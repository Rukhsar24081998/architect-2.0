"use client";

import React from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { cn } from "@/lib/utils";
import { Sparkles, Terminal } from "lucide-react";

export function ModeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useWorkspace();

  return (
    <div
      role="group"
      aria-label="Workspace mode switcher"
      className={cn(
        "inline-flex items-center p-0.5 rounded-[8px] bg-[#0E1117] border border-[#30363D] shadow-inner select-none",
        className
      )}
    >
      {/* Build Mode Segment */}
      <button
        type="button"
        onClick={() => setMode("build")}
        aria-pressed={mode === "build"}
        title="Build Mode (Simplicity, AI Assistance, Visual Prototyping) - ⌘M"
        className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs font-medium transition-all duration-150 cursor-pointer select-none",
          mode === "build"
            ? "bg-[#161B22] text-[#00F2FE] border border-[#00F2FE]/30 shadow-sm font-semibold"
            : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]/50 border border-transparent"
        )}
      >
        <Sparkles
          className={cn(
            "h-3.5 w-3.5 transition-colors",
            mode === "build" ? "text-[#00F2FE]" : "text-[#8B949E]"
          )}
        />
        <span>Build</span>
      </button>

      {/* Developer Mode Segment */}
      <button
        type="button"
        onClick={() => setMode("dev")}
        aria-pressed={mode === "dev"}
        title="Developer Mode (Source Code, Terminal, Git, Testing) - ⌘M"
        className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs font-medium transition-all duration-150 cursor-pointer select-none",
          mode === "dev"
            ? "bg-[#161B22] text-[#A855F7] border border-[#A855F7]/30 shadow-sm font-semibold"
            : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]/50 border border-transparent"
        )}
      >
        <Terminal
          className={cn(
            "h-3.5 w-3.5 transition-colors",
            mode === "dev" ? "text-[#A855F7]" : "text-[#8B949E]"
          )}
        />
        <span>Developer</span>
      </button>

      {/* Subtle keyboard hint */}
      <span className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-[#6E7681]">
        ⌘M
      </span>
    </div>
  );
}
