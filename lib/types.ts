/**
 * Architect 2.0 — Centralized Domain Type System
 * Defines core models, statuses, and interfaces across all workspace subsystems.
 */

export type WorkspaceMode = "build" | "dev";

export type UserRole =
  | "founder"
  | "builder"
  | "engineer"
  | "pm"
  | "designer"
  | "operator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  preferredMode: WorkspaceMode;
}

export interface Persona {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  tagline: string;
  email: string;
  avatar: string;
  defaultMode: WorkspaceMode;
  description: string;
}

export type ProjectStatus =
  | "draft"
  | "planning"
  | "building"
  | "ready"
  | "deployed"
  | "error";

export type ProjectTemplate =
  | "nextjs-saas"
  | "react-dashboard"
  | "api-service"
  | "mobile-web"
  | "web-app"
  | "ai-application"
  | "blank";

export type ProjectOrigin = "idea" | "github";

export interface ProjectStackConfig {
  frontend?: string;
  backend?: string;
  database?: string;
  framework?: string;
  language?: string;
  packageManager?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  template: ProjectTemplate;
  status: ProjectStatus;
  currentBranch: string;
  liveUrl?: string;
  origin?: ProjectOrigin;
  stack?: ProjectStackConfig | string;
  repositoryUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MessageSender = "user" | "architect" | "system";
export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "pending" | "streaming" | "completed" | "error";

export interface RequirementsSummary {
  product: string;
  users: string;
  corePurpose: string;
  knowledge?: string;
  persistence?: string;
  recommendedStack?: string;
}

export interface MessageAction {
  label: string;
  action: string;
  payload?: Record<string, unknown>;
}

export interface MessageMetadata {
  model?: string;
  tokenUsage?: number;
  simulated?: boolean;
  category?: string;
  question?: string | null;
  options?: string[];
  requirementsSummary?: RequirementsSummary | null;
  isReadyForBuildPlan?: boolean;
  [key: string]: unknown;
}

export interface Message {
  id: string;
  projectId: string;
  sender: MessageSender;
  role?: MessageRole;
  content: string;
  status?: MessageStatus;
  thinking?: string;
  contextFiles?: string[];
  suggestedActions?: MessageAction[];
  requirementsSummary?: RequirementsSummary | null;
  metadata?: MessageMetadata;
  createdAt: string;
}

export type PlanStepType =
  | "architecture"
  | "frontend"
  | "backend"
  | "database"
  | "integration"
  | "testing"
  | "configuration";

export type PlanStepStatus =
  | "pending"
  | "approved"
  | "active"
  | "done"
  | "failed";

export interface PlanStep {
  id: string;
  order?: number;
  title: string;
  description: string;
  type?: PlanStepType;
  status: PlanStepStatus;
  affectedFiles?: string[];
  dependencies?: string[];
  targetFile?: string;
  estimatedSeconds?: number;
}

export type BuildPlanStatus =
  | "proposed"
  | "approved"
  | "executing"
  | "completed"
  | "cancelled"
  | "in_progress"
  | "rejected";

export type BuildPlanComplexity = "low" | "medium" | "high";

export interface BuildPlan {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  status: BuildPlanStatus;
  createdAt: string;
  updatedAt: string;
  sourceMessageId?: string;
  steps: PlanStep[];
  risks?: string[];
  assumptions?: string[];
  estimatedComplexity?: BuildPlanComplexity;
  estimatedDurationMinutes?: number;
}

export type AgentRole =
  | "architect"
  | "frontend"
  | "backend"
  | "qa"
  | "devops";

export type AgentStatus =
  | "idle"
  | "thinking"
  | "running"
  | "paused"
  | "completed"
  | "failed";

export interface AgentThought {
  id: string;
  timestamp: string;
  message: string;
  type?: "info" | "action" | "warning" | "success";
}

export interface Agent {
  id: string;
  projectId: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  currentTask?: string;
  progress: number; // 0 - 100
  thoughtLog: AgentThought[];
}

export interface AgentSession {
  id: string;
  projectId: string;
  agentId: string;
  taskTitle: string;
  startedAt: string;
  completedAt?: string;
  status: AgentStatus;
  logs: string[];
}

export type FileLanguage =
  | "typescript"
  | "javascript"
  | "tsx"
  | "jsx"
  | "json"
  | "css"
  | "html"
  | "markdown"
  | "prisma";

export interface ProjectFile {
  id: string;
  projectId: string;
  path: string;
  content: string;
  language: FileLanguage;
  version: number;
  updatedAt: string;
}

export type DeploymentStatus =
  | "pending"
  | "building"
  | "testing"
  | "deploying"
  | "live"
  | "failed"
  | "rolled_back";

export type DeploymentEnvironment = "production" | "staging" | "preview";

export interface Deployment {
  id: string;
  projectId: string;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  liveUrl: string;
  commitSha: string;
  commitMessage: string;
  durationSeconds: number;
  logs: string[];
  createdAt: string;
}

export type IntegrationProvider =
  | "stripe"
  | "resend"
  | "supabase"
  | "github"
  | "auth0";

export type IntegrationStatus = "connected" | "disconnected";

export interface Integration {
  id: string;
  projectId: string;
  provider: IntegrationProvider;
  name: string;
  description: string;
  status: IntegrationStatus;
  config?: Record<string, string>;
  icon?: string;
}

export type EnvTarget = "development" | "preview" | "production";

export interface EnvironmentVariable {
  id: string;
  projectId: string;
  key: string;
  value: string;
  target: EnvTarget;
  isSecret: boolean;
  createdAt: string;
}

export type ActivityEventType =
  | "project_created"
  | "plan_proposed"
  | "plan_approved"
  | "agent_started"
  | "agent_completed"
  | "file_created"
  | "file_modified"
  | "test_passed"
  | "test_failed"
  | "deployed"
  | "rolled_back"
  | "secret_added";

export interface ActivityEvent {
  id: string;
  projectId: string;
  projectName?: string;
  actor: string;
  actorRole: "user" | "agent" | "system";
  type: ActivityEventType;
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

import type { AgentRun } from "./agents/types";

/**
 * Composite Project Aggregate View
 * Contains full project relations for workspace hydration.
 */
export interface ProjectDetails extends Project {
  files: ProjectFile[];
  messages: Message[];
  buildPlans: BuildPlan[];
  agents: Agent[];
  agentRuns?: AgentRun[];
  deployments: Deployment[];
  integrations: Integration[];
  environmentVariables: EnvironmentVariable[];
  activity: ActivityEvent[];
}
