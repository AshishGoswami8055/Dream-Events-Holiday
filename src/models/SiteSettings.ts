import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  siteName: string;
  siteUrl: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialYoutube: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  adminNotificationEmail: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  cloudinaryUploadPreset: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: "Dream Event & Holidays" },
    siteUrl: { type: String, default: "http://localhost:3000" },
    tagline: { type: String, default: "We Care for Your Memories & Comfort" },
    description: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    address: { type: String, default: "" },
    socialFacebook: { type: String, default: "" },
    socialInstagram: { type: String, default: "" },
    socialTwitter: { type: String, default: "" },
    socialYoutube: { type: String, default: "" },
    smtpHost: { type: String, default: "smtp.gmail.com" },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: "" },
    smtpPass: { type: String, default: "" },
    smtpFrom: { type: String, default: "" },
    adminNotificationEmail: { type: String, default: "" },
    cloudinaryCloudName: { type: String, default: "" },
    cloudinaryApiKey: { type: String, default: "" },
    cloudinaryApiSecret: { type: String, default: "" },
    cloudinaryUploadPreset: { type: String, default: "" },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
