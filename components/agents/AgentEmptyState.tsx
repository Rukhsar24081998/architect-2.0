"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Bot, ArrowRight, Sparkles } from "lucide-react";

interface AgentEmptyStateProps {
  projectId: string;
}

export function AgentEmptyState({ projectId }: AgentEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] select-none">
      <div className="max-w-md space-y-4">
        {/* Visual Icon Badge */}
        <div className="h-16 w-16 mx-auto rounded-2xl bg-[#161B22] border border-[#30363D] flex items-center justify-center shadow-lg">
          <Bot className="h-8 w-8 text-[#00F2FE]" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            No agent execution yet.
          </h2>
          <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
            Approve a Build Plan to prepare work for the agent team. The multi-agent swarm requires an approved plan before beginning implementation.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <Link href={`/projects/${projectId}?mode=build`}>
            <Button
              type="button"
              variant="primary"
              size="md"
              className="text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)]"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              <span>View Build Plans</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
