"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Project, ActivityEvent } from "@/lib/types";
import { apiClient } from "@/lib/api-client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ProjectFilters, FilterCategory } from "@/components/dashboard/ProjectFilters";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedProjects, fetchedActivities] = await Promise.all([
        apiClient.getProjects(),
        apiClient.getRecentActivity(6),
      ]);
      setProjects(fetchedProjects);
      setActivities(fetchedActivities);
    } catch (err: unknown) {
      console.error("Dashboard fetch error:", err);
      const message = err instanceof Error ? err.message : "Failed to load projects";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      apiClient.getProjects(),
      apiClient.getRecentActivity(6),
    ])
      .then(([p, a]) => {
        if (isMounted) {
          setProjects(p);
          setActivities(a);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load projects");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Derived metadata text: "3 projects · 1 building · 1 deployed"
  const getProjectsSummary = () => {
    const total = projects.length;
    const building = projects.filter(
      (p) => p.status === "building" || p.status === "planning"
    ).length;
    const deployed = projects.filter((p) => p.status === "deployed").length;

    const parts = [`${total} project${total === 1 ? "" : "s"}`];
    if (building > 0) parts.push(`${building} building`);
    if (deployed > 0) parts.push(`${deployed} deployed`);

    return parts.join(" · ");
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 1. Header with Persona Greeting & Primary CTAs */}
      <DashboardHeader />

      {/* 2. Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>

          <div className="space-y-4">
            <Skeleton className="h-9 w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-44 w-full" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Error State */}
      {!isLoading && error && (
        <div className="p-8 rounded-[8px] bg-[#161B22] border border-[#EF4444]/30 text-center space-y-4">
          <div className="h-10 w-10 mx-auto rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">
              Couldn&apos;t load your projects
            </h3>
            <p className="text-xs text-[#8B949E] max-w-sm mx-auto">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Retry Connection
          </Button>
        </div>
      )}

      {/* 4. Loaded Content */}
      {!isLoading && !error && (
        <>
          {/* Metrics Strip */}
          <DashboardMetrics projects={projects} />

          {/* Main Content Layout: Project Workspace (Left) + Activity & Quick Actions (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Primary Column: Projects List */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Your projects
                  </h2>
                  <p className="text-xs text-[#8B949E] font-mono">
                    {getProjectsSummary()}
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <ProjectFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                projects={projects}
              />

              {/* Grid of Project Cards */}
              <ProjectGrid
                projects={projects}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                onClearFilters={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
              />
            </div>

            {/* Aside Column: Quick Actions & Recent Activity */}
            <div className="lg:col-span-4 space-y-5">
              <QuickActions recentProjectId={projects[0]?.id} />
              <RecentActivity activities={activities} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
