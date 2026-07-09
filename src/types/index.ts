import { PACKAGE_CATEGORIES, PACKAGE_STATUSES, INQUIRY_STATUSES } from "@/constants";

export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];
export type PackageStatus = (typeof PACKAGE_STATUSES)[number];
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface CloudinaryImage {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
}

export interface PackageDocument {
  _id: string;
  title: string;
  slug: string;
  location: string;
  destination: string | DestinationDocument;
  price: number;
  duration: number;
  description: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDay[];
  featured: boolean;
  images: CloudinaryImage[];
  coverImage: CloudinaryImage;
  category: PackageCategory;
  status: PackageStatus;
  faqs: FAQItem[];
  mapEmbedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationDocument {
  _id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  image: CloudinaryImage;
  featured: boolean;
  packageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryDocument {
  _id: string;
  title: string;
  image: CloudinaryImage;
  category: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryDocument {
  _id: string;
  name: string;
  phone: string;
  email: string;
  adults: number;
  children: number;
  travelDate: string;
  package?: string | PackageDocument;
  message: string;
  source?: "package" | "contact";
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserDocument {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  createdAt: string;
  updatedAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PackageFilters {
  search?: string;
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  status?: PackageStatus | "all";
  adminMode?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface DashboardStats {
  totalPackages: number;
  publishedPackages: number;
  totalInquiries: number;
  newInquiries: number;
  totalDestinations: number;
  totalGallery: number;
  recentInquiries: InquiryDocument[];
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image?: string;
  package?: string;
}
