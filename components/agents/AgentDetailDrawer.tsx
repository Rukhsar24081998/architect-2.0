"use client";

import React from "react";
import { AgentInstance, AgentRole } from "@/lib/agents/types";
import { formatTimestamp } from "@/lib/agents/simulation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  X,
  Compass,
  Layout,
  Server,
  CheckCircle,
  FileCode2,
  Layers,
  ShieldAlert,
  Bot,
} from "lucide-react";

interface AgentDetailDrawerProps {
  agent: AgentInstance | null;
  onClose: () => void;
}

const ROLE_ICONS: Record<AgentRole, React.ElementType> = {
  architect: Compass,
  frontend: Layout,
  backend: Server,
  qa: CheckCircle,
  devops: Layers,
};

export function AgentDetailDrawer({ agent, onClose }: AgentDetailDrawerProps) {
  if (!agent) return null;

  const Icon = ROLE_ICONS[agent.role] || Bot;
  const isWorking = agent.status === "working";
  const isCompleted = agent.status === "completed";
  const isBlocked = agent.status === "blocked";
  const isPaused = agent.status === "paused";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-[#0E1117] border-l border-[#30363D] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#30363D] bg-[#161B22] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-[#090A0F] border border-[#30363D] text-white">
              <Icon className="h-5 w-5 text-[#00F2FE]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {agent.name}
                </h3>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#090A0F] text-[#8B949E] border border-[#30363D]">
                  {agent.role}
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-0.5">
                {agent.description}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[#8B949E] hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Status & Progress Card */}
          <div className="p-4 rounded-xl border border-[#30363D] bg-[#161B22]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#8B949E] uppercase">
                Agent Status
              </span>
              <div>
                {isWorking && (
                  <Badge variant="cyan" size="sm" dot className="font-mono uppercase">
                    Working
                  </Badge>
                )}
                {isCompleted && (
                  <Badge variant="success" size="sm" dot className="font-mono uppercase">
                    Completed
                  </Badge>
                )}
                {isPaused && (
                  <Badge variant="warning" size="sm" dot className="font-mono uppercase">
                    Paused
                  </Badge>
                )}
                {isBlocked && (
                  <Badge variant="destructive" size="sm" dot className="font-mono uppercase animate-pulse">
                    Blocked
                  </Badge>
                )}
                {!isWorking && !isCompleted && !isPaused && !isBlocked && (
                  <Badge variant="secondary" size="sm" className="font-mono uppercase">
                    {agent.status}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#8B949E]">Progress</span>
                <span className="text-white font-semibold">{agent.progress}%</span>
              </div>
              <div className="h-2 w-full bg-[#0E1117] rounded-full overflow-hidden border border-[#30363D]/60">
                <div
                  className="h-full bg-gradient-to-r from-[#00F2FE] to-[#A855F7] transition-all duration-300"
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
            </div>

            {agent.blockedReason && (
              <div className="p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#FCA5A5] flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-[#EF4444]" />
                <span>{agent.blockedReason}</span>
              </div>
            )}
          </div>

          {/* Current Task */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#8B949E]">
              Current Task
            </h4>
            <div className="p-3.5 rounded-xl border border-[#30363D] bg-[#161B22]/50 text-sm text-[#F0F6FC] font-medium leading-relaxed">
              {agent.currentTask || "No active task assigned."}
            </div>
          </div>

          {/* Assigned Tasks Breakdown */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#8B949E]">
                Assigned Tasks ({agent.tasksCompleted}/{agent.tasksTotal})
              </h4>
            </div>

            <div className="space-y-2">
              {agent.assignedTasks.map((task, idx) => (
                <div
                  key={task.id || idx}
                  className="p-3 rounded-lg border border-[#30363D] bg-[#161B22]/30 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-white">
                      {task.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#090A0F] text-[#8B949E] border border-[#30363D] shrink-0">
                      {task.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8B949E] leading-relaxed">
                    {task.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Referenced Files */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#8B949E]">
              Referenced Files ({agent.referencedFiles.length})
            </h4>
            <div className="space-y-1.5">
              {agent.referencedFiles.length === 0 ? (
                <p className="text-xs text-[#8B949E] italic">
                  No files targeted by this agent.
                </p>
              ) : (
                agent.referencedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg border border-[#30363D] bg-[#161B22]/30 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode2 className="h-3.5 w-3.5 text-[#00F2FE] shrink-0" />
                      <span className="text-[#C9D1D9] truncate">{file}</span>
                    </div>
                    <span className="text-[10px] text-[#00F2FE] bg-[#00F2FE]/10 px-2 py-0.5 rounded border border-[#00F2FE]/25 shrink-0 ml-2">
                      PROPOSED
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Swarm Dependencies */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#8B949E]">
              Dependencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {agent.dependencies.length === 0 ? (
                <span className="text-xs text-[#8B949E]">None (Root Agent)</span>
              ) : (
                agent.dependencies.map((dep, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#161B22] border border-[#30363D] text-[#C9D1D9]"
                  >
                    Requires: {dep}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Dedicated Execution Activity Log */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#8B949E]">
              Agent Activity History
            </h4>
            <div className="space-y-2 divide-y divide-[#21262D]">
              {agent.activityLog.map((log) => (
                <div key={log.id} className="pt-2 text-xs space-y-0.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#6E7681]">
                    <span>{formatTimestamp(log.timestamp)}</span>
                    <span className="uppercase text-[10px]">{log.type}</span>
                  </div>
                  <p className="text-[#C9D1D9]">{log.action}</p>
                  {log.fileReference && (
                    <span className="text-[11px] font-mono text-[#00F2FE]">
                      Target: {log.fileReference}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#30363D] bg-[#161B22] flex justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
