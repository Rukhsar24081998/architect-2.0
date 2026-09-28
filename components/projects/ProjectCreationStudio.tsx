"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DEMO_PERSONAS } from "@/lib/auth";
import { apiClient } from "@/lib/api-client";
import { ProjectTemplate, ProjectOrigin } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { GithubIcon } from "@/components/ui/Icons";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownDivider,
} from "@/components/ui/Dropdown";

import { CreationStepper } from "./CreationStepper";
import { IdeaStep } from "./IdeaStep";
import { ConfigureStep, StackConfig } from "./ConfigureStep";
import { ReviewStep } from "./ReviewStep";
import { GitHubImportStep, GitHubAnalysisResult } from "./GitHubImportStep";
import { InitializingStep } from "./InitializingStep";

import {
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  User,
  Check,
  LogOut,
  FolderGit2,
  AlertCircle,
} from "lucide-react";

/**
 * Intelligent helper to extract a clean project title from a prompt
 */
export function extractProjectNameFromIdea(prompt: string): string {
  if (!prompt || !prompt.trim()) return "My AI Project";

  const raw = prompt.trim();
  const lower = raw.toLowerCase();

  // 1. Direct high-fidelity patterns specified by requirements
  if (/\b(chatbot|chat\s+bot|conversational\s+ai|dialogue\s+bot)\b/i.test(lower)) {
    return "Chatbot AI";
  }

  if (/\b(food\s+delivery|restaurant\s+delivery|food\s+ordering)\b/i.test(lower)) {
    return "Food Delivery App";
  }

  if (
    /\b(analytics\s+dashboard|sales\s+dashboard|sales\s+analytics)\b/i.test(lower) ||
    (/\banalytics\b/i.test(lower) && /\bsales\b/i.test(lower))
  ) {
    return "Sales Analytics Dashboard";
  }

  if (/\b(habit\s+tracking|habit\s+tracker|habit\s+app)\b/i.test(lower)) {
    return "Habit Tracker";
  }

  if (/\b(customer\s+support|helpdesk|support\s+desk|ticket\s+system)\b/i.test(lower)) {
    return "SupportDesk AI";
  }

  if (/\b(e-?commerce|online\s+store|marketplace)\b/i.test(lower)) {
    return "E-Commerce Platform";
  }

  // 2. Intelligent Prefix Normalization
  let cleaned = raw
    .replace(
      /^(i\s+want\s+to|i\s+would\s+like\s+to|we\s+need\s+to|can\s+you|please|help\s+me|i'm\s+trying\s+to|i\s+plan\s+to)\s+/i,
      ""
    )
    .replace(
      /^(build|create|make|design|develop|construct|generate|implement|set\s+up)\s+/i,
      ""
    )
    .replace(/^(an?|the|some)\s+/i, "")
    .trim();

  const forSalesTeam = /\bfor\s+(my|our)?\s*sales\s+team\b/i.test(cleaned);
  cleaned = cleaned
    .replace(/\s+(that|which|with|using|in)\s+.*$/i, "")
    .replace(/\s+for\s+(my|our|a|the)\s+.*$/i, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean).slice(0, 3);
  if (words.length === 0) return "New Project";

  let title = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  if (forSalesTeam && !/sales/i.test(title)) {
    title = `Sales ${title}`;
  }

  if (/ai|copilot|assistant|llm/i.test(lower) && !/ai/i.test(title)) {
    title = `${title} AI`;
  }

  return title.length > 28 ? title.slice(0, 28) : title;
}

export function ProjectCreationStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, activePersona, switchPersona, logout } = useAuth();

  // Mode state: default is "idea" for immediate prompt-first experience
  const [method, setMethod] = useState<ProjectOrigin>(() => {
    const tab = searchParams.get("tab");
    return tab === "import" || tab === "github" ? "github" : "idea";
  });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);
  const [showManualConfig, setShowManualConfig] = useState<boolean>(false);

  // Idea Flow State
  const [idea, setIdea] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [template, setTemplate] = useState<ProjectTemplate>("nextjs-saas");
  const [stack, setStack] = useState<StackConfig>({
    frontend: "Next.js",
    backend: "Node.js",
    database: "Supabase",
  });

  // GitHub Flow State
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [branch, setBranch] = useState<string>("main");
  const [githubAnalysis, setGithubAnalysis] = useState<GitHubAnalysisResult | null>(null);

  // Persistence & Initialization State
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  // Stepper navigation handler
  const handleStepClick = (targetStep: number) => {
    if (targetStep < currentStep && currentStep < 4) {
      setCurrentStep(targetStep);
    }
  };

  // Switch between persona
  const handleSwitchPersona = (personaId: string) => {
    switchPersona(personaId);
  };

  // Sign out
  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  // Prompt-first creation: creates project immediately and enters Architect conversation
  const handleIdeaContinue = async () => {
    if (isCreating) return;
    setIsCreating(true);
    setCreateError(null);

    const cleanIdea = idea.trim();
    const finalName =
      projectName.trim() && projectName !== "My AI Project"
        ? projectName.trim()
        : extractProjectNameFromIdea(cleanIdea);

    try {
      const created = await apiClient.createProject({
        name: finalName,
        description: cleanIdea || "An AI-crafted application workspace",
        template: template,
        status: "ready",
        currentBranch: "main",
        origin: "idea",
        stack: stack,
        files: [
          {
            id: `file_${Date.now()}_readme`,
            projectId: "",
            path: "README.md",
            language: "markdown",
            version: 1,
            updatedAt: new Date().toISOString(),
            content: `# ${finalName}\n\n${cleanIdea}\n\nGenerated with Architect 2.0.`,
          },
          {
            id: `file_${Date.now()}_app`,
            projectId: "",
            path: "src/app/page.tsx",
            language: "tsx",
            version: 1,
            updatedAt: new Date().toISOString(),
            content: `export default function Page() {\n  return (\n    <main className="min-h-screen p-8 bg-slate-950 text-white">\n      <h1 className="text-3xl font-bold">${finalName}</h1>\n      <p className="mt-2 text-slate-400">${cleanIdea}</p>\n    </main>\n  );\n}`,
          },
        ],
        messages: [
          {
            id: `msg_${Date.now()}_init`,
            projectId: "",
            sender: "user",
            role: "user",
            content: cleanIdea,
            status: "completed",
            createdAt: new Date().toISOString(),
          },
        ],
      });


      // Navigate directly into Architect conversation with the user's prompt
      router.push(`/projects/${created.id}?initialPrompt=${encodeURIComponent(cleanIdea)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create project workspace";
      setCreateError(message);
      setIsCreating(false);
    }
  };

  // Transition from Step 2 (Configure) to Step 3 (Review)
  const handleConfigureContinue = () => {
    setCurrentStep(3);
    setMaxReachedStep((prev) => Math.max(prev, 3));
  };

  // Project Creation from Idea
  const handleCreateFromIdea = async () => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const created = await apiClient.createProject({
        name: projectName.trim(),
        description: idea.trim() || "An AI-crafted application workspace",
        template: template,
        status: "ready",
        currentBranch: "main",
        origin: "idea",
        stack: stack,
        files: [
          {
            id: `file_${Date.now()}_readme`,
            projectId: "",
            path: "README.md",
            language: "markdown",
            version: 1,
            updatedAt: new Date().toISOString(),
            content: `# ${projectName.trim()}\n\n${idea.trim()}\n\nGenerated with Architect 2.0.`,
          },
          {
            id: `file_${Date.now()}_app`,
            projectId: "",
            path: "src/app/page.tsx",
            language: "tsx",
            version: 1,
            updatedAt: new Date().toISOString(),
            content: `export default function Page() {\n  return (\n    <main className="min-h-screen p-8 bg-slate-950 text-white">\n      <h1 className="text-3xl font-bold">${projectName.trim()}</h1>\n      <p className="mt-2 text-slate-400">${idea.trim()}</p>\n    </main>\n  );\n}`,
          },
        ],
      });

      setCreatedProjectId(created.id);
      setCurrentStep(4);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create project workspace";
      setCreateError(message);
    } finally {
      setIsCreating(false);
    }
  };

  // GitHub Analysis Complete
  const handleGithubAnalysisComplete = (result: GitHubAnalysisResult) => {
    setGithubAnalysis(result);
    setProjectName(result.repoName);
    setCurrentStep(2); // In GitHub flow, analysis review is step 2/3
  };

  // Reset GitHub Analysis
  const handleResetGithubAnalysis = () => {
    setGithubAnalysis(null);
    setCurrentStep(1);
  };

  // Project Creation from GitHub Import
  const handleCreateFromGithub = async () => {
    if (!githubAnalysis) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const created = await apiClient.createProject({
        name: githubAnalysis.repoName,
        description: `Imported from GitHub repository (${githubAnalysis.owner}/${githubAnalysis.repoName})`,
        template: "nextjs-saas",
        status: "ready",
        currentBranch: githubAnalysis.branch || "main",
        origin: "github",
        repositoryUrl: repoUrl.trim(),
        stack: {
          frontend: githubAnalysis.framework,
          backend: githubAnalysis.runtime,
          framework: githubAnalysis.framework,
          language: githubAnalysis.language,
          packageManager: githubAnalysis.packageManager,
        },
        files: [
          {
            id: `file_${Date.now()}_pkg`,
            projectId: "",
            path: "package.json",
            language: "json",
            version: 1,
            updatedAt: new Date().toISOString(),
            content: JSON.stringify(
              {
                name: githubAnalysis.repoName.toLowerCase().replace(/\s+/g, "-"),
                version: "0.1.0",
                private: true,
                dependencies: {
                  next: "15.0.0",
                  react: "19.0.0",
                  "react-dom": "19.0.0",
                },
              },
              null,
              2
            ),
          },
          {
            id: `file_${Date.now()}_readme`,
            projectId: "",
            path: "README.md",
            language: "markdown",
            version: 1,
            updatedAt: new Date().toISOString(),
            content: `# ${githubAnalysis.repoName}\n\nImported from ${repoUrl.trim()} into Architect 2.0.`,
          },
          {
            id: `file_${Date.now()}_app`,
            projectId: "",
            path: "src/app/page.tsx",
            language: "tsx",
            version: 1,
            updatedAt: new Date().toISOString(),
            content: `export default function Page() {\n  return (\n    <main className="p-8">\n      <h1 className="text-3xl font-bold">${githubAnalysis.repoName}</h1>\n      <p className="text-muted">Imported repository running in Architect 2.0</p>\n    </main>\n  );\n}`,
          },
        ],
      });

      setCreatedProjectId(created.id);
      setCurrentStep(4);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to import GitHub project";
      setCreateError(message);
    } finally {
      setIsCreating(false);
    }
  };

  // When Initialization completes
  const handleInitializationComplete = () => {
    if (createdProjectId) {
      router.push(`/projects/${createdProjectId}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090A0F] text-[#F0F6FC] flex flex-col">
      {/* Studio Header Bar */}
      <header className="h-14 w-full border-b border-[#30363D] bg-[#0E1117] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90 shrink-0"
          >
            <div className="h-7 w-7 rounded-[6px] bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#A855F7] p-0.5 flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.3)]">
              <div className="h-full w-full bg-[#090A0F] rounded-[5px] flex items-center justify-center">
                <Layers className="h-4 w-4 text-[#00F2FE]" />
              </div>
            </div>
            <span className="font-bold text-sm tracking-tight text-white hidden sm:inline-block">
              ARCHITECT <span className="text-[#00F2FE] font-mono text-xs">2.0</span>
            </span>
          </Link>

          <div className="h-4 w-[1px] bg-[#30363D] hidden sm:block" />

          <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[#00F2FE] text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            <span>Prompt-First Studio</span>
          </div>
        </div>

        {/* Right Header Navigation & User Persona */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-xs text-[#8B949E] hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>

          <div className="h-4 w-[1px] bg-[#30363D]" />

          {/* User Profile Dropdown */}
          <Dropdown>
            <DropdownTrigger>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[#21262D] cursor-pointer transition-colors">
                <Avatar
                  name={user?.name || "User"}
                  size="sm"
                  src={user?.avatar}
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-medium text-[#F0F6FC] leading-none truncate max-w-[90px]">
                    {user?.name || "User"}
                  </span>
                  <span className="text-[10px] text-[#8B949E] capitalize leading-tight">
                    {user?.role || "founder"}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-[#8B949E]" />
              </div>
            </DropdownTrigger>
            <DropdownContent align="right" className="w-64">
              <div className="px-3 py-2 border-b border-[#30363D]/60 mb-1">
                <p className="text-xs font-semibold text-white">{user?.name || "Demo User"}</p>
                <p className="text-[11px] text-[#8B949E] truncate">{user?.email || "demo@architect.ai"}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge
                    variant={user?.role === "engineer" ? "violet" : "cyan"}
                    size="sm"
                  >
                    {activePersona?.title || user?.role}
                  </Badge>
                </div>
              </div>

              <DropdownItem onClick={() => router.push("/dashboard")}>
                <FolderGit2 className="h-3.5 w-3.5 text-[#8B949E]" />
                <span>Projects Dashboard</span>
              </DropdownItem>

              <DropdownDivider />

              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#6E7681]">
                Switch Persona
              </div>

              {DEMO_PERSONAS.map((persona) => {
                const isCurrent = user?.id === persona.id;
                return (
                  <DropdownItem
                    key={persona.id}
                    onClick={() => handleSwitchPersona(persona.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <User
                        className={`h-3.5 w-3.5 ${
                          persona.role === "engineer"
                            ? "text-[#A855F7]"
                            : "text-[#00F2FE]"
                        }`}
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-medium text-white">
                          {persona.name}
                        </span>
                        <span className="text-[10px] text-[#8B949E]">
                          {persona.role === "engineer" ? "Engineer (Dev Mode)" : "Founder/PM (Build Mode)"}
                        </span>
                      </div>
                    </div>
                    {isCurrent && <Check className="h-3.5 w-3.5 text-[#10B981]" />}
                  </DropdownItem>
                );
              })}

              <DropdownDivider />

              <DropdownItem destructive onClick={handleSignOut}>
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-start">
        {/* ========================================================================= */}
        {/* 1. ENTRY SCREEN: Two Clear Choices                                        */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* 1. PROMPT-FIRST IDEA FLOW (Primary AI-led Creation)                       */}
        {/* ========================================================================= */}
        {method === "idea" && (
          <div className="w-full max-w-3xl mx-auto space-y-8">
            {createError && (
              <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-xs text-[#F85149] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <IdeaStep
              idea={idea}
              onChange={setIdea}
              onContinue={handleIdeaContinue}
              isLoading={isCreating}
            />

            {/* Secondary actions: GitHub import and optional manual stack configuration */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#21262D]/60 max-w-2xl mx-auto w-full text-xs text-[#8B949E]">
              <button
                type="button"
                onClick={() => {
                  setMethod("github");
                  setCurrentStep(1);
                }}
                className="inline-flex items-center gap-1.5 hover:text-[#00F2FE] transition-colors cursor-pointer"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>Import GitHub repository</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => setShowManualConfig(!showManualConfig)}
                className="hover:text-white transition-colors cursor-pointer text-[11px]"
              >
                {showManualConfig ? "Hide technical stack" : "Advanced: Configure stack manually"}
              </button>
            </div>

            {/* Optional manual configuration panel (keeps underlying wizard capability accessible) */}
            {showManualConfig && (
              <div className="pt-6 mt-4 space-y-6 border-t border-[#21262D] max-w-2xl mx-auto w-full">
                <CreationStepper
                  mode="idea"
                  currentStep={currentStep}
                  onStepClick={handleStepClick}
                  maxReachedStep={maxReachedStep}
                />

                {currentStep === 2 && (
                  <ConfigureStep
                    projectName={projectName}
                    onProjectNameChange={setProjectName}
                    template={template}
                    onTemplateChange={setTemplate}
                    stack={stack}
                    onStackChange={setStack}
                    onBack={() => setCurrentStep(1)}
                    onContinue={handleConfigureContinue}
                  />
                )}

                {currentStep === 3 && (
                  <ReviewStep
                    projectName={projectName}
                    description={idea}
                    template={template}
                    stack={stack}
                    origin="idea"
                    branch="main"
                    isCreating={isCreating}
                    createError={createError}
                    onBack={() => setCurrentStep(2)}
                    onCreate={handleCreateFromIdea}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. GITHUB IMPORT FLOW                                                     */}
        {/* ========================================================================= */}
        {method === "github" && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#21262D] pb-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMethod("idea");
                  setCurrentStep(1);
                }}
                className="flex items-center gap-1.5 text-[#8B949E] hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>← Back to &quot;Tell Architect what to build&quot;</span>
              </button>

              <Badge variant="violet" size="sm">
                GitHub Import
              </Badge>
            </div>

            {/* ===================================================================== */}
            {/* PATH B: GITHUB IMPORT STEPS                                           */}
            {/* ===================================================================== */}
            {method === "github" && (
              <>
                {/* Step 1, 2, 3: Repo URL, Analysis & Review */}
                {currentStep < 4 && (
                  <GitHubImportStep
                    repoUrl={repoUrl}
                    onRepoUrlChange={setRepoUrl}
                    branch={branch}
                    onBranchChange={setBranch}
                    analysis={githubAnalysis}
                    onAnalysisComplete={handleGithubAnalysisComplete}
                    onResetAnalysis={handleResetGithubAnalysis}
                    onImport={handleCreateFromGithub}
                    onBackToOptions={() => {
                      setMethod("idea");
                      setCurrentStep(1);
                    }}
                    isCreating={isCreating}
                    createError={createError}
                  />
                )}

                {/* Step 4: Initializing Sequence */}
                {currentStep === 4 && (
                  <InitializingStep
                    projectName={projectName || "Imported Project"}
                    origin="github"
                    onComplete={handleInitializationComplete}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
