/**
 * Architect 2.0 — Agent Simulation Engine
 * Deterministic multi-agent swarm task assignment, timeline simulation,
 * and state transitions based on an approved Build Plan.
 */

import { BuildPlan, PlanStep } from "@/lib/types";
import {
  AgentInstance,
  AgentRole,
  AgentRun,
  AgentTask,
  AgentActivityItem,
} from "./types";
import { generateId } from "@/lib/utils";

/**
 * Deterministically format timestamp for activity feed (HH:MM:SS in UTC)
 * Supports ISO strings, Date objects, or pre-formatted HH:MM:SS strings.
 * Guarantees identical output on server SSR and client hydration regardless of timezone/locale.
 */
export function formatTimestamp(input?: string | Date): string {
  if (!input) return "00:00:00";
  if (typeof input === "string") {
    // If already in HH:MM:SS format
    if (/^\d{2}:\d{2}:\d{2}$/.test(input.trim())) {
      return input.trim();
    }
  }
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) {
    return typeof input === "string" ? input : "00:00:00";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

/**
 * Map PlanStepType to AgentRole deterministically.
 */
export function mapStepTypeToAgentRole(stepType?: string): AgentRole {
  switch (stepType) {
    case "architecture":
      return "architect";
    case "frontend":
      return "frontend";
    case "backend":
    case "database":
    case "integration":
      return "backend";
    case "testing":
      return "qa";
    case "configuration":
      return "architect";
    default:
      return "frontend";
  }
}

/**
 * Agent descriptions and roles
 */
const AGENT_METADATA: Record<
  AgentRole,
  { name: string; description: string; defaultDependencies: string[] }
> = {
  architect: {
    name: "Architect",
    description: "Architecture analysis, system decomposition & dependency boundaries",
    defaultDependencies: [],
  },
  frontend: {
    name: "Frontend",
    description: "UI implementation, client components & responsive states",
    defaultDependencies: ["Architect"],
  },
  backend: {
    name: "Backend",
    description: "Route protection, server handlers & session middleware",
    defaultDependencies: ["Architect"],
  },
  qa: {
    name: "QA",
    description: "Automated test verification, session recovery & error assertion",
    defaultDependencies: ["Frontend", "Backend"],
  },
  devops: {
    name: "DevOps",
    description: "Deployment pipeline, preview environments & container health",
    defaultDependencies: ["QA"],
  },
};

/**
 * Initialize a new AgentRun from an approved Build Plan.
 * Derives stable timestamps and identifiers deterministically from the build plan,
 * guaranteeing identical server SSR and client hydration state.
 */
export function initializeAgentRun(
  projectId: string,
  plan: BuildPlan,
  autoStart = false
): AgentRun {
  // Use stable, persisted plan timestamp as base
  const baseTimestamp =
    plan.updatedAt || plan.createdAt || "2026-09-25T11:42:00.000Z";

  // Group steps by mapped role
  const stepsByRole: Record<AgentRole, PlanStep[]> = {
    architect: [],
    frontend: [],
    backend: [],
    qa: [],
    devops: [],
  };

  for (const step of plan.steps) {
    const role = mapStepTypeToAgentRole(step.type);
    stepsByRole[role].push(step);
  }

  // Ensure all 4 core agents have at least one task representation
  if (stepsByRole.architect.length === 0) {
    stepsByRole.architect.push({
      id: "step_auto_arch",
      title: "System Architecture & Dependency Validation",
      description: "Analyze dependency tree and validate modular design boundaries.",
      type: "architecture",
      status: "pending",
      affectedFiles: ["lib/auth.ts"],
    });
  }

  if (stepsByRole.frontend.length === 0) {
    stepsByRole.frontend.push({
      id: "step_auto_fe",
      title: "User Interface Implementation",
      description: "Implement interactive view components and state bindings.",
      type: "frontend",
      status: "pending",
      affectedFiles: ["components/auth/LoginForm.tsx"],
    });
  }

  if (stepsByRole.backend.length === 0) {
    stepsByRole.backend.push({
      id: "step_auto_be",
      title: "Route Protection & Middleware",
      description: "Secure application routes and establish request guard.",
      type: "backend",
      status: "pending",
      affectedFiles: ["src/App.tsx"],
    });
  }

  if (stepsByRole.qa.length === 0) {
    stepsByRole.qa.push({
      id: "step_auto_qa",
      title: "Automated Verification Suite",
      description: "Validate test scenarios and runtime behavior under edge cases.",
      type: "testing",
      status: "pending",
      affectedFiles: ["tests/auth.test.ts"],
    });
  }

  // Build the 4 core agents in READY / QUEUED state
  const coreRoles: AgentRole[] = ["architect", "frontend", "backend", "qa"];
  const agents: AgentInstance[] = coreRoles.map((role) => {
    const meta = AGENT_METADATA[role];
    const steps = stepsByRole[role];
    const tasks: AgentTask[] = steps.map((s, sIdx) => ({
      id: `atask_${plan.id}_${role}_${s.id || sIdx}`,
      stepId: s.id,
      title: s.title,
      description: s.description,
      agentRole: role,
      status: "queued",
      progress: 0,
      targetFiles: s.affectedFiles || (s.targetFile ? [s.targetFile] : []),
      dependencies: s.dependencies || meta.defaultDependencies,
    }));

    const referencedFiles = Array.from(
      new Set(tasks.flatMap((t) => t.targetFiles || []))
    );

    return {
      id: `agt_${plan.id}_${role}`,
      name: meta.name,
      role,
      description: meta.description,
      status: "queued",
      progress: 0,
      currentTask: tasks[0]?.title || `${meta.name} task assignment`,
      tasksCompleted: 0,
      tasksTotal: tasks.length,
      assignedTasks: tasks,
      referencedFiles,
      dependencies: meta.defaultDependencies,
      activityLog: [
        {
          id: `log_init_${plan.id}_${role}`,
          timestamp: baseTimestamp,
          agentRole: role,
          agentName: meta.name,
          action: `Agent initialized for plan: ${plan.title}`,
          type: "info",
        },
      ],
    };
  });

  const totalTasks = agents.reduce((acc, a) => acc + a.tasksTotal, 0);

  const initialActivities: AgentActivityItem[] = [
    {
      id: `act_init_${plan.id}`,
      timestamp: baseTimestamp,
      agentRole: "architect",
      agentName: "Architect",
      action: `Initialized multi-agent swarm for "${plan.title}"`,
      type: "info",
    },
  ];

  const idleRun: AgentRun = {
    id: `run_${plan.id}_init`,
    projectId,
    buildPlanId: plan.id,
    buildPlanTitle: plan.title,
    status: "idle",
    progress: 0,
    currentStep: 0,
    agents,
    activityFeed: initialActivities,
    totalTasks,
    completedTasks: 0,
    startedAt: baseTimestamp,
    updatedAt: baseTimestamp,
  };

  if (autoStart) {
    return advanceSimulationStep(idleRun, 1).updatedRun;
  }

  return idleRun;
}

const STEP_PROGRESS: Record<number, number> = {
  1: 10,
  2: 20,
  3: 35,
  4: 55,
  5: 72,
  6: 85,
  7: 95,
  8: 100,
};

/**
 * Simulation tick progression.
 * Given an existing run and stepNumber (1 to 8), advances agent states deterministically.
 * Every step enforces full consistency between agent states, task counters, and overall run progress.
 */
export function advanceSimulationStep(
  run: AgentRun,
  stepNumber: number
): { updatedRun: AgentRun; isComplete: boolean } {
  if (run.status === "paused" || run.status === "aborted" || run.status === "completed") {
    return { updatedRun: run, isComplete: run.status === "completed" };
  }

  const now = new Date();
  const timestampIso = now.toISOString();
  const updatedRun: AgentRun = JSON.parse(JSON.stringify(run));

  const architect = updatedRun.agents.find((a) => a.role === "architect")!;
  const frontend = updatedRun.agents.find((a) => a.role === "frontend")!;
  const backend = updatedRun.agents.find((a) => a.role === "backend")!;
  const qa = updatedRun.agents.find((a) => a.role === "qa")!;

  const addFeed = (
    role: AgentRole,
    name: string,
    action: string,
    fileReference?: string,
    type: AgentActivityItem["type"] = "progress"
  ) => {
    const item: AgentActivityItem = {
      id: generateId("act"),
      timestamp: timestampIso,
      agentRole: role,
      agentName: name,
      action,
      fileReference,
      type,
    };
    updatedRun.activityFeed.unshift(item);

    const agent = updatedRun.agents.find((a) => a.role === role);
    if (agent) {
      agent.activityLog.unshift(item);
    }
  };

  updatedRun.currentStep = stepNumber;

  switch (stepNumber) {
    case 1: {
      // Step 1: Architect starts working (35%), all others queued (0%)
      architect.status = "working";
      architect.progress = 35;
      architect.tasksCompleted = 0;
      architect.startedAt = architect.startedAt || now.toISOString();
      architect.currentTask = architect.assignedTasks[0]?.title || "Analyze architecture & dependency graph";
      if (architect.assignedTasks[0]) {
        architect.assignedTasks[0].status = "working";
        architect.assignedTasks[0].progress = 35;
      }

      frontend.status = "queued";
      frontend.progress = 0;
      frontend.tasksCompleted = 0;
      frontend.currentTask = frontend.assignedTasks[0]?.title || "Awaiting architecture decomposition";

      backend.status = "queued";
      backend.progress = 0;
      backend.tasksCompleted = 0;
      backend.currentTask = backend.assignedTasks[0]?.title || "Awaiting architecture decomposition";

      qa.status = "queued";
      qa.progress = 0;
      qa.tasksCompleted = 0;
      qa.currentTask = qa.assignedTasks[0]?.title || "Awaiting implementation components";

      addFeed(
        "architect",
        "Architect",
        "Architect started architecture decomposition",
        architect.referencedFiles[0] || "lib/auth.ts",
        "start"
      );
      break;
    }

    case 2: {
      // Step 2: Architect working (75%), others still queued
      architect.status = "working";
      architect.progress = 75;
      architect.tasksCompleted = 0;
      architect.currentTask = "Define session boundary & JWT token handling strategy";
      if (architect.assignedTasks[0]) {
        architect.assignedTasks[0].status = "working";
        architect.assignedTasks[0].progress = 75;
      }

      frontend.status = "queued";
      frontend.progress = 0;
      frontend.tasksCompleted = 0;

      backend.status = "queued";
      backend.progress = 0;
      backend.tasksCompleted = 0;

      qa.status = "queued";
      qa.progress = 0;
      qa.tasksCompleted = 0;

      addFeed(
        "architect",
        "Architect",
        "Defined session boundary & JWT token handling strategy",
        architect.referencedFiles[1] || "lib/auth-context.tsx",
        "progress"
      );
      break;
    }

    case 3: {
      // Step 3: Architect completed (100%), Frontend (20%) & Backend (25%) start working
      architect.status = "completed";
      architect.progress = 100;
      architect.tasksCompleted = architect.tasksTotal || 1;
      architect.completedAt = architect.completedAt || now.toISOString();
      architect.currentTask = "Architecture decomposition completed";
      if (architect.assignedTasks[0]) {
        architect.assignedTasks[0].status = "completed";
        architect.assignedTasks[0].progress = 100;
      }

      frontend.status = "working";
      frontend.progress = 20;
      frontend.tasksCompleted = 0;
      frontend.startedAt = frontend.startedAt || now.toISOString();
      frontend.currentTask = frontend.assignedTasks[0]?.title || "Implement Sign-In & Registration UI";
      if (frontend.assignedTasks[0]) {
        frontend.assignedTasks[0].status = "working";
        frontend.assignedTasks[0].progress = 20;
      }

      backend.status = "working";
      backend.progress = 25;
      backend.tasksCompleted = 0;
      backend.startedAt = backend.startedAt || now.toISOString();
      backend.currentTask = backend.assignedTasks[0]?.title || "Route protection & session guard middleware";
      if (backend.assignedTasks[0]) {
        backend.assignedTasks[0].status = "working";
        backend.assignedTasks[0].progress = 25;
      }

      qa.status = "queued";
      qa.progress = 0;
      qa.tasksCompleted = 0;
      qa.currentTask = qa.assignedTasks[0]?.title || "Awaiting implementation components";

      addFeed(
        "architect",
        "Architect",
        "Architect completed architecture analysis & task decomposition",
        architect.referencedFiles[0],
        "complete"
      );
      addFeed(
        "frontend",
        "Frontend",
        "Frontend started Sign-In & Registration UI components",
        frontend.referencedFiles[0] || "components/auth/LoginForm.tsx",
        "start"
      );
      addFeed(
        "backend",
        "Backend",
        "Backend started route protection & session guard middleware",
        backend.referencedFiles[0] || "src/App.tsx",
        "start"
      );
      break;
    }

    case 4: {
      // Step 4: Frontend (55%) & Backend (60%) parallel progress; Architect completed; QA queued
      architect.status = "completed";
      architect.progress = 100;
      architect.tasksCompleted = architect.tasksTotal || 1;
      architect.currentTask = "Architecture decomposition completed";

      frontend.status = "working";
      frontend.progress = 55;
      frontend.tasksCompleted = 0;
      frontend.currentTask = "Constructing modal dialog & form validation";
      if (frontend.assignedTasks[0]) {
        frontend.assignedTasks[0].status = "working";
        frontend.assignedTasks[0].progress = 55;
      }

      backend.status = "working";
      backend.progress = 60;
      backend.tasksCompleted = 0;
      backend.currentTask = "Injecting session state and user avatar context into layout";
      if (backend.assignedTasks[0]) {
        backend.assignedTasks[0].status = "working";
        backend.assignedTasks[0].progress = 60;
      }

      qa.status = "queued";
      qa.progress = 0;
      qa.tasksCompleted = 0;

      addFeed(
        "frontend",
        "Frontend",
        "Constructed modal dialog and client-side credential validation",
        frontend.referencedFiles[0] || "components/auth/LoginForm.tsx",
        "progress"
      );
      addFeed(
        "backend",
        "Backend",
        "Injected session state and user avatar context into layout",
        backend.referencedFiles[1] || "components/auth/AuthGuard.tsx",
        "progress"
      );
      break;
    }

    case 5: {
      // Step 5: Frontend completes (100%); Backend finishing (85%); Architect completed; QA queued
      architect.status = "completed";
      architect.progress = 100;
      architect.tasksCompleted = architect.tasksTotal || 1;

      frontend.status = "completed";
      frontend.progress = 100;
      frontend.tasksCompleted = frontend.tasksTotal || 1;
      frontend.completedAt = frontend.completedAt || now.toISOString();
      frontend.currentTask = "UI components and responsive states completed";
      if (frontend.assignedTasks[0]) {
        frontend.assignedTasks[0].status = "completed";
        frontend.assignedTasks[0].progress = 100;
      }

      backend.status = "working";
      backend.progress = 85;
      backend.tasksCompleted = 0;
      backend.currentTask = "Validating server-side redirection rules for unauthenticated users";
      if (backend.assignedTasks[0]) {
        backend.assignedTasks[0].status = "working";
        backend.assignedTasks[0].progress = 85;
      }

      qa.status = "queued";
      qa.progress = 0;
      qa.tasksCompleted = 0;

      addFeed(
        "frontend",
        "Frontend",
        "Frontend completed LoginForm implementation and responsive states",
        frontend.referencedFiles[1] || "app/login/page.tsx",
        "complete"
      );
      break;
    }

    case 6: {
      // Step 6: Backend completes (100%); QA starts (40%); Architect & Frontend completed
      architect.status = "completed";
      architect.progress = 100;
      architect.tasksCompleted = architect.tasksTotal || 1;

      frontend.status = "completed";
      frontend.progress = 100;
      frontend.tasksCompleted = frontend.tasksTotal || 1;

      backend.status = "completed";
      backend.progress = 100;
      backend.tasksCompleted = backend.tasksTotal || 1;
      backend.completedAt = backend.completedAt || now.toISOString();
      backend.currentTask = "Route guard & session tokens completed";
      if (backend.assignedTasks[0]) {
        backend.assignedTasks[0].status = "completed";
        backend.assignedTasks[0].progress = 100;
      }

      qa.status = "working";
      qa.progress = 40;
      qa.tasksCompleted = 0;
      qa.startedAt = qa.startedAt || now.toISOString();
      qa.currentTask = qa.assignedTasks[0]?.title || "Automated test verification";
      if (qa.assignedTasks[0]) {
        qa.assignedTasks[0].status = "working";
        qa.assignedTasks[0].progress = 40;
      }

      addFeed(
        "backend",
        "Backend",
        "Backend completed route guard and session token verification",
        backend.referencedFiles[1] || "components/auth/AuthGuard.tsx",
        "complete"
      );
      addFeed(
        "qa",
        "QA",
        "QA started test verification suite",
        qa.referencedFiles[0] || "tests/auth.test.ts",
        "start"
      );
      break;
    }

    case 7: {
      // Step 7: QA in progress (80%); Architect, Frontend, Backend completed
      architect.status = "completed";
      architect.progress = 100;
      architect.tasksCompleted = architect.tasksTotal || 1;

      frontend.status = "completed";
      frontend.progress = 100;
      frontend.tasksCompleted = frontend.tasksTotal || 1;

      backend.status = "completed";
      backend.progress = 100;
      backend.tasksCompleted = backend.tasksTotal || 1;

      qa.status = "working";
      qa.progress = 80;
      qa.tasksCompleted = 0;
      qa.currentTask = "Validating session persistence across simulated page reloads";
      if (qa.assignedTasks[0]) {
        qa.assignedTasks[0].status = "working";
        qa.assignedTasks[0].progress = 80;
      }

      addFeed(
        "qa",
        "QA",
        "Validated session persistence across simulated page reloads",
        qa.referencedFiles[0] || "tests/auth.test.ts",
        "progress"
      );
      break;
    }

    case 8:
    default: {
      // Step 8+: Final state — ALL FOUR agents completed at 100%
      architect.status = "completed";
      architect.progress = 100;
      architect.tasksCompleted = architect.tasksTotal || 1;
      architect.currentTask = "Architecture decomposition completed";
      if (architect.assignedTasks[0]) {
        architect.assignedTasks[0].status = "completed";
        architect.assignedTasks[0].progress = 100;
      }

      frontend.status = "completed";
      frontend.progress = 100;
      frontend.tasksCompleted = frontend.tasksTotal || 1;
      frontend.currentTask = "UI components and responsive states completed";
      if (frontend.assignedTasks[0]) {
        frontend.assignedTasks[0].status = "completed";
        frontend.assignedTasks[0].progress = 100;
      }

      backend.status = "completed";
      backend.progress = 100;
      backend.tasksCompleted = backend.tasksTotal || 1;
      backend.currentTask = "Route guard & session tokens completed";
      if (backend.assignedTasks[0]) {
        backend.assignedTasks[0].status = "completed";
        backend.assignedTasks[0].progress = 100;
      }

      qa.status = "completed";
      qa.progress = 100;
      qa.tasksCompleted = qa.tasksTotal || 1;
      qa.completedAt = qa.completedAt || now.toISOString();
      qa.currentTask = "All test assertions passed cleanly";
      if (qa.assignedTasks[0]) {
        qa.assignedTasks[0].status = "completed";
        qa.assignedTasks[0].progress = 100;
      }

      updatedRun.status = "completed";
      updatedRun.progress = 100;
      updatedRun.completedTasks = 4;
      updatedRun.totalTasks = 4;
      updatedRun.completedAt = now.toISOString();
      updatedRun.updatedAt = now.toISOString();

      addFeed(
        "qa",
        "QA",
        "QA completed test suite: 4/4 assertions passed cleanly",
        qa.referencedFiles[0] || "tests/auth.test.ts",
        "complete"
      );
      addFeed(
        "architect",
        "Architect",
        "Agent workflow completed. All planned tasks have finished.",
        undefined,
        "complete"
      );

      return { updatedRun, isComplete: true };
    }
  }

  // Authoritative task and progress calculations for steps 1-7
  const totalCompleted = updatedRun.agents.filter((a) => a.status === "completed").length;
  updatedRun.completedTasks = totalCompleted;
  updatedRun.totalTasks = 4;
  updatedRun.status = "executing";
  updatedRun.progress = STEP_PROGRESS[stepNumber] ?? Math.min(95, Math.round(updatedRun.agents.reduce((sum, a) => sum + a.progress, 0) / 4));
  updatedRun.updatedAt = now.toISOString();

  return { updatedRun, isComplete: false };
}
