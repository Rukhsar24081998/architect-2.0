"use client";

import React, { useState } from "react";
import { GithubIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  GitBranch,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  FolderTree,
  Cpu,
  RefreshCw,
} from "lucide-react";

export interface GitHubAnalysisResult {
  repoName: string;
  owner: string;
  framework: string;
  language: string;
  styling: string;
  runtime: string;
  packageManager: string;
  projectType: string;
  structure: string[];
  branch: string;
  confidence: number;
}

export interface GitHubImportStepProps {
  repoUrl: string;
  onRepoUrlChange: (url: string) => void;
  branch: string;
  onBranchChange: (branch: string) => void;
  analysis: GitHubAnalysisResult | null;
  onAnalysisComplete: (result: GitHubAnalysisResult) => void;
  onResetAnalysis: () => void;
  onImport: () => void;
  onBackToOptions: () => void;
  isCreating: boolean;
  createError: string | null;
}

const DEMO_REPOSITORIES = [
  "https://github.com/architect-ai/support-copilot",
  "https://github.com/vercel/next-saas-starter",
  "https://github.com/shadcn/taxonomy",
];

export function GitHubImportStep({
  repoUrl,
  onRepoUrlChange,
  branch,
  onBranchChange,
  analysis,
  onAnalysisComplete,
  onResetAnalysis,
  onImport,
  onBackToOptions,
  isCreating,
  createError,
}: GitHubImportStepProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  // Validate GitHub URL format
  const validateUrl = (url: string): { valid: boolean; owner?: string; repo?: string } => {
    const trimmed = url.trim();
    if (!trimmed) {
      return { valid: false };
    }
    // Match github.com/owner/repo with optional trailing slash or path
    const regex = /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/;
    const match = trimmed.match(regex);
    if (!match) {
      return { valid: false };
    }
    return { valid: true, owner: match[1], repo: match[2].replace(/\.git$/, "") };
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const { valid, owner, repo } = validateUrl(repoUrl);
    if (!valid || !owner || !repo) {
      setUrlError("Please enter a valid GitHub repository URL, e.g. https://github.com/owner/repo");
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress("Connecting to GitHub API...");

    // Simulated multi-stage analysis progression
    setTimeout(() => {
      setAnalysisProgress("Fetching repository tree & manifest...");
    }, 600);

    setTimeout(() => {
      setAnalysisProgress("Analyzing package.json & dependencies...");
    }, 1200);

    setTimeout(() => {
      setAnalysisProgress("Synthesizing architecture spec...");
    }, 1800);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisProgress("");

      // Derive simulated detection
      const cleanRepoName = repo
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const result: GitHubAnalysisResult = {
        repoName: cleanRepoName,
        owner,
        framework: "Next.js 15 (App Router)",
        language: "TypeScript 5.6",
        styling: "Tailwind CSS v4",
        runtime: "Node.js 20+",
        packageManager: "pnpm",
        projectType: "Next.js SaaS",
        structure: ["src/", "components/", "app/", "package.json", "README.md"],
        branch: branch.trim() || "main",
        confidence: 98,
      };

      onAnalysisComplete(result);
    }, 2400);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/25 text-[#A855F7] text-xs font-medium">
          <GithubIcon className="h-3.5 w-3.5" />
          <span>Simulated GitHub Import</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Import Existing Project
        </h2>
        <p className="text-sm text-[#8B949E] max-w-md mx-auto">
          Connect a GitHub repository. Architect will analyze the architecture,
          detect dependencies, and prepare the workspace.
        </p>
      </div>

      {/* STATE A: URL & Branch Input (Pre-Analysis) */}
      {!analysis && !analyzing && (
        <form onSubmit={handleStartAnalysis} className="space-y-4">
          <div className="rounded-xl border border-[#30363D] bg-[#0E1117] p-5 space-y-4 shadow-xl">
            {/* Repository URL Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="repo-url"
                className="block text-xs font-semibold uppercase tracking-wider text-[#8B949E]"
              >
                GitHub Repository URL <span className="text-[#A855F7]">*</span>
              </label>
              <div className="relative">
                <input
                  id="repo-url"
                  type="text"
                  value={repoUrl}
                  onChange={(e) => {
                    onRepoUrlChange(e.target.value);
                    if (urlError) setUrlError(null);
                  }}
                  placeholder="https://github.com/username/project"
                  className="w-full rounded-lg border border-[#30363D] bg-[#161B22] px-3.5 py-2.5 pl-9 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/50 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/40 focus:outline-none transition-colors font-mono"
                />
                <GithubIcon className="h-4 w-4 text-[#8B949E] absolute left-3 top-3" />
              </div>
            </div>

            {/* Branch Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="repo-branch"
                className="block text-xs font-semibold uppercase tracking-wider text-[#8B949E]"
              >
                Default Branch
              </label>
              <div className="relative max-w-xs">
                <input
                  id="repo-branch"
                  type="text"
                  value={branch}
                  onChange={(e) => onBranchChange(e.target.value)}
                  placeholder="main"
                  className="w-full rounded-lg border border-[#30363D] bg-[#161B22] px-3.5 py-2 pl-9 text-xs text-[#F0F6FC] placeholder:text-[#8B949E]/50 focus:border-[#A855F7] focus:outline-none font-mono"
                />
                <GitBranch className="h-3.5 w-3.5 text-[#8B949E] absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Error Message */}
            {urlError && (
              <div className="flex items-center gap-2 text-xs text-[#F85149] bg-[#F85149]/10 border border-[#F85149]/20 px-3 py-2 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{urlError}</span>
              </div>
            )}

            {/* Demo Starters */}
            <div className="pt-2 border-t border-[#21262D] space-y-2">
              <span className="text-[11px] font-medium text-[#8B949E] block">
                Or pick a sample repository:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_REPOSITORIES.map((demo) => (
                  <button
                    key={demo}
                    type="button"
                    onClick={() => {
                      onRepoUrlChange(demo);
                      setUrlError(null);
                    }}
                    className="px-2.5 py-1 rounded bg-[#161B22] border border-[#30363D] text-[11px] font-mono text-[#8B949E] hover:text-[#A855F7] hover:border-[#A855F7]/40 transition-colors"
                  >
                    {demo.replace("https://github.com/", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onBackToOptions}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Change Method</span>
            </Button>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="min-w-[180px] bg-[#A855F7] hover:bg-[#9333EA] text-white border-none shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <span>Analyze Repository</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </form>
      )}

      {/* STATE B: Analyzing State */}
      {analyzing && (
        <div className="rounded-xl border border-[#A855F7]/30 bg-[#0E1117] p-8 text-center space-y-5 shadow-2xl">
          <div className="relative mx-auto h-14 w-14 rounded-full bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Cpu className="h-7 w-7 text-[#A855F7] animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Analyzing Repository</h3>
            <p className="text-xs text-[#A855F7] font-mono animate-pulse">
              {analysisProgress}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto h-1.5 bg-[#21262D] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#A855F7] to-[#00F2FE] animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* STATE C: Analysis Result & Review */}
      {analysis && !analyzing && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#30363D] bg-[#0E1117] overflow-hidden shadow-2xl">
            {/* Analysis Header */}
            <div className="px-5 py-3.5 bg-[#161B22]/70 border-b border-[#30363D] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#3FB950]" />
                <span className="text-xs font-mono font-medium text-white uppercase tracking-wider">
                  Repository Analysis Complete
                </span>
              </div>
              <Badge variant="violet" size="sm" className="font-mono">
                {analysis.confidence}% Stack Confidence
              </Badge>
            </div>

            {/* Analysis Details */}
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {analysis.repoName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#8B949E] mt-0.5">
                    <span className="font-mono text-[#A855F7]">{repoUrl}</span>
                    <span>·</span>
                    <span className="font-mono flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      {analysis.branch}
                    </span>
                  </div>
                </div>
                <Badge variant="cyan" size="sm">
                  {analysis.projectType}
                </Badge>
              </div>

              {/* Detected Stack Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-[#21262D]">
                <div className="rounded-lg bg-[#161B22] p-2.5 border border-[#30363D]/60">
                  <span className="text-[10px] uppercase font-mono text-[#8B949E] block">
                    Framework
                  </span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {analysis.framework}
                  </span>
                </div>

                <div className="rounded-lg bg-[#161B22] p-2.5 border border-[#30363D]/60">
                  <span className="text-[10px] uppercase font-mono text-[#8B949E] block">
                    Language
                  </span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {analysis.language}
                  </span>
                </div>

                <div className="rounded-lg bg-[#161B22] p-2.5 border border-[#30363D]/60">
                  <span className="text-[10px] uppercase font-mono text-[#8B949E] block">
                    Styling
                  </span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {analysis.styling}
                  </span>
                </div>

                <div className="rounded-lg bg-[#161B22] p-2.5 border border-[#30363D]/60">
                  <span className="text-[10px] uppercase font-mono text-[#8B949E] block">
                    Runtime
                  </span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {analysis.runtime}
                  </span>
                </div>
              </div>

              {/* Detected Structure */}
              <div className="space-y-1.5 pt-2 border-t border-[#21262D]">
                <span className="text-[11px] font-mono uppercase text-[#8B949E] flex items-center gap-1.5">
                  <FolderTree className="h-3.5 w-3.5 text-[#A855F7]" />
                  Detected Structure
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {analysis.structure.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded bg-[#161B22] border border-[#30363D] text-[#C9D1D9] flex items-center gap-1 text-[11px]"
                    >
                      <FileCode2 className="h-3 w-3 text-[#8B949E]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Creation Error Banner */}
          {createError && (
            <div className="rounded-xl border border-[#F85149]/40 bg-[#F85149]/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#F85149]">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Couldn&apos;t create the project.</p>
                  <p className="text-xs text-[#F85149]/80">{createError}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onImport}
                disabled={isCreating}
                className="border-[#F85149]/50 text-[#F85149] hover:bg-[#F85149]/20 self-end sm:self-auto"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                <span>Try again</span>
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onResetAnalysis}
              disabled={isCreating}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back / Change URL</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onImport}
              disabled={isCreating}
              className="min-w-[180px] bg-[#A855F7] hover:bg-[#9333EA] text-white border-none shadow-[0_0_20px_rgba(168,85,247,0.35)]"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <GithubIcon className="h-4 w-4 mr-2" />
                  <span>Import Project</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
