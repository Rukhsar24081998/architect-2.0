"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectDetails, Message, MessageAction, BuildPlan, RequirementsSummary } from "@/lib/types";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { PromptComposer } from "./PromptComposer";
import { ContextPanel } from "./ContextPanel";
import { BuildPlanView } from "./BuildPlanView";
import { BuildPlanLoading } from "./BuildPlanLoading";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";
import { ClearChatModal } from "./ClearChatModal";
import { AlertCircle, RefreshCw, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface AIWorkspaceProps {
  initialProject: ProjectDetails;
  initialPrompt?: string;
}

export function AIWorkspace({
  initialProject,
  initialPrompt: propInitialPrompt,
}: AIWorkspaceProps) {
  const router = useRouter();
  const { addToast } = useToast();

  const [project] = useState<ProjectDetails>(initialProject);

  // Initialize messages: filter placeholder system message and ensure initialPrompt
  // appears immediately as the first user message with zero empty-state flicker!
  const [messages, setMessages] = useState<Message[]>(() => {
    const rawMessages = Array.isArray(initialProject.messages)
      ? initialProject.messages
      : [];
    const cleanMessages = rawMessages.filter(
      (m) =>
        !(
          m.sender === "system" &&
          typeof m.content === "string" &&
          m.content.includes("Project workspace initialized")
        )
    );

    if (cleanMessages.length > 0) {
      return cleanMessages;
    }

    if (propInitialPrompt && propInitialPrompt.trim()) {
      return [
        {
          id: "initial_user_msg",
          projectId: initialProject.id,
          sender: "user",
          role: "user",
          content: propInitialPrompt.trim(),
          status: "completed",
          createdAt: initialProject.createdAt || new Date().toISOString(),
        },
      ];
    }

    return cleanMessages;
  });

  const [plans, setPlans] = useState<BuildPlan[]>(
    Array.isArray(initialProject.buildPlans) ? initialProject.buildPlans : []
  );
  const [activePlan, setActivePlan] = useState<BuildPlan | null>(
    Array.isArray(initialProject.buildPlans) && initialProject.buildPlans.length > 0
      ? initialProject.buildPlans[0]
      : null
  );

  const [activeView, setActiveView] = useState<"chat" | "plan">("chat");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");

  // Start with thinking true if arriving with an initial prompt
  const [isThinking, setIsThinking] = useState<boolean>(() => {
    return Boolean(propInitialPrompt && propInitialPrompt.trim());
  });

  const [error, setError] = useState<string | null>(null);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState<boolean>(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [isClearingChat, setIsClearingChat] = useState<boolean>(false);
  const autoSentRef = React.useRef(false);

  // Clear conversation handler
  const handleConfirmClearChat = async () => {
    setIsClearingChat(true);
    try {
      await apiClient.clearChat(project.id);
      setMessages([]);
      setError(null);
      setIsThinking(false);
      setActiveView("chat");
      setIsClearModalOpen(false);
      addToast({
        type: "info",
        title: "Conversation Cleared",
        message: "Chat messages removed. Ready for a new request.",
      });
    } catch (err: unknown) {
      console.error("Failed to clear chat:", err);
      addToast({
        type: "error",
        title: "Clear Chat Failed",
        message: err instanceof Error ? err.message : "Failed to clear conversation",
      });
    } finally {
      setIsClearingChat(false);
    }
  };

  // Send message handler
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || prompt).trim();
    if (!textToSend || isThinking) return;

    setError(null);
    if (!customPrompt) {
      setPrompt("");
    }

    // 1. Optimistic User Message
    const tempId = `temp_${Date.now()}`;
    const optimisticUserMsg: Message = {
      id: tempId,
      projectId: project.id,
      sender: "user",
      role: "user",
      content: textToSend,
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setIsThinking(true);

    try {
      // 2. Call /api/chat
      const result = await apiClient.sendMessage({
        projectId: project.id,
        message: textToSend,
      });

      // 3. Replace optimistic message with persisted messages
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempId);
        return [...filtered, result.userMessage, result.assistantMessage];
      });
    } catch (err: unknown) {
      console.error("AI send message failed:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to communicate with Architect AI";
      setError(errorMsg);
      addToast({
        type: "error",
        title: "Communication Error",
        message: errorMsg,
      });
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsThinking(false);
    }
  };

  // Auto-send initial prompt if arriving from simplified prompt-first creation
  useEffect(() => {
    if (typeof window === "undefined" || autoSentRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const targetPrompt = params.get("initialPrompt") || propInitialPrompt;

    if (targetPrompt && targetPrompt.trim()) {
      autoSentRef.current = true;
      const cleanPrompt = targetPrompt.trim();

      // Clean query params so browser refresh does not re-trigger
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);

      // Automatically submit initialPrompt to Groq AI
      apiClient
        .sendMessage({
          projectId: project.id,
          message: cleanPrompt,
        })

        .then((result) => {
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== "initial_user_msg");
            return [...filtered, result.userMessage, result.assistantMessage];
          });
        })
        .catch((err: unknown) => {
          console.error("AI initial prompt submission failed:", err);
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Failed to communicate with Architect AI";
          setError(errorMsg);
          addToast({
            type: "error",
            title: "Communication Error",
            message: errorMsg,
          });
        })
        .finally(() => {
          setIsThinking(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Build Plan Generation Handler
  const handleCreateBuildPlan = async (
    sourcePrompt?: string,
    sourceMessageId?: string,
    requirementsSummary?: RequirementsSummary
  ) => {
    let targetPrompt = sourcePrompt;
    if (!targetPrompt) {
      const lastUser = [...messages]
        .reverse()
        .find((m) => m.sender === "user" || m.role === "user");
      targetPrompt = lastUser?.content || `Feature architecture for ${project.name}`;
    }

    setActiveView("plan");
    setIsGeneratingPlan(true);
    setError(null);

    try {
      const newPlan = await apiClient.createBuildPlan(project.id, {
        prompt: targetPrompt,
        sourceMessageId,
        requirementsSummary,
      });

      setPlans((prev) => [newPlan, ...prev]);
      setActivePlan(newPlan);

      // Append system message in conversation
      const sysMsg: Message = {
        id: `sys_${Date.now()}`,
        projectId: project.id,
        sender: "system",
        role: "system",
        content: `Architect generated Build Plan: **"${newPlan.title}"** (${newPlan.steps.length} steps). Review the milestones before agent execution.`,
        suggestedActions: [
          {
            label: "Review Build Plan",
            action: "view_plan",
            payload: { planId: newPlan.id },
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, sysMsg]);

      addToast({
        type: "success",
        title: "Build Plan Created",
        message: `Plan "${newPlan.title}" is ready for review.`,
      });
    } catch (err: unknown) {
      console.error("Failed to create build plan:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create build plan";
      setError(errorMsg);
      addToast({
        type: "error",
        title: "Plan Generation Error",
        message: errorMsg,
      });
      setActiveView("chat");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Approve Plan Handler
  const handleApprovePlan = async (planId: string) => {
    try {
      const updated = await apiClient.updateBuildPlan(project.id, planId, {
        status: "approved",
      });

      setPlans((prev) => prev.map((p) => (p.id === planId ? updated : p)));
      setActivePlan(updated);

      // Append system message in chat
      const sysMsg: Message = {
        id: `sys_app_${Date.now()}`,
        projectId: project.id,
        sender: "system",
        role: "system",
        content: `Build plan **"${updated.title}"** approved by user. Ready for agent execution.`,
        suggestedActions: [
          {
            label: "Start Agent Execution",
            action: "start_execution",
            payload: { planId: updated.id },
          },
          {
            label: "View Build Plan",
            action: "view_plan",
            payload: { planId: updated.id },
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, sysMsg]);
    } catch (err: unknown) {
      console.error("Failed to approve plan:", err);
      throw err;
    }
  };

  // Update/Edit Plan Handler
  const handleUpdatePlan = async (updatedPlan: BuildPlan) => {
    try {
      const saved = await apiClient.updateBuildPlan(
        project.id,
        updatedPlan.id,
        updatedPlan
      );
      setPlans((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      setActivePlan(saved);
      addToast({
        type: "success",
        title: "Build Plan Updated",
        message: "Your modifications have been persisted.",
      });
    } catch (err: unknown) {
      console.error("Failed to update plan:", err);
      throw err;
    }
  };

  // Action Click Handler (from Chat message actions)
  const handleActionClick = (action: MessageAction) => {
    switch (action.action) {
      case "start_execution": {
        const planId = action.payload?.planId as string | undefined;
        router.push(
          `/projects/${project.id}/agents${
            planId ? `?planId=${planId}&start=true` : "?start=true"
          }`
        );
        break;
      }
      case "create_plan": {
        const payloadContent = action.payload?.content as string | undefined;
        const sourceMessageId = action.payload?.sourceMessageId as string | undefined;
        const reqSummary = action.payload?.requirementsSummary as RequirementsSummary | undefined;
        handleCreateBuildPlan(payloadContent, sourceMessageId, reqSummary);
        break;
      }
      case "select_option": {
        const optText = (action.payload?.option || action.payload?.content || action.label) as string;
        handleSendMessage(optText);
        break;
      }
      case "view_plan": {
        const planId = action.payload?.planId as string | undefined;
        if (planId) {
          const found = plans.find((p) => p.id === planId);
          if (found) {
            setActivePlan(found);
            setActiveView("plan");
            return;
          }
        }
        if (plans.length > 0) {
          setActivePlan(plans[0]);
        }
        setActiveView("plan");
        break;
      }
      case "inspect_arch":
        handleSendMessage(
          "Analyze the existing project architecture, files, and dependencies."
        );
        break;
      case "review_code":
        handleSendMessage(
          "Review the existing project files and identify component improvements."
        );
        break;
      case "add_auth":
        handleSendMessage("Add authentication with Supabase and protected routes.");
        break;
      default:
        break;
    }
  };

  const filePaths = (project.files || []).map((f) => f.path);
  const recentActivities = project.activity || [];

  return (
    <div className="h-full w-full flex flex-col bg-[#090A0F] text-[#F0F6FC] overflow-hidden">
      {/* 1. Minimal Header */}
      <ChatHeader
        project={project}
        isThinking={isThinking}
        activeView={activeView}
        onViewChange={(view) => {
          if (view === "plan" && !activePlan && plans.length > 0) {
            setActivePlan(plans[0]);
          }
          setActiveView(view);
        }}
        planCount={plans.length}
        isContextPanelOpen={isContextPanelOpen}
        onToggleContextPanel={() => setIsContextPanelOpen(!isContextPanelOpen)}
        onClearChat={() => setIsClearModalOpen(true)}
        messagesCount={messages.length}
      />

      {/* 2. Main Stage: Conversation / Build Plan + Collapsible Context Panel */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Active View Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#090A0F] overflow-hidden">
          {/* VIEW A: BUILD PLAN VIEW (Secondary Layer) */}
          {activeView === "plan" && (
            <>
              {isGeneratingPlan ? (
                <BuildPlanLoading />
              ) : activePlan ? (
                <BuildPlanView
                  project={project}
                  plan={activePlan}
                  onBackToChat={() => setActiveView("chat")}
                  onApprovePlan={handleApprovePlan}
                  onUpdatePlan={handleUpdatePlan}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
                  <div className="h-12 w-12 rounded-xl bg-[#161B22] border border-[#30363D] flex items-center justify-center text-[#00F2FE]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">
                      No Build Plan Created Yet
                    </h3>
                    <p className="text-xs text-[#8B949E] leading-relaxed">
                      Describe your feature request in the conversation, then click
                      &quot;Create build plan&quot; to synthesize an architectural roadmap.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleCreateBuildPlan()}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      <span>Create Build Plan</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveView("chat")}
                    >
                      <span>Back to Conversation</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* VIEW B: CHAT CONVERSATION VIEW (Primary AI-first experience) */}
          {activeView === "chat" && (
            <>
              {messages.length === 0 && !isThinking ? (
                /* EMPTY / FIRST-TIME BUILD STATE */
                <WorkspaceEmptyState
                  project={project}
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  onSend={handleSendMessage}
                  isLoading={isThinking}
                  fileCount={filePaths.length}
                />
              ) : (
                /* ACTIVE CONVERSATION STATE */
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {/* Scrollable Message Feed */}
                  <ChatMessageList
                    project={project}
                    messages={messages}
                    isThinking={isThinking}
                    onSelectPrompt={(p) => handleSendMessage(p)}
                    onActionClick={handleActionClick}
                  />

                  {/* Pinned Bottom Area: Suggestions + Dominant Composer + Context Strip */}
                  <div className="p-3 sm:p-5 bg-gradient-to-t from-[#090A0F] via-[#090A0F] to-transparent shrink-0">
                    <div className="max-w-3xl mx-auto space-y-2.5">
                      {/* Error Alert if any */}
                      {error && (
                        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-xs text-[#F85149]">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setError(null)}
                            className="hover:underline flex items-center gap-1 font-mono text-[10px] cursor-pointer"
                          >
                            <RefreshCw className="h-3 w-3" /> Dismiss
                          </button>
                        </div>
                      )}

                      {/* Dominant Textarea Composer */}
                      <PromptComposer
                        value={prompt}
                        onChange={setPrompt}
                        onSend={() => handleSendMessage()}
                        isLoading={isThinking}
                        placeholder={
                          messages.length > 0
                            ? "Reply to Architect..."
                            : "Tell Architect what you want to build..."
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Project Context Panel (Collapsible Secondary Layer) */}
        {isContextPanelOpen && (
          <ContextPanel
            project={project}
            files={filePaths}
            recentActivity={recentActivities}
            plans={plans}
            activePlanId={activePlan?.id}
            onSelectPlan={(selected) => {
              setActivePlan(selected);
              setActiveView("plan");
            }}
            onSelectPrompt={(p) => {
              setActiveView("chat");
              handleSendMessage(p);
            }}
            onClose={() => setIsContextPanelOpen(false)}
          />
        )}
      </div>

      {/* Clear Chat Confirmation Modal */}
      <ClearChatModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleConfirmClearChat}
        isClearing={isClearingChat}
      />
    </div>
  );
}
