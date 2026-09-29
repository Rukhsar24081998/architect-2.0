"use client";

import React, { useState } from "react";
import { ProjectDetails } from "@/lib/types";
import {
  Settings,
  Sliders,
  AlertTriangle,
  Save,
  Bot,
  Code2,
  Archive,
  Trash2,
  Cpu,
  Shield,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

interface SettingsStudioProps {
  project: ProjectDetails;
}

export function SettingsStudio({ project }: SettingsStudioProps) {
  const { addToast } = useToast();

  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(
    project.description || "AI-powered customer support triage queue and internal assistant."
  );
  const [defaultMode, setDefaultMode] = useState<"build" | "dev">("build");

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: "success",
      title: "Settings Saved",
      message: "Project general settings updated successfully.",
    });
  };

  const handleArchive = () => {
    addToast({
      type: "warning",
      title: "Action Disabled",
      message: "Workspace archival is restricted in evaluation demo mode.",
    });
  };

  const handleDelete = () => {
    addToast({
      type: "error",
      title: "Action Disabled",
      message: "Project deletion is protected in demo mode to preserve evaluation integrity.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#21262D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-[#161B22] border border-[#30363D] text-[#00F2FE]">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#F0F6FC] tracking-tight">Project Settings</h1>
                <Badge variant="cyan" size="sm">
                  {project.id}
                </Badge>
              </div>
              <p className="text-xs text-[#8B949E]">
                Configure project metadata, workspace defaults, and administrative controls.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-[6px] bg-[#161B22] border border-[#30363D] text-[#8B949E]">
          <Shield className="h-4 w-4 text-[#10B981]" />
          <span>Role: Owner</span>
          <span className="text-[#30363D]">|</span>
          <span className="text-[#F0F6FC] font-semibold">Production Ready</span>
        </div>
      </div>

      {/* 1. GENERAL SETTINGS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#00F2FE]" />
          <h2 className="text-sm font-semibold text-[#F0F6FC] uppercase tracking-wider font-mono">
            General Configuration
          </h2>
        </div>

        <Card className="border-[#30363D] bg-[#0E1117]">
          <CardContent className="p-6">
            <form onSubmit={handleSaveGeneral} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#C9D1D9]">Project Name</label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project name"
                  className="bg-[#161B22] border-[#30363D] text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#C9D1D9]">Description</label>
                <Textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Project description"
                  rows={3}
                  className="bg-[#161B22] border-[#30363D] text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#6E7681]">Project ID</label>
                  <div className="px-3 py-2 rounded-[6px] bg-[#161B22] border border-[#21262D] font-mono text-xs text-[#8B949E] select-all">
                    {project.id}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#6E7681]">Stack Framework</label>
                  <div className="px-3 py-2 rounded-[6px] bg-[#161B22] border border-[#21262D] font-mono text-xs text-[#F0F6FC]">
                    Next.js 15 App Router · TypeScript
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#21262D] flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={<Save className="h-3.5 w-3.5 text-[#00F2FE]" />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* 2. WORKSPACE PREFERENCES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-[#A855F7]" />
          <h2 className="text-sm font-semibold text-[#F0F6FC] uppercase tracking-wider font-mono">
            Workspace Preferences
          </h2>
        </div>

        <Card className="border-[#30363D] bg-[#0E1117]">
          <CardContent className="p-6 space-y-5">
            {/* Startup Mode */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#C9D1D9]">
                Default Landing Mode
              </label>
              <p className="text-[11px] text-[#8B949E]">
                Choose which workspace experience opens first when opening this project.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div
                  onClick={() => setDefaultMode("build")}
                  className={`p-3.5 rounded-[8px] border cursor-pointer transition-all flex items-start gap-3 ${
                    defaultMode === "build"
                      ? "bg-[#161B22] border-[#00F2FE]/50 shadow-[0_0_12px_rgba(0,242,254,0.1)]"
                      : "bg-[#0E1117] border-[#30363D] hover:bg-[#161B22]/50"
                  }`}
                >
                  <Bot className="h-5 w-5 text-[#00F2FE] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#F0F6FC]">Build Mode (Default)</div>
                    <div className="text-[11px] text-[#8B949E]">
                      Conversational requirements discovery, roadmaps, and visual sandbox preview.
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setDefaultMode("dev")}
                  className={`p-3.5 rounded-[8px] border cursor-pointer transition-all flex items-start gap-3 ${
                    defaultMode === "dev"
                      ? "bg-[#161B22] border-[#A855F7]/50 shadow-[0_0_12px_rgba(168,85,247,0.1)]"
                      : "bg-[#0E1117] border-[#30363D] hover:bg-[#161B22]/50"
                  }`}
                >
                  <Code2 className="h-5 w-5 text-[#A855F7] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#F0F6FC]">Developer Mode</div>
                    <div className="text-[11px] text-[#8B949E]">
                      Full IDE code editor, virtual file tree, Git source control, and live terminal.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Model Information */}
            <div className="pt-4 border-t border-[#21262D] space-y-2">
              <label className="text-xs font-medium text-[#C9D1D9]">
                AI Orchestration Engine
              </label>
              <div className="p-3.5 rounded-[8px] bg-[#161B22] border border-[#21262D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-[6px] bg-[#0E1117] border border-[#30363D] text-[#00F2FE]">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#F0F6FC]">
                      Groq · Llama 3.3 70B Versatile
                    </div>
                    <div className="text-[11px] text-[#8B949E]">
                      Fast token generation with deterministic schema guardrails
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-[#6E7681]">
                  <span>128k Context</span>
                  <span>•</span>
                  <span>Temp 0.2</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. DANGER ZONE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
          <h2 className="text-sm font-semibold text-[#EF4444] uppercase tracking-wider font-mono">
            Danger Zone
          </h2>
        </div>

        <Card className="border-[#EF4444]/30 bg-[#EF4444]/5">
          <CardContent className="p-6 divide-y divide-[#EF4444]/20 space-y-4">
            {/* Archive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-0">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-[#F0F6FC]">Archive Project</div>
                <div className="text-[11px] text-[#8B949E]">
                  Freezes autonomous agent swarms and sets the workspace into read-only mode.
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleArchive}
                leftIcon={<Archive className="h-3.5 w-3.5 text-[#F59E0B]" />}
              >
                Archive Project
              </Button>
            </div>

            {/* Delete */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-[#EF4444]">Delete Project</div>
                <div className="text-[11px] text-[#8B949E]">
                  Permanently delete project repository, generated build plans, and preview artifacts.
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              >
                Delete Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
