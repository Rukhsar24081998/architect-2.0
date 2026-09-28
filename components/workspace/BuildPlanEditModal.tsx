"use client";

import React, { useState } from "react";
import { BuildPlan, PlanStep, PlanStepType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, X, Save, AlertCircle } from "lucide-react";

export interface BuildPlanEditModalProps {
  plan: BuildPlan;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPlan: BuildPlan) => Promise<void>;
}

export function BuildPlanEditModal({
  plan,
  isOpen,
  onClose,
  onSave,
}: BuildPlanEditModalProps) {
  const [title, setTitle] = useState(plan.title);
  const [summary, setSummary] = useState(plan.summary || "");
  const [steps, setSteps] = useState<PlanStep[]>(
    plan.steps.map((s, idx) => ({ ...s, order: s.order ?? idx + 1 }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStepChange = (
    index: number,
    field: keyof PlanStep,
    value: string | string[]
  ) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddStep = () => {
    const newStep: PlanStep = {
      id: `step_${Date.now()}`,
      order: steps.length + 1,
      title: "New Implementation Step",
      description: "Describe what will be built in this step.",
      type: "frontend",
      status: "pending",
      affectedFiles: [],
      dependencies: [],
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      setError("A build plan must have at least one step.");
      return;
    }
    const updated = steps.filter((_, idx) => idx !== index);
    // re-assign orders
    const reordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSteps(reordered);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Plan title is required");
      return;
    }

    if (steps.length === 0) {
      setError("At least one step is required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updated: BuildPlan = {
        ...plan,
        title: title.trim(),
        summary: summary.trim(),
        steps,
        updatedAt: new Date().toISOString(),
      };
      await onSave(updated);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update build plan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0E1117] border border-[#30363D] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-[#30363D] flex items-center justify-between bg-[#161B22]/50">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Edit Build Plan
            </h3>
            <p className="text-xs text-[#8B949E]">
              Adjust plan titles, milestone steps, or target files.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#21262D] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Plan Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
              Plan Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[#30363D] bg-[#161B22] px-3.5 py-2 text-sm text-[#F0F6FC] focus:border-[#00F2FE] focus:outline-none"
              placeholder="e.g. Add Supabase Authentication"
            />
          </div>

          {/* Plan Summary */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
              Summary / Architect&apos;s Understanding
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded-lg border border-[#30363D] bg-[#161B22] px-3.5 py-2 text-xs text-[#F0F6FC] focus:border-[#00F2FE] focus:outline-none resize-none"
              placeholder="Brief summary of what this plan delivers..."
            />
          </div>

          {/* Steps Section */}
          <div className="space-y-3 pt-2 border-t border-[#21262D]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
                Implementation Steps ({steps.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddStep}
                className="text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>Add Step</span>
              </Button>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="p-3.5 rounded-xl border border-[#30363D] bg-[#161B22]/50 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="h-6 w-6 rounded bg-[#21262D] text-[#00F2FE] font-mono font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                      className="flex-1 rounded border border-[#30363D] bg-[#0E1117] px-2.5 py-1 text-xs text-white focus:border-[#00F2FE] focus:outline-none font-semibold"
                      placeholder="Step Title"
                    />

                    <select
                      value={step.type || "frontend"}
                      onChange={(e) =>
                        handleStepChange(idx, "type", e.target.value as PlanStepType)
                      }
                      className="rounded border border-[#30363D] bg-[#0E1117] px-2 py-1 text-[11px] text-[#C9D1D9] focus:outline-none font-mono"
                    >
                      <option value="architecture">Architecture</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="integration">Integration</option>
                      <option value="testing">Testing</option>
                      <option value="configuration">Configuration</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1 rounded text-[#8B949E] hover:text-[#F85149] transition-colors"
                      title="Remove Step"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(idx, "description", e.target.value)
                    }
                    className="w-full rounded border border-[#30363D] bg-[#0E1117] p-2 text-xs text-[#C9D1D9] focus:border-[#00F2FE] focus:outline-none resize-none"
                    placeholder="Step description and milestones..."
                  />

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-[#8B949E] font-mono">Files:</span>
                    <input
                      type="text"
                      value={(step.affectedFiles || []).join(", ")}
                      onChange={(e) =>
                        handleStepChange(
                          idx,
                          "affectedFiles",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      className="flex-1 rounded border border-[#30363D] bg-[#0E1117] px-2 py-0.5 text-xs text-[#00F2FE] font-mono focus:outline-none"
                      placeholder="e.g. src/App.tsx, lib/auth.ts"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#30363D] flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving}
              className="min-w-[120px] shadow-[0_0_12px_rgba(0,242,254,0.2)]"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1" />
                  <span>Save Plan</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
