import React from "react";
import Link from "next/link";
import { Plus, ArrowRight, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export function QuickActions({ recentProjectId }: { recentProjectId?: string }) {
  return (
    <div className="p-4 rounded-[8px] bg-[#0E1117] border border-[#30363D] space-y-3 shadow-sm select-none">
      <div className="flex items-center justify-between border-b border-[#21262D]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#00F2FE]" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Quick Actions
          </h3>
        </div>
      </div>

      <div className="space-y-1.5">
        <Link
          href="/projects/new"
          className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#161B22]/50 hover:bg-[#161B22] border border-transparent hover:border-[#30363D] text-xs font-medium text-[#F0F6FC] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-3.5 w-3.5 text-[#00F2FE]" />
            <span>Create from Idea Prompt</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-[#8B949E] transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/projects/new?tab=import"
          className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#161B22]/50 hover:bg-[#161B22] border border-transparent hover:border-[#30363D] text-xs font-medium text-[#F0F6FC] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <GithubIcon className="h-3.5 w-3.5 text-[#8B949E]" />
            <span>Import GitHub Repository</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-[#8B949E] transition-transform group-hover:translate-x-1" />
        </Link>

        {recentProjectId && (
          <Link
            href={`/projects/${recentProjectId}`}
            className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#161B22]/50 hover:bg-[#161B22] border border-transparent hover:border-[#30363D] text-xs font-medium text-[#C9D1D9] transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              <span>Resume Active Workspace</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[#8B949E] transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
