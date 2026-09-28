"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";

export interface BuildPlanLoadingProps {
  onComplete?: () => void;
}

const STAGES = [
  { id: 1, label: "Understanding request & intent" },
  { id: 2, label: "Reviewing project context & files" },
  { id: 3, label: "Structuring implementation steps" },
];

export function BuildPlanLoading() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStage(1), 600);
    const timer2 = setTimeout(() => setCurrentStage(2), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none max-w-md mx-auto space-y-6">
      {/* Orb */}
      <div className="relative mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-[#00F2FE]/20 via-[#4FACFE]/10 to-[#A855F7]/20 border border-[#00F2FE]/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,242,254,0.25)]">
        <Sparkles className="h-8 w-8 text-[#00F2FE] animate-pulse" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white tracking-tight">
          Architect is preparing your build plan...
        </h3>
        <p className="text-xs text-[#8B949E]">
          Synthesizing architectural specifications and dependencies.
        </p>
      </div>

      {/* Staged Checklist */}
      <div className="w-full rounded-xl border border-[#30363D] bg-[#0E1117] p-4 text-left space-y-3 shadow-lg">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 text-xs transition-colors ${
                isDone
                  ? "text-white"
                  : isCurrent
                  ? "text-[#00F2FE] font-medium"
                  : "text-[#8B949E]/50"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  isDone
                    ? "bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40"
                    : isCurrent
                    ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40"
                    : "bg-[#161B22] border border-[#30363D] text-[#8B949E]"
                }`}
              >
                {isDone ? (
                  <Check className="h-3 w-3 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <span>{stage.id}</span>
                )}
              </div>
              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
