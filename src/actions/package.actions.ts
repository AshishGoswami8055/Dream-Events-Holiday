"use server";

import connectDB from "@/lib/db";
import Package from "@/models/Package";
import Destination from "@/models/Destination";
import Gallery from "@/models/Gallery";
import Inquiry from "@/models/Inquiry";
import { packageSchema, destinationSchema, gallerySchema, inquiryStatusSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { slugify, sanitizeInput } from "@/lib/utils";
import { sendAdminQueryNotification, sendCustomerAcknowledgement } from "@/lib/email";
import { deleteImage } from "@/lib/cloudinary";
import type { ActionResponse, PackageFilters, PaginatedResult } from "@/types";
import { ITEMS_PER_PAGE } from "@/constants";
import type { PackageInput, DestinationInput, GalleryInput } from "@/lib/validations";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function getPackages(
  filters: PackageFilters = {}
): Promise<PaginatedResult<Record<string, unknown>>> {
  await connectDB();

  const {
    search,
    destination,
    category,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    sort = "newest",
    page = 1,
    limit = ITEMS_PER_PAGE,
    featured,
    status,
    adminMode,
  } = filters;

  const query: Record<string, unknown> = {};

  if (adminMode) {
    if (status && status !== "all") query.status = status;
  } else {
    query.status = status || "published";
  }

  if (featured !== undefined) query.featured = featured;
  if (destination) query.destination = destination;
  if (category) query.category = category;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) (query.price as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (query.price as Record<string, number>).$lte = maxPrice;
  }
  if (minDuration !== undefined || maxDuration !== undefined) {
    query.duration = {};
    if (minDuration !== undefined) (query.duration as Record<string, number>).$gte = minDuration;
    if (maxDuration !== undefined) (query.duration as Record<string, number>).$lte = maxDuration;
  }
  if (search) {
    query.$text = { $search: search };
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    "duration-asc": { duration: 1 },
    "duration-desc": { duration: -1 },
  };

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Package.find(query)
      .populate("destination", "name slug country")
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(limit)
      .lean(),
    Package.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: serialize(data),
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

export async function getPackageBySlug(slug: string) {
  await connectDB();
  const pkg = await Package.findOne({ slug, status: "published" })
    .populate("destination", "name slug country description image")
    .lean();
  return pkg ? serialize(pkg) : null;
}

export async function getRelatedPackages(slug: string, destinationId: string, limit = 4) {
  await connectDB();
  const packages = await Package.find({
    slug: { $ne: slug },
    destination: destinationId,
    status: "published",
  })
    .populate("destination", "name slug")
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .lean();
  return serialize(packages);
}

export async function createPackage(data: PackageInput): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = packageSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const slug = parsed.data.slug || slugify(parsed.data.title);
    const destination = await Destination.findById(parsed.data.destination).select("name").lean();
    const location = parsed.data.location || destination?.name || parsed.data.title;

    const existing = await Package.findOne({ slug });
    if (existing) {
      return { success: false, message: "A package with this slug already exists" };
    }

    const pkg = await Package.create({ ...parsed.data, slug, location });
    revalidatePath("/packages");
    revalidatePath("/");
    revalidatePath("/admin/packages");

    return { success: true, message: "Package created successfully", data: serialize(pkg) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to create package" };
  }
}

export async function updatePackage(id: string, data: PackageInput): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = packageSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const slug = parsed.data.slug || slugify(parsed.data.title);
    const destination = await Destination.findById(parsed.data.destination).select("name").lean();
    const location = parsed.data.location || destination?.name || parsed.data.title;

    const existing = await Package.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return { success: false, message: "A package with this slug already exists" };
    }

    const pkg = await Package.findByIdAndUpdate(id, { ...parsed.data, slug, location }, { new: true });
    if (!pkg) return { success: false, message: "Package not found" };

    revalidatePath("/packages");
    revalidatePath(`/packages/${slug}`);
    revalidatePath("/");
    revalidatePath("/admin/packages");

    return { success: true, message: "Package updated successfully", data: serialize(pkg) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update package" };
  }
}

export async function deletePackage(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await connectDB();

    const pkg = await Package.findById(id);
    if (!pkg) return { success: false, message: "Package not found" };

    const imagesToDelete = [pkg.coverImage, ...pkg.images].filter(Boolean);
    for (const img of imagesToDelete) {
      if (img?.publicId) {
        try {
          await deleteImage(img.publicId);
        } catch {
          // Continue even if Cloudinary delete fails
        }
      }
    }

    await Package.findByIdAndDelete(id);
    revalidatePath("/packages");
    revalidatePath("/");
    revalidatePath("/admin/packages");

    return { success: true, message: "Package deleted successfully" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete package" };
  }
}

export async function getPackageById(id: string) {
  await requireAuth();
  await connectDB();
  const pkg = await Package.findById(id).populate("destination").lean();
  return pkg ? serialize(pkg) : null;
}

export async function getDestinations(featured?: boolean) {
  await connectDB();
  const query = featured !== undefined ? { featured } : {};
  const destinations = await Destination.find(query).sort({ name: 1 }).lean();

  const withCounts = await Promise.all(
    destinations.map(async (dest) => {
      const count = await Package.countDocuments({ destination: dest._id, status: "published" });
      return { ...dest, packageCount: count };
    })
  );

  return serialize(withCounts);
}

