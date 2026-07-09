import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = request.nextUrl.searchParams.get("since");
  const sinceDate = since ? new Date(since) : null;

  try {
    await connectDB();

    const baseQuery = { status: "new" as const };
    const latestQuery =
      sinceDate && !Number.isNaN(sinceDate.getTime())
        ? { ...baseQuery, createdAt: { $gt: sinceDate } }
        : baseQuery;

    const [newCount, latest, newSince] = await Promise.all([
      Inquiry.countDocuments(baseQuery),
      Inquiry.find(latestQuery)
        .populate("package", "title")
        .sort({ createdAt: -1 })
        .limit(8)
        .select("name email phone message source createdAt package status")
        .lean(),
      sinceDate && !Number.isNaN(sinceDate.getTime())
        ? Inquiry.countDocuments(latestQuery)
        : Promise.resolve(0),
    ]);

    const items = latest.map((item) => ({
      _id: String(item._id),
      name: item.name,
      email: item.email,
      phone: item.phone,
      message: item.message,
      source: item.source || "package",
      status: item.status,
      createdAt: item.createdAt,
      packageTitle:
        item.package && typeof item.package === "object" && "title" in item.package
          ? (item.package as { title: string }).title
          : undefined,
    }));

    return NextResponse.json({
      newCount,
      hasUpdates: sinceDate ? newSince > 0 : newCount > 0,
      latest: items,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load notifications" },
      { status: 500 }
    );
  }
}
