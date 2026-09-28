import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { generateArchitectResponse } from "@/lib/ai";
import { ProjectContextSummary } from "@/lib/ai/prompts";

/**
 * POST /api/chat
 * Primary conversational workspace endpoint for Architect 2.0.
 * Saves user message, loads project context, generates grounded response,
 * and persists the assistant reply.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, message } = body;

    // 1. Validation
    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json(
        { success: false, error: "projectId is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    // 2. Validate project exists
    const project = await storage.getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: `Project not found with ID: ${projectId}` },
        { status: 404 }
      );
    }

    const trimmedPrompt = message.trim();

    // 3. Reuse existing user message if already stored on creation, or persist new user message
    const existingMessages = project.messages || [];
    const lastMsg = existingMessages[existingMessages.length - 1];
    let userMessage;
    if (
      lastMsg &&
      (lastMsg.sender === "user" || lastMsg.role === "user") &&
      lastMsg.content.trim() === trimmedPrompt
    ) {
      userMessage = lastMsg;
    } else {
      userMessage = await storage.addMessage(projectId, {
        sender: "user",
        role: "user",
        content: trimmedPrompt,
        status: "completed",
        createdAt: new Date().toISOString(),
      });
    }


    // 4. Log user prompt to project activity
    const snippet = trimmedPrompt.length > 36 ? `${trimmedPrompt.slice(0, 36)}...` : trimmedPrompt;
    await storage.addActivity(projectId, {
      actor: "User",
      actorRole: "user",
      type: "file_modified",
      summary: `Asked Architect: "${snippet}"`,
    });

    // 5. Assemble concise project context
    const recentActivity = (project.activity || []).slice(0, 3).map((a) => a.summary);
    const files = (project.files || []).map((f) => f.path);

    const context: ProjectContextSummary = {
      name: project.name,
      description: project.description,
      template: project.template,
      status: project.status,
      currentBranch: project.currentBranch,
      stack: project.stack,
      files,
      recentActivity,
    };

    // 6. Generate Architect response (real LLM or simulation)
    const aiResult = await generateArchitectResponse({
      prompt: trimmedPrompt,
      context,
      history: project.messages || [],
    });

    // 7. Save assistant message to storage
    const assistantMessage = await storage.addMessage(projectId, {
      sender: "architect",
      role: "assistant",
      content: aiResult.content,
      thinking: aiResult.thinking,
      contextFiles: aiResult.contextFiles,
      suggestedActions: aiResult.suggestedActions,
      requirementsSummary: aiResult.requirementsSummary,
      status: "completed",
      metadata: aiResult.metadata,
      createdAt: new Date().toISOString(),
    });

    // 8. Log assistant analysis activity
    await storage.addActivity(projectId, {
      actor: "Architect",
      actorRole: "agent",
      type: "plan_proposed",
      summary: `Architect analyzed ${aiResult.summary}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        userMessage,
        assistantMessage,
      },
    });
  } catch (error: unknown) {
    console.error("POST /api/chat error:", error);
    const msg = error instanceof Error ? error.message : "Failed to process chat message";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chat?projectId=[id]
 * Clears conversation messages for a project without affecting project records, build plans, or agent state.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId query param is required" },
        { status: 400 }
      );
    }

    const success = await storage.clearMessages(projectId);
    if (!success) {
      return NextResponse.json(
        { success: false, error: `Project not found with ID: ${projectId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Conversation cleared successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/chat error:", error);
    const msg = error instanceof Error ? error.message : "Failed to clear conversation";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
