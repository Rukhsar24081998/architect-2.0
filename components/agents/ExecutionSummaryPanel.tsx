"use client";

import React from "react";
import Link from "next/link";
import { AgentRun } from "@/lib/agents/types";
import { calculateExecutionMetrics } from "@/lib/agents/orchestrator";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Layers } from "lucide-react";

interface ExecutionSummaryPanelProps {
  run: AgentRun;
  onViewPlan: () => void;
}

export function ExecutionSummaryPanel({
  run,
  onViewPlan,
}: ExecutionSummaryPanelProps) {
  const metrics = calculateExecutionMetrics(run);
  const isComplete =
    run.status === "completed" &&
    metrics.completedTasks === metrics.totalTasks &&
    metrics.workingAgents === 0;

  return (
    <div className="rounded-xl border border-[#30363D] bg-[#0E1117] p-4 sm:p-5 flex flex-col justify-between h-[420px] sm:h-[480px] overflow-y-auto shadow-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21262D] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#00F2FE]" />
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              {isComplete ? "Execution Results" : "Execution Summary"}
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#8B949E]">
            {run.buildPlanTitle}
          </span>
        </div>

        {/* Compact Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D]">
            <span className="text-[10px] font-mono text-[#8B949E] uppercase">Agents</span>
            <p className="text-base font-bold text-white font-mono mt-0.5">
              {metrics.totalAgents}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D]">
            <span className="text-[10px] font-mono text-[#8B949E] uppercase">Tasks</span>
            <p className="text-base font-bold text-white font-mono mt-0.5">
              {metrics.totalTasks}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D]">
            <span className="text-[10px] font-mono text-[#8B949E] uppercase">Completed</span>
            <p className="text-base font-bold text-[#3FB950] font-mono mt-0.5">
              {metrics.completedTasks}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D]">
            <span className="text-[10px] font-mono text-[#8B949E] uppercase">Working</span>
            <p className="text-base font-bold text-[#00F2FE] font-mono mt-0.5">
              {metrics.workingAgents}
            </p>
          </div>
        </div>

        {/* Swarm Stage Pipeline */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-mono text-[#8B949E] uppercase">
            Swarm Orchestration Pipeline
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
            {/* Stage 1: Architect */}
            <div
              className={cn(
                "p-2 rounded-lg border text-center transition-colors",
                run.agents.find((a) => a.role === "architect")?.status === "completed"
                  ? "bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950]"
                  : run.agents.find((a) => a.role === "architect")?.status === "working"
                  ? "bg-[#00F2FE]/10 border-[#00F2FE]/40 text-[#00F2FE] animate-pulse"
                  : "bg-[#161B22] border-[#30363D] text-[#8B949E]"
              )}
            >
              <div className="text-[10px] text-[#8B949E]">Phase 1</div>
              <div className="font-semibold text-xs mt-0.5">Architect</div>
            </div>

            {/* Stage 2: Frontend & Backend */}
            <div
              className={cn(
                "p-2 rounded-lg border text-center transition-colors",
                run.agents.find((a) => a.role === "frontend")?.status === "completed" &&
                  run.agents.find((a) => a.role === "backend")?.status === "completed"
                  ? "bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950]"
                  : run.agents.find((a) => a.role === "frontend")?.status === "working" ||
                    run.agents.find((a) => a.role === "backend")?.status === "working"
                  ? "bg-[#A855F7]/10 border-[#A855F7]/40 text-[#A855F7] animate-pulse"
                  : "bg-[#161B22] border-[#30363D] text-[#8B949E]"
              )}
            >
              <div className="text-[10px] text-[#8B949E]">Phase 2</div>
              <div className="font-semibold text-xs mt-0.5">FE & BE</div>
            </div>

            {/* Stage 3: QA */}
            <div
              className={cn(
                "p-2 rounded-lg border text-center transition-colors",
                run.agents.find((a) => a.role === "qa")?.status === "completed"
                  ? "bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950]"
                  : run.agents.find((a) => a.role === "qa")?.status === "working"
                  ? "bg-[#3FB950]/10 border-[#3FB950]/40 text-[#3FB950] animate-pulse"
                  : "bg-[#161B22] border-[#30363D] text-[#8B949E]"
              )}
            >
              <div className="text-[10px] text-[#8B949E]">Phase 3</div>
              <div className="font-semibold text-xs mt-0.5">QA Suite</div>
            </div>
          </div>
        </div>

        {/* Results Checklist when Complete */}
        {isComplete && (
          <div className="p-3.5 rounded-xl bg-[#3FB950]/10 border border-[#3FB950]/30 space-y-2.5">
            <div className="flex items-center gap-2 text-[#3FB950] font-semibold text-xs font-mono uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Execution Complete</span>
            </div>
            <p className="text-xs text-[#C9D1D9] leading-relaxed">
              All planned tasks have completed cleanly.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#3FB950]/20 font-mono">
              <div className="flex items-center gap-1.5 text-[#3FB950]">
                <CheckCircle2 className="h-3 w-3" />
                <span>Architecture</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#3FB950]">
                <CheckCircle2 className="h-3 w-3" />
                <span>Frontend UI</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#3FB950]">
                <CheckCircle2 className="h-3 w-3" />
                <span>Backend Routes</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#3FB950]">
                <CheckCircle2 className="h-3 w-3" />
                <span>QA Verification</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer & Suggested Actions */}
      <div className="pt-3 border-t border-[#21262D] space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8B949E]">
          <span>Security / Trust Note</span>
          <span className="text-[#6E7681]">Simulated workflow</span>
        </div>
        <p className="text-[11px] text-[#8B949E] leading-relaxed">
          Simulated execution demonstration. No project files were modified on disk.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onViewPlan}
            className="flex-1 text-xs border-[#30363D] text-[#C9D1D9] hover:text-white"
          >
            <span>Review Plan</span>
          </Button>

          <Link
            href={`/projects/${run.projectId}/preview${run.buildPlanId ? `?planId=${run.buildPlanId}` : ""}`}
            className="flex-1"
          >
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="w-full text-xs font-semibold bg-[#00F2FE] hover:bg-[#00D8E6] text-black shadow-[0_0_12px_rgba(0,242,254,0.3)]"
            >
              <span>Open Preview</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
