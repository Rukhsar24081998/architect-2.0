"use client";

import React from "react";
import { ProjectTemplate } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Rocket,
  Sparkles,
  Layers,
  Code2,
  GitBranch,
  FolderGit2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export interface ReviewStepProps {
  projectName: string;
  description: string;
  template: ProjectTemplate;
  stack: {
    frontend?: string;
    backend?: string;
    database?: string;
  };
  origin: "idea" | "github";
  repositoryUrl?: string;
  branch?: string;
  isCreating: boolean;
  createError: string | null;
  onBack: () => void;
  onCreate: () => void;
}

const TEMPLATE_NAMES: Record<ProjectTemplate, string> = {
  "nextjs-saas": "Next.js SaaS",
  "react-dashboard": "React Dashboard",
  "ai-application": "AI Application",
  "web-app": "Web App",
  "api-service": "API Service",
  "mobile-web": "Mobile Web App",
  blank: "Blank Project",
};

export function ReviewStep({
  projectName,
  description,
  template,
  stack,
  origin,
  repositoryUrl,
  branch = "main",
  isCreating,
  createError,
  onBack,
  onCreate,
}: ReviewStepProps) {
  const templateName = TEMPLATE_NAMES[template] || template;

  const stackString = [stack.frontend, stack.backend, stack.database]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/25 text-[#00F2FE] text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Final Verification</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Ready to Build
        </h2>
        <p className="text-sm text-[#8B949E]">
          Confirm your project parameters before Architect initializes the workspace.
        </p>
      </div>

      {/* Blueprint Card */}
      <div className="rounded-xl border border-[#30363D] bg-[#0E1117] overflow-hidden shadow-2xl">
        {/* Card Header Banner */}
        <div className="px-6 py-4 bg-[#161B22]/70 border-b border-[#30363D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#00F2FE] animate-pulse" />
            <span className="text-xs font-mono font-medium text-[#00F2FE] uppercase tracking-wider">
              Project Specification
            </span>
          </div>
          <Badge
            variant={origin === "idea" ? "cyan" : "violet"}
            size="sm"
            className="flex items-center gap-1 font-mono"
          >
            {origin === "idea" ? (
              <>
                <Sparkles className="h-3 w-3" />
                <span>Created from idea</span>
              </>
            ) : (
              <>
                <FolderGit2 className="h-3 w-3" />
                <span>Imported from GitHub</span>
              </>
            )}
          </Badge>
        </div>

        {/* Card Body Details */}
        <div className="p-6 space-y-6">
          {/* Project Title & Description */}
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {projectName}
            </h3>
            <p className="text-sm text-[#8B949E] leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#21262D]">
            {/* Template */}
            <div className="rounded-lg bg-[#161B22] p-3.5 border border-[#30363D]/60 space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#8B949E] flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#00F2FE]" />
                Template
              </span>
              <div className="text-sm font-semibold text-white">{templateName}</div>
            </div>

            {/* Target Stack */}
            <div className="rounded-lg bg-[#161B22] p-3.5 border border-[#30363D]/60 space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#8B949E] flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-[#00F2FE]" />
                Target Stack
              </span>
              <div className="text-sm font-semibold text-white truncate">
                {stackString || "Modern Web Stack"}
              </div>
            </div>
          </div>

          {/* Repository / Branch Details */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#21262D] text-xs text-[#8B949E]">
            <div className="flex items-center gap-2">
              <GitBranch className="h-3.5 w-3.5 text-[#8B949E]" />
              <span>Default Branch:</span>
              <span className="font-mono text-[#F0F6FC]">{branch}</span>
            </div>

            {repositoryUrl && (
              <div className="flex items-center gap-2 truncate max-w-[280px]">
                <FolderGit2 className="h-3.5 w-3.5 text-[#8B949E]" />
                <span className="truncate font-mono text-[11px] text-[#A855F7]">
                  {repositoryUrl}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error State Banner */}
      {createError && (
        <div className="rounded-xl border border-[#F85149]/40 bg-[#F85149]/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#F85149]">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Couldn&apos;t create the project.</p>
              <p className="text-xs text-[#F85149]/80">{createError}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCreate}
            disabled={isCreating}
            className="border-[#F85149]/50 text-[#F85149] hover:bg-[#F85149]/20 self-end sm:self-auto"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            <span>Try again</span>
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isCreating}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onCreate}
          disabled={isCreating}
          className="min-w-[180px] shadow-[0_0_20px_rgba(0,242,254,0.35)]"
        >
          {isCreating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 mr-2" />
              <span>Create Project</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
