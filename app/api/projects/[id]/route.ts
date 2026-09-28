import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * GET /api/projects/[id]
 * Returns full aggregate project details including files, messages, agents, and build plans.
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await Promise.resolve(context.params);
    const project = await storage.getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]
 * Updates project metadata or top-level properties.
 */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await Promise.resolve(context.params);
    const body = await request.json();

    const updated = await storage.updateProject(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * Deletes a project workspace and all its associated resources.
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await Promise.resolve(context.params);
    const success = await storage.deleteProject(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
