import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";
import { getSiteSettings } from "@/lib/site-settings";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSiteSettings();
    if (!settings.cloudinaryCloudName || !settings.cloudinaryApiKey || !settings.cloudinaryApiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Add settings in Admin → Settings." },
        { status: 400 }
      );
    }

    cloudinary.config({
      cloud_name: settings.cloudinaryCloudName,
      api_key: settings.cloudinaryApiKey,
      api_secret: settings.cloudinaryApiSecret,
    });

    const { folder = "dream-events" } = await request.json();
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      settings.cloudinaryApiSecret
    );

    return NextResponse.json({
      cloudName: settings.cloudinaryCloudName,
      apiKey: settings.cloudinaryApiKey,
      timestamp,
      signature,
      folder,
      uploadPreset: settings.cloudinaryUploadPreset,
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
