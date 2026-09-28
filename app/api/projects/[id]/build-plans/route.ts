import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { generateBuildPlan, validateBuildPlanSchema } from "@/lib/ai/build-plan";
import { ProjectContextSummary } from "@/lib/ai/prompts";

interface RouteParams {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * GET /api/projects/[id]/build-plans
 * Lists all build plans for the project.
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

    const plans = await storage.getBuildPlans(projectId);
    return NextResponse.json({ success: true, data: plans });
  } catch (error: unknown) {
    console.error("GET build-plans error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch build plans" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/build-plans
 * Generates and saves a new build plan based on user prompt or custom plan payload.
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
    const { prompt, sourceMessageId, plan, requirementsSummary } = body;

    let planToSave;

    if (plan) {
      // Validate passed plan
      const validation = validateBuildPlanSchema(plan);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: `Invalid plan schema: ${validation.errors.join(", ")}` },
          { status: 400 }
        );
      }
      planToSave = validation.plan;
    } else {
      // Generate plan from prompt or latest user request
      let userPrompt = prompt;
      if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
        // Fall back to latest user message if prompt was not explicitly sent
        const messages = project.messages || [];
        const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user" || m.role === "user");
        userPrompt = lastUserMsg?.content || `Feature implementation for ${project.name}`;
      }

      // Find any requirementsSummary from request body or recent chat history
      let resolvedSummary = requirementsSummary;
      if (!resolvedSummary) {
        const msgWithSummary = [...(project.messages || [])]
          .reverse()
          .find((m) => m.requirementsSummary || m.metadata?.requirementsSummary);
        if (msgWithSummary) {
          resolvedSummary =
            msgWithSummary.requirementsSummary ||
            (msgWithSummary.metadata?.requirementsSummary as typeof requirementsSummary);
        }
      }

      const files = (project.files || []).map((f) => f.path);
      const recentActivity = (project.activity || []).slice(0, 3).map((a) => a.summary);

      const contextSummary: ProjectContextSummary = {
        name: project.name,
        description: project.description,
        template: project.template,
        status: project.status,
        currentBranch: project.currentBranch,
        stack: project.stack,
        files,
        recentActivity,
      };

      planToSave = await generateBuildPlan({
        projectId,
        userPrompt,
        context: contextSummary,
        sourceMessageId,
        requirementsSummary: resolvedSummary,
      });
    }

    const savedPlan = await storage.saveBuildPlan(projectId, {
      ...planToSave,
      projectId,
      status: "proposed",
    });

    if (!savedPlan) {
      return NextResponse.json(
        { success: false, error: "Failed to persist build plan" },
        { status: 500 }
      );
    }

    // Record activity event
    await storage.addActivity(projectId, {
      actor: "Architect",
      actorRole: "agent",
      type: "plan_proposed",
      summary: `Architect created build plan: "${savedPlan.title}"`,
    });

    // Also add an informative system message in conversation so chat stays connected
    await storage.addMessage(projectId, {
      sender: "system",
      role: "system",
      content: `Architect created a Build Plan: **"${savedPlan.title}"** (${savedPlan.steps.length} steps). Review the plan before agent execution.`,
      suggestedActions: [
        {
          label: "View Build Plan",
          action: "view_plan",
          payload: { planId: savedPlan.id },
        },
      ],
    });

    return NextResponse.json(
      { success: true, data: savedPlan },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST build-plans error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create build plan";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
