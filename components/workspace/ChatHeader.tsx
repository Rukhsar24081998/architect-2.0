"use client";

import React from "react";
import { Project } from "@/lib/types";
import {
  Sparkles,
  SidebarClose,
  SidebarOpen,
  ClipboardList,
  MessageSquare,
  Trash2,
} from "lucide-react";

export interface ChatHeaderProps {
  project: Project;
  isThinking: boolean;
  activeView?: "chat" | "plan";
  onViewChange?: (view: "chat" | "plan") => void;
  planCount?: number;
  isContextPanelOpen: boolean;
  onToggleContextPanel: () => void;
  onClearChat?: () => void;
  messagesCount?: number;
}

export function ChatHeader({
  project,
  isThinking,
  activeView = "chat",
  onViewChange,
  planCount = 0,
  isContextPanelOpen,
  onToggleContextPanel,
  onClearChat,
  messagesCount = 0,
}: ChatHeaderProps) {
  return (
    <header className="h-13 w-full border-b border-[#30363D] bg-[#0E1117] px-3 sm:px-5 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Architect Title & Project Details */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#A855F7] p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,242,254,0.25)]">
          <div className="h-full w-full bg-[#090A0F] rounded-[6px] flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-[#00F2FE]" />
          </div>
        </div>

        {/* Architect identity */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-tight text-white">
              Architect
            </span>
            <span className="text-[11px] text-[#8B949E] hidden sm:inline">
              · AI software architect
            </span>
          </div>

          {/* Thinking live micro-indicator (only when actively thinking) */}
          {isThinking && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] animate-pulse" />
              <span className="text-[#00F2FE] font-medium">Thinking...</span>
            </div>
          )}
        </div>

        {/* Project Name (Clean identity) */}
        <div className="h-4 w-[1px] bg-[#30363D] hidden sm:block" />
        <span
          className="hidden sm:inline-block text-xs font-semibold text-[#F0F6FC] truncate max-w-[200px]"
          title={project.name}
        >
          {project.name}
        </span>
      </div>


      {/* Right Controls: Build Plan Toggle + Clear Chat + Context Drawer Toggle */}
      <div className="flex items-center gap-2">
        {/* Build Plan Secondary View Toggle */}
        {onViewChange && planCount > 0 && (
          <button
            type="button"
            onClick={() => onViewChange(activeView === "plan" ? "chat" : "plan")}
            className={`h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === "plan"
                ? "bg-[#00F2FE]/15 border-[#00F2FE]/40 text-[#00F2FE] shadow-[0_0_10px_rgba(0,242,254,0.15)]"
                : "bg-[#161B22] border-[#30363D] text-[#C9D1D9] hover:border-[#8B949E] hover:text-white"
            }`}
            title={activeView === "plan" ? "Return to Conversation" : "View Build Plan"}
          >
            {activeView === "plan" ? (
              <>
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Conversation</span>
              </>
            ) : (
              <>
                <ClipboardList className="h-3.5 w-3.5 text-[#00F2FE]" />
                <span>Build Plan</span>
                <span className="h-4 px-1.5 rounded-full bg-[#21262D] text-[10px] font-mono text-[#00F2FE]">
                  {planCount}
                </span>
              </>
            )}
          </button>
        )}

        {/* Clear Chat Action Button - only shown when conversation exists */}
        {onClearChat && messagesCount > 0 && (
          <button
            type="button"
            onClick={onClearChat}
            disabled={isThinking}
            className="h-8 px-2 sm:px-2.5 rounded-lg border border-[#30363D] bg-[#0E1117] text-[#8B949E] hover:text-[#F85149] hover:border-[#F85149]/40 hover:bg-[#F85149]/10 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            title="Clear conversation messages"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[11px]">Clear chat</span>
          </button>
        )}

        {/* Toggle Context Panel Button */}
        <button
          type="button"
          onClick={onToggleContextPanel}
          className={`h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            isContextPanelOpen
              ? "bg-[#161B22] border-[#00F2FE]/40 text-[#00F2FE]"
              : "bg-[#0E1117] border-[#30363D] text-[#8B949E] hover:text-white"
          }`}
          title={isContextPanelOpen ? "Hide Project Context" : "Show Project Context"}
        >
          {isContextPanelOpen ? (
            <SidebarClose className="h-3.5 w-3.5" />
          ) : (
            <SidebarOpen className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline text-[11px]">Context</span>
        </button>
      </div>
    </header>
  );
}
