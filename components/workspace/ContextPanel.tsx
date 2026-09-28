"use client";

import React, { useState } from "react";
import { Project, ActivityEvent, BuildPlan } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { BuildPlanHistory } from "./BuildPlanHistory";
import {
  GitBranch,
  Layers,
  FileCode2,
  Activity,
  X,
  Code2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface ContextPanelProps {
  project: Project;
  files: string[];
  recentActivity: ActivityEvent[];
  plans?: BuildPlan[];
  activePlanId?: string;
  onSelectPlan?: (plan: BuildPlan) => void;
  onSelectPrompt: (prompt: string) => void;
  onClose?: () => void;
}

export function ContextPanel({
  project,
  files,
  recentActivity,
  plans = [],
  activePlanId,
  onSelectPlan,
  onClose,
}: ContextPanelProps) {
  const [showAllFiles, setShowAllFiles] = useState(false);

  const getStackLayers = () => {
    if (typeof project.stack === "object" && project.stack !== null) {
      return [
        project.stack.frontend || "Next.js 15",
        project.stack.backend || "Node.js",
        project.stack.database || "Supabase",
      ].filter(Boolean);
    }
    return ["Next.js 15", "Node.js", "Supabase"];
  };

  const stackLayers = getStackLayers();

  return (
    <aside className="w-64 sm:w-72 h-full border-l border-[#30363D] bg-[#0E1117] flex flex-col shrink-0 overflow-y-auto select-none text-xs">
      {/* 1. Header */}
      <div className="p-3 border-b border-[#21262D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#00F2FE]" />
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-white">
            Project Context
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#8B949E] hover:text-white hover:bg-[#161B22] transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="p-3.5 space-y-4">
        {/* 2. PROJECT OVERVIEW */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-white truncate" title={project.name}>
              {project.name}
            </h3>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#3FB950]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3FB950]" />
              <span className="capitalize">{project.status || "active"}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8B949E]">
            <GitBranch className="h-3 w-3 text-[#A855F7]" />
            <span>{project.currentBranch || "main"}</span>
          </div>

          {project.description && (
            <p className="text-[11px] text-[#8B949E] line-clamp-2 leading-relaxed pt-0.5">
              {project.description}
            </p>
          )}
        </div>

        {/* 3. TECH STACK */}
        <div className="space-y-1.5 pt-2.5 border-t border-[#21262D]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B949E] flex items-center gap-1">
            <Layers className="h-3 w-3 text-[#00F2FE]" />
            Stack
          </span>
          <div className="flex flex-wrap gap-1">
            {stackLayers.map((layer, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-[#161B22] border border-[#21262D] text-[10px] font-mono text-[#C9D1D9]"
              >
                {layer}
              </span>
            ))}
          </div>
        </div>

        {/* 4. TRACKED FILES */}
        <div className="space-y-1.5 pt-2.5 border-t border-[#21262D]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B949E] flex items-center gap-1">
              <FileCode2 className="h-3 w-3 text-[#38BDF8]" />
              Tracked Files ({files.length})
            </span>
            {files.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllFiles(!showAllFiles)}
                className="text-[10px] text-[#00F2FE] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>{showAllFiles ? "Less" : "All"}</span>
                {showAllFiles ? (
                  <ChevronUp className="h-2.5 w-2.5" />
                ) : (
                  <ChevronDown className="h-2.5 w-2.5" />
                )}
              </button>
            )}
          </div>

          <div className="space-y-1">
            {(showAllFiles ? files : files.slice(0, 3)).map((filePath, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#161B22] border border-[#21262D] text-[10px] font-mono text-[#8B949E] truncate"
              >
                <Code2 className="h-2.5 w-2.5 text-[#6E7681] shrink-0" />
                <span className="truncate">{filePath}</span>
              </div>
            ))}
            {files.length === 0 && (
              <span className="text-[10px] text-[#8B949E] italic">
                No files tracked yet
              </span>
            )}
          </div>
        </div>

        {/* 5. BUILD PLANS */}
        {onSelectPlan && (
          <div className="pt-2.5 border-t border-[#21262D]">
            <BuildPlanHistory
              plans={plans}
              activePlanId={activePlanId}
              onSelectPlan={onSelectPlan}
            />
          </div>
        )}

        {/* 6. RECENT ACTIVITY */}
        <div className="space-y-1.5 pt-2.5 border-t border-[#21262D]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B949E] flex items-center gap-1">
            <Activity className="h-3 w-3 text-[#10B981]" />
            Recent Activity
          </span>
          <div className="space-y-1">
            {recentActivity.slice(0, 3).map((act) => (
              <div
                key={act.id}
                className="p-1.5 rounded bg-[#161B22] border border-[#21262D] text-[10px] space-y-0.5"
              >
                <p className="text-white line-clamp-1 leading-snug">
                  {act.summary}
                </p>
                <div className="flex items-center justify-between text-[9px] text-[#8B949E] font-mono">
                  <span>{act.actor}</span>
                  <span suppressHydrationWarning>{formatTimestamp(act.createdAt)}</span>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <span className="text-[10px] text-[#8B949E] italic">
                No recent activity
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
