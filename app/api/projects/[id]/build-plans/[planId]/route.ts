import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string; planId: string }> | { id: string; planId: string };
}

/**
 * GET /api/projects/[id]/build-plans/[planId]
 * Fetches a specific build plan by ID.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId, planId } = await Promise.resolve(params);
    const plan = await storage.getBuildPlanById(projectId, planId);

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Build plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: plan });
  } catch (error: unknown) {
    console.error("GET build-plan by id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch build plan" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]/build-plans/[planId]
 * Updates build plan status (e.g. approved) or modifies title, steps, risks, and assumptions.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId, planId } = await Promise.resolve(params);
    const existing = await storage.getBuildPlanById(projectId, planId);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Build plan not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updatedPlan = await storage.updateBuildPlan(projectId, planId, body);

    if (!updatedPlan) {
      return NextResponse.json(
        { success: false, error: "Failed to update build plan" },
        { status: 500 }
      );
    }

    // If status became approved, log an activity event
    if (body.status === "approved" && existing.status !== "approved") {
      await storage.addActivity(projectId, {
        actor: "User",
        actorRole: "user",
        type: "plan_approved",
        summary: `Build plan approved: "${updatedPlan.title}"`,
      });

      // Also append system message in chat
      await storage.addMessage(projectId, {
        sender: "system",
        role: "system",
        content: `Build plan **"${updatedPlan.title}"** was approved by user. Ready for agent execution.`,
      });
    }

    return NextResponse.json({ success: true, data: updatedPlan });
  } catch (error: unknown) {
    console.error("PUT build-plan error:", error);
    const msg = error instanceof Error ? error.message : "Failed to update build plan";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
