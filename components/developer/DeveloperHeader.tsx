"use client";

import React from "react";
import Link from "next/link";
import { ProjectDetails } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Code2,
  GitBranch,
  Play,
  Hammer,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";

interface DeveloperHeaderProps {
  project: ProjectDetails;
  currentBranch: string;
  hasUnsavedChanges: boolean;
  modifiedCount: number;
  isDiffActive: boolean;
  onToggleDiff: () => void;
  onOpenGitPanel: () => void;
  onSave: () => void;
}

export function DeveloperHeader({
  project,
  currentBranch = "main",
  hasUnsavedChanges,
  modifiedCount,
  isDiffActive,
  onToggleDiff,
  onOpenGitPanel,
  onSave,
}: DeveloperHeaderProps) {
  return (
    <header className="h-13 w-full border-b border-[#30363D] bg-[#0E1117] px-3 sm:px-5 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Project Name + Developer Mode Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="h-7 w-7 rounded-lg bg-[#A855F7]/15 border border-[#A855F7]/30 flex items-center justify-center text-[#A855F7] shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
          <Code2 className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-xs sm:text-sm text-white truncate max-w-[160px] sm:max-w-[220px]">
            {project.name}
          </span>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/25 hidden sm:inline-block shrink-0">
            Developer Mode
          </span>
        </div>
      </div>

      {/* Center: Branch + Git Status + Save Status */}
      <div className="hidden md:flex items-center gap-2 lg:gap-3 text-xs font-mono shrink-0 whitespace-nowrap">
        {/* Branch */}
        <div className="flex items-center gap-1.5 text-[#8B949E] px-2 py-0.5 rounded bg-[#161B22] border border-[#21262D] shrink-0">
          <GitBranch className="h-3 w-3 text-[#A855F7]" />
          <span className="text-white">{currentBranch}</span>
        </div>

        {/* Changed Files Counter */}
        <div
          onClick={onOpenGitPanel}
          className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors border shrink-0 whitespace-nowrap",
            modifiedCount > 0
              ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 hover:bg-[#F59E0B]/20"
              : "bg-[#161B22] text-[#8B949E] border-[#21262D]"
          )}
          title="Click to view Source Control"
        >
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", modifiedCount > 0 ? "bg-[#F59E0B] animate-pulse" : "bg-[#3FB950]")} />
          <span className="whitespace-nowrap">
            {modifiedCount > 0 ? `${modifiedCount} changed files` : "working tree clean"}
          </span>
        </div>

        {/* Save State Badge */}
        <button
          type="button"
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all duration-150 border shrink-0 whitespace-nowrap",
            hasUnsavedChanges
              ? "bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/40 hover:bg-[#00F2FE]/25 cursor-pointer shadow-[0_0_10px_rgba(0,242,254,0.15)]"
              : "bg-[#161B22] text-[#8B949E] border-[#21262D] cursor-default opacity-80"
          )}
          title={hasUnsavedChanges ? "Click to Save (Ctrl+S)" : "All files saved"}
        >
          {hasUnsavedChanges ? (
            <>
              <AlertCircle className="h-3 w-3 text-[#00F2FE] shrink-0" />
              <span className="whitespace-nowrap">Unsaved changes (Save)</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3 text-[#3FB950] shrink-0" />
              <span className="text-[#8B949E] whitespace-nowrap">Saved</span>
            </>
          )}
        </button>
      </div>

      {/* Right: Actions (Diff, Commit, Preview, Build Mode) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* View Changes / Diff Toggle */}
        <button
          type="button"
          onClick={onToggleDiff}
          title="Toggle Side-by-Side Diff Viewer"
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all duration-150",
            isDiffActive
              ? "bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/50 shadow-[0_0_10px_rgba(0,242,254,0.2)]"
              : "bg-[#161B22] text-[#8B949E] hover:text-[#F0F6FC] border-[#30363D] hover:bg-[#21262D]"
          )}
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">{isDiffActive ? "Close Diff" : "View Changes"}</span>
        </button>

        {/* Source Control Commit CTA */}
        {modifiedCount > 0 && (
          <button
            type="button"
            onClick={onOpenGitPanel}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#F59E0B]/40 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-mono font-medium transition-colors"
          >
            <GitCommit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Commit</span>
          </button>
        )}

        {/* Preview Link */}
        <Link href={`/projects/${project.id}/preview`}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs font-mono border-[#30363D] text-[#C9D1D9] hover:text-white flex items-center gap-1"
          >
            <Play className="h-3.5 w-3.5 text-[#00F2FE]" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
        </Link>

        {/* Build Mode Switcher */}
        <Link href={`/projects/${project.id}?mode=build`}>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="h-8 text-xs font-semibold bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] hover:from-[#00D8E6] hover:to-[#0284C7] text-black shadow-[0_0_12px_rgba(0,242,254,0.3)] flex items-center gap-1.5"
          >
            <Hammer className="h-3.5 w-3.5 fill-black" />
            <span>Build Mode</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
