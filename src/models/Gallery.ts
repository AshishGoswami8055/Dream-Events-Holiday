import mongoose, { Schema, Document, Model } from "mongoose";
import { CloudinaryImage } from "@/types";

export interface IGallery extends Document {
  title: string;
  image: CloudinaryImage;
  category: string;
  featured: boolean;
  order: number;
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

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true, trim: true },
    image: { type: CloudinaryImageSchema, required: true },
    category: { type: String, default: "General", trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GallerySchema.index({ featured: -1, order: 1 });
GallerySchema.index({ category: 1 });

const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
