"use client";

import React, { useState } from "react";
import { ProjectTemplate } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  Globe,
  Bot,
  Server,
  Smartphone,
  FolderMinus,
  Check,
  AlertCircle,
  Code2,
} from "lucide-react";

export interface StackConfig {
  frontend: string;
  backend: string;
  database: string;
}

export interface ConfigureStepProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  template: ProjectTemplate;
  onTemplateChange: (template: ProjectTemplate) => void;
  stack: StackConfig;
  onStackChange: (stack: StackConfig) => void;
  onBack: () => void;
  onContinue: () => void;
}

interface TemplateOption {
  id: ProjectTemplate;
  title: string;
  description: string;
  icon: React.ElementType;
  recommended?: boolean;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: "nextjs-saas",
    title: "Next.js SaaS",
    description: "App Router, Tailwind CSS, API routes & auth architecture",
    icon: Layers,
    recommended: true,
  },
  {
    id: "ai-application",
    title: "AI Application",
    description: "LLM orchestration, agent sessions & streaming copilot UI",
    icon: Bot,
  },
  {
    id: "web-app",
    title: "Web App",
    description: "Modern single-page client app with component design system",
    icon: Globe,
  },
  {
    id: "api-service",
    title: "API Service",
    description: "Headless backend endpoints, data schemas & webhooks",
    icon: Server,
  },
  {
    id: "mobile-web",
    title: "Mobile Web App",
    description: "Responsive touch-first layout with native-like mobile UX",
    icon: Smartphone,
  },
  {
    id: "blank",
    title: "Blank Project",
    description: "Minimal boilerplate for custom specialized architecture",
    icon: FolderMinus,
  },
];

const FRONTEND_OPTIONS = [
  { id: "Next.js", label: "Next.js 15 (App Router)", tag: "Recommended" },
  { id: "React", label: "React (Vite SPA)" },
];

const BACKEND_OPTIONS = [
  { id: "Node.js", label: "Node.js (API Routes / Express)", tag: "Standard" },
  { id: "Python", label: "Python (FastAPI)" },
];

const DATABASE_OPTIONS = [
  { id: "Supabase", label: "Supabase (PostgreSQL + Auth)", tag: "Managed" },
  { id: "PostgreSQL", label: "Standard PostgreSQL" },
  { id: "None", label: "None (Client / Headless)" },
];

export function ConfigureStep({
  projectName,
  onProjectNameChange,
  template,
  onTemplateChange,
  stack,
  onStackChange,
  onBack,
  onContinue,
}: ConfigureStepProps) {
  const [touched, setTouched] = useState(false);

  const trimmedName = projectName.trim();
  const isValid = trimmedName.length >= 2;
  const showError = touched && !isValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isValid) {
      onContinue();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Configure Your Workspace
        </h2>
        <p className="text-sm text-[#8B949E]">
          Name your project, select an initial template, and fine-tune your stack.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name Card */}
        <div className="rounded-xl border border-[#30363D] bg-[#0E1117] p-5 space-y-3 shadow-md">
          <label
            htmlFor="project-name"
            className="block text-xs font-semibold uppercase tracking-wider text-[#8B949E]"
          >
            Project Name <span className="text-[#00F2FE]">*</span>
          </label>
          <div className="relative">
            <input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(e) => {
                onProjectNameChange(e.target.value);
                if (!touched) setTouched(true);
              }}
              placeholder="e.g. SupportFlow AI"
              className="w-full rounded-lg border border-[#30363D] bg-[#161B22] px-3.5 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/50 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]/40 focus:outline-none transition-colors"
            />
            {isValid && (
              <span className="absolute right-3 top-2.5 text-xs text-[#00F2FE] flex items-center gap-1 font-mono">
                <Check className="h-4 w-4" />
              </span>
            )}
          </div>
          {showError && (
            <div className="flex items-center gap-1.5 text-xs text-[#F85149]">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Project name is required (minimum 2 characters).</span>
            </div>
          )}
        </div>

        {/* Template Selector Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
              Select Template / Architecture
            </span>
            <span className="text-xs text-[#8B949E]/80">6 options available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TEMPLATE_OPTIONS.map((opt) => {
              const isSelected = template === opt.id;
              const IconComp = opt.icon;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onTemplateChange(opt.id)}
                  className={`relative p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 outline-none ${
                    isSelected
                      ? "border-[#00F2FE] bg-[#00F2FE]/5 shadow-[0_0_15px_rgba(0,242,254,0.15)] ring-1 ring-[#00F2FE]/30"
                      : "border-[#30363D] bg-[#0E1117] hover:border-[#8B949E]/40 hover:bg-[#161B22]/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? "bg-[#00F2FE]/20 text-[#00F2FE]"
                            : "bg-[#21262D] text-[#8B949E]"
                        }`}
                      >
                        <IconComp className="h-4 w-4" />
                      </div>
                      {opt.recommended && (
                        <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-sm text-white mb-1">
                      {opt.title}
                    </div>
                    <div className="text-[11px] text-[#8B949E] leading-relaxed">
                      {opt.description}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#21262D] text-[10px]">
                    <span className={isSelected ? "text-[#00F2FE] font-medium" : "text-[#8B949E]"}>
                      {isSelected ? "Active template" : "Select"}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-[#00F2FE]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Stack Configuration */}
        <div className="rounded-xl border border-[#30363D] bg-[#0E1117] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#21262D]">
            <Code2 className="h-4 w-4 text-[#00F2FE]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Target Technology Stack (Prototype Spec)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Frontend */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#8B949E]">
                Frontend Layer
              </label>
              <div className="space-y-1.5">
                {FRONTEND_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onStackChange({ ...stack, frontend: item.id })}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      stack.frontend === item.id
                        ? "border-[#00F2FE] bg-[#00F2FE]/10 text-white font-medium"
                        : "border-[#30363D] bg-[#161B22] text-[#8B949E] hover:text-[#C9D1D9]"
                    }`}
                  >
                    <span>{item.id}</span>
                    {stack.frontend === item.id && (
                      <Check className="h-3 w-3 text-[#00F2FE]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#8B949E]">
                Backend Layer
              </label>
              <div className="space-y-1.5">
                {BACKEND_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onStackChange({ ...stack, backend: item.id })}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      stack.backend === item.id
                        ? "border-[#00F2FE] bg-[#00F2FE]/10 text-white font-medium"
                        : "border-[#30363D] bg-[#161B22] text-[#8B949E] hover:text-[#C9D1D9]"
                    }`}
                  >
                    <span>{item.id}</span>
                    {stack.backend === item.id && (
                      <Check className="h-3 w-3 text-[#00F2FE]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Database */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#8B949E]">
                Database Layer
              </label>
              <div className="space-y-1.5">
                {DATABASE_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onStackChange({ ...stack, database: item.id })}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      stack.database === item.id
                        ? "border-[#00F2FE] bg-[#00F2FE]/10 text-white font-medium"
                        : "border-[#30363D] bg-[#161B22] text-[#8B949E] hover:text-[#C9D1D9]"
                    }`}
                  >
                    <span>{item.id}</span>
                    {stack.database === item.id && (
                      <Check className="h-3 w-3 text-[#00F2FE]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Idea</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValid}
            className="min-w-[180px] shadow-[0_0_15px_rgba(0,242,254,0.25)]"
          >
            <span>Review Project</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
