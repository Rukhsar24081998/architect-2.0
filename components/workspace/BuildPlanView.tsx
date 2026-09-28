"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BuildPlan, Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

import { BuildPlanStepItem } from "./BuildPlanStepItem";
import { BuildPlanEditModal } from "./BuildPlanEditModal";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  FileCode2,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Pencil,
  ChevronDown,
  ChevronUp,
  Layers,
  Play,
} from "lucide-react";

export interface BuildPlanViewProps {
  project: Project;
  plan: BuildPlan;
  onBackToChat: () => void;
  onApprovePlan: (planId: string) => Promise<void>;
  onUpdatePlan: (updatedPlan: BuildPlan) => Promise<void>;
}

export function BuildPlanView({
  project,
  plan,
  onBackToChat,
  onApprovePlan,
  onUpdatePlan,
}: BuildPlanViewProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Progressive disclosure states (collapsed by default)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showAssumptionsRisks, setShowAssumptionsRisks] = useState(false);

  const isApproved = plan.status === "approved";

  // Derive unique affected files
  const allAffectedFiles = Array.from(
    new Set(
      plan.steps.flatMap((s) => s.affectedFiles || (s.targetFile ? [s.targetFile] : []))
    )
  );

  const existingFiles = (project as { files?: { path: string }[] }).files?.map((f) => f.path) || [];
  const existingFileSet = new Set(existingFiles);
  const existingTargetCount = allAffectedFiles.filter((f) => existingFileSet.has(f)).length;
  const newTargetCount = allAffectedFiles.filter((f) => !existingFileSet.has(f)).length;

  const complexityLabel = (plan.estimatedComplexity || "medium").toLowerCase();
  const formattedComplexity =
    complexityLabel.charAt(0).toUpperCase() + complexityLabel.slice(1);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprovePlan(plan.id);
      addToast({
        type: "success",
        title: "Build Plan Approved",
        message: "Plan approved and ready for agent execution.",
      });
    } catch (err: unknown) {
      addToast({
        type: "error",
        title: "Approval Failed",
        message: err instanceof Error ? err.message : "Failed to approve plan",
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A0F] text-[#F0F6FC] overflow-y-auto">
      {/* 1. Simplified View Header */}
      <div className="p-4 sm:p-6 border-b border-[#21262D] bg-[#0E1117] space-y-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBackToChat}
              className="text-xs text-[#8B949E] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Back to Conversation</span>
            </Button>

            <div className="h-4 w-[1px] bg-[#30363D]" />

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/25 text-[#00F2FE] text-xs font-mono font-medium">
              <Sparkles className="h-3 w-3" />
              <span>Build Plan</span>
            </div>

            <Badge
              variant={isApproved ? "success" : "cyan"}
              size="sm"
              dot
              className="font-mono text-xs uppercase"
            >
              {isApproved ? "Approved" : "Proposed"}
            </Badge>
          </div>

          {/* Action CTAs in Header */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs border-[#30363D] text-[#C9D1D9] hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5 mr-1 text-[#8B949E]" />
              <span>Edit Plan</span>
            </Button>

            {!isApproved ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isApproving}
                onClick={handleApprove}
                className="text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)] bg-[#00F2FE] hover:bg-[#00D8E6] text-black font-semibold"
              >
                {isApproving ? (
                  <span>Approving...</span>
                ) : (
                  <>
                    <span>Approve Plan</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() =>
                  router.push(`/projects/${project.id}/agents?planId=${plan.id}&start=true`)
                }
                className="text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)] bg-[#00F2FE] hover:bg-[#00D8E6] text-black font-semibold"
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                <span>Start Agent Execution</span>
              </Button>
            )}
          </div>
        </div>

        {/* Title, Short Description & Clean Metadata */}
        <div className="space-y-2 max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {plan.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
            {plan.summary || "Structured implementation roadmap for this workspace."}
          </p>

          {/* Clean, Non-Technical Metadata Strip */}
          <div className="flex items-center gap-2 pt-1 text-xs font-mono text-[#8B949E]">
            <span className="text-[#C9D1D9] font-medium">{plan.steps.length} steps</span>
            <span>·</span>
            <span>{formattedComplexity} complexity</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Stages */}
      <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* Approved State Banner */}
        {isApproved && (
          <div className="rounded-xl border border-[#3FB950]/40 bg-[#3FB950]/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#3FB950]/20 border border-[#3FB950]/40 flex items-center justify-center text-[#3FB950] shrink-0 mt-0.5">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white">
                  Plan approved and ready for agent execution.
                </h4>
                <p className="text-xs text-[#8B949E]">
                  Milestones are confirmed and ready for the swarm agents.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBackToChat}
              className="border-[#3FB950]/40 text-[#3FB950] hover:bg-[#3FB950]/10 text-xs shrink-0"
            >
              <span>Return to Conversation</span>
            </Button>
          </div>
        )}

        {/* PRIMARY SECTION: WHAT I'LL BUILD */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F2FE]">
                WHAT I&apos;LL BUILD
              </h3>
              <p className="text-xs text-[#6E7681] mt-0.5">
                Architect&apos;s proposed milestone sequence
              </p>
            </div>
            <span className="text-xs font-mono text-[#8B949E]">
              {plan.steps.length} milestones
            </span>
          </div>

          {/* Clean Step Cards */}
          <div className="space-y-2.5">
            {plan.steps.map((step, idx) => (
              <BuildPlanStepItem
                key={step.id || idx}
                step={step}
                index={idx}
                existingFiles={existingFiles}
              />
            ))}
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE: Technical Details (Collapsed by default) */}
        <div className="rounded-xl border border-[#21262D] bg-[#0E1117] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#161B22]/50 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <Code2 className="h-4 w-4 text-[#8B949E]" />
              <div>
                <span className="text-xs font-mono font-semibold text-[#C9D1D9] uppercase tracking-wider">
                  Technical details
                </span>
                <span className="text-xs text-[#6E7681] ml-2 hidden sm:inline">
                  — files, dependencies, and architecture breakdown
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#6E7681]">
                {allAffectedFiles.length} files · ~{plan.estimatedDurationMinutes || plan.steps.length * 4} min
              </span>
              {showTechnicalDetails ? (
                <ChevronUp className="h-4 w-4 text-[#8B949E]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#8B949E]" />
              )}
            </div>
          </button>

          {showTechnicalDetails && (
            <div className="p-4 sm:p-5 border-t border-[#21262D] space-y-4 bg-[#0A0D14] animate-in fade-in duration-150">
              {/* Internal Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#21262D] space-y-1">
                  <div className="text-[10px] text-[#6E7681] uppercase flex items-center gap-1">
                    <FileCode2 className="h-3 w-3 text-[#00F2FE]" />
                    Total Files
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {allAffectedFiles.length}
                  </div>
                  <div className="text-[10px] text-[#8B949E]">
                    {existingTargetCount} existing / {newTargetCount} proposed
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#21262D] space-y-1">
                  <div className="text-[10px] text-[#6E7681] uppercase flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#A855F7]" />
                    Est. Duration
                  </div>
                  <div className="text-white font-semibold text-sm">
                    ~{plan.estimatedDurationMinutes || plan.steps.length * 4} min
                  </div>
                  <div className="text-[10px] text-[#8B949E]">
                    Autonomous agent time
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#21262D] space-y-1">
                  <div className="text-[10px] text-[#6E7681] uppercase flex items-center gap-1">
                    <Layers className="h-3 w-3 text-[#38BDF8]" />
                    Architecture
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {plan.steps.length} Modules
                  </div>
                  <div className="text-[10px] text-[#8B949E]">
                    End-to-end stack
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#21262D] space-y-1">
                  <div className="text-[10px] text-[#6E7681] uppercase flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#F59E0B]" />
                    Target Branch
                  </div>
                  <div className="text-white font-semibold text-sm truncate">
                    {project.currentBranch || "main"}
                  </div>
                  <div className="text-[10px] text-[#8B949E]">
                    Git working branch
                  </div>
                </div>
              </div>

              {/* Full Affected Files List */}
              {allAffectedFiles.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase text-[#8B949E]">
                    All Targeted Source Files
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {allAffectedFiles.map((file, i) => {
                      const isExisting = existingFileSet.has(file);
                      return (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
                            isExisting
                              ? "bg-[#161B22] border-[#30363D] text-[#C9D1D9]"
                              : "bg-[#161B22] border-[#00F2FE]/25 text-[#00F2FE]"
                          }`}
                        >
                          <span className={`text-[8px] font-bold ${isExisting ? "text-[#3FB950]" : "text-[#00F2FE]"}`}>
                            {isExisting ? "EXISTING" : "NEW"}
                          </span>
                          <span className="truncate max-w-[280px]">{file}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PROGRESSIVE DISCLOSURE: Assumptions & Risks (Collapsed by default) */}
        <div className="rounded-xl border border-[#21262D] bg-[#0E1117] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAssumptionsRisks(!showAssumptionsRisks)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#161B22]/50 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-4 w-4 text-[#8B949E]" />
              <div>
                <span className="text-xs font-mono font-semibold text-[#C9D1D9] uppercase tracking-wider">
                  Assumptions &amp; risks
                </span>
                <span className="text-xs text-[#6E7681] ml-2 hidden sm:inline">
                  — architectural considerations and guardrails
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#6E7681]">
                {(plan.assumptions?.length || 0) + (plan.risks?.length || 0)} items
              </span>
              {showAssumptionsRisks ? (
                <ChevronUp className="h-4 w-4 text-[#8B949E]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#8B949E]" />
              )}
            </div>
          </button>

          {showAssumptionsRisks && (
            <div className="p-4 sm:p-5 border-t border-[#21262D] grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0A0D14] animate-in fade-in duration-150">
              {/* Assumptions */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#00F2FE]">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Assumptions ({plan.assumptions?.length || 0})</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#C9D1D9]">
                  {(plan.assumptions && plan.assumptions.length > 0
                    ? plan.assumptions
                    : ["Existing project architecture and dependencies are verified."]
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#F59E0B]">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Risks &amp; Considerations ({plan.risks?.length || 0})</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#C9D1D9]">
                  {(plan.risks && plan.risks.length > 0
                    ? plan.risks
                    : ["Automated testing required before staging cutover."]
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Primary Approval Bar */}
        {!isApproved ? (
          <div className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#21262D]">
            <p className="text-xs text-[#8B949E]">
              Approving confirms this plan and prepares it for agent execution.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="w-full sm:w-auto text-xs border-[#30363D] text-[#C9D1D9] hover:text-white"
              >
                <span>Edit Plan</span>
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={isApproving}
                onClick={handleApprove}
                className="w-full sm:w-auto min-w-[200px] shadow-[0_0_20px_rgba(0,242,254,0.35)] bg-[#00F2FE] hover:bg-[#00D8E6] text-black font-semibold text-xs"
              >
                {isApproving ? (
                  <span>Approving Plan...</span>
                ) : (
                  <>
                    <span>Approve Plan</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#21262D]">
            <div className="flex items-center gap-3 text-xs">
              <div className="h-9 w-9 rounded-lg bg-[#3FB950]/15 border border-[#3FB950]/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-[#3FB950]" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">
                  Plan approved and ready for agent execution.
                </p>
                <p className="text-[#8B949E] text-xs">
                  All milestones confirmed. Click below to begin multi-agent execution.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() =>
                router.push(`/projects/${project.id}/agents?planId=${plan.id}&start=true`)
              }
              className="w-full sm:w-auto min-w-[220px] shadow-[0_0_20px_rgba(0,242,254,0.35)] bg-[#00F2FE] hover:bg-[#00D8E6] text-black font-semibold text-xs"
            >
              <Play className="h-4 w-4 mr-1.5" />
              <span>Start Agent Execution</span>
            </Button>
          </div>
        )}
      </div>

      {/* Edit Plan Modal (Preserved functionality) */}
      <BuildPlanEditModal
        plan={plan}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onUpdatePlan}
      />
    </div>
  );
}
