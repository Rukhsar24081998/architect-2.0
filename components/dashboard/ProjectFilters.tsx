"use client";

import React from "react";
import { Project, ProjectStatus } from "@/lib/types";
import { Search, X } from "lucide-react";

export type FilterCategory = "all" | ProjectStatus;

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  projects: Project[];
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  projects,
}: ProjectFiltersProps) {
  const getFilterCount = (cat: FilterCategory) => {
    if (cat === "all") return projects.length;
    return projects.filter((p) => p.status === cat).length;
  };

  const categories: { id: FilterCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "building", label: "Building" },
    { id: "ready", label: "Ready" },
    { id: "deployed", label: "Deployed" },
    { id: "draft", label: "Draft" },
  ];

  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 select-none">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] xl:max-w-xs 2xl:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects by name or description..."
          className="w-full h-9 rounded-[6px] bg-[#0E1117] border border-[#30363D] pl-9 pr-8 text-xs text-[#F0F6FC] placeholder:text-[#6E7681] transition-colors focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-white p-0.5"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const count = getFilterCount(cat.id);
          const isActive = activeFilter === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all duration-150 cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? "bg-[#161B22] text-[#F0F6FC] border border-[#30363D] shadow-sm font-semibold"
                  : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]/50 border border-transparent"
              }`}
            >
              <span className="whitespace-nowrap">{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 whitespace-nowrap ${
                  isActive
                    ? "bg-[#21262D] text-[#00F2FE]"
                    : "bg-[#161B22] text-[#6E7681]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
