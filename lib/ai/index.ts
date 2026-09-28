/**
 * Architect 2.0 AI Orchestration Layer
 * Entry point for generating Architect AI responses with automatic provider/simulation fallback.
 */

import { Message, MessageAction, RequirementsSummary } from "../types";
import { ProjectContextSummary } from "./prompts";
import { generateSimulatedResponse } from "./simulation";
import { callRealLLM, isRealAIConfigured, GROQ_MODEL } from "./provider";

export interface GenerateAIResponseParams {
  prompt: string;
  context: ProjectContextSummary;
  history?: Message[];
}

export interface ArchitectAIResponse {
  content: string;
  thinking?: string;
  contextFiles: string[];
  suggestedActions: MessageAction[];
  summary: string;
  requirementsSummary?: RequirementsSummary | null;
  metadata: {
    model: string;
    simulated: boolean;
    category?: string;
    question?: string | null;
    options?: string[];
    requirementsSummary?: RequirementsSummary | null;
    isReadyForBuildPlan?: boolean;
  };
}

export async function generateArchitectResponse({
  prompt,
  context,
  history = [],
}: GenerateAIResponseParams): Promise<ArchitectAIResponse> {
  // 1. Try real LLM if configured
  if (isRealAIConfigured()) {
    const realResult = await callRealLLM(prompt, context, history);
    if (realResult) {
      // Build contextual suggested actions
      const actions: MessageAction[] = [];

      if (Array.isArray(realResult.options) && realResult.options.length > 0) {
        realResult.options.forEach((opt) => {
          actions.push({
            label: opt,
            action: "select_option",
            payload: { option: opt, content: opt },
          });
        });
      }

      // Only offer Create Build Plan action once discovery is complete and requirements summary exists
      if (realResult.isReadyForBuildPlan && realResult.requirementsSummary) {
        actions.push({
          label: "Create Build Plan →",
          action: "create_plan",
          payload: { requirementsSummary: realResult.requirementsSummary },
        });
      }


      return {
        content: realResult.content,
        thinking: realResult.thinking || `Analyzed intent using ${realResult.model}`,
        contextFiles: realResult.contextFiles,
        suggestedActions: actions,
        summary: `Analyzed "${prompt.slice(0, 30)}..."`,
        requirementsSummary: realResult.requirementsSummary,
        metadata: {
          model: realResult.model,
          simulated: false,
          question: realResult.question,
          options: realResult.options,
          requirementsSummary: realResult.requirementsSummary,
          isReadyForBuildPlan: realResult.isReadyForBuildPlan,
        },
      };
    }
  }

  // 2. Deterministic simulation engine fallback
  const simulated = generateSimulatedResponse(prompt, context);
  return {
    content: simulated.content,
    thinking: simulated.thinking,
    contextFiles: simulated.contextFiles,
    suggestedActions: simulated.suggestedActions,
    summary: simulated.summary,
    requirementsSummary: simulated.requirementsSummary,
    metadata: {
      model: "architect-simulation-v2",
      simulated: true,
      category: simulated.category,
      question: simulated.question,
      options: simulated.options,
      requirementsSummary: simulated.requirementsSummary,
      isReadyForBuildPlan: simulated.isReadyForBuildPlan,
    },
  };
}

export function getAIStatus(): { isSimulation: boolean; label: string } {
  const configured = isRealAIConfigured();
  return {
    isSimulation: !configured,
    label: configured ? `Groq (${GROQ_MODEL})` : "Simulation mode",
  };
}
