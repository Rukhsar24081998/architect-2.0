import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { resumeRun } from "@/lib/agents/orchestrator";

interface RouteParams {
  params: Promise<{ id: string; runId: string }> | { id: string; runId: string };
}

/**
 * POST /api/projects/[id]/agent-runs/[runId]/resume
 * Resumes paused agent execution.
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId, runId } = await Promise.resolve(params);
    const existing = await storage.getAgentRunById(projectId, runId);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Agent run not found" },
        { status: 404 }
      );
    }

    const resumed = resumeRun(existing);
    const saved = await storage.saveAgentRun(projectId, resumed);

    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    console.error("POST resume agent run error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to resume agent run" },
      { status: 500 }
    );
  }
}
