import React from "react";
import { Project } from "@/lib/types";
import { Layers, Play, CheckCircle2, Hammer } from "lucide-react";

interface DashboardMetricsProps {
  projects: Project[];
}

export function DashboardMetrics({ projects }: DashboardMetricsProps) {
  const total = projects.length;
  const building = projects.filter(
    (p) => p.status === "building" || p.status === "planning"
  ).length;
  const deployed = projects.filter((p) => p.status === "deployed").length;
  const ready = projects.filter(
    (p) => p.status === "ready" || p.status === "draft"
  ).length;

  const metrics = [
    {
      label: "Total Projects",
      value: total,
      icon: Layers,
      color: "text-[#F0F6FC]",
      borderColor: "border-[#30363D]",
      dotColor: "bg-[#8B949E]",
    },
    {
      label: "Active Builds",
      value: building,
      icon: Hammer,
      color: "text-[#00F2FE]",
      borderColor: "border-[#00F2FE]/30",
      dotColor: "bg-[#00F2FE]",
      pulse: building > 0,
    },
    {
      label: "Live in Production",
      value: deployed,
      icon: Play,
      color: "text-[#10B981]",
      borderColor: "border-[#10B981]/30",
      dotColor: "bg-[#10B981]",
    },
    {
      label: "Ready / Idle",
      value: ready,
      icon: CheckCircle2,
      color: "text-[#C9D1D9]",
      borderColor: "border-[#30363D]",
      dotColor: "bg-[#58A6FF]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className={`p-3.5 rounded-[8px] bg-[#0E1117] border ${m.borderColor} flex items-center justify-between transition-colors shadow-sm min-h-[76px]`}
          >
            <div className="space-y-0.5 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  {m.pulse && (
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${m.dotColor}`}
                    />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${m.dotColor}`}
                  />
                </span>
                <span className="text-[10px] xl:text-[11px] font-mono uppercase text-[#8B949E] whitespace-nowrap truncate tracking-tight">
                  {m.label}
                </span>
              </div>
              <p className={`text-xl font-bold font-mono ${m.color}`}>
                {m.value}
              </p>
            </div>

            <div className="h-8 w-8 rounded-[6px] bg-[#161B22] border border-[#21262D] flex items-center justify-center text-[#8B949E] shrink-0">
              <Icon className="h-4 w-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
