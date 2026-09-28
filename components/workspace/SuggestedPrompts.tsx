"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export interface SuggestedPromptsProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

export function SuggestedPrompts({
  prompts,
  onSelectPrompt,
  className = "",
}: SuggestedPromptsProps) {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <span className="text-[10px] uppercase font-semibold text-[#8B949E] flex items-center gap-1 mr-1">
        <Sparkles className="h-3 w-3 text-[#00F2FE]" />
        Suggested:
      </span>
      {prompts.map((p, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelectPrompt(p)}
          className="px-2.5 py-1 rounded-full text-xs bg-[#161B22] border border-[#30363D] hover:border-[#00F2FE]/50 hover:bg-[#00F2FE]/10 text-[#C9D1D9] hover:text-[#00F2FE] transition-colors cursor-pointer text-left"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
