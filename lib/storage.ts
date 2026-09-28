import fs from "fs";
import path from "path";
import {
  Project,
  ProjectDetails,
  ProjectFile,
  Message,
  Agent,
  Deployment,
  ActivityEvent,
  BuildPlan,
  PlanStep,
} from "./types";
import { AgentRun } from "./agents/types";
import { SEED_PROJECTS } from "./mock-data";
import { generateId } from "./utils";

interface DataStore {
  projects: Record<string, ProjectDetails>;
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

// In-memory fallback if fs is unavailable
let memoryStore: DataStore | null = null;

/**
 * Initializes the store with seed data if the store file does not exist.
 */
function initStore(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(raw) as DataStore;
      memoryStore = parsed;
      return parsed;
    }

    if (memoryStore) {
      return memoryStore;
    }

    // Seed the store
    const initialProjects: Record<string, ProjectDetails> = {};
    for (const proj of SEED_PROJECTS) {
      initialProjects[proj.id] = proj;
    }

    const newStore: DataStore = {
      projects: initialProjects,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(STORE_FILE, JSON.stringify(newStore, null, 2), "utf-8");
    memoryStore = newStore;
    return newStore;
  } catch (err) {
    console.warn("Storage filesystem access fallback to memory:", err);
    if (!memoryStore) {
      const fallbackProjects: Record<string, ProjectDetails> = {};
      for (const proj of SEED_PROJECTS) {
        fallbackProjects[proj.id] = proj;
      }
      memoryStore = {
        projects: fallbackProjects,
        lastUpdated: new Date().toISOString(),
      };
    }
    return memoryStore;
  }
}

/**
 * Persists the current in-memory store to disk.
 */
function persistStore(store: DataStore): void {
  store.lastUpdated = new Date().toISOString();
  memoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to persist data store to disk:", err);
  }
}

