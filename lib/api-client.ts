import {
  Project,
  ProjectDetails,
  ActivityEvent,
  ProjectTemplate,
  ProjectStatus,
  ProjectOrigin,
  ProjectStackConfig,
  ProjectFile,
  Message,
  BuildPlan,
  RequirementsSummary,
} from "./types";
import { AgentRun } from "./agents/types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Standard API Client for Architect 2.0 Frontend.
 * Centralizes all network requests to avoid scattering raw fetch() calls.
 */
export const apiClient = {
  /**
   * Fetch all project summaries
   */
  async getProjects(): Promise<Project[]> {
    const res = await fetch("/api/projects", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json: ApiResponse<Project[]> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to fetch projects");
    }

    return json.data || [];
  },

  /**
   * Fetch recent activity across all projects
   */
  async getRecentActivity(limit = 6): Promise<ActivityEvent[]> {
    const res = await fetch(`/api/activity?limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json: ApiResponse<ActivityEvent[]> = await res.json();
    if (!res.ok || !json.success) {
      return [];
    }

    return json.data || [];
  },

  /**
   * Fetch full aggregate project details by ID
   */
  async getProject(id: string): Promise<ProjectDetails> {
    const res = await fetch(`/api/projects/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json: ApiResponse<ProjectDetails> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to fetch project ${id}`);
    }

    return json.data as ProjectDetails;
  },

  /**
   * Create a new project
   */
  async createProject(input: {
    name: string;
    description?: string;
    template?: ProjectTemplate;
    status?: ProjectStatus;
    currentBranch?: string;
    origin?: ProjectOrigin;
    stack?: ProjectStackConfig | string;
    repositoryUrl?: string;
    files?: ProjectFile[];
    messages?: Message[];
  }): Promise<ProjectDetails> {

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const json: ApiResponse<ProjectDetails> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to create project");
    }

    return json.data as ProjectDetails;
  },

  /**
   * Update project fields
   */
  async updateProject(
    id: string,
    updates: Partial<ProjectDetails>
  ): Promise<ProjectDetails> {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const json: ApiResponse<ProjectDetails> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to update project ${id}`);
    }

    return json.data as ProjectDetails;
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const json: ApiResponse<unknown> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Failed to delete project ${id}`);
    }

    return true;
  },

  /**
   * Send a prompt message to Architect AI in the workspace
   */
  async sendMessage(input: {
    projectId: string;
    message: string;
  }): Promise<{ userMessage: Message; assistantMessage: Message }> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const json: ApiResponse<{ userMessage: Message; assistantMessage: Message }> =
      await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || "Failed to communicate with Architect AI");
    }

    return json.data;
  },

  /**
   * Clear all conversation messages for a project
   */
  async clearChat(projectId: string): Promise<boolean> {
    const res = await fetch(`/api/chat?projectId=${encodeURIComponent(projectId)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const json: ApiResponse<null> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to clear conversation");
    }

    return true;
  },

  /**
   * Fetch all build plans for a project
   */
  async getBuildPlans(projectId: string): Promise<BuildPlan[]> {
    const res = await fetch(`/api/projects/${projectId}/build-plans`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json: ApiResponse<BuildPlan[]> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to fetch build plans");
    }

    return json.data || [];
  },

  /**
   * Fetch a specific build plan by ID
   */
  async getBuildPlan(projectId: string, planId: string): Promise<BuildPlan> {
    const res = await fetch(`/api/projects/${projectId}/build-plans/${planId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json: ApiResponse<BuildPlan> = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || `Failed to fetch build plan ${planId}`);
    }

    return json.data;
  },

  /**
   * Create or generate a new build plan
   */
  async createBuildPlan(
    projectId: string,
    payload?: {
      prompt?: string;
      sourceMessageId?: string;
      plan?: Partial<BuildPlan>;
      requirementsSummary?: RequirementsSummary;
    }
  ): Promise<BuildPlan> {
    const res = await fetch(`/api/projects/${projectId}/build-plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });

    const json: ApiResponse<BuildPlan> = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || "Failed to create build plan");
    }

    return json.data;
  },

  /**
   * Update fields of an existing build plan
   */
  async updateBuildPlan(
    projectId: string,
    planId: string,
    updates: Partial<BuildPlan>
  ): Promise<BuildPlan> {
    const res = await fetch(`/api/projects/${projectId}/build-plans/${planId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const json: ApiResponse<BuildPlan> = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || `Failed to update build plan ${planId}`);
    }

    return json.data;
  },

  /**
   * Fetch all agent runs for a project
   */
  async getAgentRuns(projectId: string): Promise<AgentRun[]> {
    const res = await fetch(`/api/projects/${projectId}/agent-runs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json: ApiResponse<AgentRun[]> = await res.json();
    if (!res.ok || !json.success) {
      return [];
    }

    return json.data || [];
  },

  /**
   * Fetch a specific agent run by ID
   */
  async getAgentRun(projectId: string, runId: string): Promise<AgentRun> {
    const res = await fetch(`/api/projects/${projectId}/agent-runs/${runId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json: ApiResponse<AgentRun> = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || `Failed to fetch agent run ${runId}`);
    }

    return json.data;
  },

  /**
   * Initialize a new agent run
   */
  async createAgentRun(
    projectId: string,
    payload?: { buildPlanId?: string; autoStart?: boolean }
  ): Promise<AgentRun> {
    const res = await fetch(`/api/projects/${projectId}/agent-runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });

    const json: ApiResponse<AgentRun> = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || "Failed to create agent run");
    }

    return json.data;
  },

  /**
   * Update an existing agent run with latest state
   */
  async updateAgentRun(
    projectId: string,
    runId: string,
    updates: Partial<AgentRun>
  ): Promise<AgentRun> {
    const res = await fetch(`/api/projects/${projectId}/agent-runs/${runId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const json: ApiResponse<AgentRun> = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || `Failed to update agent run ${runId}`);
    }

    return json.data;
  },

  /**
   * Pause agent execution run
   */
  async pauseAgentRun(projectId: string, runId: string): Promise<AgentRun> {
    const res = await fetch(
      `/api/projects/${projectId}/agent-runs/${runId}/pause`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    const json: ApiResponse<AgentRun> = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || `Failed to pause agent run ${runId}`);
    }

    return json.data;
  },

  /**
   * Resume agent execution run
   */
  async resumeAgentRun(projectId: string, runId: string): Promise<AgentRun> {
    const res = await fetch(
      `/api/projects/${projectId}/agent-runs/${runId}/resume`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    const json: ApiResponse<AgentRun> = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || `Failed to resume agent run ${runId}`);
    }

    return json.data;
  },

  /**
   * Abort agent execution run
   */
  async abortAgentRun(projectId: string, runId: string): Promise<AgentRun> {
    const res = await fetch(
      `/api/projects/${projectId}/agent-runs/${runId}/abort`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    const json: ApiResponse<AgentRun> = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.error || `Failed to abort agent run ${runId}`);
    }

    return json.data;
  },
};
