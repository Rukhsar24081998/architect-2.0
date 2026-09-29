"use client";

import React, { useState } from "react";
import { ProjectDetails } from "@/lib/types";
import { EnvironmentVariable } from "@/lib/developer/types";
import { INITIAL_ENV_VARIABLES } from "@/lib/developer/mock-git";
import { EnvironmentPanel } from "@/components/developer/EnvironmentPanel";
import { KeyRound, ShieldCheck, Lock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface EnvironmentStudioProps {
  project: ProjectDetails;
}

export function EnvironmentStudio({ project }: EnvironmentStudioProps) {
  const { addToast } = useToast();

  // Initialize with project environment variables if present, or INITIAL_ENV_VARIABLES
  const [variables, setVariables] = useState<EnvironmentVariable[]>(() => {
    if (project.environmentVariables && project.environmentVariables.length > 0) {
      // Map any store variables to EnvironmentVariable structure
      const existingKeys = new Set(project.environmentVariables.map((v) => v.key));
      const combined = [
        ...project.environmentVariables.map((v) => ({
          id: v.id,
          key: v.key,
          value: v.value,
          isSecret: v.isSecret ?? true,
          target: (v.target as "production" | "preview" | "development") || "production",
        })),
        ...INITIAL_ENV_VARIABLES.filter((iv) => !existingKeys.has(iv.key)),
      ];
      return combined;
    }
    return INITIAL_ENV_VARIABLES;
  });

  const handleAddVariable = (newVar: Omit<EnvironmentVariable, "id">) => {
    const deterministicId = `env_custom_${variables.length + 1}`;
    const item: EnvironmentVariable = {
      ...newVar,
      id: deterministicId,
    };

    setVariables((prev) => [item, ...prev]);
    addToast({
      type: "success",
      title: "Secret Saved",
      message: `${newVar.key} added to encrypted vault.`,
    });
  };

  const handleDeleteVariable = (id: string) => {
    const target = variables.find((v) => v.id === id);
    setVariables((prev) => prev.filter((v) => v.id !== id));
    addToast({
      type: "info",
      title: "Variable Deleted",
      message: `${target?.key || "Secret"} was removed.`,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#21262D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-[#161B22] border border-[#30363D] text-[#00F2FE]">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#F0F6FC] tracking-tight">
                  Environment Variables
                </h1>
                <Badge variant="cyan" size="sm">
                  {variables.length} Active Secrets
                </Badge>
              </div>
              <p className="text-xs text-[#8B949E]">
                Manage configuration and secrets used by this project.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Vault Status */}
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-[6px] bg-[#161B22] border border-[#30363D] text-[#8B949E]">
          <ShieldCheck className="h-4 w-4 text-[#10B981]" />
          <span>Encrypted at rest (AES-256)</span>
          <span className="text-[#30363D]">|</span>
          <span className="text-[#00F2FE] flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Scoped to {project.name}
          </span>
        </div>
      </div>

      {/* Main Studio Body: Reusing existing EnvironmentPanel */}
      <div className="rounded-[8px] border border-[#30363D] bg-[#0E1117] overflow-hidden min-h-[500px]">
        <EnvironmentPanel
          variables={variables}
          onAddVariable={handleAddVariable}
          onDeleteVariable={handleDeleteVariable}
        />
      </div>
    </div>
  );
}
