import connectDB from "@/lib/db";
import Package from "@/models/Package";
import { SITE_CONFIG } from "@/constants";

export default async function sitemap() {
  const baseUrl = SITE_CONFIG.url;

  const staticPages = [
    "",
    "/about",
    "/packages",
    "/destinations",
    "/gallery",
    "/testimonials",
    "/faq",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" as const : "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  let packagePages: { url: string; lastModified: Date; changeFrequency: "weekly"; priority: number }[] = [];

  try {
    await connectDB();
    const packages = await Package.find({ status: "published" }).select("slug updatedAt").lean();
    packagePages = packages.map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.slug}`,
      lastModified: pkg.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch {
    // DB unavailable during build — return static pages only
  }

  return [...staticPages, ...packagePages];
}
