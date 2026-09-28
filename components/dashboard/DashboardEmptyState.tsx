import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FolderGit2, SearchX, Plus, RefreshCw } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface DashboardEmptyStateProps {
  type: "no-projects" | "no-matches";
  onClearFilters?: () => void;
}

export function DashboardEmptyState({
  type,
  onClearFilters,
}: DashboardEmptyStateProps) {
  if (type === "no-matches") {
    return (
      <div className="py-16 px-4 text-center rounded-[8px] bg-[#0E1117] border border-[#30363D] border-dashed space-y-4">
        <div className="h-10 w-10 mx-auto rounded-full bg-[#161B22] border border-[#21262D] flex items-center justify-center text-[#8B949E]">
          <SearchX className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">
            No projects match your search
          </h3>
          <p className="text-xs text-[#8B949E] max-w-sm mx-auto">
            Try adjusting your search keywords or clear your active status filter.
          </p>
        </div>
        {onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            className="text-xs"
          >
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="py-20 px-6 text-center rounded-[8px] bg-[#0E1117] border border-[#30363D] border-dashed space-y-5">
      <div className="h-12 w-12 mx-auto rounded-[8px] bg-[#161B22] border border-[#21262D] flex items-center justify-center text-[#00F2FE]">
        <FolderGit2 className="h-6 w-6" />
      </div>
      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-base font-bold text-white tracking-tight">
          Your workspace is ready.
        </h3>
        <p className="text-xs text-[#8B949E] leading-relaxed">
          Start with an idea, import an existing repository, or explore a template project.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/projects/new">
          <Button
            variant="cyan"
            size="md"
            leftIcon={<Plus className="h-4 w-4" />}
            className="text-xs font-semibold"
          >
            New Project
          </Button>
        </Link>
        <Link href="/projects/new?tab=import">
          <Button
            variant="outline"
            size="md"
            leftIcon={<GithubIcon className="h-4 w-4 text-[#8B949E]" />}
            className="text-xs"
          >
            Import from GitHub
          </Button>
        </Link>
      </div>
    </div>
  );
}
