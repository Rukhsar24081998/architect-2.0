"use client";

import React from "react";
import { AgentInstance, AgentRole } from "@/lib/agents/types";
import { formatTimestamp } from "@/lib/agents/simulation";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Compass,
  Layout,
  Server,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  FileCode2,
} from "lucide-react";

interface AgentCardProps {
  agent: AgentInstance;
  onSelect: (agent: AgentInstance) => void;
  onResolveBlock?: (role: AgentRole) => void;
}

const ROLE_CONFIG: Record<
  AgentRole,
  {
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    accentGlow: string;
  }
> = {
  architect: {
    icon: Compass,
    color: "text-[#00F2FE]",
    bgColor: "bg-[#00F2FE]/10",
    borderColor: "border-[#00F2FE]/30",
    accentGlow: "shadow-[0_0_15px_rgba(0,242,254,0.15)]",
  },
  frontend: {
    icon: Layout,
    color: "text-[#A855F7]",
    bgColor: "bg-[#A855F7]/10",
    borderColor: "border-[#A855F7]/30",
    accentGlow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
  },
  backend: {
    icon: Server,
    color: "text-[#38BDF8]",
    bgColor: "bg-[#38BDF8]/10",
    borderColor: "border-[#38BDF8]/30",
    accentGlow: "shadow-[0_0_15px_rgba(56,189,248,0.15)]",
  },
  qa: {
    icon: CheckCircle,
    color: "text-[#3FB950]",
    bgColor: "bg-[#3FB950]/10",
    borderColor: "border-[#3FB950]/30",
    accentGlow: "shadow-[0_0_15px_rgba(63,185,80,0.15)]",
  },
  devops: {
    icon: RotateCcw,
    color: "text-[#F59E0B]",
    bgColor: "bg-[#F59E0B]/10",
    borderColor: "border-[#F59E0B]/30",
    accentGlow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  },
};

export function AgentCard({ agent, onSelect, onResolveBlock }: AgentCardProps) {
  const config = ROLE_CONFIG[agent.role] || ROLE_CONFIG.architect;
  const Icon = config.icon;

  const isWorking = agent.status === "working";
  const isCompleted = agent.status === "completed";
  const isBlocked = agent.status === "blocked";
  const isPaused = agent.status === "paused";
  const isQueued = agent.status === "queued" || agent.status === "idle";

  const latestLog = agent.activityLog[0];

  return (
    <div
      onClick={() => onSelect(agent)}
      className={cn(
        "group relative rounded-xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer select-none",
        "bg-[#0E1117] hover:bg-[#161B22] border-[#30363D] hover:border-[#6E7681]",
        isWorking && cn("border-[#00F2FE]/50", config.accentGlow),
        isBlocked && "border-[#EF4444]/60 bg-[#EF4444]/5"
      )}
    >
      {/* Top row: Icon + Name/Role + Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center border transition-transform duration-200 group-hover:scale-105",
              config.bgColor,
              config.borderColor,
              config.color
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-white">
                {agent.name}
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#161B22] text-[#8B949E] border border-[#30363D]">
                {agent.role}
              </span>
            </div>
            <p className="text-xs text-[#8B949E] line-clamp-1 mt-0.5">
              {agent.description}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isWorking && (
            <Badge
              variant="cyan"
              size="sm"
              dot
              className="font-mono text-xs uppercase animate-pulse shadow-[0_0_10px_rgba(0,242,254,0.3)]"
            >
              Working
            </Badge>
          )}
          {isCompleted && (
            <Badge
              variant="success"
              size="sm"
              dot
              className="font-mono text-xs uppercase"
            >
              Completed
            </Badge>
          )}
          {isQueued && (
            <Badge
              variant="secondary"
              size="sm"
              className="font-mono text-xs uppercase text-[#8B949E]"
            >
              {agent.role === "architect" ? "Ready / Queued" : "Queued"}
            </Badge>
          )}
          {isPaused && (
            <Badge
              variant="warning"
              size="sm"
              dot
              className="font-mono text-xs uppercase"
            >
              Paused
            </Badge>
          )}
          {isBlocked && (
            <Badge
              variant="destructive"
              size="sm"
              dot
              className="font-mono text-xs uppercase animate-pulse"
            >
              Blocked
            </Badge>
          )}
        </div>
      </div>

      {/* Middle row: Current Task */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#8B949E] font-medium">Current Task:</span>
          <span className="font-mono text-[#8B949E] text-[11px]">
            {agent.tasksCompleted} / {agent.tasksTotal} tasks
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#C9D1D9] font-medium line-clamp-2 min-h-[2.5rem]">
          {agent.currentTask || "Awaiting task assignment"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#8B949E]">Progress</span>
          <span
            className={cn(
              "font-semibold",
              isCompleted
                ? "text-[#3FB950]"
                : isWorking
                ? "text-[#00F2FE]"
                : "text-[#8B949E]"
            )}
          >
            {agent.progress}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#161B22] rounded-full overflow-hidden border border-[#30363D]/50">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              isCompleted
                ? "bg-[#3FB950]"
                : isBlocked
                ? "bg-[#EF4444]"
                : "bg-gradient-to-r from-[#00F2FE] to-[#A855F7]"
            )}
            style={{ width: `${agent.progress}%` }}
          />
        </div>
      </div>

      {/* Blocked Alert Banner if applicable */}
      {isBlocked && agent.blockedReason && (
        <div className="mt-3 p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#FCA5A5] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 line-clamp-1">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[#EF4444]" />
            <span>{agent.blockedReason}</span>
          </div>
          {onResolveBlock && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onResolveBlock(agent.role);
              }}
              className="px-2 py-0.5 rounded bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium text-[10px] shrink-0"
            >
              Resolve
            </button>
          )}
        </div>
      )}

      {/* Footer: Latest Activity Log Snippet */}
      {latestLog && (
        <div className="mt-3 pt-3 border-t border-[#21262D] flex items-center justify-between text-[11px] text-[#8B949E]">
          <div className="flex items-center gap-1.5 line-clamp-1">
            <span className="font-mono text-[#6E7681]">
              {formatTimestamp(latestLog.timestamp)}
            </span>
            <span className="truncate">{latestLog.action}</span>
          </div>
          {latestLog.fileReference && (
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-[#00F2FE]/80 bg-[#00F2FE]/5 px-1.5 py-0.5 rounded border border-[#00F2FE]/20 shrink-0 ml-2">
              <FileCode2 className="h-3 w-3" />
              {latestLog.fileReference.split("/").pop()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
