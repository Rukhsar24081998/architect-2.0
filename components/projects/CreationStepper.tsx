"use client";

import React from "react";
import { Check, Sparkles, FolderGit2, Settings, ShieldCheck, Cpu } from "lucide-react";

export type CreationMode = "idea" | "github";

export interface StepDefinition {
  number: number;
  label: string;
  subtitle: string;
  icon: React.ElementType;
}

export interface CreationStepperProps {
  mode: CreationMode;
  currentStep: number; // 1 to 4
  onStepClick?: (step: number) => void;
  maxReachedStep?: number;
}

export function CreationStepper({
  mode,
  currentStep,
  onStepClick,
  maxReachedStep = 1,
}: CreationStepperProps) {
  const ideaSteps: StepDefinition[] = [
    { number: 1, label: "Idea", subtitle: "Prompt & vision", icon: Sparkles },
    { number: 2, label: "Configure", subtitle: "Stack & template", icon: Settings },
    { number: 3, label: "Review", subtitle: "Verify spec", icon: ShieldCheck },
    { number: 4, label: "Initialize", subtitle: "Build workspace", icon: Cpu },
  ];

  const githubSteps: StepDefinition[] = [
    { number: 1, label: "Repository", subtitle: "URL & branch", icon: FolderGit2 },
    { number: 2, label: "Analyze", subtitle: "Inspect stack", icon: Sparkles },
    { number: 3, label: "Review", subtitle: "Verify structure", icon: ShieldCheck },
    { number: 4, label: "Initialize", subtitle: "Build workspace", icon: Cpu },
  ];

  const steps = mode === "idea" ? ideaSteps : githubSteps;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 select-none">
      <nav aria-label="Creation Progress" className="relative">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isActive = step.number === currentStep;
            const isClickable =
              Boolean(onStepClick) &&
              step.number <= maxReachedStep &&
              step.number !== currentStep &&
              currentStep < 4; // cannot jump during initialization

            const IconComponent = step.icon;

            return (
              <li
                key={step.number}
                className="relative flex-1 flex flex-col items-center group"
              >
                {/* Connecting Line (left of node, except for first step) */}
                {index > 0 && (
                  <div
                    className={`absolute top-4 -left-1/2 w-full h-[2px] -translate-y-1/2 z-0 transition-colors duration-300 ${
                      step.number <= currentStep
                        ? mode === "idea"
                          ? "bg-gradient-to-r from-[#00F2FE] to-[#00c8d6]"
                          : "bg-gradient-to-r from-[#A855F7] to-[#8B5CF6]"
                        : "bg-[#21262D]"
                    }`}
                  />
                )}

                {/* Step Circle & Button */}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(step.number)}
                  className={`relative z-10 flex items-center justify-center h-8 w-8 rounded-full text-xs font-semibold transition-all duration-200 outline-none ${
                    isCompleted
                      ? "bg-[#0E1117] border-2 border-[#00F2FE] text-[#00F2FE] hover:shadow-[0_0_12px_rgba(0,242,254,0.4)] cursor-pointer"
                      : isActive
                      ? mode === "idea"
                        ? "bg-[#00F2FE] text-[#090A0F] ring-4 ring-[#00F2FE]/20 shadow-[0_0_16px_rgba(0,242,254,0.5)]"
                        : "bg-[#A855F7] text-white ring-4 ring-[#A855F7]/25 shadow-[0_0_16px_rgba(168,85,247,0.5)]"
                      : "bg-[#161B22] border border-[#30363D] text-[#8B949E] cursor-not-allowed"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    <IconComponent className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Step Labels */}
                <div className="mt-2 text-center">
                  <span
                    className={`block text-xs font-medium transition-colors ${
                      isActive
                        ? "text-white font-semibold"
                        : isCompleted
                        ? "text-[#C9D1D9]"
                        : "text-[#8B949E]"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="hidden sm:block text-[10px] text-[#8B949E]/80 mt-0.5">
                    {step.subtitle}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
