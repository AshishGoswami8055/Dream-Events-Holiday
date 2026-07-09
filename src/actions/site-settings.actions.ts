"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { auth } from "@/lib/auth";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import { getSiteSettings, toAdminFormSettings } from "@/lib/site-settings";
import type { ActionResponse } from "@/types";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

const SECRET_MASK = "••••••••";

export async function getAdminSiteSettings() {
  await requireAuth();
  const settings = await getSiteSettings();
  return toAdminFormSettings(settings);
}

export async function updateSiteSettings(data: SiteSettingsInput): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = siteSettingsSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Please check your settings",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await connectDB();
    const existing = await SiteSettings.findOne();
    const payload = { ...parsed.data };

    if (payload.smtpPass === SECRET_MASK || !payload.smtpPass?.trim()) {
      payload.smtpPass = existing?.smtpPass || process.env.SMTP_PASS || "";
    }
    if (payload.cloudinaryApiSecret === SECRET_MASK || !payload.cloudinaryApiSecret?.trim()) {
      payload.cloudinaryApiSecret =
        existing?.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET || "";
    }

    if (existing) {
      await SiteSettings.findByIdAndUpdate(existing._id, payload, { new: true });
    } else {
      await SiteSettings.create(payload);
    }

    revalidateTag("site-settings");
    revalidatePath("/", "layout");

    return { success: true, message: "Settings saved successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save settings",
    };
  }
}
