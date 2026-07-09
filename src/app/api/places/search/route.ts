import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { searchPlaces } from "@/lib/openstreetmap";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = await searchPlaces(query);
    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    );
  }
}
