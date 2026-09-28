"use client";

import React from "react";
import { Loader2, Sparkles } from "lucide-react";

export function PreviewLoadingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 select-none">
      <div className="relative">
        <div className="h-12 w-12 rounded-xl bg-[#00F2FE]/10 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
          <Loader2 className="h-6 w-6 animate-spin text-[#00F2FE]" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="h-3.5 w-3.5 text-[#A855F7] animate-pulse" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className="text-sm font-semibold text-white">
          Preparing preview...
        </h4>
        <p className="text-xs text-[#8B949E] font-mono">
          Mounting component tree &amp; binding client state
        </p>
      </div>

      <div className="w-48 h-1.5 bg-[#161B22] rounded-full overflow-hidden border border-[#30363D]">
        <div className="h-full bg-gradient-to-r from-[#00F2FE] to-[#A855F7] rounded-full animate-pulse w-3/4" />
      </div>
    </div>
  );
}
