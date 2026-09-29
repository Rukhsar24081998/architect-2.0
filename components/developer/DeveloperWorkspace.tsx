"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ProjectDetails, BuildPlan } from "@/lib/types";
import { AgentRun } from "@/lib/agents/types";
import {
  VirtualFile,
  VirtualDirectory,
  EditorTab,
  GitCommit,
  EnvironmentVariable,
  TerminalEntry,
  DeveloperSideTab,
} from "@/lib/developer/types";
import {
  INITIAL_FILES_RECORD,
  buildVirtualFileTree,
} from "@/lib/developer/mock-files";
import {
  INITIAL_GIT_COMMITS,
  INITIAL_ENV_VARIABLES,
} from "@/lib/developer/mock-git";
import { INITIAL_TERMINAL_ENTRIES } from "@/lib/developer/mock-terminal";
import { DeveloperHeader } from "./DeveloperHeader";
import { EditorTabs } from "./EditorTabs";
import { CodeEditor } from "./CodeEditor";
import { FileExplorer } from "./FileExplorer";
import { GitPanel } from "./GitPanel";
import { EnvironmentPanel } from "./EnvironmentPanel";
import { DeveloperContextPanel } from "./DeveloperContextPanel";
import { DeveloperTerminal } from "./DeveloperTerminal";
import { DiffViewer } from "./DiffViewer";
import { DeveloperEmptyState } from "./DeveloperEmptyState";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  Files,
  GitBranch,
  KeyRound,
  Search,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

interface DeveloperWorkspaceProps {
  project: ProjectDetails;
  initialPlans?: BuildPlan[];
  initialRuns?: AgentRun[];
}

