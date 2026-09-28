import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { initializeAgentRun } from "@/lib/agents/simulation";

interface RouteParams {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * GET /api/projects/[id]/agent-runs
 * Fetches all agent runs for a project.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId } = await Promise.resolve(params);
    const project = await storage.getProjectById(projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const runs = await storage.getAgentRuns(projectId);
    return NextResponse.json({ success: true, data: runs });
  } catch (error: unknown) {
    console.error("GET agent-runs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent runs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/agent-runs
 * Initializes and saves a new agent execution run from an approved build plan.
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId } = await Promise.resolve(params);
    const project = await storage.getProjectById(projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { buildPlanId, autoStart = true } = body;

    const plans = await storage.getBuildPlans(projectId);

    let targetPlan = buildPlanId
      ? plans.find((p) => p.id === buildPlanId)
      : plans.find((p) => p.status === "approved") || plans[0];

    if (!targetPlan) {
      return NextResponse.json(
        {
          success: false,
          error: "No build plan available to initialize agent execution.",
        },
        { status: 400 }
      );
    }

    // Ensure plan status is approved
    if (targetPlan.status !== "approved") {
      targetPlan = await storage.updateBuildPlan(projectId, targetPlan.id, {
        status: "approved",
      }) || targetPlan;
    }

    // Initialize agent run
    const newRun = initializeAgentRun(projectId, targetPlan, autoStart);
    const savedRun = await storage.saveAgentRun(projectId, newRun);

    // Record activity event
    await storage.addActivity(projectId, {
      actor: "Architect Swarm",
      actorRole: "agent",
      type: "agent_started",
      summary: `Started agent execution for "${targetPlan.title}"`,
      metadata: { runId: newRun.id, planId: targetPlan.id },
    });

    return NextResponse.json({ success: true, data: savedRun });
  } catch (error: unknown) {
    console.error("POST agent-runs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create agent run" },
      { status: 500 }
    );
  }
}
