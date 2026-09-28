"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface IdeaStepProps {
  idea: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  isLoading?: boolean;
}

interface IdeaSuggestion {
  id: string;
  label: string;
  prompt: string;
}

const SUGGESTIONS: IdeaSuggestion[] = [
  {
    id: "saas-dashboard",
    label: "SaaS dashboard",
    prompt:
      "Build a modern SaaS subscription analytics dashboard with churn prediction, customer lifetime value charts, and automated team alerting.",
  },
  {
    id: "ai-assistant",
    label: "AI assistant",
    prompt:
      "Build an AI chatbot assistant that answers customer support queries using knowledge base documentation.",
  },
  {
    id: "internal-tool",
    label: "Internal tool",
    prompt:
      "Build an internal operations tool for warehouse inventory tracking, order fulfillment dispatch, and barcode scanning with real-time audit logs.",
  },
  {
    id: "mobile-web-app",
    label: "Mobile web app",
    prompt:
      "Design a responsive mobile web app for personal fitness tracking, daily workout logging, and macro nutrient calorie budgeting.",
  },
];

export function IdeaStep({ idea, onChange, onContinue, isLoading = false }: IdeaStepProps) {
  const [touched, setTouched] = useState(false);

  const trimmedIdea = idea.trim();
  const isValid = trimmedIdea.length >= 3;
  const showError = touched && !isValid;

  const handleSuggestionClick = (suggestionPrompt: string) => {
    onChange(suggestionPrompt);
    setTouched(true);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isValid && !isLoading) {
      onContinue();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/25 text-[#00F2FE] text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI-Native Software Builder</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          What do you want to build?
        </h2>
        <p className="text-sm text-[#8B949E] max-w-lg mx-auto">
          Describe your vision, core features, or workflow. Architect will analyze
          requirements, design the architecture, and generate the workspace.
        </p>
      </div>

      {/* Main Prompt Card */}
      <form onSubmit={handleContinue} className="space-y-4">
        <div className="relative rounded-xl border border-[#30363D] bg-[#0E1117] p-4 shadow-xl transition-all focus-within:border-[#00F2FE]/60 focus-within:ring-1 focus-within:ring-[#00F2FE]/40">
          <label htmlFor="idea-prompt" className="sr-only">
            Project Idea Description
          </label>
          <textarea
            id="idea-prompt"
            rows={5}
            value={idea}
            onChange={(e) => {
              onChange(e.target.value);
              if (!touched) setTouched(true);
            }}
            placeholder="Build an AI-powered customer support dashboard where teams can upload support tickets, search them, and generate suggested responses."
            className="w-full bg-transparent text-sm sm:text-base text-[#F0F6FC] placeholder:text-[#8B949E]/50 focus:outline-none resize-none leading-relaxed"
          />

          <div className="mt-3 pt-3 border-t border-[#21262D] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8B949E]">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Lightbulb className="h-3.5 w-3.5 text-[#00F2FE]" />
              <span>Be specific about users, core workflows, and data models.</span>
            </div>
            <span
              className={`font-mono text-[11px] ${
                trimmedIdea.length < 10
                  ? "text-[#8B949E]"
                  : "text-[#00F2FE]"
              }`}
            >
              {idea.length} chars {isValid && "✓"}
            </span>
          </div>
        </div>

        {/* Validation Error */}
        {showError && (
          <div className="flex items-center gap-2 text-xs text-[#F85149] bg-[#F85149]/10 border border-[#F85149]/20 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Please enter what you want to build to continue.</span>
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-medium text-[#8B949E] flex items-center gap-1.5">
            <span>Or explore popular starters:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionClick(suggestion.prompt)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#161B22] border border-[#30363D] text-[#C9D1D9] hover:text-[#00F2FE] hover:border-[#00F2FE]/50 hover:bg-[#00F2FE]/5 transition-all text-left cursor-pointer"
              >
                + {suggestion.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValid || isLoading}
            className="w-full sm:w-auto min-w-[160px] shadow-[0_0_20px_rgba(0,242,254,0.3)] bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#090A0F] font-bold cursor-pointer"
          >
            {isLoading ? (
              <span>Opening Architect...</span>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
