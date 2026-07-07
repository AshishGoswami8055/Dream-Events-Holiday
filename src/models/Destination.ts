import mongoose, { Schema, Document, Model } from "mongoose";
import { CloudinaryImage } from "@/types";

export interface IDestination extends Document {
  name: string;
  slug: string;
  country: string;
  description: string;
  image: CloudinaryImage;
  featured: boolean;
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

const DestinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    country: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: CloudinaryImageSchema, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

DestinationSchema.index({ featured: -1 });
DestinationSchema.index({ name: "text", country: "text" });

const Destination: Model<IDestination> =
  mongoose.models.Destination || mongoose.model<IDestination>("Destination", DestinationSchema);

export default Destination;