export function DeveloperWorkspace({
  project,
  initialPlans = [],
}: DeveloperWorkspaceProps) {
  const { addToast } = useToast();

  // In-memory files state
  const [files, setFiles] = useState<Record<string, VirtualFile>>(
    INITIAL_FILES_RECORD
  );

  // Active side-bar tab and open state
  const [activeSideTab, setActiveSideTab] =
    useState<DeveloperSideTab>("files");
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false);

  // Automatically collapse Architect Context on narrower screens (< 1280px)
  // while keeping it open in 3-column layout on wide desktop (>= 1280px)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 1280px)");
    const updatePanelState = (matches: boolean) => {
      setIsContextPanelOpen(matches);
    };
    updatePanelState(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      updatePanelState(e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Active file & open editor tabs
  const [activeFileId, setActiveFileId] = useState<string | null>(
    "src/app/page.tsx"
  );
  const [openTabIds, setOpenTabIds] = useState<string[]>([
    "src/app/page.tsx",
    "src/components/dashboard/TicketList.tsx",
    "src/lib/tickets.ts",
  ]);

  // Diff mode toggle
  const [isDiffActive, setIsDiffActive] = useState(false);

  // Git state
  const [commits, setCommits] = useState<GitCommit[]>(INITIAL_GIT_COMMITS);
  const [currentBranch] = useState("main");

  // Environment variables
  const [envVars, setEnvVars] =
    useState<EnvironmentVariable[]>(INITIAL_ENV_VARIABLES);

  // Terminal entries
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>(
    INITIAL_TERMINAL_ENTRIES
  );

  // Derived: active file object
  const activeFile = useMemo(() => {
    if (!activeFileId) return null;
    return files[activeFileId] || null;
  }, [activeFileId, files]);

  // Derived: virtual file tree
  const fileTree: VirtualDirectory = useMemo(() => {
    return buildVirtualFileTree(files);
  }, [files]);

  // Derived: open editor tabs
  const editorTabs: EditorTab[] = useMemo(() => {
    return openTabIds
      .map((path) => {
        const file = files[path];
        if (!file) return null;
        return {
          fileId: file.path,
          filePath: file.path,
          fileName: file.name,
          isModified: file.isModified,
          language: file.language,
        };
      })
      .filter(Boolean) as EditorTab[];
  }, [openTabIds, files]);

  // Derived: list of modified files
  const modifiedFiles = useMemo(() => {
    return Object.values(files).filter((f) => f.isModified);
  }, [files]);

  const hasUnsavedChanges = modifiedFiles.length > 0;

  // File Selection
  const handleSelectFile = useCallback((fileIdOrPath: string) => {
    // Lookup by path or id
    const matchedPath = Object.keys(files).find(
      (path) => path === fileIdOrPath || files[path].id === fileIdOrPath
    );

    if (matchedPath) {
      setActiveFileId(matchedPath);
      setOpenTabIds((prev) =>
        prev.includes(matchedPath) ? prev : [...prev, matchedPath]
      );
    }
  }, [files]);

  // Close Tab
  const handleCloseTab = useCallback(
    (fileIdOrPath: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenTabIds((prev) => {
        const next = prev.filter((p) => p !== fileIdOrPath);
        if (activeFileId === fileIdOrPath) {
          const nextActive = next.length > 0 ? next[next.length - 1] : null;
          setActiveFileId(nextActive);
        }
        return next;
      });
    },
    [activeFileId]
  );

  // Code modification
  const handleContentChange = useCallback(
    (fileIdOrPath: string, newContent: string) => {
      setFiles((prev) => {
        const target = prev[fileIdOrPath];
        if (!target) return prev;

        const isModified = newContent !== target.originalContent;
        return {
          ...prev,
          [fileIdOrPath]: {
            ...target,
            content: newContent,
            isModified,
          },
        };
      });
    },
    []
  );

  // Save changes
  const handleSave = useCallback(() => {
    if (!activeFile) return;

    setFiles((prev) => {
      const target = prev[activeFile.path];
      if (!target) return prev;
      return {
        ...prev,
        [activeFile.path]: {
          ...target,
          originalContent: target.content,
          isModified: false,
        },
      };
    });

    addToast({
      type: "success",
      title: "File Saved",
      message: `${activeFile.name} changes saved to project memory.`,
    });
  }, [activeFile, addToast]);

  // Revert single file changes
  const handleRevertFile = useCallback((fileIdOrPath: string) => {
    setFiles((prev) => {
      const target = prev[fileIdOrPath];
      if (!target) return prev;
      return {
        ...prev,
        [fileIdOrPath]: {
          ...target,
          content: target.originalContent,
          isModified: false,
        },
      };
    });

    addToast({
      type: "info",
      title: "Changes Discarded",
      message: `Reverted ${fileIdOrPath} to committed state.`,
    });
  }, [addToast]);

  // Commit changes
  const handleCommit = useCallback(
    (message: string) => {
      if (modifiedFiles.length === 0) return;

      const newSha = `d${(commits.length + 1).toString().padStart(2, "0")}f9e1`;
      const newCommit: GitCommit = {
        id: `cmt_${commits.length + 1}`,
        sha: newSha,
        message,
        author: "You (Developer Mode)",
        timestamp: "Just now",
        branch: currentBranch,
      };

      setCommits((prev) => [newCommit, ...prev]);

      // Clear modified flags
      setFiles((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (next[key].isModified) {
            next[key] = {
              ...next[key],
              originalContent: next[key].content,
              isModified: false,
            };
          }
        });
        return next;
      });

      setIsDiffActive(false);

      addToast({
        type: "success",
        title: "Committed Successfully",
        message: `[${newSha}] ${message}`,
      });
    },
    [modifiedFiles, commits, currentBranch, addToast]
  );

  // Environment variables mutations
  const handleAddEnvVar = useCallback(
    (newVar: Omit<EnvironmentVariable, "id">) => {
      const item: EnvironmentVariable = {
        id: `env_${envVars.length + 1}`,
        ...newVar,
      };
      setEnvVars((prev) => [...prev, item]);
    },
    [envVars.length]
  );

  const handleDeleteEnvVar = useCallback((id: string) => {
    setEnvVars((prev) => prev.filter((v) => v.id !== id));
  }, []);

  // Terminal commands
  const handleAddTerminalEntries = useCallback((entries: TerminalEntry[]) => {
    setTerminalEntries((prev) => [...prev, ...entries]);
  }, []);

  const handleClearTerminal = useCallback(() => {
    setTerminalEntries([
      {
        id: "cleared_init",
        type: "info",
        content: `Terminal cleared. Project: ${project.name} (branch: ${currentBranch})`,
      },
    ]);
  }, [project.name, currentBranch]);

  // Dock item click handler
  const handleDockItemClick = (tab: DeveloperSideTab) => {
    if (activeSideTab === tab && isSidePanelOpen) {
      setIsSidePanelOpen(false);
    } else {
      setActiveSideTab(tab);
      setIsSidePanelOpen(true);
    }
  };

  const currentPlan = initialPlans.length > 0 ? initialPlans[0] : null;

  return (
    <div className="h-full w-full flex flex-col bg-[#090A0F] text-[#F0F6FC] overflow-hidden select-none">
      {/* 1. TOP DEVELOPER HEADER */}
      <DeveloperHeader
        project={project}
        currentBranch={currentBranch}
        hasUnsavedChanges={hasUnsavedChanges}
        modifiedCount={modifiedFiles.length}
        isDiffActive={isDiffActive}
        onToggleDiff={() => setIsDiffActive((prev) => !prev)}
        onOpenGitPanel={() => {
          setActiveSideTab("git");
          setIsSidePanelOpen(true);
        }}
        onSave={handleSave}
      />

      {/* 2. MAIN WORKSPACE ROW */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* FAR-LEFT ACTIVITY BAR / DOCK STRIP */}
        <div className="w-11 border-r border-[#21262D] bg-[#0E1117] flex flex-col items-center py-2 space-y-2 select-none shrink-0 z-20">
          {/* Files */}
          <button
            type="button"
            onClick={() => handleDockItemClick("files")}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-colors relative",
              isSidePanelOpen && activeSideTab === "files"
                ? "bg-[#161B22] text-[#00F2FE] border border-[#00F2FE]/30"
                : "text-[#8B949E] hover:text-white hover:bg-[#161B22]/50"
            )}
            title="Explorer (Files)"
          >
            <Files className="h-4 w-4" />
          </button>

          {/* Search */}
          <button
            type="button"
            onClick={() => handleDockItemClick("search")}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-colors relative",
              isSidePanelOpen && activeSideTab === "search"
                ? "bg-[#161B22] text-[#00F2FE] border border-[#00F2FE]/30"
                : "text-[#8B949E] hover:text-white hover:bg-[#161B22]/50"
            )}
            title="Search Workspace"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Source Control / Git */}
          <button
            type="button"
            onClick={() => handleDockItemClick("git")}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-colors relative",
              isSidePanelOpen && activeSideTab === "git"
                ? "bg-[#161B22] text-[#00F2FE] border border-[#00F2FE]/30"
                : "text-[#8B949E] hover:text-white hover:bg-[#161B22]/50"
            )}
            title="Source Control (Git)"
          >
            <GitBranch className="h-4 w-4" />
            {modifiedFiles.length > 0 && (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#F59E0B] text-black text-[9px] font-bold flex items-center justify-center">
                {modifiedFiles.length}
              </span>
            )}
          </button>

          {/* Environment Variables */}
          <button
            type="button"
            onClick={() => handleDockItemClick("env")}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-colors relative",
              isSidePanelOpen && activeSideTab === "env"
                ? "bg-[#161B22] text-[#00F2FE] border border-[#00F2FE]/30"
                : "text-[#8B949E] hover:text-white hover:bg-[#161B22]/50"
            )}
            title="Environment Variables"
          >
            <KeyRound className="h-4 w-4" />
          </button>
        </div>

        {/* EXPANDABLE SIDE PANEL (Explorer / Git / Env / Search) */}
        {isSidePanelOpen && (
          <div className="w-64 sm:w-72 h-full shrink-0 flex flex-col z-10">
            {activeSideTab === "files" || activeSideTab === "search" ? (
              <FileExplorer
                rootDirectory={fileTree}
                activeFileId={activeFileId}
                onSelectFile={handleSelectFile}
                allFiles={files}
              />
            ) : activeSideTab === "git" ? (
              <GitPanel
                branch={currentBranch}
                modifiedFiles={modifiedFiles}
                commits={commits}
                onCommit={handleCommit}
                onSelectFile={handleSelectFile}
                onViewDiff={(path) => {
                  setActiveFileId(path);
                  setIsDiffActive(true);
                }}
              />
            ) : (
              <EnvironmentPanel
                variables={envVars}
                onAddVariable={handleAddEnvVar}
                onDeleteVariable={handleDeleteEnvVar}
              />
            )}
          </div>
        )}

        {/* CENTER COLUMN: Tabs + Editor/Diff + Bottom Terminal */}
        <div className="flex-1 flex flex-col min-w-0 md:min-w-[400px] h-full overflow-hidden bg-[#090A0F]">
          {/* Editor Tabs Strip */}
          <div className="flex items-center justify-between bg-[#0E1117] border-b border-[#21262D]">
            <div className="flex-1 overflow-hidden">
              <EditorTabs
                openTabs={editorTabs}
                activeFileId={activeFileId}
                onSelectTab={(id) => {
                  setActiveFileId(id);
                }}
                onCloseTab={handleCloseTab}
              />
            </div>

            {/* Panel toggle shortcuts */}
            <div className="flex items-center gap-1.5 px-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsContextPanelOpen((prev) => !prev)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors",
                  isContextPanelOpen
                    ? "text-[#00F2FE] bg-[#00F2FE]/10 border border-[#00F2FE]/30"
                    : "text-[#8B949E] hover:text-white hover:bg-[#21262D] border border-transparent"
                )}
                title={
                  isContextPanelOpen
                    ? "Hide Architect Context"
                    : "Show Architect Context"
                }
                aria-label="Toggle Architect Context Panel"
              >
                {isContextPanelOpen ? (
                  <PanelRightClose className="h-3.5 w-3.5" />
                ) : (
                  <PanelRightOpen className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline text-[11px]">Context</span>
              </button>
            </div>
          </div>

          {/* Editor Body or Diff Viewer */}
          <div className="flex-1 flex min-h-0 overflow-hidden relative">
            {isDiffActive && activeFile ? (
              <DiffViewer
                activeFile={activeFile}
                onClose={() => setIsDiffActive(false)}
                onRevert={handleRevertFile}
              />
            ) : activeFile ? (
              <CodeEditor
                activeFile={activeFile}
                onContentChange={handleContentChange}
                onSave={handleSave}
              />
            ) : (
              <DeveloperEmptyState
                type="no-file"
                onAction={() => handleSelectFile("src/app/page.tsx")}
                actionLabel="Open src/app/page.tsx"
              />
            )}
          </div>

          {/* BOTTOM TERMINAL PANEL */}
          <DeveloperTerminal
            entries={terminalEntries}
            onAddEntries={handleAddTerminalEntries}
            onClear={handleClearTerminal}
            modifiedCount={modifiedFiles.length}
            modifiedFileNames={modifiedFiles.map((f) => f.name)}
          />
        </div>

        {/* 3. RIGHT CONTEXT PANEL */}
        {isContextPanelOpen && (
          <>
            {/* Mobile/Tablet Backdrop when opened as overlay (< xl) */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 xl:hidden"
              onClick={() => setIsContextPanelOpen(false)}
            />
            <div
              className={cn(
                "h-full shrink-0 z-30 transition-all",
                // Overlay drawer mode on narrower screens (< 1280px)
                "fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] shadow-2xl bg-[#0E1117] border-l border-[#21262D] flex flex-col",
                // In-flow 3rd column on desktop (>= 1280px)
                "xl:relative xl:inset-auto xl:w-64 xl:sm:w-72 xl:shadow-none xl:z-10 xl:block xl:border-l-0"
              )}
            >
              {/* Drawer header on < xl */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#21262D] bg-[#161B22] xl:hidden shrink-0">
                <span className="text-xs font-semibold text-white">Architect Context</span>
                <button
                  type="button"
                  onClick={() => setIsContextPanelOpen(false)}
                  className="p-1 rounded text-[#8B949E] hover:text-white hover:bg-[#21262D]"
                  aria-label="Close Context Drawer"
                >
                  <PanelRightClose className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <DeveloperContextPanel
                  activeFile={activeFile}
                  project={project}
                  currentPlan={currentPlan}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
