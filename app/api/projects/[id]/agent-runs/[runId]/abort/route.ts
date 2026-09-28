import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { abortRun } from "@/lib/agents/orchestrator";

interface RouteParams {
  params: Promise<{ id: string; runId: string }> | { id: string; runId: string };
}

/**
 * POST /api/projects/[id]/agent-runs/[runId]/abort
 * Stops and aborts agent execution.
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

    const aborted = abortRun(existing);
    const saved = await storage.saveAgentRun(projectId, aborted);

    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    console.error("POST abort agent run error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to abort agent run" },
      { status: 500 }
    );
  }
}
