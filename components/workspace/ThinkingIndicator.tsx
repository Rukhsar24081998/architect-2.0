"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 py-3 px-4 max-w-2xl animate-in fade-in duration-200">
      {/* Avatar */}
      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#A855F7] p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,242,254,0.3)]">
        <div className="h-full w-full bg-[#090A0F] rounded-[6px] flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-[#00F2FE] animate-pulse" />
        </div>
      </div>

      {/* Bubble / Indicator */}
      <div className="rounded-xl border border-[#30363D] bg-[#0E1117] px-4 py-2.5 shadow-md flex items-center gap-2.5">
        <Loader2 className="h-3.5 w-3.5 text-[#00F2FE] animate-spin shrink-0" />
        <span className="text-xs font-medium text-[#C9D1D9]">
          Architect is thinking...
        </span>
        <span className="flex gap-1 ml-1">
          <span className="h-1 w-1 rounded-full bg-[#00F2FE] animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1 w-1 rounded-full bg-[#00F2FE] animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1 w-1 rounded-full bg-[#00F2FE] animate-bounce" />
        </span>
      </div>
    </div>
  );
}
