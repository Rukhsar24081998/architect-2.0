"use client";

import React from "react";
import { Project } from "@/lib/types";
import { GitBranch, FileCode2, Layers, Database } from "lucide-react";

export interface ContextChipsProps {
  project: Project;
  fileCount: number;
}

export function ContextChips({ project, fileCount }: ContextChipsProps) {
  const getTemplateLabel = () => {
    switch (project.template) {
      case "nextjs-saas":
        return "Next.js 15";
      case "api-service":
        return "Node.js API";
      case "mobile-web":
        return "Mobile Web";
      case "ai-application":
        return "AI App";
      case "web-app":
        return "React SPA";
      default:
        return "Next.js 15";
    }
  };

  const getDatabaseLabel = () => {
    if (typeof project.stack === "object" && project.stack !== null) {
      return project.stack.database || "Supabase";
    }
    return "Supabase";
  };

  const templateLabel = getTemplateLabel();
  const dbLabel = getDatabaseLabel();
  const branchName = project.currentBranch || "main";
  const filesLabel = `${fileCount} ${fileCount === 1 ? "file" : "files"} tracked`;

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-0.5 select-none text-[10px] font-mono text-[#8B949E]">
      {/* 1. Framework */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#161B22]/80 border border-[#21262D] text-[#8B949E] hover:text-[#C9D1D9] transition-colors">
        <Layers className="h-2.5 w-2.5 text-[#00F2FE]/70" />
        <span>{templateLabel}</span>
      </span>

      {/* 2. Branch */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#161B22]/80 border border-[#21262D] text-[#8B949E] hover:text-[#C9D1D9] transition-colors">
        <GitBranch className="h-2.5 w-2.5 text-[#A855F7]/70" />
        <span>{branchName}</span>
      </span>

      {/* 3. Tracked Files */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#161B22]/80 border border-[#21262D] text-[#8B949E] hover:text-[#C9D1D9] transition-colors">
        <FileCode2 className="h-2.5 w-2.5 text-[#38BDF8]/70" />
        <span>{filesLabel}</span>
      </span>

      {/* 4. Database */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#161B22]/80 border border-[#21262D] text-[#8B949E] hover:text-[#C9D1D9] transition-colors">
        <Database className="h-2.5 w-2.5 text-[#3FB950]/70" />
        <span>{dbLabel}</span>
      </span>
    </div>
  );
}
