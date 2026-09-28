"use client";

import React from "react";
import { Project } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { PromptComposer } from "./PromptComposer";

export interface WorkspaceEmptyStateProps {
  project?: Project;
  prompt: string;
  onPromptChange: (val: string) => void;
  onSend: (customPrompt?: string) => void;
  isLoading: boolean;
  fileCount?: number;
}

export function WorkspaceEmptyState({
  prompt,
  onPromptChange,
  onSend,
  isLoading,
}: WorkspaceEmptyStateProps) {
  const suggestions = [
    "Build a SaaS app",
    "Build an AI assistant",
    "Build a dashboard",
    "Build a mobile app",
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full my-auto select-none space-y-6">
      {/* Centered Architect Mark & Title */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00F2FE]/20 via-[#4FACFE]/10 to-[#A855F7]/20 border border-[#00F2FE]/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.18)]">
          <Sparkles className="h-6 w-6 text-[#00F2FE]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Architect
          </h1>
          <p className="text-base sm:text-lg text-[#8B949E] font-medium">
            What do you want to build?
          </p>
        </div>
      </div>

      {/* Large Centered Prompt Composer */}
      <div className="w-full">
        <PromptComposer
          value={prompt}
          onChange={onPromptChange}
          onSend={() => onSend()}
          isLoading={isLoading}
          placeholder="Tell Architect what you want to build..."
          autoFocus
        />
      </div>

      {/* Compact Starter Prompts */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-1">
        {suggestions.map((text, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSend(text)}
            className="px-3.5 py-1.5 rounded-full bg-[#161B22] border border-[#30363D] hover:border-[#00F2FE]/50 hover:bg-[#161B22]/80 text-xs text-[#8B949E] hover:text-[#F0F6FC] transition-all cursor-pointer shadow-sm"
          >
            <span>{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

