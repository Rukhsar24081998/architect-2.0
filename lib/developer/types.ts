/**
 * Architect 2.0 — Developer Mode Domain Types
 * Defines models for virtual file tree, editor tabs, Git changes, commits,
 * terminal commands, and environment variables.
 */

export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  language: "typescript" | "javascript" | "tsx" | "jsx" | "css" | "json" | "markdown" | "svg" | "env";
  content: string;
  originalContent: string;
  isModified?: boolean;
  relatedBuildStep?: string;
  agentRole?: "architect" | "frontend" | "backend" | "qa";
}

export interface VirtualDirectory {
  name: string;
  path: string;
  isOpen?: boolean;
  subdirectories: VirtualDirectory[];
  files: VirtualFile[];
}

export interface EditorTab {
  fileId: string;
  filePath: string;
  fileName: string;
  isModified?: boolean;
  language: VirtualFile["language"];
}

export interface GitCommit {
  id: string;
  sha: string;
  message: string;
  author: string;
  timestamp: string; // Deterministic string
  branch: string;
}

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
  target: "production" | "preview" | "development";
}

export interface TerminalEntry {
  id: string;
  type: "command" | "output" | "error" | "info";
  content: string;
}

export type DeveloperSideTab = "files" | "git" | "env" | "search";
