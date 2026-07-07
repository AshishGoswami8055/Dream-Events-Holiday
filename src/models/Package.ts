import mongoose, { Schema, Document, Model } from "mongoose";
import { ItineraryDay, CloudinaryImage, FAQItem } from "@/types";
import { PACKAGE_CATEGORIES, PACKAGE_STATUSES } from "@/constants";

export interface IPackage extends Document {
  title: string;
  slug: string;
  location: string;
  destination: mongoose.Types.ObjectId;
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
  category: string;
  status: string;
  faqs: FAQItem[];
  mapEmbedUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CloudinaryImageSchema = new Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    width: Number,
    height: Number,
  },
  { _id: false }
);

const ItinerarySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const PackageSchema = new Schema<IPackage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, required: true, trim: true },
    destination: { type: Schema.Types.ObjectId, ref: "Destination", required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    description: { type: String, required: true },
    highlights: [{ type: String, trim: true }],
    includes: [{ type: String, trim: true }],
    excludes: [{ type: String, trim: true }],
    itinerary: [ItinerarySchema],
    featured: { type: Boolean, default: false },
    images: [CloudinaryImageSchema],
    coverImage: { type: CloudinaryImageSchema, required: true },
    category: { type: String, enum: PACKAGE_CATEGORIES, required: true },
    status: { type: String, enum: PACKAGE_STATUSES, default: "draft" },
    faqs: [FAQSchema],
    mapEmbedUrl: String,
  },
  { timestamps: true }
);

PackageSchema.index({ status: 1, featured: -1 });
PackageSchema.index({ destination: 1 });
PackageSchema.index({ category: 1 });
PackageSchema.index({ price: 1 });
PackageSchema.index({ title: "text", description: "text", location: "text" });

const Package: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);

export default Package;
