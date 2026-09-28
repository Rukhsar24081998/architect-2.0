"use client";

import React from "react";
import { Code2, Search, Sparkles } from "lucide-react";

interface DeveloperEmptyStateProps {
  type?: "no-file" | "no-results" | "empty-env";
  message?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function DeveloperEmptyState({
  type = "no-file",
  message,
  onAction,
  actionLabel,
}: DeveloperEmptyStateProps) {
  if (type === "no-results") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8B949E] select-none font-mono">
        <Search className="h-8 w-8 text-[#6E7681] mb-2" />
        <p className="text-white text-xs font-semibold">No Matching Files</p>
        <p className="text-[11px] text-[#6E7681] mt-1 max-w-xs">
          {message || "No files matched your query. Try a different search term."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8B949E] bg-[#090A0F] select-none font-mono">
      <div className="h-12 w-12 rounded-xl bg-[#161B22] border border-[#21262D] flex items-center justify-center text-[#00F2FE] mb-3 shadow-[0_0_20px_rgba(0,242,254,0.1)]">
        <Code2 className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-white">No File Selected</h3>
      <p className="text-xs text-[#6E7681] mt-1 max-w-sm">
        {message || "Choose a file from the explorer on the left or open a recently generated component."}
      </p>

      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-3 py-1.5 rounded-md bg-[#00F2FE]/15 hover:bg-[#00F2FE]/25 text-[#00F2FE] border border-[#00F2FE]/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
