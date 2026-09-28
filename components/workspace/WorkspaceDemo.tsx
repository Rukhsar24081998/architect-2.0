"use client";

import React from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, Terminal, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";

export function WorkspaceDemo() {
  const { mode, currentProject, toggleMode } = useWorkspace();
  const { addToast } = useToast();

  const handleTestToast = () => {
    addToast({
      type: "success",
      title: "Design System Verified",
      message: "Tactile feedback, toast notifications, and dark tokens are operational.",
    });
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Workspace Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#30363D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentProject?.name || "Project Workspace"}
            </h1>
            <Badge variant="cyan" size="sm">
              Phase 2 Active
            </Badge>
          </div>
          <p className="text-xs text-[#8B949E] max-w-2xl">
            {currentProject?.description ||
              "Unified AI software development workspace. Toggle between Build Mode and Developer Mode anytime."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestToast}
            leftIcon={<ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />}
          >
            Test Toast
          </Button>
          <Button
            variant={mode === "build" ? "cyan" : "violet"}
            size="sm"
            onClick={toggleMode}
            leftIcon={
              mode === "build" ? (
                <Terminal className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )
            }
          >
            Switch to {mode === "build" ? "Developer Mode" : "Build Mode"}
          </Button>
        </div>
      </div>

      {/* Mode State Live Indicator Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Mode Card */}
        <Card className={mode === "build" ? "border-[#00F2FE]/40" : "border-[#A855F7]/40"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {mode === "build" ? (
                  <div className="h-8 w-8 rounded-[6px] bg-[#00F2FE]/10 border border-[#00F2FE]/20 flex items-center justify-center text-[#00F2FE]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-[6px] bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center text-[#A855F7]">
                    <Terminal className="h-4 w-4" />
                  </div>
                )}
                <div>
                  <CardTitle>
                    Current Mode: {mode === "build" ? "✨ Build Mode" : "⚡ Developer Mode"}
                  </CardTitle>
                  <CardDescription>
                    {mode === "build"
                      ? "Optimized for Founders, PMs, and visual iterations."
                      : "Optimized for Engineers with source code, terminal, and git."}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={mode === "build" ? "cyan" : "violet"}>
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-[6px] bg-[#161B22] border border-[#21262D] text-xs text-[#C9D1D9] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#8B949E]">State Persistence:</span>
                <span className="text-[#10B981]">localStorage + Context</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Hotkey:</span>
                <span className="text-[#58A6FF]">Cmd+M / Ctrl+M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Target Stage:</span>
                <span>{mode === "build" ? "Chat + Preview Canvas" : "File Tree + Editor + Terminal"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 1 Data Connection Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[6px] bg-[#161B22] border border-[#30363D] flex items-center justify-center text-[#F0F6FC]">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle>Phase 1 Foundation Data</CardTitle>
                  <CardDescription>
                    Connected to local filesystem persistence
                  </CardDescription>
                </div>
              </div>
              <StatusIndicator status={currentProject?.status || "ready"} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-[6px] bg-[#161B22] border border-[#21262D] text-xs text-[#C9D1D9] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Project ID:</span>
                <span className="text-[#F0F6FC]">{currentProject?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Template:</span>
                <span className="text-[#00F2FE]">{currentProject?.template}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Active Branch:</span>
                <span className="text-[#F59E0B]">{currentProject?.currentBranch || "main"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scope Verification Notice */}
      <div className="p-4 rounded-[8px] bg-[#161B22] border border-[#30363D] flex items-start gap-3 text-xs text-[#8B949E]">
        <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-[#F0F6FC]">
            Phase 2 Scope Boundary Notice
          </p>
          <p>
            The design tokens, dark surfaces, tactile mode switch, and collapsible shell are established.
            Subsequent missions will populate the inner panels with the full conversational engine (Phase 6),
            live preview container (Phase 9), and multi-pane developer editor (Phase 10).
          </p>
        </div>
      </div>
    </div>
  );
}
