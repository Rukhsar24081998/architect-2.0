/**
 * Architect 2.0 — Swarm Orchestrator
 * Coordinates pause, resume, abort, block/resolve, and metric aggregations.
 */

import { AgentRun, AgentRole, AgentActivityItem } from "./types";
import { generateId } from "@/lib/utils";

export interface ExecutionMetrics {
  totalAgents: number;
  totalTasks: number;
  completedTasks: number;
  workingAgents: number;
  queuedAgents: number;
  blockedAgents: number;
  overallProgress: number;
}

export function calculateExecutionMetrics(run: AgentRun): ExecutionMetrics {
  const totalAgents = run.agents.length;
  const totalTasks = run.totalTasks || 4;
  const completedTasks = run.agents.filter((a) => a.status === "completed").length;

  const workingAgents = run.agents.filter(
    (a) => a.status === "working"
  ).length;
  const queuedAgents = run.agents.filter(
    (a) => a.status === "queued" || a.status === "idle"
  ).length;
  const blockedAgents = run.agents.filter(
    (a) => a.status === "blocked"
  ).length;

  let overallProgress = 0;
  if (run.status === "completed" && completedTasks === totalTasks) {
    overallProgress = 100;
  } else if (run.status === "idle") {
    overallProgress = 0;
  } else {
    overallProgress = typeof run.progress === "number" ? run.progress : Math.min(95, Math.round(run.agents.reduce((sum, a) => sum + a.progress, 0) / totalAgents));
  }

  return {
    totalAgents,
    totalTasks,
    completedTasks,
    workingAgents,
    queuedAgents,
    blockedAgents,
    overallProgress,
  };
}

/**
 * Pause execution
 */
export function pauseRun(run: AgentRun): AgentRun {
  const now = new Date();
  const timestampIso = now.toISOString();
  const updated: AgentRun = JSON.parse(JSON.stringify(run));

  updated.status = "paused";
  updated.updatedAt = timestampIso;

  // Mark all working agents as paused
  for (const agent of updated.agents) {
    if (agent.status === "working") {
      agent.status = "paused";
    }
  }

  const pauseItem: AgentActivityItem = {
    id: generateId("act"),
    timestamp: timestampIso,
    agentRole: "architect",
    agentName: "Architect",
    action: "Execution paused by user. Swarm holds state.",
    type: "pause",
  };
  updated.activityFeed.unshift(pauseItem);

  return updated;
}

/**
 * Resume execution
 */
export function resumeRun(run: AgentRun): AgentRun {
  const now = new Date();
  const timestampIso = now.toISOString();
  const updated: AgentRun = JSON.parse(JSON.stringify(run));

  updated.status = "executing";
  updated.updatedAt = timestampIso;

  // Resume paused agents back to working
  for (const agent of updated.agents) {
    if (agent.status === "paused") {
      agent.status = "working";
    }
  }

  const resumeItem: AgentActivityItem = {
    id: generateId("act"),
    timestamp: timestampIso,
    agentRole: "architect",
    agentName: "Architect",
    action: "Execution resumed. Agents continuing task pipeline.",
    type: "resume",
  };
  updated.activityFeed.unshift(resumeItem);

  return updated;
}

/**
 * Abort execution
 */
export function abortRun(run: AgentRun): AgentRun {
  const now = new Date();
  const timestampIso = now.toISOString();
  const updated: AgentRun = JSON.parse(JSON.stringify(run));

  updated.status = "aborted";
  updated.completedAt = timestampIso;
  updated.updatedAt = timestampIso;

  // Abort non-completed agents
  for (const agent of updated.agents) {
    if (agent.status === "working" || agent.status === "queued" || agent.status === "paused") {
      agent.status = "idle";
    }
  }

  const abortItem: AgentActivityItem = {
    id: generateId("act"),
    timestamp: timestampIso,
    agentRole: "architect",
    agentName: "Architect",
    action: "Execution stopped by user. Progress preserved; remaining tasks aborted.",
    type: "abort",
  };
  updated.activityFeed.unshift(abortItem);

  return updated;
}

/**
 * Block a specific agent (for controlled demonstration)
 */
export function blockAgent(
  run: AgentRun,
  role: AgentRole,
  reason = "Waiting for Supabase environment configuration"
): AgentRun {
  const now = new Date();
  const timestampIso = now.toISOString();
  const updated: AgentRun = JSON.parse(JSON.stringify(run));

  const agent = updated.agents.find((a) => a.role === role);
  if (agent && agent.status === "working") {
    agent.status = "blocked";
    agent.blockedReason = reason;

    const blockItem: AgentActivityItem = {
      id: generateId("act"),
      timestamp: timestampIso,
      agentRole: role,
      agentName: agent.name,
      action: `BLOCKED: ${reason}`,
      type: "blocked",
    };
    updated.activityFeed.unshift(blockItem);
    agent.activityLog.unshift(blockItem);
  }

  return updated;
}

/**
 * Resolve blocked agent and continue
 */
export function resolveBlockedAgent(run: AgentRun, role: AgentRole): AgentRun {
  const now = new Date();
  const timestampIso = now.toISOString();
  const updated: AgentRun = JSON.parse(JSON.stringify(run));

  const agent = updated.agents.find((a) => a.role === role);
  if (agent && agent.status === "blocked") {
    agent.status = "working";
    agent.blockedReason = undefined;

    const resolveItem: AgentActivityItem = {
      id: generateId("act"),
      timestamp: timestampIso,
      agentRole: role,
      agentName: agent.name,
      action: "Dependency resolved. Agent resumed working.",
      type: "resume",
    };
    updated.activityFeed.unshift(resolveItem);
    agent.activityLog.unshift(resolveItem);
  }

  return updated;
}
