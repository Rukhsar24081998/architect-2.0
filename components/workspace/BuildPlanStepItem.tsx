"use client";

import React, { useState } from "react";
import { PlanStep, PlanStepType } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import {
  FileCode2,
  ChevronDown,
  ChevronUp,
  GitCommit,
  CheckCircle2,
  Layers,
  Code2,
  Server,
  Database,
  TestTube,
  Sliders,
} from "lucide-react";

export interface BuildPlanStepItemProps {
  step: PlanStep;
  index: number;
  existingFiles?: string[];
}

function StepTypeIcon({ type, className }: { type?: PlanStepType; className?: string }) {
  switch (type) {
    case "architecture":
      return <Layers className={className} />;
    case "frontend":
      return <Code2 className={className} />;
    case "backend":
      return <Server className={className} />;
    case "database":
      return <Database className={className} />;
    case "testing":
      return <TestTube className={className} />;
    case "configuration":
      return <Sliders className={className} />;
    default:
      return <GitCommit className={className} />;
  }
}

function getCategoryVariant(type?: PlanStepType): "default" | "cyan" | "violet" | "outline" {
  switch (type) {
    case "architecture":
      return "cyan";
    case "frontend":
      return "violet";
    case "backend":
      return "default";
    case "database":
      return "default";
    case "testing":
      return "outline";
    default:
      return "default";
  }
}

export function BuildPlanStepItem({ step, index, existingFiles }: BuildPlanStepItemProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const orderNum = String(step.order ?? index + 1).padStart(2, "0");
  const badgeVariant = getCategoryVariant(step.type);

  const affectedFiles =
    step.affectedFiles && step.affectedFiles.length > 0
      ? step.affectedFiles
      : step.targetFile
      ? [step.targetFile]
      : [];

  const existingFileSet = new Set(existingFiles || []);
  const existingStepFiles = affectedFiles.filter((f) => existingFileSet.has(f));
  const newStepFiles = affectedFiles.filter((f) => !existingFileSet.has(f));

  return (
    <div className="rounded-xl border border-[#21262D] bg-[#0E1117] overflow-hidden transition-all duration-200 hover:border-[#30363D]">
      {/* Primary Card View: Title, Category, and Product Description */}
      <div className="p-4 sm:p-5 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Step Number Badge */}
            <div className="h-7 w-7 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-center font-mono text-xs font-bold text-[#00F2FE] shrink-0 shadow-sm">
              {orderNum}
            </div>

            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h4 className="text-sm font-semibold text-white tracking-tight truncate">
                {step.title}
              </h4>
              <Badge variant={badgeVariant} size="sm" className="font-mono text-[10px] uppercase">
                <StepTypeIcon type={step.type} className="h-3 w-3 mr-1" />
                {step.type || "feature"}
              </Badge>
              {step.status === "approved" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#3FB950]">
                  <CheckCircle2 className="h-3 w-3" /> Approved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Short Product Description */}
        <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed pl-10">
          {step.description}
        </p>

        {/* Progressive Disclosure Toggle */}
        <div className="pl-10 pt-1">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#6E7681] hover:text-[#00F2FE] transition-colors py-0.5 group cursor-pointer"
          >
            <FileCode2 className="h-3 w-3 text-[#6E7681] group-hover:text-[#00F2FE] transition-colors" />
            <span>
              {showTechnicalDetails ? "Hide technical details" : "View technical details"}
            </span>
            {affectedFiles.length > 0 && (
              <span className="text-[10px] text-[#484F58]">
                ({affectedFiles.length} file{affectedFiles.length === 1 ? "" : "s"})
              </span>
            )}
            {showTechnicalDetails ? (
              <ChevronUp className="h-3 w-3 text-[#6E7681] group-hover:text-[#00F2FE]" />
            ) : (
              <ChevronDown className="h-3 w-3 text-[#6E7681] group-hover:text-[#00F2FE]" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Technical Details Drawer */}
      {showTechnicalDetails && (
        <div className="px-4 sm:px-5 py-3.5 border-t border-[#21262D] bg-[#161B22]/40 space-y-3 animate-in fade-in duration-150">
          {/* Affected Files */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-[#8B949E] flex items-center gap-1">
              <FileCode2 className="h-3 w-3 text-[#00F2FE]" />
              Target Files
            </span>

            {affectedFiles.length === 0 ? (
              <span className="text-[11px] font-mono text-[#6E7681] italic">
                No direct file modifications
              </span>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Existing Files */}
                {existingStepFiles.map((file, i) => (
                  <span
                    key={`exist-${i}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#161B22] border border-[#30363D] font-mono text-[11px] text-[#C9D1D9]"
                    title={`Existing file: ${file}`}
                  >
                    <span className="text-[9px] text-[#3FB950] font-bold">EXISTING</span>
                    <span className="truncate max-w-[240px]">{file}</span>
                  </span>
                ))}

                {/* Proposed New Files */}
                {newStepFiles.map((file, i) => (
                  <span
                    key={`new-${i}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#161B22] border border-[#00F2FE]/25 font-mono text-[11px] text-[#00F2FE]"
                    title={`Proposed new file: ${file}`}
                  >
                    <span className="text-[9px] text-[#00F2FE] font-bold">NEW</span>
                    <span className="truncate max-w-[240px]">{file}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dependencies if any */}
          {step.dependencies && step.dependencies.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8B949E] pt-1">
              <span>Dependencies:</span>
              <span className="text-[#C9D1D9]">{step.dependencies.join(", ")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
