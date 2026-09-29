"use client";

import React from "react";
import Link from "next/link";
import { ProjectDetails } from "@/lib/types";
import { ViewportMode } from "@/lib/preview/types";
import { PreviewViewportControls } from "./PreviewViewportControls";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Eye,
} from "lucide-react";

interface PreviewToolbarProps {
  project: ProjectDetails;
  productName?: string;
  currentMode: ViewportMode;
  onModeChange: (mode: ViewportMode) => void;
  isInspectorActive: boolean;
  onToggleInspector: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function PreviewToolbar({
  project,
  productName,
  currentMode,
  onModeChange,
  isInspectorActive,
  onToggleInspector,
  onRefresh,
  isRefreshing = false,
}: PreviewToolbarProps) {
  const handleOpenExternal = () => {
    // Open clean preview in new tab or copy preview URL
    const url = `${window.location.origin}/projects/${project.id}/preview?standalone=true`;
    window.open(url, "_blank");
  };

  const displayName = productName && productName !== project.name
    ? `${project.name} · ${productName}`
    : project.name;

  return (
    <header className="h-14 w-full border-b border-[#30363D] bg-[#0E1117] px-3 sm:px-5 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Back / Breadcrumbs / Project Identity */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <Link
          href={`/projects/${project.id}`}
          className="h-8 w-8 rounded-lg border border-[#30363D] bg-[#161B22] hover:bg-[#21262D] text-[#8B949E] hover:text-white flex items-center justify-center transition-colors shrink-0"
          title="Back to Workspace"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Project & Preview Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="font-semibold text-xs sm:text-sm text-white truncate max-w-[140px] sm:max-w-[240px]"
                title={displayName}
              >
                {displayName}
              </span>
              <span className="text-[#6E7681] text-xs">/</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono font-medium text-[#00F2FE]">
                  Preview
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#3FB950] px-1.5 py-0.2 rounded bg-[#3FB950]/10 border border-[#3FB950]/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3FB950] animate-pulse" />
                  <span className="hidden sm:inline">Active</span>
                </span>
              </div>
            </div>
            <span className="text-[10px] text-[#8B949E] font-mono hidden md:inline truncate">
              {project.currentBranch || "main"} · Next.js Local Sandbox
            </span>
          </div>
        </div>
      </div>

      {/* Center: Responsive Viewport Switcher */}
      <div className="flex items-center justify-center">
        <PreviewViewportControls
          currentMode={currentMode}
          onModeChange={onModeChange}
        />
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Visual Inspector Toggle */}
        <button
          type="button"
          onClick={onToggleInspector}
          title="Toggle Visual Component Inspector"
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all duration-150",
            isInspectorActive
              ? "bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/50 shadow-[0_0_12px_rgba(0,242,254,0.2)]"
              : "bg-[#161B22] text-[#8B949E] hover:text-[#F0F6FC] border-[#30363D] hover:bg-[#21262D]"
          )}
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden md:inline">
            Inspector {isInspectorActive ? "ON" : "OFF"}
          </span>
        </button>

        {/* Refresh Preview */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Preview Canvas"
          className="h-8 w-8 rounded-lg border border-[#30363D] bg-[#161B22] hover:bg-[#21262D] text-[#8B949E] hover:text-white flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
        >
          <RotateCcw
            className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-[#00F2FE]")}
          />
        </button>

        {/* Open in New Window */}
        <button
          type="button"
          onClick={handleOpenExternal}
          title="Open in new window"
          className="h-8 px-2.5 rounded-lg border border-[#30363D] bg-[#161B22] hover:bg-[#21262D] text-[#8B949E] hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors shrink-0"
        >
          <span className="hidden sm:inline">Open</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>

        {/* Build / Agent Connection Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#30363D] text-[11px] font-mono text-[#8B949E] whitespace-nowrap shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] shrink-0" />
          <span className="text-[#C9D1D9] whitespace-nowrap">Built by Architect</span>
          <span className="text-[#6E7681] hidden xl:inline">·</span>
          <span className="hidden xl:inline whitespace-nowrap">Last build: just now</span>
        </div>
      </div>
    </header>
  );
}
