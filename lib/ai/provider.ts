/**
 * Architect 2.0 AI Provider Layer
 * Uses Groq as the primary LLM provider for conversational inference.
 * Automatically signals fallback to deterministic simulation when credentials are unavailable.
 */

import Groq from "groq-sdk";
import { buildSystemPrompt, ProjectContextSummary } from "./prompts";
import { Message, RequirementsSummary } from "../types";

export interface AIProviderResult {
  content: string;
  thinking?: string;
  contextFiles: string[];
  model: string;
  simulated: boolean;
  question?: string | null;
  options?: string[];
  requirementsSummary?: RequirementsSummary | null;
  isReadyForBuildPlan?: boolean;
}

export const GROQ_MODEL = "openai/gpt-oss-120b";

/**
 * Checks whether Groq credentials are validly configured server-side.
 * Returns false if the key is missing, empty, or left as the placeholder.
 */
export function isGroqConfigured(): boolean {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return false;
  const trimmed = apiKey.trim();
  return (
    trimmed.length > 0 &&
    trimmed !== "YOUR_KEY_HERE" &&
    trimmed !== "your_groq_api_key_here"
  );
}

export function isRealAIConfigured(): boolean {
  return isGroqConfigured();
}

/**
 * Executes chat inference via Groq's official API.
 * Keeps GROQ_API_KEY strictly server-side and never exposes it to client or logs.
 */
export async function callRealLLM(
  prompt: string,
  context: ProjectContextSummary,
  history: Message[]
): Promise<AIProviderResult | null> {
  if (!isGroqConfigured()) {
    console.log("[AI] Provider: Fallback (GROQ_API_KEY not configured or placeholder)");
    return null;
  }

  const apiKey = process.env.GROQ_API_KEY!.trim();

  // Safe development log (never logs API key or sensitive data)
  console.log(`[AI] Provider: Groq (model: ${GROQ_MODEL})`);

  try {
    const groq = new Groq({ apiKey });

    const systemMessage: Groq.Chat.ChatCompletionMessageParam = {
      role: "system",
      content: buildSystemPrompt(context),
    };

    // Format recent chat history for context continuity (max last 6 messages)
    const formattedHistory: Groq.Chat.ChatCompletionMessageParam[] = history
      .slice(-6)
      .filter((msg) => msg.content && typeof msg.content === "string")
      .map((msg) => ({
        role:
          msg.role === "assistant" || msg.sender === "architect"
            ? "assistant"
            : "user",
        content: msg.content,
      }));

    const userMessage: Groq.Chat.ChatCompletionMessageParam = {
      role: "user",
      content: prompt,
    };

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      response_format: { type: "json_object" },
      messages: [systemMessage, ...formattedHistory, userMessage],
      temperature: 0.25,
      max_tokens: 1200,
    });

    const reply = completion.choices?.[0]?.message?.content;
    if (!reply || !reply.trim()) {
      console.warn("[AI] Groq returned empty response content. Falling back to simulation.");
      return null;
    }

    try {
      const parsed = JSON.parse(reply);
      const content =
        typeof parsed.message === "string" && parsed.message.trim()
          ? parsed.message.trim()
          : reply.trim();
      const thinking =
        typeof parsed.thinking === "string"
          ? parsed.thinking.trim()
          : `Synthesized architecture via Groq (${GROQ_MODEL}) prioritizing intent: "${prompt.slice(0, 36)}..."`;
      const question = typeof parsed.question === "string" ? parsed.question.trim() : null;
      const options = Array.isArray(parsed.options)
        ? parsed.options.filter((o: unknown) => typeof o === "string" && Boolean(o.trim()))
        : [];
      let requirementsSummary: RequirementsSummary | null =
        parsed.requirementsSummary && typeof parsed.requirementsSummary === "object"
          ? (parsed.requirementsSummary as RequirementsSummary)
          : null;

      const isReadyForBuildPlan = Boolean(
        parsed.isReadyForBuildPlan ||
        requirementsSummary !== null ||
        content.includes("Here's what I've understood")
      );

      // If ready for build plan but object was not formatted as JSON field, extract from markdown bullets
      if (isReadyForBuildPlan && !requirementsSummary) {
        const getField = (pattern: RegExp) => {
          const match = content.match(pattern);
          return match ? match[1].trim() : "";
        };

        const product =
          getField(/\*\*(?:Product|Product Name)\*\*:\s*([^\n\r]+)/i) ||
          "Customer Support Chatbot";
        const users =
          getField(/\*\*(?:Users|Target Users|Audience)\*\*:\s*([^\n\r]+)/i) ||
          "Customers and website visitors";
        const corePurpose =
          getField(/\*\*(?:Core Purpose|Purpose|Job)\*\*:\s*([^\n\r]+)/i) ||
          "Answer support questions and resolve common issues";
        const knowledge =
          getField(/\*\*(?:Knowledge|Knowledge Sources?|Data)\*\*:\s*([^\n\r]+)/i) ||
          "Company documentation and FAQs";
        const persistence =
          getField(/\*\*(?:Persistence|Storage|History)\*\*:\s*([^\n\r]+)/i) ||
          "Conversation history stored per user";
        const recommendedStack =
          getField(/\*\*(?:Recommended Stack|Stack)\*\*:\s*([^\n\r]+)/i) ||
          "Next.js + TypeScript + TailwindCSS + Supabase";

        requirementsSummary = {
          product,
          users,
          corePurpose,
          knowledge,
          persistence,
          recommendedStack,
        };
      }

      // Only show file references if analyzing an existing codebase or if explicitly referenced
      const isAnalyzingExisting = /\b(analyze|inspect|review|audit|refactor|existing\s+files)\b/i.test(prompt);
      const parsedFiles = Array.isArray(parsed.contextFiles)
        ? (parsed.contextFiles as unknown[]).filter((f): f is string => typeof f === "string" && Boolean(f.trim()))
        : [];
      const contextFiles = isAnalyzingExisting ? context.files.slice(0, 3) : parsedFiles;

      return {
        content,
        thinking,
        contextFiles,
        model: GROQ_MODEL,
        simulated: false,
        question: isReadyForBuildPlan ? null : question,
        options: isReadyForBuildPlan ? [] : options,
        requirementsSummary,
        isReadyForBuildPlan,
      };
    } catch {

      // If output wasn't valid JSON, fallback gracefully to treating text as content
      const isAnalyzingExisting = /\b(analyze|inspect|review|audit|refactor|existing\s+files)\b/i.test(prompt);
      return {
        content: reply.trim(),
        thinking: `Synthesized architecture via Groq (${GROQ_MODEL}) prioritizing intent: "${prompt.slice(0, 36)}..."`,
        contextFiles: isAnalyzingExisting ? context.files.slice(0, 3) : [],
        model: GROQ_MODEL,
        simulated: false,
      };
    }

  } catch (err: unknown) {
    const safeError = err instanceof Error ? err.message : "Unknown error";
    console.warn(`[AI] Groq call failed (${safeError}). Falling back to deterministic simulation.`);
    return null;
  }
}
