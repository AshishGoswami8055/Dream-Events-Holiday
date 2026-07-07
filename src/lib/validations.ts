import { z } from "zod";
import { PACKAGE_CATEGORIES, PACKAGE_STATUSES, INQUIRY_STATUSES } from "@/constants";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const cloudinaryImageSchema = z.object({
  publicId: z.string().min(1),
  url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const itineraryDaySchema = z.object({
  day: z.coerce.number().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const packageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200).optional(),
  location: z.string().min(2, "Location is required"),
  destination: z.string().min(1, "Destination is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 day"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  highlights: z.array(z.string()).default([]),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  itinerary: z.array(itineraryDaySchema).default([]),
  featured: z.boolean().default(false),
  images: z.array(cloudinaryImageSchema).default([]),
  coverImage: cloudinaryImageSchema,
  category: z.enum(PACKAGE_CATEGORIES as unknown as [string, ...string[]]),
  status: z.enum(PACKAGE_STATUSES as unknown as [string, ...string[]]).default("draft"),
  faqs: z.array(faqSchema).default([]),
  mapEmbedUrl: z.string().url().optional().or(z.literal("")),
});

export const destinationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2).optional(),
  country: z.string().min(2, "Country is required"),
  description: z.string().min(10, "Description is required"),
  image: cloudinaryImageSchema,
  featured: z.boolean().default(false),
});

export const gallerySchema = z.object({
  title: z.string().min(2, "Title is required"),
  image: cloudinaryImageSchema,
  category: z.string().default("General"),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .max(15)
    .regex(/^[+]?[\d\s-]+$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  adults: z.coerce.number().min(1, "At least 1 adult required").max(50),
  children: z.coerce.number().min(0).max(50).default(0),
  travelDate: z.string().min(1, "Travel date is required"),
  package: z.string().optional(),
  message: z.string().max(2000).default(""),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10).max(15).regex(/^[+]?[\d\s-]+$/, "Invalid phone number"),
  subject: z.string().min(3, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUSES as unknown as [string, ...string[]]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PackageInput = z.infer<typeof packageSchema>;
export type DestinationInput = z.infer<typeof destinationSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