export const storage = {
  /**
   * Get all projects (summaries)
   */
  async getAllProjects(): Promise<Project[]> {
    const store = initStore();
    return Object.values(store.projects).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      template: p.template,
      status: p.status,
      currentBranch: p.currentBranch,
      liveUrl: p.liveUrl,
      origin: p.origin || "idea",
      stack: p.stack,
      repositoryUrl: p.repositoryUrl,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  },

  /**
   * Get complete project details by ID
   */
  async getProjectById(id: string): Promise<ProjectDetails | null> {
    const store = initStore();
    return store.projects[id] ? JSON.parse(JSON.stringify(store.projects[id])) : null;
  },

  /**
   * Create a new project
   */
  async createProject(input: Partial<ProjectDetails>): Promise<ProjectDetails> {
    const store = initStore();
    const id = input.id || generateId("prj");
    const now = new Date().toISOString();

    const newProject: ProjectDetails = {
      id,
      name: input.name || "Untitled Project",
      description: input.description || "An AI-crafted application workspace",
      template: input.template || "nextjs-saas",
      status: input.status || "draft",
      currentBranch: input.currentBranch || "main",
      liveUrl: input.liveUrl,
      origin: input.origin || "idea",
      stack: input.stack,
      repositoryUrl: input.repositoryUrl,
      createdAt: now,
      updatedAt: now,
      files: input.files || [
        {
          id: generateId("file"),
          projectId: id,
          path: "README.md",
          language: "markdown",
          version: 1,
          updatedAt: now,
          content: `# ${input.name || "Untitled Project"}\n\nGenerated with Architect 2.0.`,
        },
      ],
      messages: input.messages
        ? input.messages.map((m) => ({ ...m, projectId: m.projectId || id }))
        : [
            {
              id: generateId("msg"),
              projectId: id,
              sender: "system",
              content: "Project workspace initialized. Describe what you'd like to build to begin.",
              createdAt: now,
            },
          ],

      buildPlans: input.buildPlans || [],
      agents: input.agents || [
        {
          id: generateId("ag"),
          projectId: id,
          name: "Architect Agent",
          role: "architect",
          status: "idle",
          progress: 0,
          thoughtLog: [],
        },
      ],
      deployments: input.deployments || [],
      integrations: input.integrations || [],
      environmentVariables: input.environmentVariables || [],
      activity: input.activity || [
        {
          id: generateId("act"),
          projectId: id,
          actor: "System",
          actorRole: "system",
          type: "project_created",
          summary: `Created project "${input.name || "Untitled Project"}"`,
          createdAt: now,
        },
      ],
    };

    store.projects[id] = newProject;
    persistStore(store);
    return newProject;
  },

  /**
   * Update project fields
   */
  async updateProject(
    id: string,
    updates: Partial<ProjectDetails>
  ): Promise<ProjectDetails | null> {
    const store = initStore();
    const existing = store.projects[id];
    if (!existing) return null;

    const updated: ProjectDetails = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    store.projects[id] = updated;
    persistStore(store);
    return updated;
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    const store = initStore();
    if (!store.projects[id]) return false;

    delete store.projects[id];
    persistStore(store);
    return true;
  },

  // =========================================================================
  // Granular Sub-Entity Accessors (used by subsequent missions)
  // =========================================================================

  async getFiles(projectId: string): Promise<ProjectFile[]> {
    const p = await this.getProjectById(projectId);
    return p ? p.files : [];
  },

  async saveFile(projectId: string, file: Partial<ProjectFile>): Promise<ProjectFile | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p) return null;

    const existingIndex = p.files.findIndex((f) => f.path === file.path);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = p.files[existingIndex];
      const updated: ProjectFile = {
        ...existing,
        ...file,
        version: existing.version + 1,
        updatedAt: now,
      };
      p.files[existingIndex] = updated;
      persistStore(store);
      return updated;
    } else {
      const created: ProjectFile = {
        id: file.id || generateId("file"),
        projectId,
        path: file.path || "file.txt",
        content: file.content || "",
        language: file.language || "typescript",
        version: 1,
        updatedAt: now,
      };
      p.files.push(created);
      persistStore(store);
      return created;
    }
  },

  async getMessages(projectId: string): Promise<Message[]> {
    const store = initStore();
    const p = store.projects[projectId];
    return p && Array.isArray(p.messages) ? [...p.messages] : [];
  },

  /**
   * Clear all conversation messages for a project
   */
  async clearMessages(projectId: string): Promise<boolean> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p) return false;
    p.messages = [];
    p.updatedAt = new Date().toISOString();
    persistStore(store);
    return true;
  },

  async addMessage(projectId: string, message: Partial<Message>): Promise<Message | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p) return null;

    const newMsg: Message = {
      id: message.id || generateId("msg"),
      projectId,
      sender: message.sender || (message.role === "user" ? "user" : "architect"),
      role: message.role || (message.sender === "architect" ? "assistant" : "user"),
      content: message.content || "",
      status: message.status || "completed",
      thinking: message.thinking,
      contextFiles: message.contextFiles,
      suggestedActions: message.suggestedActions,
      requirementsSummary: message.requirementsSummary,
      metadata: message.metadata,
      createdAt: message.createdAt || new Date().toISOString(),
    };


    if (!Array.isArray(p.messages)) {
      p.messages = [];
    }
    p.messages.push(newMsg);
    p.updatedAt = new Date().toISOString();
    persistStore(store);
    return newMsg;
  },

  /**
   * Get all build plans for a project
   */
  async getBuildPlans(projectId: string): Promise<BuildPlan[]> {
    const store = initStore();
    const p = store.projects[projectId];
    return p && Array.isArray(p.buildPlans) ? [...p.buildPlans] : [];
  },

  /**
   * Get a specific build plan by ID
   */
  async getBuildPlanById(
    projectId: string,
    planId: string
  ): Promise<BuildPlan | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p || !Array.isArray(p.buildPlans)) return null;
    const plan = p.buildPlans.find((bp) => bp.id === planId);
    return plan ? JSON.parse(JSON.stringify(plan)) : null;
  },

  /**
   * Save / Create a new build plan
   */
  async saveBuildPlan(
    projectId: string,
    plan: Partial<BuildPlan>
  ): Promise<BuildPlan | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p) return null;

    if (!Array.isArray(p.buildPlans)) {
      p.buildPlans = [];
    }

    const now = new Date().toISOString();
    const newPlan: BuildPlan = {
      id: plan.id || generateId("bp"),
      projectId,
      title: plan.title || "Untitled Build Plan",
      summary: plan.summary || "Structured implementation plan",
      status: plan.status || "proposed",
      createdAt: plan.createdAt || now,
      updatedAt: now,
      sourceMessageId: plan.sourceMessageId,
      steps: (plan.steps || []).map((step: Partial<PlanStep>, idx: number) => ({
        id: step.id || generateId("step"),
        order: step.order ?? idx + 1,
        title: step.title || `Step ${idx + 1}`,
        description: step.description || "",
        type: step.type || "frontend",
        status: step.status || "pending",
        affectedFiles: step.affectedFiles || [],
        dependencies: step.dependencies || [],
      })),
      risks: plan.risks || [],
      assumptions: plan.assumptions || [],
      estimatedComplexity: plan.estimatedComplexity || "medium",
      estimatedDurationMinutes: plan.estimatedDurationMinutes,
    };

    const existingIndex = p.buildPlans.findIndex((bp) => bp.id === newPlan.id);
    if (existingIndex >= 0) {
      p.buildPlans[existingIndex] = newPlan;
    } else {
      p.buildPlans.unshift(newPlan);
    }

    p.updatedAt = now;
    persistStore(store);
    return newPlan;
  },

  /**
   * Update fields of an existing build plan
   */
  async updateBuildPlan(
    projectId: string,
    planId: string,
    updates: Partial<BuildPlan>
  ): Promise<BuildPlan | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p || !Array.isArray(p.buildPlans)) return null;

    const existingIndex = p.buildPlans.findIndex((bp) => bp.id === planId);
    if (existingIndex < 0) return null;

    const existing = p.buildPlans[existingIndex];
    const now = new Date().toISOString();

    const updatedPlan: BuildPlan = {
      ...existing,
      ...updates,
      id: existing.id,
      projectId: existing.projectId,
      createdAt: existing.createdAt,
      updatedAt: now,
    };

    p.buildPlans[existingIndex] = updatedPlan;
    p.updatedAt = now;
    persistStore(store);
    return updatedPlan;
  },

  async updateAgent(
    projectId: string,
    agentId: string,
    updates: Partial<Agent>
  ): Promise<Agent | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p) return null;

    const agent = p.agents.find((a) => a.id === agentId);
    if (!agent) return null;

    Object.assign(agent, updates);
    persistStore(store);
    return agent;
  },

  /**
   * Get all agent runs for a project
   */
  async getAgentRuns(projectId: string): Promise<AgentRun[]> {
    const store = initStore();
    const p = store.projects[projectId];
    return p && Array.isArray(p.agentRuns) ? [...p.agentRuns] : [];
  },

  /**
   * Get a specific agent run by ID
   */
  async getAgentRunById(
    projectId: string,
    runId: string
  ): Promise<AgentRun | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p || !Array.isArray(p.agentRuns)) return null;
    const run = p.agentRuns.find((r) => r.id === runId);
    return run ? JSON.parse(JSON.stringify(run)) : null;
  },

  /**
   * Save or upsert an agent run
   */
  async saveAgentRun(
    projectId: string,
    run: AgentRun
  ): Promise<AgentRun | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p) return null;

    if (!Array.isArray(p.agentRuns)) {
      p.agentRuns = [];
    }

    const now = new Date().toISOString();
    const updatedRun: AgentRun = {
      ...run,
      updatedAt: now,
    };

    const existingIdx = p.agentRuns.findIndex((r) => r.id === run.id);
    if (existingIdx >= 0) {
      p.agentRuns[existingIdx] = updatedRun;
    } else {
      p.agentRuns.unshift(updatedRun);
    }

    p.updatedAt = now;
    persistStore(store);
    return updatedRun;
  },

  /**
   * Update fields of an existing agent run
   */
  async updateAgentRun(
    projectId: string,
    runId: string,
    updates: Partial<AgentRun>
  ): Promise<AgentRun | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p || !Array.isArray(p.agentRuns)) return null;

    const existingIdx = p.agentRuns.findIndex((r) => r.id === runId);
    const now = new Date().toISOString();

    if (existingIdx < 0) {
      const newRun: AgentRun = {
        id: runId,
        projectId,
        buildPlanId: updates.buildPlanId || "",
        buildPlanTitle: updates.buildPlanTitle || "",
        status: updates.status || "idle",
        progress: updates.progress || 0,
        agents: updates.agents || [],
        activityFeed: updates.activityFeed || [],
        totalTasks: updates.totalTasks || 4,
        completedTasks: updates.completedTasks || 0,
        startedAt: updates.startedAt || now,
        updatedAt: now,
      };
      p.agentRuns.unshift(newRun);
      p.updatedAt = now;
      persistStore(store);
      return newRun;
    }

    const existing = p.agentRuns[existingIdx];

    const merged: AgentRun = {
      ...existing,
      ...updates,
      id: existing.id,
      projectId: existing.projectId,
      buildPlanId: existing.buildPlanId,
      startedAt: existing.startedAt,
      updatedAt: now,
    };

    p.agentRuns[existingIdx] = merged;
    p.updatedAt = now;
    persistStore(store);
    return merged;
  },

  async addDeployment(
    projectId: string,
    deployment: Partial<Deployment>
  ): Promise<Deployment | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p) return null;

    const newDeployment: Deployment = {
      id: deployment.id || generateId("dep"),
      projectId,
      environment: deployment.environment || "production",
      status: deployment.status || "building",
      liveUrl: deployment.liveUrl || `https://${p.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.architect.live`,
      commitSha: deployment.commitSha || "main",
      commitMessage: deployment.commitMessage || "Automated release",
      durationSeconds: deployment.durationSeconds || 15,
      logs: deployment.logs || [],
      createdAt: new Date().toISOString(),
    };

    p.deployments.unshift(newDeployment);
    if (newDeployment.status === "live") {
      p.status = "deployed";
      p.liveUrl = newDeployment.liveUrl;
    }
    persistStore(store);
    return newDeployment;
  },

  async addActivity(
    projectId: string,
    activity: Partial<ActivityEvent>
  ): Promise<ActivityEvent | null> {
    const store = initStore();
    const p = store.projects[projectId];
    if (!p) return null;

    const newEvent: ActivityEvent = {
      id: activity.id || generateId("act"),
      projectId,
      actor: activity.actor || "System",
      actorRole: activity.actorRole || "system",
      type: activity.type || "file_modified",
      summary: activity.summary || "Project activity recorded",
      metadata: activity.metadata,
      createdAt: new Date().toISOString(),
    };

    p.activity.unshift(newEvent);
    persistStore(store);
    return newEvent;
  },

  async getRecentActivity(limit = 10): Promise<ActivityEvent[]> {
    const store = initStore();
    const allActivities: ActivityEvent[] = [];

    for (const project of Object.values(store.projects)) {
      if (Array.isArray(project.activity)) {
        for (const act of project.activity) {
          allActivities.push({
            ...act,
            projectName: act.projectName || project.name,
          });
        }
      }
    }

    allActivities.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return allActivities.slice(0, limit);
  },
};
