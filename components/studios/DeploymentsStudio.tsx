"use client";

import React, { useState } from "react";
import { ProjectDetails } from "@/lib/types";
import {
  Rocket,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCcw,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

interface DeploymentsStudioProps {
  project: ProjectDetails;
}

interface DeploymentRecord {
  id: string;
  version: string;
  commitSha: string;
  commitMessage: string;
  deployedAt: string;
  author: string;
  status: "live" | "succeeded" | "rolled_back";
  duration: string;
}

export function DeploymentsStudio({ project }: DeploymentsStudioProps) {
  const { addToast } = useToast();

  const [activeVersion, setActiveVersion] = useState("v1.2.0");

  const liveUrl = `https://${project.id.replace("prj_", "")}.architect.app`;

  const [history, setHistory] = useState<DeploymentRecord[]>([
    {
      id: "dep_01",
      version: "v1.2.0",
      commitSha: "c9f28a1",
      commitMessage: "feat: Internal Assistant Chatbot & Session Boundary",
      deployedAt: "12 mins ago",
      author: "Architect Swarm",
      status: "live",
      duration: "18s",
    },
    {
      id: "dep_02",
      version: "v1.1.0",
      commitSha: "b7e4110",
      commitMessage: "feat: Add Supabase Authentication & Session Boundary",
      deployedAt: "2 hours ago",
      author: "Sarah Chen",
      status: "succeeded",
      duration: "24s",
    },
    {
      id: "dep_03",
      version: "v1.0.0",
      commitSha: "8f4a21e",
      commitMessage: "chore: initial project scaffold and dashboard",
      deployedAt: "1 day ago",
      author: "Alex Rivera",
      status: "succeeded",
      duration: "31s",
    },
  ]);

  const handleRollback = (record: DeploymentRecord) => {
    setActiveVersion(record.version);
    setHistory((prev) =>
      prev.map((item) => {
        if (item.id === record.id) {
          return { ...item, status: "live" };
        }
        if (item.status === "live") {
          return { ...item, status: "succeeded" };
        }
        return item;
      })
    );

    addToast({
      type: "success",
      title: "Rollback Initiated",
      message: `Production restored to ${record.version} (${record.commitSha}).`,
    });
  };

  const handleOpenLive = () => {
    addToast({
      type: "info",
      title: "Production Endpoint",
      message: `Simulated production domain: ${liveUrl}`,
    });
  };

  const pipelineSteps = [
    { name: "Build", status: "passed", meta: "1.4s" },
    { name: "Tests", status: "passed", meta: "18/18 ok" },
    { name: "Environment", status: "passed", meta: "5 secrets" },
    { name: "Deploy", status: "passed", meta: "Edge CDN" },
    { name: "Live", status: "active", meta: "100% Traffic" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#21262D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-[#161B22] border border-[#30363D] text-[#00F2FE]">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#F0F6FC] tracking-tight">Deployments</h1>
                <Badge variant="success" size="sm" dot>
                  Production Live
                </Badge>
              </div>
              <p className="text-xs text-[#8B949E]">
                Ship, inspect, and manage production releases.
              </p>
            </div>
          </div>
        </div>

        {/* Global Edge Status */}
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-[6px] bg-[#161B22] border border-[#30363D] text-[#8B949E]">
          <Globe className="h-4 w-4 text-[#00F2FE]" />
          <span>Global Edge CDN</span>
          <span className="text-[#30363D]">|</span>
          <span className="text-[#10B981] font-semibold">48ms Latency</span>
        </div>
      </div>

      {/* Top Production Status Card */}
      <Card className="border-[#30363D] bg-[#0E1117]">
        <CardContent className="p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#F0F6FC]">Production Environment</span>
                <Badge variant="cyan" size="sm">
                  {activeVersion}
                </Badge>
                <Badge variant="success" size="sm" dot>
                  Live
                </Badge>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-[#58A6FF]">
                <Globe className="h-3.5 w-3.5 text-[#6E7681]" />
                <span className="hover:underline cursor-pointer select-all" onClick={handleOpenLive}>
                  {liveUrl}
                </span>
                <button
                  onClick={handleOpenLive}
                  className="text-[#8B949E] hover:text-[#F0F6FC]"
                >
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#8B949E]">
              <div>
                <div className="text-[10px] uppercase text-[#6E7681]">LAST DEPLOYED</div>
                <div className="text-[#F0F6FC]">12 mins ago</div>
              </div>
              <div className="h-6 w-px bg-[#21262D]" />
              <div>
                <div className="text-[10px] uppercase text-[#6E7681]">UPTIME</div>
                <div className="text-[#10B981]">99.98%</div>
              </div>
              <div className="h-6 w-px bg-[#21262D]" />
              <div>
                <div className="text-[10px] uppercase text-[#6E7681]">REGIONS</div>
                <div className="text-[#F0F6FC]">32 Edge Locations</div>
              </div>
            </div>
          </div>

          {/* Release Pipeline Stepper */}
          <div className="pt-4 border-t border-[#21262D]">
            <div className="text-xs font-mono text-[#6E7681] uppercase tracking-wider mb-3">
              Release Pipeline Lifecycle
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {pipelineSteps.map((step) => (
                <div
                  key={step.name}
                  className="p-3 rounded-[6px] bg-[#161B22] border border-[#21262D] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#F0F6FC]">{step.name}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                  </div>
                  <div className="text-[11px] font-mono text-[#8B949E]">{step.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment History Table */}
      <Card className="border-[#30363D] bg-[#0E1117]">
        <CardHeader className="py-3 px-5 border-b border-[#21262D]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#A855F7]" />
              Deployment History
            </CardTitle>
            <span className="text-xs font-mono text-[#6E7681]">
              {history.length} Recorded Releases
            </span>
          </div>
          <CardDescription className="text-xs">
            Previous immutable build artifacts ready for instant rollback.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-[#21262D]">
            {history.map((record) => {
              const isLive = record.status === "live";

              return (
                <div
                  key={record.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[#F0F6FC]">
                        {record.version}
                      </span>
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#161B22] border border-[#21262D] text-[#00F2FE]">
                        {record.commitSha}
                      </span>
                      <Badge
                        variant={isLive ? "success" : "secondary"}
                        size="sm"
                        dot={isLive}
                      >
                        {isLive ? "Active Live" : "Succeeded"}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#C9D1D9] font-mono">
                      {record.commitMessage}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-[#6E7681]">
                      <span>Deployed by {record.author}</span>
                      <span>•</span>
                      <span>{record.deployedAt}</span>
                      <span>•</span>
                      <span>Duration: {record.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isLive ? (
                      <Badge variant="cyan" size="sm">
                        Current Production
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRollback(record)}
                        leftIcon={<RotateCcw className="h-3 w-3 text-[#F59E0B]" />}
                      >
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
