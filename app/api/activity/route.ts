import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

/**
 * GET /api/activity
 * Returns recent workspace activity events across all projects.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const activities = await storage.getRecentActivity(limit);

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error("GET /api/activity error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
