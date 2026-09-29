"use client";

import React, { useState, useMemo } from "react";
import { ActivityEvent, ProjectDetails } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import {
  Activity,
  Bot,
  User,
  CheckCircle2,
  Rocket,
  FileCode,
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

interface ActivityStudioProps {
  project: ProjectDetails;
}

type FilterCategory = "all" | "plans" | "agents" | "commits" | "deployments";

export function ActivityStudio({ project }: ActivityStudioProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const rawActivities: ActivityEvent[] = useMemo(() => {
    return project.activity || [];
  }, [project.activity]);

  // Filtered activities based on category and search query
  const filteredActivities = useMemo(() => {
    return rawActivities.filter((act) => {
      // Category filter
      if (activeFilter === "plans") {
        const matchesType = act.type === "plan_approved" || act.type === "plan_proposed";
        const matchesSummary = act.summary.toLowerCase().includes("plan");
        if (!matchesType && !matchesSummary) return false;
      } else if (activeFilter === "agents") {
        const matchesRole = act.actorRole === "agent";
        const matchesType = act.type.startsWith("agent");
        const matchesSummary = act.summary.toLowerCase().includes("agent") || act.summary.toLowerCase().includes("swarm");
        if (!matchesRole && !matchesType && !matchesSummary) return false;
      } else if (activeFilter === "commits") {
        const matchesType = act.type === "file_modified" || act.type === "file_created";
        const matchesSummary = act.summary.toLowerCase().includes("file") || act.summary.toLowerCase().includes("commit");
        if (!matchesType && !matchesSummary) return false;
      } else if (activeFilter === "deployments") {
        const matchesType = act.type === "deployed" || act.type === "rolled_back";
        const matchesSummary = act.summary.toLowerCase().includes("deploy");
        if (!matchesType && !matchesSummary) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inSummary = act.summary.toLowerCase().includes(q);
        const inActor = act.actor.toLowerCase().includes(q);
        const inType = act.type.toLowerCase().includes(q);
        return inSummary || inActor || inType;
      }

      return true;
    });
  }, [rawActivities, activeFilter, searchQuery]);

  // Counts for each category filter
  const counts = useMemo(() => {
    return {
      all: rawActivities.length,
      plans: rawActivities.filter(
        (a) => a.type === "plan_approved" || a.type === "plan_proposed" || a.summary.toLowerCase().includes("plan")
      ).length,
      agents: rawActivities.filter(
        (a) => a.actorRole === "agent" || a.type.startsWith("agent") || a.summary.toLowerCase().includes("agent") || a.summary.toLowerCase().includes("swarm")
      ).length,
      commits: rawActivities.filter(
        (a) => a.type === "file_modified" || a.type === "file_created" || a.summary.toLowerCase().includes("file") || a.summary.toLowerCase().includes("commit")
      ).length,
      deployments: rawActivities.filter(
        (a) => a.type === "deployed" || a.type === "rolled_back" || a.summary.toLowerCase().includes("deploy")
      ).length,
    };
  }, [rawActivities]);

  const getEventIcon = (type: string, role: string) => {
    if (type === "deployed") {
      return <Rocket className="h-4 w-4 text-[#10B981]" />;
    }
    if (type === "test_passed" || type === "plan_approved") {
      return <CheckCircle2 className="h-4 w-4 text-[#00F2FE]" />;
    }
    if (type === "file_modified" || type === "file_created") {
      return <FileCode className="h-4 w-4 text-[#58A6FF]" />;
    }
    if (type === "secret_added") {
      return <ShieldCheck className="h-4 w-4 text-[#F59E0B]" />;
    }
    if (role === "agent") {
      return <Bot className="h-4 w-4 text-[#A855F7]" />;
    }
    return <User className="h-4 w-4 text-[#8B949E]" />;
  };

  const getBadgeVariant = (type: string, role: string): BadgeVariant => {
    if (type === "deployed") return "success";
    if (type === "plan_approved") return "cyan";
    if (role === "agent") return "violet";
    if (type === "file_modified" || type === "file_created") return "default";
    return "secondary";
  };

  const filterTabs: { id: FilterCategory; label: string; count: number }[] = [
    { id: "all", label: "All Events", count: counts.all },
    { id: "plans", label: "Plans", count: counts.plans },
    { id: "agents", label: "Agents", count: counts.agents },
    { id: "commits", label: "Commits", count: counts.commits },
    { id: "deployments", label: "Deployments", count: counts.deployments },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#21262D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-[#161B22] border border-[#30363D] text-[#00F2FE]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#F0F6FC] tracking-tight">Activity</h1>
                <Badge variant="cyan" size="sm">
                  {rawActivities.length} Events
                </Badge>
              </div>
              <p className="text-xs text-[#8B949E]">
                A chronological record of what Architect and your team changed.
              </p>
            </div>
          </div>
        </div>

        {/* Project Context Chip */}
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-[6px] bg-[#161B22] border border-[#30363D] text-[#8B949E]">
          <span className="text-[#6E7681]">Project:</span>
          <span className="text-[#F0F6FC] font-semibold">{project.name}</span>
          <span className="text-[#30363D]">|</span>
          <span className="text-[#10B981] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Live Audit Stream
          </span>
        </div>
      </div>

      {/* Controls: Category Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#161B22] border border-[#30363D] rounded-[8px] overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? "bg-[#21262D] text-[#F0F6FC] shadow-sm border border-[#30363D]"
                    : "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]/50 border border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-[#00F2FE]/20 text-[#00F2FE]"
                      : "bg-[#0E1117] text-[#6E7681]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Filter */}
        <div className="relative sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7681]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity records..."
            className="pl-8 h-8 text-xs bg-[#161B22] border-[#30363D]"
          />
        </div>
      </div>

      {/* Main Activity Timeline */}
      <Card className="border-[#30363D] bg-[#0E1117]">
        <CardContent className="p-6">
          {filteredActivities.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Filter className="h-8 w-8 text-[#30363D] mx-auto" />
              <p className="text-sm font-medium text-[#F0F6FC]">No events found</p>
              <p className="text-xs text-[#8B949E]">
                No activity items match the current filter criteria.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-px before:bg-[#21262D]">
              {filteredActivities.map((act) => {
                const formattedTime = formatTimestamp(act.createdAt);
                const isAgent = act.actorRole === "agent";

                return (
                  <div key={act.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-[30px] top-1 p-1 rounded-full bg-[#161B22] border border-[#30363D] group-hover:border-[#00F2FE]/50 transition-colors shadow-sm">
                      {getEventIcon(act.type, act.actorRole)}
                    </div>

                    {/* Timeline Event Card */}
                    <div className="p-4 rounded-[8px] bg-[#161B22]/60 hover:bg-[#161B22] border border-[#21262D] hover:border-[#30363D] transition-colors space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-[#F0F6FC] flex items-center gap-1.5">
                            {isAgent ? (
                              <Sparkles className="h-3 w-3 text-[#A855F7]" />
                            ) : null}
                            {act.actor}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#0E1117] text-[#8B949E] border border-[#21262D]">
                            {act.actorRole}
                          </span>
                          <Badge
                            variant={getBadgeVariant(act.type, act.actorRole)}
                            size="sm"
                          >
                            {act.type.replace(/_/g, " ")}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-[#6E7681] font-mono">
                          <Calendar className="h-3 w-3" />
                          <span>{formattedTime}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#C9D1D9] leading-relaxed">
                        {act.summary}
                      </p>

                      {/* Metadata Chips if available */}
                      {act.metadata && Object.keys(act.metadata).length > 0 && (
                        <div className="pt-2 flex items-center gap-2 flex-wrap text-[11px] font-mono text-[#8B949E]">
                          {Object.entries(act.metadata).map(([key, value]) => (
                            <span
                              key={key}
                              className="px-2 py-0.5 rounded bg-[#0E1117] border border-[#21262D] text-[#8B949E]"
                            >
                              <span className="text-[#6E7681]">{key}: </span>
                              <span className="text-[#F0F6FC]">{String(value)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
