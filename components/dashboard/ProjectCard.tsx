import React from "react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Badge } from "@/components/ui/Badge";
import { formatTimestamp } from "@/lib/utils";
import { GitBranch, ArrowRight, ExternalLink, Code2, Sparkles } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getTemplateLabel = (tmpl: string) => {
    switch (tmpl) {
      case "nextjs-saas":
        return "Next.js SaaS";
      case "ai-application":
        return "AI Application";
      case "web-app":
        return "Web App";
      case "api-service":
        return "API Microservice";
      case "mobile-web":
        return "Mobile Web App";
      case "blank":
        return "Blank Project";
      default:
        return tmpl;
    }
  };

  const isBuilding = project.status === "building" || project.status === "planning";
  const isDeployed = project.status === "deployed";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block w-full min-w-0 focus-visible:outline-none"
    >
      <div
        className={`h-full w-full min-w-0 flex flex-col justify-between p-4 sm:p-5 rounded-[8px] bg-[#0E1117] border transition-all duration-200 select-none shadow-sm relative ${
          isBuilding
            ? "border-[#00F2FE]/40 hover:border-[#00F2FE] hover:shadow-[0_0_15px_rgba(0,242,254,0.15)]"
            : isDeployed
            ? "border-[#10B981]/30 hover:border-[#10B981]/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.12)]"
            : "border-[#30363D] hover:border-[#484F58] hover:bg-[#161B22]/60"
        } hover:-translate-y-0.5`}
      >
        {/* Top Header: Status & Branch */}
        <div className="space-y-3 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-2 min-w-0">
            {/* Status Indicator */}
            <div className="flex items-center min-w-0 shrink-0">
              <StatusIndicator status={project.status} pulse={isBuilding || isDeployed} />
            </div>

            {/* Badges Container */}
            <div className="flex flex-wrap items-center justify-end gap-1.5 min-w-0">
              {/* Branch Badge */}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#161B22] border border-[#21262D] text-[11px] font-mono text-[#8B949E] min-w-0 max-w-[95px] sm:max-w-[110px] shrink"
                title={`Branch: ${project.currentBranch || "main"}`}
              >
                <GitBranch className="h-3 w-3 text-[#6E7681] shrink-0" />
                <span className="truncate">{project.currentBranch || "main"}</span>
              </span>

              {/* Active Build Badge */}
              {isBuilding && (
                <Badge variant="cyan" size="sm" className="inline-flex items-center shrink-0">
                  <Sparkles className="h-3 w-3 mr-0.5 shrink-0" />
                  <span>Active Build</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Project Title & Description */}
          <div className="space-y-1.5 min-w-0">
            <h3
              className="text-base font-bold text-white group-hover:text-[#00F2FE] transition-colors leading-snug line-clamp-2 break-words"
              title={project.name}
            >
              {project.name}
            </h3>
            <p className="text-xs text-[#8B949E] line-clamp-2 leading-relaxed break-words">
              {project.description}
            </p>
          </div>
        </div>

        {/* Bottom Metadata & Footer Action */}
        <div className="mt-5 pt-3 border-t border-[#21262D]/60 flex items-center justify-between gap-2 min-w-0">
          {/* Tech/Template tag */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] text-[#8B949E] font-mono min-w-0 overflow-hidden">
            <span className="inline-flex items-center gap-1 min-w-0 shrink">
              <Code2 className="h-3.5 w-3.5 text-[#6E7681] shrink-0" />
              <span
                className="truncate max-w-[105px]"
                title={getTemplateLabel(project.template)}
              >
                {getTemplateLabel(project.template)}
              </span>
            </span>
            <span className="shrink-0 text-[#6E7681]">•</span>
            <span className="truncate shrink" suppressHydrationWarning>
              {formatTimestamp(project.updatedAt)}
            </span>
          </div>

          {/* Open Workspace Action */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#C9D1D9] group-hover:text-white transition-colors shrink-0 ml-auto">
            {project.liveUrl && isDeployed ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.liveUrl, "_blank");
                }}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#10B981] hover:underline mr-1 shrink-0"
                title={project.liveUrl}
              >
                <ExternalLink className="h-3 w-3 shrink-0" />
                Live
              </span>
            ) : null}
            <span className="text-xs font-semibold text-[#00F2FE] flex items-center gap-1 shrink-0">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1 shrink-0" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

}
