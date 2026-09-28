import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { pauseRun } from "@/lib/agents/orchestrator";

interface RouteParams {
  params: Promise<{ id: string; runId: string }> | { id: string; runId: string };
}

/**
 * POST /api/projects/[id]/agent-runs/[runId]/pause
 * Pauses active agent execution.
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

    const paused = pauseRun(existing);
    const saved = await storage.saveAgentRun(projectId, paused);

    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    console.error("POST pause agent run error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to pause agent run" },
      { status: 500 }
    );
  }
}
