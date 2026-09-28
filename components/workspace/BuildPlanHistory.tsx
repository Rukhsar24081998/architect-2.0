"use client";

import React from "react";
import { BuildPlan } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { FileCode2, Sparkles } from "lucide-react";

export interface BuildPlanHistoryProps {
  plans: BuildPlan[];
  activePlanId?: string;
  onSelectPlan: (plan: BuildPlan) => void;
}

export function BuildPlanHistory({
  plans,
  activePlanId,
  onSelectPlan,
}: BuildPlanHistoryProps) {
  if (!plans || plans.length === 0) return null;

  return (
    <div className="space-y-2 pt-2 border-t border-[#21262D]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B949E] flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#00F2FE]" />
          Build Plans ({plans.length})
        </span>
      </div>

      <div className="space-y-1.5">
        {plans.map((p) => {
          const isSelected = activePlanId === p.id;
          const isApproved = p.status === "approved";

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPlan(p)}
              className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#00F2FE]/10 border-[#00F2FE]/50 text-white"
                  : "bg-[#161B22] border-[#30363D] hover:border-[#8B949E]/60 text-[#C9D1D9]"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isApproved ? "bg-[#3FB950]" : "bg-[#00F2FE]"
                    }`}
                  />
                  <span className="font-mono text-[10px] uppercase text-[#8B949E]">
                    {isApproved ? "Approved" : "Proposed"}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#8B949E]" suppressHydrationWarning>
                  {formatTimestamp(p.createdAt)}
                </span>
              </div>

              <h5 className="font-semibold text-xs text-white truncate leading-snug">
                {p.title}
              </h5>

              <div className="flex items-center gap-2 mt-1 text-[10px] text-[#8B949E] font-mono">
                <span className="flex items-center gap-0.5">
                  <FileCode2 className="h-3 w-3" />
                  {p.steps?.length || 0} steps
                </span>
                <span>•</span>
                <span className="capitalize">{p.estimatedComplexity || "medium"}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
