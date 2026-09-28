"use client";

import React, { useState } from "react";
import { Message, MessageAction, RequirementsSummary } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import {
  Sparkles,
  User,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Brain,
  Rocket,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

export interface ChatMessageProps {
  message: Message;
  onActionClick?: (action: MessageAction) => void;
}

export function ChatMessage({ message, onActionClick }: ChatMessageProps) {
  const { addToast } = useToast();
  const [showThinking, setShowThinking] = useState(false);

  const isAssistant =
    message.role === "assistant" ||
    message.sender === "architect" ||
    message.sender === "system";

  const isSystem = message.sender === "system" || message.role === "system";

  const handleFileClick = (filePath: string) => {
    addToast({
      type: "info",
      title: "File Reference",
      message: `File: ${filePath}`,
    });
  };

  const handleActionClick = (action: MessageAction) => {
    if (action.action === "create_plan") {
      if (onActionClick) {
        onActionClick({
          ...action,
          payload: {
            sourceMessageId: message.id,
            content: message.content,
          },
        });
      }
      return;
    }

    if (action.action === "deploy_preview") {
      addToast({
        type: "info",
        title: "Preview",
        message: "Application preview will be available in a later phase.",
      });
      return;
    }

    if (onActionClick) {
      onActionClick(action);
    }
  };

  // Render markdown text with bolding, lists, and inline file chips
  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, lineIdx) => {
      // Empty line
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // H3 Heading ###
      if (line.startsWith("### ")) {
        return (
          <h4
            key={lineIdx}
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F2FE] mt-3 mb-1.5"
          >
            {line.replace("### ", "")}
          </h4>
        );
      }

      // Numbered List (1. 2. 3.)
      const listMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (listMatch) {
        const num = listMatch[1];
        const rest = listMatch[2];
        return (
          <div key={lineIdx} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed my-1">
            <span className="font-mono text-[#00F2FE] font-semibold shrink-0">
              {num}.
            </span>
            <div className="flex-1">{renderInlineTokens(rest)}</div>
          </div>
        );
      }

      // Bullet List (- or *)
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed my-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] shrink-0 mt-2" />
            <div className="flex-1">{renderInlineTokens(line.slice(2))}</div>
          </div>
        );
      }

      // Standard paragraph
      return (
        <p key={lineIdx} className="text-xs sm:text-sm leading-relaxed my-1 text-[#C9D1D9]">
          {renderInlineTokens(line)}
        </p>
      );
    });
  };

  // Parse bold **text** and inline `code/file` chips
  const renderInlineTokens = (content: string) => {
    const tokens = content.split(/(\*\*.*?\*\*|`.*?`)/g);

    return tokens.map((token, idx) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      }

      if (token.startsWith("`") && token.endsWith("`")) {
        const inner = token.slice(1, -1);
        const isFilePath =
          inner.includes("/") ||
          inner.endsWith(".ts") ||
          inner.endsWith(".tsx") ||
          inner.endsWith(".js") ||
          inner.endsWith(".json");

        if (isFilePath) {
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleFileClick(inner)}
              className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-[#161B22] border border-[#30363D] hover:border-[#00F2FE]/50 text-[#00F2FE] font-mono text-[11px] transition-colors cursor-pointer"
              title="Referenced file"
            >
              <FileCode2 className="h-3 w-3 shrink-0" />
              <span>{inner}</span>
            </button>
          );
        }

        return (
          <code
            key={idx}
            className="mx-0.5 px-1 py-0.5 rounded bg-[#161B22] border border-[#21262D] font-mono text-[11px] text-[#A855F7]"
          >
            {inner}
          </code>
        );
      }

      return token;
    });
  };

  // 1. User Message (Right Aligned)
  if (!isAssistant) {
    return (
      <div className="flex items-start justify-end gap-2.5 py-2 max-w-3xl mx-auto w-full select-text">
        <div className="flex flex-col items-end space-y-1 max-w-[85%] sm:max-w-xl">
          <div className="rounded-2xl bg-[#161B22] border border-[#30363D] px-4 py-3 text-white text-xs sm:text-sm leading-relaxed shadow-sm">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <span className="font-mono text-[10px] text-[#8B949E] px-1" suppressHydrationWarning>
            {formatTimestamp(message.createdAt)}
          </span>
        </div>

        <div className="h-7 w-7 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-center shrink-0 text-[#8B949E] mt-1">
          <User className="h-3.5 w-3.5" />
        </div>
      </div>
    );
  }

  // 2. System Notification Message
  if (isSystem) {
    return (
      <div className="py-2 max-w-3xl mx-auto w-full">
        <div className="rounded-xl border border-[#00F2FE]/25 bg-[#00F2FE]/5 p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center gap-2 text-[#00F2FE] font-semibold text-xs">
            <ClipboardList className="h-4 w-4" />
            <span>Architect Notification</span>
          </div>

          <div className="text-xs sm:text-sm text-[#C9D1D9] leading-relaxed">
            {renderFormattedContent(message.content)}
          </div>

          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {message.suggestedActions.map((act, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleActionClick(act)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#161B22] border border-[#00F2FE]/40 hover:border-[#00F2FE] hover:bg-[#00F2FE]/15 text-[#00F2FE] transition-all cursor-pointer shadow-sm"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>{act.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Architect Assistant Message (Left Aligned)
  return (
    <div className="flex items-start gap-3 py-2 max-w-3xl mx-auto w-full select-text">
      {/* Assistant Avatar */}
      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#A855F7] p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,242,254,0.25)] mt-1">
        <div className="h-full w-full bg-[#090A0F] rounded-[6px] flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-[#00F2FE]" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col space-y-2 min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-[#8B949E]">
          <span className="font-semibold text-white">Architect</span>
          <span>•</span>
          <span className="font-mono text-[10px]" suppressHydrationWarning>
            {formatTimestamp(message.createdAt)}
          </span>
        </div>

        {/* Collapsible Reasoning Block */}
        {message.thinking && (
          <div className="w-full rounded-lg border border-[#21262D] bg-[#0E1117] overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setShowThinking(!showThinking)}
              className="w-full px-2.5 py-1.5 flex items-center justify-between text-[#8B949E] hover:text-[#C9D1D9] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase">
                <Brain className="h-3 w-3 text-[#A855F7]" />
                <span>Architect Reasoning</span>
              </div>
              {showThinking ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
            {showThinking && (
              <div className="px-3 py-2 border-t border-[#21262D] text-[11px] text-[#8B949E] font-mono leading-relaxed bg-[#161B22]/40">
                {message.thinking}
              </div>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div className="rounded-2xl bg-[#0E1117] border border-[#30363D] p-4 sm:p-5 shadow-sm space-y-2">
          <div className="text-[#C9D1D9] space-y-1">
            {renderFormattedContent(message.content)}
          </div>

          {/* Context Files */}
          {message.contextFiles && message.contextFiles.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-[#21262D] flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-[#8B949E] flex items-center gap-1">
                <FileCode2 className="h-3 w-3 text-[#00F2FE]" />
                Referenced:
              </span>
              {message.contextFiles.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleFileClick(f)}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#161B22] border border-[#30363D] hover:border-[#00F2FE]/60 text-[#C9D1D9] hover:text-[#00F2FE] transition-colors cursor-pointer"
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* Discovery: Contextual Selectable Options */}
          {(() => {
            const reqSummary =
              message.requirementsSummary ||
              (message.metadata?.requirementsSummary as RequirementsSummary | undefined);
            const optionsActions = (message.suggestedActions || []).filter(
              (a) => a.action === "select_option"
            );
            const otherActions = (message.suggestedActions || []).filter(
              (a) => a.action !== "select_option" && a.action !== "create_plan"
            );


            return (
              <>
                {/* 1. Requirements Summary Card */}
                {reqSummary && (
                  <div className="mt-3 pt-3 border-t border-[#21262D]">
                    <div className="rounded-xl border border-[#00F2FE]/30 bg-gradient-to-b from-[#00F2FE]/10 via-[#00F2FE]/5 to-transparent p-4 space-y-3.5 shadow-[0_0_25px_rgba(0,242,254,0.08)]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#00F2FE]">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Requirements Summary</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#00F2FE] bg-[#00F2FE]/15 px-2 py-0.5 rounded border border-[#00F2FE]/30">
                          Ready to Build
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-[#0E1117] border border-[#30363D] space-y-0.5">
                          <span className="text-[10px] font-mono uppercase text-[#8B949E]">
                            Product
                          </span>
                          <p className="font-semibold text-white">
                            {reqSummary.product}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0E1117] border border-[#30363D] space-y-0.5">
                          <span className="text-[10px] font-mono uppercase text-[#8B949E]">
                            Users
                          </span>
                          <p className="font-semibold text-white">
                            {reqSummary.users}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0E1117] border border-[#30363D] space-y-0.5 sm:col-span-2">
                          <span className="text-[10px] font-mono uppercase text-[#8B949E]">
                            Core Purpose
                          </span>
                          <p className="text-[#F0F6FC]">
                            {reqSummary.corePurpose}
                          </p>
                        </div>
                        {reqSummary.knowledge && (
                          <div className="p-2.5 rounded-lg bg-[#0E1117] border border-[#30363D] space-y-0.5">
                            <span className="text-[10px] font-mono uppercase text-[#8B949E]">
                              Knowledge / Data
                            </span>
                            <p className="text-[#C9D1D9]">
                              {reqSummary.knowledge}
                            </p>
                          </div>
                        )}
                        {reqSummary.persistence && (
                          <div className="p-2.5 rounded-lg bg-[#0E1117] border border-[#30363D] space-y-0.5">
                            <span className="text-[10px] font-mono uppercase text-[#8B949E]">
                              Persistence
                            </span>
                            <p className="text-[#C9D1D9]">
                              {reqSummary.persistence}
                            </p>
                          </div>
                        )}
                        {reqSummary.recommendedStack && (
                          <div className="p-2.5 rounded-lg bg-[#0E1117] border border-[#30363D] space-y-0.5 sm:col-span-2">
                            <span className="text-[10px] font-mono uppercase text-[#8B949E]">
                              Recommended Stack
                            </span>
                            <p className="text-[#00F2FE] font-mono text-[11px]">
                              {reqSummary.recommendedStack}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#21262D]">
                        <span className="text-xs text-[#8B949E]">
                          Next: Synthesize implementation steps & milestone agents
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleActionClick({
                              label: "Create Build Plan →",
                              action: "create_plan",
                              payload: { requirementsSummary: reqSummary },
                            })
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#A855F7] text-[#090A0F] font-bold text-xs hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all cursor-pointer transform hover:scale-[1.02]"
                        >
                          <span>Create Build Plan</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Contextual Selectable Option Buttons (Radio style) */}
                {optionsActions.length > 0 && !reqSummary && (
                  <div className="mt-3 pt-3 border-t border-[#21262D] space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#8B949E]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE]" />
                      <span>Select an option:</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 pt-0.5">
                      {optionsActions.map((act, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleActionClick(act)}
                          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-[#00F2FE] hover:bg-[#00F2FE]/10 text-xs text-[#C9D1D9] hover:text-white transition-all text-left shadow-sm cursor-pointer"
                        >
                          <span className="h-3.5 w-3.5 rounded-full border border-[#8B949E] group-hover:border-[#00F2FE] group-hover:bg-[#00F2FE] flex items-center justify-center shrink-0 transition-colors">
                            <span className="h-1.5 w-1.5 rounded-full bg-transparent group-hover:bg-[#090A0F] transition-colors" />
                          </span>
                          <span className="font-medium">{act.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Secondary Actions (when requirements summary isn't active) */}
                {otherActions.length > 0 && !reqSummary && (
                  <div className="mt-2.5 pt-2 flex flex-wrap gap-2">
                    {otherActions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleActionClick(act)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#161B22] border border-[#00F2FE]/40 hover:border-[#00F2FE] hover:bg-[#00F2FE]/10 text-white transition-all shadow-[0_0_10px_rgba(0,242,254,0.08)] cursor-pointer"
                      >
                        {act.action === "create_plan" ? (
                          <Rocket className="h-3.5 w-3.5 text-[#00F2FE]" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-[#00F2FE]" />
                        )}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
