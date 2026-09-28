import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

/**
 * GET /api/projects
 * Returns a list of all project summaries.
 */
export async function GET() {
  try {
    const projects = await storage.getAllProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Creates a new project workspace.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { success: false, error: "Project name is required" },
        { status: 400 }
      );
    }

    const createdProject = await storage.createProject({
      name: body.name.trim(),
      description: body.description?.trim() || "An AI-crafted application workspace",
      template: body.template || "nextjs-saas",
      status: body.status || "ready",
      currentBranch: body.currentBranch || body.branch || "main",
      origin: body.origin || "idea",
      stack: body.stack,
      repositoryUrl: body.repositoryUrl,
      files: body.files,
      messages: body.messages,
    });


    return NextResponse.json(
      { success: true, data: createdProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
