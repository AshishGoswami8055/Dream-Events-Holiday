import { unstable_cache } from "next/cache";
import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { getSiteUrl } from "@/lib/site-url";

export interface SiteSettingsData {
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
}

export interface PublicSiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

function envDefaults(): SiteSettingsData {
  return {
    siteName: process.env.NEXT_PUBLIC_APP_NAME || "Dream Event & Holidays",
    siteUrl: getSiteUrl(),
    tagline: "We Care for Your Memories & Comfort",
    description:
      "Discover exceptional travel experiences across India and the world with thoughtfully crafted holidays.",
    email: "dreamevents.holidays@gmail.com",
    phone: "+91 9023612162",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919023612162",
    address: "Ahmedabad (Head Office) · Modasa · Surat, Gujarat, India",
    socialFacebook: "https://facebook.com/dreamevents",
    socialInstagram: "https://instagram.com/dreamevents",
    socialTwitter: "https://twitter.com/dreamevents",
    socialYoutube: "https://youtube.com/dreamevents",
    smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    smtpUser: process.env.SMTP_USER || "",
    smtpPass: process.env.SMTP_PASS || "",
    smtpFrom: process.env.SMTP_FROM || "",
    adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || "",
    cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
    cloudinaryUploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
  };
}

function mergeSettings(doc: Partial<SiteSettingsData> | null): SiteSettingsData {
  const defaults = envDefaults();
  if (!doc) return defaults;

  return {
    siteName: doc.siteName || defaults.siteName,
    siteUrl: doc.siteUrl || defaults.siteUrl,
    tagline: doc.tagline || defaults.tagline,
    description: doc.description || defaults.description,
    email: doc.email || defaults.email,
    phone: doc.phone || defaults.phone,
    whatsapp: doc.whatsapp || defaults.whatsapp,
    address: doc.address || defaults.address,
    socialFacebook: doc.socialFacebook || defaults.socialFacebook,
    socialInstagram: doc.socialInstagram || defaults.socialInstagram,
    socialTwitter: doc.socialTwitter || defaults.socialTwitter,
    socialYoutube: doc.socialYoutube || defaults.socialYoutube,
    smtpHost: doc.smtpHost || defaults.smtpHost,
    smtpPort: doc.smtpPort ?? defaults.smtpPort,
    smtpUser: doc.smtpUser || defaults.smtpUser,
    smtpPass: doc.smtpPass || defaults.smtpPass,
    smtpFrom: doc.smtpFrom || defaults.smtpFrom,
    adminNotificationEmail: doc.adminNotificationEmail || defaults.adminNotificationEmail,
    cloudinaryCloudName: doc.cloudinaryCloudName || defaults.cloudinaryCloudName,
    cloudinaryApiKey: doc.cloudinaryApiKey || defaults.cloudinaryApiKey,
    cloudinaryApiSecret: doc.cloudinaryApiSecret || defaults.cloudinaryApiSecret,
    cloudinaryUploadPreset: doc.cloudinaryUploadPreset || defaults.cloudinaryUploadPreset,
  };
}

export function toPublicSiteConfig(settings: SiteSettingsData): PublicSiteConfig {
  return {
    name: settings.siteName,
    tagline: settings.tagline,
    description: settings.description,
    url: settings.siteUrl.replace(/\/$/, ""),
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    whatsapp: settings.whatsapp,
    social: {
      facebook: settings.socialFacebook,
      instagram: settings.socialInstagram,
      twitter: settings.socialTwitter,
      youtube: settings.socialYoutube,
    },
  };
}

async function fetchSiteSettings(): Promise<SiteSettingsData> {
  await connectDB();
  const doc = await SiteSettings.findOne().lean();
  return mergeSettings(doc as Partial<SiteSettingsData> | null);
}

export const getSiteSettings = unstable_cache(fetchSiteSettings, ["site-settings"], {
  revalidate: 60,
  tags: ["site-settings"],
});

export async function getPublicSiteConfig(): Promise<PublicSiteConfig> {
  const settings = await getSiteSettings();
  return toPublicSiteConfig(settings);
}

export function toAdminFormSettings(settings: SiteSettingsData) {
  return {
    ...settings,
    smtpPass: settings.smtpPass ? "••••••••" : "",
    cloudinaryApiSecret: settings.cloudinaryApiSecret ? "••••••••" : "",
  };
}
