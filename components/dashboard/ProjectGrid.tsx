import React from "react";
import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { FilterCategory } from "./ProjectFilters";

interface ProjectGridProps {
  projects: Project[];
  searchQuery: string;
  activeFilter: FilterCategory;
  onClearFilters: () => void;
}

export function ProjectGrid({
  projects,
  searchQuery,
  activeFilter,
  onClearFilters,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return <DashboardEmptyState type="no-projects" />;
  }

  const query = searchQuery.trim().toLowerCase();

  const filteredProjects = projects.filter((project) => {
    // 1. Status Filter
    if (activeFilter !== "all" && project.status !== activeFilter) {
      return false;
    }

    // 2. Search Filter (name and description)
    if (query) {
      const matchName = project.name.toLowerCase().includes(query);
      const matchDesc = project.description.toLowerCase().includes(query);
      if (!matchName && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  if (filteredProjects.length === 0) {
    return <DashboardEmptyState type="no-matches" onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );

}
