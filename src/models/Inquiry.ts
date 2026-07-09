import mongoose, { Schema, Document, Model } from "mongoose";
import { INQUIRY_STATUSES } from "@/constants";

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email: string;
  adults: number;
  children: number;
  travelDate: Date;
  package?: mongoose.Types.ObjectId;
  message: string;
  source: "package" | "contact";
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    adults: { type: Number, required: true, min: 1, default: 1 },
    children: { type: Number, default: 0, min: 0 },
    travelDate: { type: Date, required: true },
    package: { type: Schema.Types.ObjectId, ref: "Package" },
    message: { type: String, default: "", trim: true },
    source: { type: String, enum: ["package", "contact"], default: "package" },
    status: { type: String, enum: INQUIRY_STATUSES, default: "new" },
  },
  { timestamps: true }
);

InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ email: 1 });

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
