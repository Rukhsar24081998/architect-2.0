"use client";

import React from "react";
import Link from "next/link";
import { ProjectDetails } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Bot, Hammer, Layers } from "lucide-react";

interface PreviewEmptyStateProps {
  project: ProjectDetails;
}

export function PreviewEmptyState({ project }: PreviewEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto space-y-5 select-none">
      {/* Icon with Glowing Aura */}
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#00F2FE]/20 via-[#4FACFE]/20 to-[#A855F7]/20 border border-[#00F2FE]/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.2)]">
          <Layers className="h-8 w-8 text-[#00F2FE]" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#161B22] border border-[#30363D] flex items-center justify-center">
          <Bot className="h-3.5 w-3.5 text-[#A855F7]" />
        </div>
      </div>

      {/* Copy */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white tracking-tight">
          No preview available yet.
        </h3>
        <p className="text-xs text-[#8B949E] leading-relaxed">
          Your preview will appear here after the build completes. Architect’s specialized swarm agents need to execute the approved Build Plan before your live interactive preview can be rendered.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link href={`/projects/${project.id}/agents`}>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="text-xs font-semibold bg-[#00F2FE] hover:bg-[#00D8E6] text-black shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            <Bot className="h-4 w-4 mr-1.5" />
            <span>View Agents</span>
          </Button>
        </Link>

        <Link href={`/projects/${project.id}?mode=build`}>
          <Button
            type="button"
            variant="outline"
            size="md"
            className="text-xs border-[#30363D] text-[#C9D1D9] hover:text-white"
          >
            <Hammer className="h-4 w-4 mr-1.5 text-[#00F2FE]" />
            <span>Open Build Workspace</span>
          </Button>
        </Link>
      </div>

      {/* Helpful Hint */}
      <div className="text-[11px] font-mono text-[#6E7681] bg-[#161B22]/60 p-2.5 rounded-lg border border-[#21262D]">
        Tip: Approve a Build Plan and click &quot;Start Agent Execution&quot; in the Command Center to synthesize the application.
      </div>
    </div>
  );
}
