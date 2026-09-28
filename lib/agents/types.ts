/**
 * Architect 2.0 — Agent Command Center & Multi-Agent Swarm Types
 * Defines the models for specialized agent execution, task assignment,
 * activity logging, and swarm orchestration.
 */

export type AgentRole =
  | "architect"
  | "frontend"
  | "backend"
  | "qa"
  | "devops";

export type AgentStatus =
  | "idle"
  | "queued"
  | "working"
  | "completed"
  | "blocked"
  | "paused"
  | "failed";

export type AgentRunStatus =
  | "idle"
  | "executing"
  | "paused"
  | "completed"
  | "aborted"
  | "blocked";

export interface AgentActivityItem {
  id: string;
  timestamp: string; // Formatted HH:MM:SS or ISO
  agentRole: AgentRole;
  agentName: string;
  action: string;
  fileReference?: string;
  type?:
    | "start"
    | "progress"
    | "complete"
    | "pause"
    | "resume"
    | "abort"
    | "blocked"
    | "info";
}

export interface AgentTask {
  id: string;
  stepId?: string;
  title: string;
  description: string;
  agentRole: AgentRole;
  status: "queued" | "working" | "completed" | "blocked" | "failed";
  progress: number; // 0 - 100
  targetFiles?: string[];
  dependencies?: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface AgentInstance {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  status: AgentStatus;
  progress: number; // 0 - 100
  currentTask?: string;
  tasksCompleted: number;
  tasksTotal: number;
  assignedTasks: AgentTask[];
  referencedFiles: string[];
  dependencies: string[];
  activityLog: AgentActivityItem[];
  startedAt?: string;
  completedAt?: string;
  blockedReason?: string;
}

export interface AgentRun {
  id: string;
  projectId: string;
  buildPlanId: string;
  buildPlanTitle: string;
  status: AgentRunStatus;
  progress: number; // 0 - 100
  agents: AgentInstance[];
  activityFeed: AgentActivityItem[];
  totalTasks: number;
  completedTasks: number;
  currentStep?: number;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
}

export interface SwarmSimulationState {
  stage: number; // 0: init, 1: architect, 2: frontend+backend, 3: qa, 4: complete
  subStep: number;
}
