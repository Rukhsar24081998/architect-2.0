"use client";

import React, { useEffect, useState } from "react";
import { Check, Sparkles, FolderGit2, Loader2 } from "lucide-react";

export interface InitializingStepProps {
  projectName: string;
  origin: "idea" | "github";
  onComplete: () => void;
}

interface InitItem {
  id: number;
  label: string;
}

const IDEA_STAGES: InitItem[] = [
  { id: 1, label: "Creating project workspace" },
  { id: 2, label: "Preparing project structure" },
  { id: 3, label: "Initializing environment" },
  { id: 4, label: "Preparing Architect agents" },
  { id: 5, label: "Workspace ready" },
];

const GITHUB_STAGES: InitItem[] = [
  { id: 1, label: "Connecting repository" },
  { id: 2, label: "Analyzing project structure" },
  { id: 3, label: "Detecting framework & dependencies" },
  { id: 4, label: "Preparing workspace" },
  { id: 5, label: "Workspace ready" },
];

export function InitializingStep({
  projectName,
  origin,
  onComplete,
}: InitializingStepProps) {
  const stages = origin === "idea" ? IDEA_STAGES : GITHUB_STAGES;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    // Progress through each stage every 450ms
    if (currentStageIndex < stages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStageIndex((prev) => prev + 1);
      }, 450);
      return () => clearTimeout(timer);
    } else {
      // Completed all stages, brief pause then navigate
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(completeTimer);
    }
  }, [currentStageIndex, stages.length, onComplete]);

  const progressPercent = Math.round(
    ((currentStageIndex + 1) / stages.length) * 100
  );

  return (
    <div className="w-full max-w-xl mx-auto py-8 text-center space-y-8 select-none">
      {/* Animated Center Orb */}
      <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
        {/* Pulsing Outer Glow */}
        <div
          className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
            origin === "idea" ? "bg-[#00F2FE]" : "bg-[#A855F7]"
          }`}
        />
        {/* Center Container */}
        <div
          className={`relative h-16 w-16 rounded-2xl flex items-center justify-center border shadow-2xl transition-all duration-300 ${
            origin === "idea"
              ? "bg-[#00F2FE]/10 border-[#00F2FE]/40 text-[#00F2FE] shadow-[0_0_30px_rgba(0,242,254,0.3)]"
              : "bg-[#A855F7]/10 border-[#A855F7]/40 text-[#A855F7] shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          }`}
        >
          {progressPercent === 100 ? (
            <Check className="h-8 w-8 stroke-[2.5] animate-scale" />
          ) : origin === "idea" ? (
            <Sparkles className="h-7 w-7 animate-pulse" />
          ) : (
            <FolderGit2 className="h-7 w-7 animate-pulse" />
          )}
        </div>
      </div>

      {/* Headings */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Initializing Workspace
        </h2>
        <p className="text-sm font-medium text-[#8B949E]">
          Setting up <span className="text-white font-semibold">{projectName}</span>
        </p>
      </div>

      {/* Checklist Card */}
      <div className="rounded-xl border border-[#30363D] bg-[#0E1117] p-5 text-left max-w-md mx-auto shadow-xl space-y-3">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStageIndex || currentStageIndex === stages.length - 1;
          const isCurrent = idx === currentStageIndex && currentStageIndex < stages.length - 1;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 text-xs transition-all duration-200 ${
                isDone
                  ? "text-white"
                  : isCurrent
                  ? origin === "idea"
                    ? "text-[#00F2FE] font-medium"
                    : "text-[#A855F7] font-medium"
                  : "text-[#8B949E]/50"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                  isDone
                    ? "bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40"
                    : isCurrent
                    ? origin === "idea"
                      ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40"
                      : "bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40"
                    : "bg-[#161B22] border border-[#30363D] text-[#8B949E]"
                }`}
              >
                {isDone ? (
                  <Check className="h-3 w-3 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className="truncate">{stage.label}</span>
            </div>
          );
        })}

        {/* Linear Progress Bar */}
        <div className="pt-3 border-t border-[#21262D]">
          <div className="flex items-center justify-between text-[11px] text-[#8B949E] font-mono mb-1.5">
            <span>Progress</span>
            <span
              className={
                origin === "idea" ? "text-[#00F2FE]" : "text-[#A855F7]"
              }
            >
              {progressPercent}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#161B22] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ease-out rounded-full ${
                origin === "idea"
                  ? "bg-gradient-to-r from-[#00F2FE] to-[#38BDF8]"
                  : "bg-gradient-to-r from-[#A855F7] to-[#C084FC]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