export async function getDestinationBySlug(slug: string) {
  await connectDB();
  const dest = await Destination.findOne({ slug }).lean();
  return dest ? serialize(dest) : null;
}

export async function createDestination(data: DestinationInput): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = destinationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const slug = parsed.data.slug || slugify(parsed.data.name);
    const dest = await Destination.create({ ...parsed.data, slug });
    revalidatePath("/destinations");
    revalidatePath("/");

    return { success: true, message: "Destination created", data: serialize(dest) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to create destination" };
  }
}

export async function updateDestination(id: string, data: DestinationInput): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = destinationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Validation failed" };
    }

    await connectDB();
    const slug = parsed.data.slug || slugify(parsed.data.name);
    const dest = await Destination.findByIdAndUpdate(id, { ...parsed.data, slug }, { new: true });
    if (!dest) return { success: false, message: "Destination not found" };

    revalidatePath("/destinations");
    return { success: true, message: "Destination updated", data: serialize(dest) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update destination" };
  }
}

export async function deleteDestination(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await connectDB();

    const packageCount = await Package.countDocuments({ destination: id });
    if (packageCount > 0) {
      return { success: false, message: "Cannot delete destination with associated packages" };
    }

    const dest = await Destination.findByIdAndDelete(id);
    if (!dest) return { success: false, message: "Destination not found" };

    revalidatePath("/destinations");
    return { success: true, message: "Destination deleted" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete destination" };
  }
}

export async function getGalleryItems(featured?: boolean) {
  await connectDB();
  const query = featured !== undefined ? { featured } : {};
  const items = await Gallery.find(query).sort({ order: 1, createdAt: -1 }).lean();
  return serialize(items);
}

export async function createGalleryItem(data: GalleryInput): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = gallerySchema.safeParse(data);
    if (!parsed.success) return { success: false, message: "Validation failed" };

    await connectDB();
    const item = await Gallery.create(parsed.data);
    revalidatePath("/gallery");
    revalidatePath("/");

    return { success: true, message: "Gallery item created", data: serialize(item) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to create gallery item" };
  }
}

export async function deleteGalleryItem(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await connectDB();

    const item = await Gallery.findById(id);
    if (!item) return { success: false, message: "Gallery item not found" };

    if (item.image?.publicId) {
      try {
        await deleteImage(item.image.publicId);
      } catch {
        // Continue
      }
    }

    await Gallery.findByIdAndDelete(id);
    revalidatePath("/gallery");
    revalidatePath("/");

    return { success: true, message: "Gallery item deleted" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete gallery item" };
  }
}

export async function getInquiries(status?: string) {
  await requireAuth();
  await connectDB();
  const query = status ? { status } : {};
  const inquiries = await Inquiry.find(query)
    .populate("package", "title slug")
    .sort({ createdAt: -1 })
    .lean();
  return serialize(inquiries);
}

export async function updateInquiryStatus(id: string, status: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = inquiryStatusSchema.safeParse({ status });
    if (!parsed.success) return { success: false, message: "Invalid status" };

    await connectDB();
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!inquiry) return { success: false, message: "Inquiry not found" };

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    return { success: true, message: "Status updated" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update status" };
  }
}

export async function deleteInquiry(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await connectDB();
    await Inquiry.findByIdAndDelete(id);
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    return { success: true, message: "Inquiry deleted" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete inquiry" };
  }
}

export async function getDashboardStats() {
  await requireAuth();
  await connectDB();

  const [totalPackages, publishedPackages, totalInquiries, newInquiries, totalDestinations, totalGallery, recentInquiries] =
    await Promise.all([
      Package.countDocuments(),
      Package.countDocuments({ status: "published" }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "new" }),
      Destination.countDocuments(),
      Gallery.countDocuments(),
      Inquiry.find().populate("package", "title").sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  return serialize({
    totalPackages,
    publishedPackages,
    totalInquiries,
    newInquiries,
    totalDestinations,
    totalGallery,
    recentInquiries,
  });
}

export async function createInquiryFromAdmin(data: {
  name: string;
  phone: string;
  email: string;
  adults: number;
  children: number;
  travelDate: string;
  package?: string;
  message: string;
}): Promise<ActionResponse> {
  try {
    await connectDB();

    const inquiry = await Inquiry.create({
      name: sanitizeInput(data.name),
      phone: sanitizeInput(data.phone),
      email: sanitizeInput(data.email).toLowerCase(),
      adults: data.adults,
      children: data.children,
      travelDate: new Date(data.travelDate),
      package: data.package || undefined,
      message: sanitizeInput(data.message),
    });

    let packageTitle: string | undefined;
    if (data.package) {
      const pkg = await Package.findById(data.package).select("title");
      packageTitle = pkg?.title;
    }

    try {
      await sendAdminQueryNotification({
        source: "package",
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        adults: data.adults,
        children: data.children,
        travelDate: data.travelDate,
        packageTitle,
      });
      await sendCustomerAcknowledgement({
        name: data.name,
        email: data.email,
        source: "package",
      });
    } catch {
      // Email failure shouldn't block inquiry creation
    }

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    return { success: true, message: "Inquiry submitted successfully", data: serialize(inquiry) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to submit inquiry" };
  }
}
