"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectDetails, BuildPlan } from "@/lib/types";
import {
  AgentRun,
  AgentInstance,
  AgentRole,
} from "@/lib/agents/types";
import {
  initializeAgentRun,
  advanceSimulationStep,
} from "@/lib/agents/simulation";
import {
  pauseRun,
  resumeRun,
  abortRun,
  blockAgent,
  resolveBlockedAgent,
  calculateExecutionMetrics,
} from "@/lib/agents/orchestrator";
import { apiClient } from "@/lib/api-client";
import { AgentCard } from "./AgentCard";
import { LiveActivityFeed } from "./LiveActivityFeed";
import { ExecutionSummaryPanel } from "./ExecutionSummaryPanel";
import { AgentDetailDrawer } from "./AgentDetailDrawer";
import { StopExecutionModal } from "./StopExecutionModal";
import { AgentEmptyState } from "./AgentEmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  StopCircle,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Bot,
  Check,
} from "lucide-react";

interface AgentCommandCenterProps {
  project: ProjectDetails;
  initialPlans: BuildPlan[];
  initialRuns: AgentRun[];
}

export function AgentCommandCenter({
  project,
  initialPlans,
  initialRuns,
}: AgentCommandCenterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const autoStartParam = searchParams.get("start") === "true";
  const planIdParam = searchParams.get("planId");

  // Determine active build plan: matching param, or first approved, or first existing
  const targetPlan =
    (planIdParam ? initialPlans.find((p) => p.id === planIdParam) : null) ||
    initialPlans.find((p) => p.status === "approved") ||
    initialPlans[0] ||
    null;

  const [activePlan, setActivePlan] = useState<BuildPlan | null>(targetPlan);
  const [currentRun, setCurrentRun] = useState<AgentRun | null>(() => {
    if (autoStartParam && targetPlan) {
      const idleRun = initializeAgentRun(project.id, targetPlan, false);
      return advanceSimulationStep(idleRun, 1).updatedRun;
    }
    // Check initial runs
    if (initialRuns && initialRuns.length > 0) {
      const match = planIdParam
        ? initialRuns.find((r) => r.buildPlanId === planIdParam)
        : initialRuns[0];
      if (match && match.status === "completed") {
        return match;
      }
    }
    // If target plan exists, initialize ready-to-execute swarm
    if (targetPlan) {
      return initializeAgentRun(project.id, targetPlan, false);
    }
    return null;
  });

  const [selectedAgentForDrawer, setSelectedAgentForDrawer] =
    useState<AgentInstance | null>(null);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const currentRunRef = useRef<AgentRun | null>(currentRun);
  useEffect(() => {
    currentRunRef.current = currentRun;
  }, [currentRun]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop the ticking timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Save / Sync run to server and localStorage
  const syncRunState = useCallback(
    async (runToSave: AgentRun) => {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            `architect_agent_run_${project.id}`,
            JSON.stringify(runToSave)
          );
        }
        await apiClient.updateAgentRun(project.id, runToSave.id, runToSave);
      } catch (err) {
        console.warn("Failed to sync agent run to server:", err);
      }
    },
    [project.id]
  );

  // Execute a single simulation tick
  const tickSimulation = useCallback(() => {
    const prev = currentRunRef.current;
    if (!prev || prev.status !== "executing") {
      stopTimer();
      return;
    }

    const nextStep = (prev.currentStep ?? 0) + 1;
    const { updatedRun, isComplete } = advanceSimulationStep(prev, nextStep);

    currentRunRef.current = updatedRun;
    setCurrentRun(updatedRun);

    if (isComplete) {
      stopTimer();
      syncRunState(updatedRun);
      addToast({
        type: "success",
        title: "Execution Complete",
        message: "All planned tasks have been executed successfully.",
      });
    } else {
      syncRunState(updatedRun);
    }
  }, [addToast, stopTimer, syncRunState]);

  // Start the timer loop
  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      tickSimulation();
    }, 1600);
  }, [stopTimer, tickSimulation]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // Start Agent Execution
  const handleStartExecution = useCallback(
    async (planToRun?: BuildPlan) => {
      const plan = planToRun || activePlan;
      if (!plan) return;

      stopTimer();

      // Mark plan as approved if not already
      if (plan.status !== "approved") {
        try {
          await apiClient.updateBuildPlan(project.id, plan.id, {
            status: "approved",
          });
          setActivePlan((prev) => (prev ? { ...prev, status: "approved" } : null));
        } catch (err) {
          console.warn("Failed to mark plan as approved:", err);
        }
      }

      // Initialize fresh run at Step 1
      const idleRun = initializeAgentRun(project.id, plan, false);
      const step1 = advanceSimulationStep(idleRun, 1).updatedRun;

      currentRunRef.current = step1;
      setCurrentRun(step1);

      try {
        await apiClient.updateAgentRun(project.id, step1.id, step1);
      } catch (err) {
        console.warn("Failed to persist initial run:", err);
      }

      addToast({
        type: "info",
        title: "Agent Execution Started",
        message: `Swarm orchestrator initialized for "${plan.title}".`,
      });

      startTimer();
    },
    [activePlan, addToast, project.id, startTimer, stopTimer]
  );

  // If autoStartParam was provided, start timer on mount
  useEffect(() => {
    if (autoStartParam && currentRunRef.current?.status === "executing") {
      startTimer();
    }
  }, [autoStartParam, startTimer]);

  // Pause Action
  const handlePause = async () => {
    if (!currentRun) return;
    stopTimer();
    const paused = pauseRun(currentRun);
    currentRunRef.current = paused;
    setCurrentRun(paused);
    await syncRunState(paused);
    addToast({
      type: "warning",
      title: "Execution Paused",
      message: "Agent swarm paused. Progress preserved.",
    });
  };

  // Resume Action
  const handleResume = async () => {
    if (!currentRun) return;
    const resumed = resumeRun(currentRun);
    currentRunRef.current = resumed;
    setCurrentRun(resumed);
    await syncRunState(resumed);
    addToast({
      type: "info",
      title: "Execution Resumed",
      message: "Agents resuming task execution.",
    });
    startTimer();
  };

  // Stop / Abort Action
  const handleConfirmStop = async () => {
    if (!currentRun) return;
    setIsStopping(true);
    stopTimer();
    const aborted = abortRun(currentRun);
    currentRunRef.current = aborted;
    setCurrentRun(aborted);
    await syncRunState(aborted);
    setIsStopping(false);
    setIsStopModalOpen(false);
    addToast({
      type: "error",
      title: "Execution Aborted",
      message: "Current progress preserved. Remaining tasks stopped.",
    });
  };

  // Simulated Block Demo Action (Requirement 18)
  const handleSimulateBlock = () => {
    if (!currentRun) return;
    const blocked = blockAgent(
      currentRun,
      "backend",
      "Waiting for Supabase environment configuration"
    );
    currentRunRef.current = blocked;
    setCurrentRun(blocked);
    addToast({
      type: "warning",
      title: "Agent Blocked (Simulation)",
      message: "Backend agent waiting for Supabase credentials.",
    });
  };

  // Resolve Blocked Agent Action
  const handleResolveBlock = (role: AgentRole) => {
    if (!currentRun) return;
    const resolved = resolveBlockedAgent(currentRun, role);
    currentRunRef.current = resolved;
    setCurrentRun(resolved);
    addToast({
      type: "success",
      title: "Dependency Resolved",
      message: `${role.toUpperCase()} agent resumed.`,
    });
  };

  // Empty state check
  if (!activePlan && (!currentRun || currentRun.status === "idle")) {
    return <AgentEmptyState projectId={project.id} />;
  }

  const isExecuting = currentRun?.status === "executing";
  const isPaused = currentRun?.status === "paused";
  const isAborted = currentRun?.status === "aborted";
  const isIdle = !currentRun || currentRun.status === "idle";

  const metrics = currentRun
    ? calculateExecutionMetrics(currentRun)
    : {
        totalAgents: 4,
        totalTasks: activePlan?.steps.length || 4,
        completedTasks: 0,
        workingAgents: 0,
        queuedAgents: 4,
        blockedAgents: 0,
        overallProgress: 0,
      };

  const isCompleted =
    currentRun?.status === "completed" &&
    metrics.completedTasks === metrics.totalTasks &&
    metrics.workingAgents === 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A0F] text-[#F0F6FC] overflow-y-auto">
      {/* 1. Command Center Top Header */}
      <div className="p-4 sm:p-6 border-b border-[#30363D] bg-[#0E1117] space-y-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8B949E] flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-[#00F2FE]" />
                <span>Agent Command Center</span>
              </span>

              <div className="h-3.5 w-[1px] bg-[#30363D]" />

              {/* Status Badge */}
              {isExecuting && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] text-xs font-mono font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE]" />
                  </span>
                  <span>EXECUTING</span>
                </div>
              )}
              {isPaused && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-medium">
                  <Pause className="h-3 w-3" />
                  <span>PAUSED</span>
                </div>
              )}
              {isCompleted && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950] text-xs font-mono font-medium">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                  <span>COMPLETED</span>
                </div>
              )}
              {isAborted && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-mono font-medium">
                  <StopCircle className="h-3 w-3" />
                  <span>ABORTED</span>
                </div>
              )}
              {isIdle && (
                <Badge variant="secondary" size="sm" className="font-mono text-xs uppercase">
                  READY TO EXECUTE
                </Badge>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {activePlan?.title || currentRun?.buildPlanTitle || "Multi-Agent Swarm Orchestration"}
            </h1>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Build Plan link */}
            {activePlan && (
              <Link href={`/projects/${project.id}?mode=build&planId=${activePlan.id}`}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#30363D] text-[#C9D1D9] hover:text-white"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-[#00F2FE]" />
                  <span>View Build Plan</span>
                </Button>
              </Link>
            )}

            {/* Execution Controls */}
            {isIdle && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleStartExecution()}
                className="text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)]"
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                <span>Start Agent Execution</span>
              </Button>
            )}

            {isExecuting && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePause}
                  className="text-xs border-[#F59E0B]/40 text-[#F59E0B] hover:bg-[#F59E0B]/10"
                >
                  <Pause className="h-3.5 w-3.5 mr-1" />
                  <span>Pause Execution</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsStopModalOpen(true)}
                  className="text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  <StopCircle className="h-3.5 w-3.5 mr-1" />
                  <span>Stop</span>
                </Button>
              </>
            )}

            {isPaused && (
              <>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleResume}
                  className="text-xs"
                >
                  <Play className="h-3.5 w-3.5 mr-1" />
                  <span>Resume Execution</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsStopModalOpen(true)}
                  className="text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  <StopCircle className="h-3.5 w-3.5 mr-1" />
                  <span>Stop</span>
                </Button>
              </>
            )}

            {isCompleted && (
              <Link
                href={`/projects/${project.id}/preview${
                  activePlan?.id
                    ? `?planId=${activePlan.id}`
                    : currentRun?.buildPlanId
                    ? `?planId=${currentRun.buildPlanId}`
                    : ""
                }`}
              >
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="text-xs bg-[#00F2FE] hover:bg-[#00D8E6] text-black font-semibold shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                >
                  <Play className="h-3.5 w-3.5 mr-1 fill-black" />
                  <span>Open Preview</span>
                </Button>
              </Link>
            )}

            {(isCompleted || isAborted) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleStartExecution()}
                className="text-xs border-[#30363D] text-[#C9D1D9] hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                <span>Run Again</span>
              </Button>
            )}
          </div>
        </div>

        {/* Overall Progress Strip */}
        <div className="space-y-2 pt-2 border-t border-[#21262D]">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-[#8B949E]">Progress</span>
              <span className="font-bold text-white text-sm">
                {metrics.overallProgress}%
              </span>
              <span className="text-[#30363D]">•</span>
              <span className="text-[#8B949E]">
                {metrics.workingAgents} / {metrics.totalAgents} agents active
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#8B949E]">
              <span>
                Tasks: <strong className="text-white">{metrics.completedTasks}</strong> /{" "}
                {metrics.totalTasks} completed
              </span>

              {/* Controlled Simulation Block Helper (Requirement 18) */}
              {isExecuting && metrics.workingAgents > 0 && (
                <button
                  type="button"
                  onClick={handleSimulateBlock}
                  className="hidden md:inline-flex items-center gap-1 text-[10px] text-[#8B949E] hover:text-[#EF4444] underline transition-colors"
                  title="Simulate a temporary dependency block for testing"
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Simulate Block</span>
                </button>
              )}
            </div>
          </div>

          <div className="h-2 w-full bg-[#161B22] rounded-full overflow-hidden border border-[#30363D]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isCompleted
                  ? "bg-[#3FB950]"
                  : isAborted
                  ? "bg-[#EF4444]"
                  : "bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#A855F7]"
              )}
              style={{ width: `${metrics.overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Main Body Content */}
      <div className="p-4 sm:p-6 space-y-6 flex-1">
        {/* AGENTS GRID (Core Swarm Cards) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
              Specialized Swarm Agents ({currentRun?.agents.length || 4})
            </h2>
            <span className="text-xs text-[#6E7681]">
              Click any agent to inspect activity and referenced files
            </span>
          </div>

          {/* 2 x 2 Agent Card Grid on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentRun?.agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onSelect={(a) => setSelectedAgentForDrawer(a)}
                onResolveBlock={handleResolveBlock}
              />
            ))}
          </div>
        </div>

        {/* 3. LOWER SECTION: Live Activity Feed (Left) & Execution Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left Column: Live Activity Feed (8 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <LiveActivityFeed
              activities={currentRun?.activityFeed || []}
            />
          </div>

          {/* Right Column: Execution Summary & Results Panel (5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4">
            {currentRun && (
              <ExecutionSummaryPanel
                run={currentRun}
                onViewPlan={() => {
                  if (activePlan) {
                    router.push(`/projects/${project.id}?mode=build&planId=${activePlan.id}`);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 4. Modals & Drawers */}
      <AgentDetailDrawer
        agent={selectedAgentForDrawer}
        onClose={() => setSelectedAgentForDrawer(null)}
      />

      <StopExecutionModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        onConfirmStop={handleConfirmStop}
        isStopping={isStopping}
      />
    </div>
  );
}
