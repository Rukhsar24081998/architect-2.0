"use client";

import React, { useState, useRef, useEffect } from "react";
import { AgentActivityItem, AgentRole } from "@/lib/agents/types";
import { formatTimestamp } from "@/lib/agents/simulation";
import { cn } from "@/lib/utils";
import {
  Activity,
  FileCode2,
  ArrowDown,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  PauseCircle,
  Info,
} from "lucide-react";

interface LiveActivityFeedProps {
  activities: AgentActivityItem[];
}

const ROLE_BADGE_STYLE: Record<AgentRole, { bg: string; text: string; border: string }> = {
  architect: {
    bg: "bg-[#00F2FE]/10",
    text: "text-[#00F2FE]",
    border: "border-[#00F2FE]/25",
  },
  frontend: {
    bg: "bg-[#A855F7]/10",
    text: "text-[#A855F7]",
    border: "border-[#A855F7]/25",
  },
  backend: {
    bg: "bg-[#38BDF8]/10",
    text: "text-[#38BDF8]",
    border: "border-[#38BDF8]/25",
  },
  qa: {
    bg: "bg-[#3FB950]/10",
    text: "text-[#3FB950]",
    border: "border-[#3FB950]/25",
  },
  devops: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    border: "border-[#F59E0B]/25",
  },
};

export function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isAutoScrollLocked, setIsAutoScrollLocked] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomMarkerRef = useRef<HTMLDivElement>(null);

  const filteredActivities = activities.filter((act) => {
    if (selectedRole === "all") return true;
    return act.agentRole === selectedRole;
  });

  // Handle scroll detection to toggle auto-scroll lock
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // Check if scrolled near the top/bottom (we render items in normal or reverse order)
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setIsAutoScrollLocked(isAtBottom);
  };

  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      setIsAutoScrollLocked(true);
    }
  };

  // When new activity arrives and auto-scroll is locked, scroll down
  useEffect(() => {
    if (isAutoScrollLocked && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [activities.length, isAutoScrollLocked]);

  const roles = [
    { id: "all", label: "All" },
    { id: "architect", label: "Architect" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "qa", label: "QA" },
  ];

  return (
    <div className="rounded-xl border border-[#30363D] bg-[#0E1117] flex flex-col h-[420px] sm:h-[480px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-[#30363D] flex flex-wrap items-center justify-between gap-2.5 bg-[#161B22]/60">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE]" />
          </div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
            Live Activity
          </span>
          <span className="text-[11px] font-mono text-[#8B949E]">
            ({filteredActivities.length})
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRole(r.id)}
              className={cn(
                "px-2 py-0.5 rounded text-[11px] font-mono transition-colors",
                selectedRole === r.id
                  ? "bg-[#30363D] text-white font-medium"
                  : "text-[#8B949E] hover:text-white hover:bg-[#161B22]"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Timeline */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 relative"
      >
        {filteredActivities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8B949E] space-y-2">
            <Activity className="h-6 w-6 text-[#30363D]" />
            <p className="text-xs">No activity recorded for this filter yet.</p>
          </div>
        ) : (
          [...filteredActivities].reverse().map((act) => {
            const roleStyle =
              ROLE_BADGE_STYLE[act.agentRole] || ROLE_BADGE_STYLE.architect;

            return (
              <div
                key={act.id}
                className="flex items-start gap-2.5 sm:gap-3 text-xs p-2 rounded-lg hover:bg-[#161B22]/50 transition-colors group"
              >
                {/* Timestamp */}
                <span className="font-mono text-[11px] text-[#6E7681] shrink-0 pt-0.5">
                  {formatTimestamp(act.timestamp)}
                </span>

                {/* Agent Role Badge */}
                <span
                  className={cn(
                    "font-mono text-[10px] font-medium px-2 py-0.5 rounded border shrink-0",
                    roleStyle.bg,
                    roleStyle.text,
                    roleStyle.border
                  )}
                >
                  {act.agentName}
                </span>

                {/* Action & File Reference */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-[#C9D1D9] leading-relaxed break-words">
                    {act.action}
                  </p>
                  {act.fileReference && (
                    <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#00F2FE] bg-[#00F2FE]/5 border border-[#00F2FE]/20 px-2 py-0.5 rounded">
                      <FileCode2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{act.fileReference}</span>
                    </div>
                  )}
                </div>

                {/* Event Type Icon */}
                <div className="shrink-0 text-[#6E7681] pt-0.5">
                  {act.type === "complete" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#3FB950]" />
                  )}
                  {act.type === "start" && (
                    <PlayCircle className="h-3.5 w-3.5 text-[#00F2FE]" />
                  )}
                  {act.type === "blocked" && (
                    <AlertCircle className="h-3.5 w-3.5 text-[#EF4444]" />
                  )}
                  {act.type === "pause" && (
                    <PauseCircle className="h-3.5 w-3.5 text-[#F59E0B]" />
                  )}
                  {act.type === "info" && (
                    <Info className="h-3.5 w-3.5 text-[#8B949E]" />
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomMarkerRef} />
      </div>

      {/* Jump to latest button if user scrolled up */}
      {!isAutoScrollLocked && (
        <div className="p-2 border-t border-[#30363D] bg-[#161B22]/90 flex justify-center">
          <button
            type="button"
            onClick={scrollToBottom}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F2FE]/15 border border-[#00F2FE]/40 text-[#00F2FE] hover:bg-[#00F2FE]/25 text-xs font-mono transition-colors shadow-sm"
          >
            <ArrowDown className="h-3 w-3" />
            <span>Jump to latest activity</span>
          </button>
        </div>
      )}
    </div>
  );
}
