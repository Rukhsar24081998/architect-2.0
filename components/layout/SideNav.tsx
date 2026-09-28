"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/lib/workspace-context";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Hammer,
  Play,
  Bot,
  Code2,
  GitPullRequest,
  Database,
  Plug,
  KeyRound,
  Rocket,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  section?: "core" | "technical" | "operations";
}

export function SideNav() {
  const pathname = usePathname();
  const { currentProject, isSidebarCollapsed, toggleSidebar } = useWorkspace();

  if (!currentProject) {
    // Global navigation when not in project
    return (
      <aside
        className={cn(
          "h-full border-r border-[#30363D] bg-[#0E1117] flex flex-col justify-between transition-all duration-200 select-none",
          isSidebarCollapsed ? "w-14" : "w-56"
        )}
      >
        <div className="p-3">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors",
              pathname.startsWith("/dashboard")
                ? "bg-[#161B22] text-[#F0F6FC] border border-[#30363D]"
                : "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]/50"
            )}
          >
            <FolderGit2 className="h-4 w-4 shrink-0 text-[#00F2FE]" />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </Link>
        </div>
      </aside>
    );
  }

  const projectId = currentProject.id;

  const navItems: NavItem[] = [
    { label: "Overview", href: `/projects/${projectId}`, icon: LayoutDashboard, section: "core" },
    { label: "Build", href: `/projects/${projectId}?mode=build`, icon: Hammer, section: "core" },
    { label: "Agents", href: `/projects/${projectId}/agents`, icon: Bot, section: "core" },
    { label: "Preview", href: `/projects/${projectId}/preview`, icon: Play, section: "core" },
    { label: "Developer", href: `/projects/${projectId}/code`, icon: Code2, section: "core" },

    { label: "GitHub", href: `/projects/${projectId}/github`, icon: GitPullRequest, section: "technical" },
    { label: "Database", href: `/projects/${projectId}/database`, icon: Database, section: "technical" },
    { label: "Integrations", href: `/projects/${projectId}/integrations`, icon: Plug, section: "technical" },

    { label: "Environment", href: `/projects/${projectId}/environment`, icon: KeyRound, section: "operations" },
    { label: "Deployments", href: `/projects/${projectId}/deployments`, icon: Rocket, section: "operations" },
    { label: "Activity", href: `/projects/${projectId}/activity`, icon: Activity, section: "operations" },
    { label: "Settings", href: `/projects/${projectId}/settings`, icon: Settings, section: "operations" },
  ];

  const isActive = (itemHref: string) => {
    // Strict match for root workspace, prefix for sub-routes
    const cleanItemHref = itemHref.split("?")[0];
    if (cleanItemHref === `/projects/${projectId}`) {
      return pathname === `/projects/${projectId}`;
    }
    return pathname.startsWith(cleanItemHref);
  };

  return (
    <aside
      className={cn(
        "h-full border-r border-[#30363D] bg-[#0E1117] flex flex-col justify-between transition-all duration-200 select-none z-30 shrink-0",
        isSidebarCollapsed ? "w-14" : "w-56"
      )}
    >
      {/* Scrollable Navigation Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {/* Core Items */}
        <div className="space-y-0.5">
          {!isSidebarCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-[#6E7681]">
              Workspace
            </div>
          )}
          {navItems
            .filter((item) => item.section === "core")
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              const linkContent = (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-colors group",
                    active
                      ? "bg-[#161B22] text-[#F0F6FC] border border-[#30363D] shadow-sm font-semibold"
                      : "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]/50 border border-transparent"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-[#00F2FE]" : "text-[#8B949E] group-hover:text-[#F0F6FC]"
                    )}
                  />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );

              return isSidebarCollapsed ? (
                <Tooltip key={item.label} content={item.label} side="right">
                  {linkContent}
                </Tooltip>
              ) : (
                linkContent
              );
            })}
        </div>

        {/* Technical Items */}
        <div className="space-y-0.5 pt-2 border-t border-[#21262D]/60">
          {!isSidebarCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-[#6E7681]">
              Developer
            </div>
          )}
          {navItems
            .filter((item) => item.section === "technical")
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              const linkContent = (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-colors group",
                    active
                      ? "bg-[#161B22] text-[#F0F6FC] border border-[#30363D] shadow-sm font-semibold"
                      : "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]/50 border border-transparent"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-[#A855F7]" : "text-[#8B949E] group-hover:text-[#F0F6FC]"
                    )}
                  />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );

              return isSidebarCollapsed ? (
                <Tooltip key={item.label} content={item.label} side="right">
                  {linkContent}
                </Tooltip>
              ) : (
                linkContent
              );
            })}
        </div>

        {/* Operations Items */}
        <div className="space-y-0.5 pt-2 border-t border-[#21262D]/60">
          {!isSidebarCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-[#6E7681]">
              Ship & Observe
            </div>
          )}
          {navItems
            .filter((item) => item.section === "operations")
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              const linkContent = (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-colors group",
                    active
                      ? "bg-[#161B22] text-[#F0F6FC] border border-[#30363D] shadow-sm font-semibold"
                      : "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]/50 border border-transparent"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-[#10B981]" : "text-[#8B949E] group-hover:text-[#F0F6FC]"
                    )}
                  />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );

              return isSidebarCollapsed ? (
                <Tooltip key={item.label} content={item.label} side="right">
                  {linkContent}
                </Tooltip>
              ) : (
                linkContent
              );
            })}
        </div>
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-[#30363D]/60 flex items-center justify-end">
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-full flex items-center justify-center p-1.5 rounded-[6px] text-[#8B949E] hover:text-white hover:bg-[#161B22] transition-colors cursor-pointer"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="w-full flex items-center justify-between px-1 text-xs">
              <span className="text-[11px] text-[#6E7681]">Collapse menu</span>
              <ChevronLeft className="h-4 w-4" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
