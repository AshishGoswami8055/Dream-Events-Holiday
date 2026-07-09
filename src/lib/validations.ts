import { z } from "zod";
import { PACKAGE_CATEGORIES, PACKAGE_STATUSES, INQUIRY_STATUSES } from "@/constants";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .optional()
    .transform((value) => value === true || value === "true"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset link is invalid"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const cloudinaryImageSchema = z.object({
  publicId: z.string().min(1),
  url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const itineraryDaySchema = z.object({
  day: z.coerce.number().min(1),
  title: z.string(),
  description: z.string(),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const packageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200).optional(),
  location: z.string().min(2, "Location is required").optional(),
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
}).transform((data) => ({
  ...data,
  location: data.location || "India",
  itinerary: data.itinerary.filter((day) => day.title.trim() && day.description.trim()),
  highlights: data.highlights.filter(Boolean),
  includes: data.includes.filter(Boolean),
  excludes: data.excludes.filter(Boolean),
}));

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

export const siteSettingsSchema = z.object({
  siteName: z.string().min(2, "Site name is required"),
  siteUrl: z.string().url("Enter a valid website URL"),
  tagline: z.string().min(3, "Tagline is required"),
  description: z.string().min(10, "Description is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  whatsapp: z.string().min(10, "WhatsApp number required (with country code, no +)"),
  address: z.string().min(3, "Address is required"),
  socialFacebook: z.string().url().or(z.literal("")),
  socialInstagram: z.string().url().or(z.literal("")),
  socialTwitter: z.string().url().or(z.literal("")),
  socialYoutube: z.string().url().or(z.literal("")),
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.coerce.number().min(1).max(65535),
  smtpUser: z.string().optional().or(z.literal("")),
  smtpPass: z.string().optional().or(z.literal("")),
  smtpFrom: z.string().optional().or(z.literal("")),
  adminNotificationEmail: z.string().email().or(z.literal("")),
  cloudinaryCloudName: z.string().optional().or(z.literal("")),
  cloudinaryApiKey: z.string().optional().or(z.literal("")),
  cloudinaryApiSecret: z.string().optional().or(z.literal("")),
  cloudinaryUploadPreset: z.string().optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type PackageInput = z.infer<typeof packageSchema>;
export type DestinationInput = z.infer<typeof destinationSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
