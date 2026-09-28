/**
 * Architect 2.0 — Deterministic Preview Scenario Selector
 *
 * Inspects project details, latest approved Build Plan, active agent run,
 * or user prompt to deterministically route the interactive preview to the
 * matching application scenario:
 *
 * 1. "assistant"   -> Internal Assistant / AI Chatbot
 * 2. "supportdesk" -> Customer Support / Ticket Inbox
 * 3. "dashboard"   -> SaaS Analytics & KPI Dashboard
 * 4. "landing"     -> SaaS Marketing & Landing Page
 */

import { ProjectDetails, BuildPlan } from "@/lib/types";
import { AgentRun } from "@/lib/agents/types";

export type PreviewScenario = "assistant" | "supportdesk" | "dashboard" | "landing";

export interface ScenarioSelectionResult {
  scenario: PreviewScenario;
  matchedReason: string;
  activePlanTitle?: string;
  productName: string;
}

export function detectPreviewScenario({
  project,
  initialPlans = [],
  initialRuns = [],
  selectedPlanId,
}: {
  project: ProjectDetails;
  initialPlans?: BuildPlan[];
  initialRuns?: AgentRun[];
  selectedPlanId?: string;
}): ScenarioSelectionResult {
  // 1. Locate the target Build Plan
  let activePlan: BuildPlan | undefined;
  if (selectedPlanId) {
    activePlan = initialPlans.find((p) => p.id === selectedPlanId);
  }

  // Fallback to latest run plan
  if (!activePlan && initialRuns.length > 0) {
    const recentRun = initialRuns.find((r) => r.status === "completed") || initialRuns[0];
    if (recentRun?.buildPlanId) {
      activePlan = initialPlans.find((p) => p.id === recentRun.buildPlanId);
    }
    if (!activePlan && recentRun?.buildPlanTitle) {
      activePlan = initialPlans.find((p) => p.title === recentRun.buildPlanTitle);
    }
  }

  // Fallback to latest approved or executed plan
  if (!activePlan && initialPlans.length > 0) {
    activePlan =
      initialPlans.find(
        (p) =>
          p.status === "approved" ||
          p.status === "completed" ||
          p.status === "in_progress"
      ) || initialPlans[0];
  }

  // 2. Extract recent user prompt intent
  const userMessages = Array.isArray(project.messages)
    ? project.messages.filter((m) => m.sender === "user" || m.role === "user")
    : [];
  const latestUserMessage = userMessages[userMessages.length - 1];

  // 3. Assemble tokens to match against
  const planTitle = activePlan?.title || initialRuns[0]?.buildPlanTitle;
  const tokens = [
    planTitle,
    activePlan?.summary,
    initialRuns[0]?.buildPlanTitle,
    latestUserMessage?.content,
    project.name,
    project.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Clean formatted name from plan
  const cleanPlanName = planTitle
    ? planTitle.replace(/\b(build\s*plan|plan|architecture)\b/gi, "").trim()
    : undefined;

  // 4. Scenario Matching Rules

  // A. Internal Assistant / AI Chatbot
  if (
    /\b(assistant|chatbot|chat\s*bot|copilot|conversational|ai\s*agent|chat\s*interface|bot|internal\s*assistant)\b/i.test(
      tokens
    )
  ) {
    return {
      scenario: "assistant",
      matchedReason: `Matched assistant/chatbot intent: "${planTitle || latestUserMessage?.content || project.name}"`,
      activePlanTitle: planTitle,
      productName: cleanPlanName || "Internal Assistant",
    };
  }

  // C. Dashboard / Analytics
  if (
    /\b(dashboard|analytics|kpi|metrics|telemetry|chart|reporting|monitor|control\s*center)\b/i.test(
      tokens
    )
  ) {
    return {
      scenario: "dashboard",
      matchedReason: `Matched dashboard/metrics intent: "${planTitle || latestUserMessage?.content || project.name}"`,
      activePlanTitle: planTitle,
      productName: cleanPlanName || `${project.name} Dashboard`,
    };
  }

  // D. Generic SaaS / Landing Page
  if (
    /\b(landing|landing\s*page|marketing|showcase|waitlist|homepage|hero\s*page)\b/i.test(
      tokens
    )
  ) {
    return {
      scenario: "landing",
      matchedReason: `Matched landing page intent: "${planTitle || latestUserMessage?.content || project.name}"`,
      activePlanTitle: planTitle,
      productName: cleanPlanName || `${project.name} SaaS`,
    };
  }

  // B. Customer Support / SupportDesk
  if (
    /\b(support|supportdesk|ticket|inbox|helpdesk|service\s*desk|customer\s*service)\b/i.test(
      tokens
    ) ||
    project.id === "prj_supportdesk" ||
    project.template === "nextjs-saas"
  ) {
    return {
      scenario: "supportdesk",
      matchedReason: `Matched customer support intent: "${planTitle || project.name}"`,
      activePlanTitle: planTitle,
      productName: "SupportDesk AI",
    };
  }

  // Fallback (Requirement 10: Default to SupportDesk)
  return {
    scenario: "supportdesk",
    matchedReason: "Default fallback to SupportDesk AI",
    activePlanTitle: planTitle,
    productName: "SupportDesk AI",
  };
}
