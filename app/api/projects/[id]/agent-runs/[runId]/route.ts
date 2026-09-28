import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string; runId: string }> | { id: string; runId: string };
}

/**
 * GET /api/projects/[id]/agent-runs/[runId]
 * Fetches an individual agent run by ID.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId, runId } = await Promise.resolve(params);
    const run = await storage.getAgentRunById(projectId, runId);

    if (!run) {
      return NextResponse.json(
        { success: false, error: "Agent run not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: run });
  } catch (error: unknown) {
    console.error("GET agent run error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent run" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]/agent-runs/[runId]
 * Updates an agent run with progress, agent states, and activity logs.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId, runId } = await Promise.resolve(params);
    const body = await request.json().catch(() => ({}));

    const updated = await storage.updateAgentRun(projectId, runId, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Agent run not found or could not be updated" },
        { status: 404 }
      );
    }

    if (updated.status === "completed") {
      await storage.addActivity(projectId, {
        actor: "Architect Swarm",
        actorRole: "agent",
        type: "agent_completed",
        summary: `Completed agent workflow for "${updated.buildPlanTitle}"`,
        metadata: { runId },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    console.error("PUT agent run error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update agent run" },
      { status: 500 }
    );
  }
}
