"use client";

import React, { useState } from "react";
import { ProjectDetails } from "@/lib/types";
import { INITIAL_GIT_COMMITS } from "@/lib/developer/mock-git";
import {
  GitPullRequest,
  GitBranch,
  GitCommit,
  ExternalLink,
  CheckCircle2,
  Clock,
  Plus,
  Copy,
  Check,
  Shield,
  FolderGit2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

interface GitHubStudioProps {
  project: ProjectDetails;
}

export function GitHubStudio({ project }: GitHubStudioProps) {
  const { addToast } = useToast();
  const [copiedClone, setCopiedClone] = useState(false);
  const [activeBranch, setActiveBranch] = useState("main");

  const repoName =
    project.repositoryUrl?.replace("https://github.com/", "") ||
    `architect-cloud/${project.id.replace("prj_", "")}`;
  const cloneUrl = `https://github.com/${repoName}.git`;

  const handleCopyClone = () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(cloneUrl);
      }
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 2000);
      addToast({
        type: "success",
        title: "Clone URL Copied",
        message: `${cloneUrl} copied to clipboard.`,
      });
    } catch {
      // Fallback
    }
  };

  const handleViewRepo = () => {
    addToast({
      type: "info",
      title: "GitHub Navigation",
      message: `Simulating external redirect to github.com/${repoName}`,
    });
  };

  const handleCreateBranch = () => {
    setActiveBranch("feat/next-iteration");
    addToast({
      type: "success",
      title: "Branch Created",
      message: "Branch 'feat/next-iteration' branched from main.",
    });
  };

  const handleOpenPR = () => {
    addToast({
      type: "success",
      title: "Pull Request Created",
      message: "Draft PR #15 'feat: implement approved build plan' opened on GitHub.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#21262D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-[#161B22] border border-[#30363D] text-[#00F2FE]">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#F0F6FC] tracking-tight">GitHub</h1>
                <Badge variant="success" size="sm" dot>
                  Connected
                </Badge>
              </div>
              <p className="text-xs text-[#8B949E]">
                Repository synchronization, pull requests, and commit tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewRepo}
            leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
          >
            View Repository
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateBranch}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Create Branch
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenPR}
            leftIcon={<GitPullRequest className="h-3.5 w-3.5 text-[#00F2FE]" />}
          >
            Open Pull Request
          </Button>
        </div>
      </div>

      {/* Grid: Repository Overview & Active Pull Request */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Repository Card */}
        <div className="space-y-6">
          <Card className="border-[#30363D] bg-[#0E1117]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-[#58A6FF]" />
                  Repository
                </CardTitle>
                <Badge variant="cyan" size="sm">
                  Active
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Synchronized with upstream Git workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[#6E7681]">REPOSITORY</label>
                <div className="font-mono text-sm font-semibold text-[#F0F6FC] break-all">
                  {repoName}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[#6E7681]">DEFAULT BRANCH</label>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#161B22] border border-[#21262D] font-mono text-xs text-[#F0F6FC]">
                  <GitBranch className="h-3.5 w-3.5 text-[#A855F7]" />
                  <span>{activeBranch}</span>
                  <span className="text-[10px] text-[#6E7681] ml-auto">Protected</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[#6E7681]">CLONE HTTPS</label>
                <div className="flex items-center gap-1.5 p-1.5 rounded-[6px] bg-[#161B22] border border-[#21262D] font-mono text-[11px]">
                  <span className="truncate flex-1 text-[#8B949E] px-1 select-all">
                    {cloneUrl}
                  </span>
                  <button
                    onClick={handleCopyClone}
                    className="p-1 rounded text-[#8B949E] hover:text-white hover:bg-[#21262D] transition-colors"
                  >
                    {copiedClone ? (
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#21262D] space-y-2 text-[11px] text-[#8B949E]">
                <div className="flex items-center justify-between">
                  <span>Webhook Delivery</span>
                  <span className="text-[#10B981] font-mono font-medium">100% Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Branch Protection</span>
                  <span className="text-[#F0F6FC] font-mono">Enforced (Require 1 Review)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Code Scanning</span>
                  <span className="text-[#00F2FE] font-mono">GitHub Advanced Security</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Notice */}
          <div className="p-3.5 rounded-[8px] bg-[#161B22]/50 border border-[#21262D] space-y-1 text-xs text-[#8B949E]">
            <span className="font-semibold text-[#F0F6FC] flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#00F2FE]" />
              Developer Mode Sync
            </span>
            <p className="text-[11px] leading-relaxed">
              Use Developer Mode (⌘M) to stage local changes, write commit messages, and view line-by-line diffs.
            </p>
          </div>
        </div>

        {/* Right Column (2 cols): Pull Request & Commit History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Pull Request Card */}
          <Card className="border-[#30363D] bg-[#0E1117]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-[#10B981]" />
                  Active Pull Request
                </CardTitle>
                <Badge variant="success" size="sm">
                  Open #14
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Generated from the latest approved build plan iteration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 rounded-[8px] bg-[#161B22] border border-[#21262D] space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span className="text-sm font-semibold text-[#F0F6FC]">
                    feat: Implement approved build plan & internal assistant
                  </span>
                  <span className="text-[11px] font-mono text-[#6E7681]">Opened 25m ago</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#8B949E] flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-[#0E1117] border border-[#21262D] text-[#A855F7]">
                    architect/internal-assistant
                  </span>
                  <span>into</span>
                  <span className="px-2 py-0.5 rounded bg-[#0E1117] border border-[#21262D] text-[#58A6FF]">
                    main
                  </span>
                  <span className="text-[#30363D]">|</span>
                  <span className="text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    4 checks passed
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#21262D] text-[11px]">
                  <div>
                    <div className="text-[#6E7681]">Architect Linter</div>
                    <div className="text-[#10B981] font-mono font-medium">Passed (0 errors)</div>
                  </div>
                  <div>
                    <div className="text-[#6E7681]">TypeScript</div>
                    <div className="text-[#10B981] font-mono font-medium">Passed (v5.6.3)</div>
                  </div>
                  <div>
                    <div className="text-[#6E7681]">QA Test Suite</div>
                    <div className="text-[#10B981] font-mono font-medium">18 / 18 passed</div>
                  </div>
                  <div>
                    <div className="text-[#6E7681]">Diff Size</div>
                    <div className="text-[#58A6FF] font-mono font-medium">+240 / -18 lines</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Commits List */}
          <Card className="border-[#30363D] bg-[#0E1117]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-[#A855F7]" />
                  Recent Commits
                </CardTitle>
                <span className="text-xs font-mono text-[#6E7681]">
                  Branch: {activeBranch}
                </span>
              </div>
              <CardDescription className="text-xs">
                Deterministic commit history recorded by Architect agents and team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-[#21262D]">
                {INITIAL_GIT_COMMITS.map((commit) => (
                  <div
                    key={commit.id}
                    className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-[#F0F6FC]">
                          {commit.message}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#6E7681]">
                        <span className="text-[#8B949E]">{commit.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {commit.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-[#161B22] border border-[#21262D] font-mono text-[11px] text-[#00F2FE]">
                        {commit.sha}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#161B22] border border-[#21262D] font-mono text-[11px] text-[#8B949E]">
                        {commit.branch}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
