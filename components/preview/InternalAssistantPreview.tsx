"use client";

import React, { useState } from "react";
import { ViewportMode, InspectorRegion } from "@/lib/preview/types";
import { cn } from "@/lib/utils";
import {
  Bot,
  MessageSquare,
  BookOpen,
  History,
  Send,
  Sparkles,
  Paperclip,
  CheckCircle2,
  FileText,
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface InternalAssistantPreviewProps {
  productName?: string;
  viewportMode: ViewportMode;
  isInspectorActive?: boolean;
  onSelectInspectorRegion?: (region: InspectorRegion) => void;
}

interface AssistantMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Array<{ title: string; section: string }>;
}

const INITIAL_MESSAGES: AssistantMessage[] = [
  {
    id: "msg_init_1",
    sender: "user",
    content: "Summarize our deployment pipeline SLA and on-call escalation policy.",
    timestamp: "10:42 AM",
  },
  {
    id: "msg_init_2",
    sender: "assistant",
    content: `Here is the current operational policy extracted from internal engineering docs:

### 1. Deployment Pipeline SLA
- **Production Deployments:** Automated smoke tests + canary analysis run in under 4 minutes.
- **Rollback Target:** Automated rollbacks execute within 60 seconds if error rate exceeds 0.05%.
- **Zero-Downtime Guarantee:** Blue/Green rolling migrations via Kubernetes ingress controllers.

### 2. On-Call Escalation Matrix
- **Tier 1 (Automated Pager):** Primary on-call engineer alerted via PagerDuty (5-min ACK SLA).
- **Tier 2 (Secondary Escalation):** If unacknowledged after 10 mins, escalates to Engineering Lead.
- **Tier 3 (Executive Notification):** P0 outages lasting > 30 minutes notify VP of Engineering.`,
    timestamp: "10:43 AM",
    citations: [
      { title: "Engineering Handbook 2026", section: "§ 4.2 Deployment SLA" },
      { title: "Incident Response Playbook", section: "§ 1.4 Escalation Matrix" },
    ],
  },
];

const KNOWLEDGE_SOURCES = [
  { id: "kb_1", name: "Engineering Handbook 2026", type: "Markdown", size: "1.4 MB", status: "Indexed · Synced", icon: FileText },
  { id: "kb_2", name: "Incident Response Playbook", type: "PDF", size: "840 KB", status: "Indexed · Synced", icon: FileText },
  { id: "kb_3", name: "Production Architecture v2.4", type: "Notion Sync", size: "3.2 MB", status: "Indexed · Synced", icon: BookOpen },
  { id: "kb_4", name: "Security & SOC2 Guidelines", type: "PDF", size: "2.1 MB", status: "Indexed · Synced", icon: ShieldCheck },
];

const RECENT_THREADS = [
  { id: "th_1", title: "Incident triage postmortem P0-409", date: "Today", count: 8 },
  { id: "th_2", title: "Q3 OKR engineering capacity analysis", date: "Yesterday", count: 14 },
  { id: "th_3", title: "Supabase connection pooling setup", date: "Sep 24", count: 6 },
  { id: "th_4", title: "Stripe webhook idempotency guidelines", date: "Sep 22", count: 11 },
];

export function InternalAssistantPreview({
  productName = "Internal Assistant",
  viewportMode,
  isInspectorActive = false,
  onSelectInspectorRegion,
}: InternalAssistantPreviewProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "knowledge" | "history">("chat");
  const [messages, setMessages] = useState<AssistantMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [kbSearch, setKbSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const isMobile = viewportMode === "mobile";
  const isTablet = viewportMode === "tablet";

  const triggerInspector = (
    id: string,
    name: string,
    componentName: string,
    filePath: string,
    description: string
  ) => {
    if (!isInspectorActive || !onSelectInspectorRegion) return;
    onSelectInspectorRegion({
      id,
      name,
      componentName,
      filePath,
      route: "/assistant",
      agentRole: "frontend",
      stepNumber: 2,
      description,
      stateSnapshot: {
        activeTab,
        messagesCount: messages.length,
        isTyping,
      },
    });
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: AssistantMessage = {
      id: `msg_user_${messages.length + 1}`,
      sender: "user",
      content: text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let replyContent = `I searched the internal knowledge base for **"${text}"**.\n\nAll systems are operating normally. Based on current documentation, the relevant specifications and team workflows have been verified with 99.4% confidence score.`;
      const citations = [
        { title: "Engineering Handbook 2026", section: "§ 2.1 Core Services" },
      ];

      if (/deploy|sla|release/i.test(text)) {
        replyContent = `Deployment status is healthy across all regions. Canary verification runs automatically with a 4-minute threshold. Zero incidents detected in the last 72 hours.`;
        citations.push({ title: "Release Runbook", section: "§ 5.0 Automation" });
      } else if (/auth|security|login|token/i.test(text)) {
        replyContent = `Authentication runs via JWT session tokens refreshed automatically every 15 minutes. RBAC policies enforce role restrictions at both API gateway and database levels.`;
        citations.push({ title: "Security & SOC2 Guidelines", section: "§ 3.2 Token Lifecycle" });
      }

      const botMsg: AssistantMessage = {
        id: `msg_asst_${messages.length + 2}`,
        sender: "assistant",
        content: replyContent,
        timestamp: "Just now",
        citations,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const suggestedPrompts = [
    "Review API authentication policy",
    "Check deployment pipeline SLA",
    "List indexed knowledge sources",
    "Summarize on-call rotation",
  ];

  return (
    <div className="w-full h-full flex bg-[#0A0D14] text-[#C9D1D9] font-sans overflow-hidden select-none antialiased">
      {/* 1. Left Navigation Sidebar */}
      <aside
        onClick={() =>
          triggerInspector(
            "assistant-nav",
            "Assistant Left Navigation",
            "AssistantSidebar",
            "components/assistant/AssistantSidebar.tsx",
            "Sidebar routing for Chat, Knowledge Base, and Recent Threads"
          )
        }
        className={cn(
          "h-full border-r border-[#21262D] bg-[#0E1117] flex flex-col justify-between shrink-0 transition-all",
          isInspectorActive &&
            "hover:border-[#00F2FE]/70 hover:bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30",
          isMobile || isTablet ? "w-16 items-center p-2" : "w-60 p-3"
        )}
      >
        <div className="space-y-4">
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#21262D]">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#A855F7] p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,242,254,0.25)]">
              <div className="h-full w-full bg-[#0A0D14] rounded-[6px] flex items-center justify-center">
                <Bot className="h-4 w-4 text-[#00F2FE]" />
              </div>
            </div>
            {!isMobile && !isTablet && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-white truncate">
                  {productName}
                </span>
                <span className="text-[10px] font-mono text-[#8B949E]">
                  AI Internal Assistant
                </span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-1">
            {[
              { id: "chat", label: "Assistant Chat", icon: MessageSquare, badge: "Active" },
              { id: "knowledge", label: "Knowledge Base", icon: BookOpen, badge: "4 Synced" },
              { id: "history", label: "Recent Conversations", icon: History, badge: "4" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab.id as "chat" | "knowledge" | "history");
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer",
                    isActive
                      ? "bg-[#161B22] text-white border border-[#30363D] shadow-sm"
                      : "text-[#8B949E] hover:text-white hover:bg-[#161B22]/50 border border-transparent",
                    (isMobile || isTablet) && "justify-center px-0"
                  )}
                  title={tab.label}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-[#00F2FE]" : "text-[#8B949E]"
                    )}
                  />
                  {!isMobile && !isTablet && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={cn(
                            "text-[9px] font-mono px-1.5 py-0.5 rounded",
                            isActive
                              ? "bg-[#00F2FE]/15 text-[#00F2FE]"
                              : "bg-[#21262D] text-[#8B949E]"
                          )}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="p-2.5 rounded-lg bg-[#161B22]/60 border border-[#21262D] space-y-1 text-[10px] font-mono text-[#8B949E]">
          {!isMobile && !isTablet ? (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#3FB950]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3FB950] animate-pulse" />
                  RAG Pipeline Live
                </span>
                <span className="text-white">v1.2</span>
              </div>
              <div className="text-[9px] text-[#6E7681] truncate">
                Vector DB: pgvector (Supabase)
              </div>
            </>
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#3FB950] mx-auto block" />
          )}
        </div>
      </aside>

      {/* 2. Main Stage */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0D14]">
        {/* Top Header */}
        <header
          onClick={() =>
            triggerInspector(
              "assistant-header",
              "Assistant Header & Context Strip",
              "AssistantHeader",
              "components/assistant/AssistantHeader.tsx",
              "Displays connected model, latency, and Architect build certification"
            )
          }
          className={cn(
            "h-13 w-full border-b border-[#21262D] bg-[#0E1117] px-4 sm:px-6 flex items-center justify-between shrink-0 transition-all",
            isInspectorActive &&
              "hover:border-[#00F2FE]/70 hover:bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30"
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2 whitespace-nowrap">
              <span className="whitespace-nowrap">{productName}</span>
              <span className="text-[10px] font-mono text-[#3FB950] bg-[#3FB950]/10 border border-[#3FB950]/20 px-1.5 py-0.5 rounded inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3FB950]" />
                Online
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            <div className="hidden xl:flex items-center gap-2 font-mono text-[11px] text-[#8B949E] whitespace-nowrap shrink-0">
              <span className="text-[#C9D1D9]">Model:</span>
              <span className="text-[#00F2FE]">Claude 3.5 Sonnet</span>
              <span className="text-[#6E7681]">·</span>
              <span className="text-[#3FB950]">28ms latency</span>
            </div>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#00F2FE] bg-[#00F2FE]/10 px-2 py-1 rounded-lg border border-[#00F2FE]/30 whitespace-nowrap shrink-0">
              <Sparkles className="h-3 w-3 shrink-0" />
              <span className="whitespace-nowrap">Built by Architect</span>
            </span>
          </div>
        </header>

        {/* View A: Chat Conversation View */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Knowledge Context Indicator Banner */}
            <div
              onClick={() =>
                triggerInspector(
                  "context-banner",
                  "Knowledge Context Indicator",
                  "ContextIndicator",
                  "components/assistant/ContextIndicator.tsx",
                  "Realtime citation and synced context indicator banner"
                )
              }
              className={cn(
                "px-4 py-2 bg-[#161B22]/70 border-b border-[#21262D] flex items-center justify-between text-xs text-[#8B949E] shrink-0 transition-all",
                isInspectorActive &&
                  "hover:border-[#00F2FE]/70 hover:bg-[#00F2FE]/10 cursor-pointer"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <BookOpen className="h-3.5 w-3.5 text-[#00F2FE] shrink-0" />
                <span className="truncate">
                  <strong className="text-white font-medium">Context active:</strong> 4
                  internal knowledge sources synced · Q3 Engineering Wiki & Runbooks
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#3FB950] hidden sm:inline-flex items-center gap-1 shrink-0">
                <CheckCircle2 className="h-3 w-3" /> Up to date
              </span>
            </div>

            {/* Conversation Feed */}
            <div
              onClick={() =>
                triggerInspector(
                  "conversation-feed",
                  "Conversation Feed & Responses",
                  "ConversationFeed",
                  "components/assistant/ConversationFeed.tsx",
                  "Rendered user queries, assistant formatted responses, and doc citations"
                )
              }
              className={cn(
                "flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 transition-all",
                isInspectorActive &&
                  "hover:border-[#00F2FE]/70 hover:bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/20"
              )}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col space-y-1.5 max-w-3xl",
                    msg.sender === "user" ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#8B949E] px-1">
                    <span>{msg.sender === "user" ? "You" : productName}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={cn(
                      "p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm",
                      msg.sender === "user"
                        ? "bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-white rounded-br-none"
                        : "bg-[#161B22] border border-[#262C36] text-[#E6EDF3] rounded-bl-none space-y-2.5"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Citations List if provided */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 border-t border-[#30363D]/70 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B949E]">
                          Verified Citations ({msg.citations.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((cite, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0E1117] border border-[#30363D] text-[10px] font-mono text-[#00F2FE] hover:border-[#00F2FE]/60 transition-colors"
                            >
                              <FileText className="h-2.5 w-2.5" />
                              <span>{cite.title}</span>
                              <span className="text-[#8B949E]">{cite.section}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#00F2FE] p-2 rounded-lg bg-[#161B22]/40 w-fit">
                  <Zap className="h-3.5 w-3.5 animate-pulse" />
                  <span>{productName} is thinking & citing sources...</span>
                </div>
              )}
            </div>

            {/* Bottom: Suggested Prompts & Message Composer */}
            <div className="p-3 sm:p-5 border-t border-[#21262D] bg-[#0E1117] space-y-2.5 shrink-0">
              {/* Suggested Prompts Pills */}
              <div
                onClick={() =>
                  triggerInspector(
                    "suggested-prompts",
                    "Assistant Suggested Prompts",
                    "SuggestedPrompts",
                    "components/assistant/SuggestedPrompts.tsx",
                    "Subtle context-aware prompt chips for zero-friction user inquiry"
                  )
                }
                className={cn(
                  "flex flex-wrap items-center gap-1.5",
                  isInspectorActive &&
                    "p-1 rounded border border-[#00F2FE]/40 bg-[#00F2FE]/5 cursor-pointer"
                )}
              >
                {suggestedPrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessage(promptText);
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#161B22] border border-[#30363D] hover:border-[#00F2FE]/60 hover:text-white text-[11px] text-[#8B949E] transition-all cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(0,242,254,0.12)]"
                  >
                    <span>{promptText}</span>
                  </button>
                ))}
              </div>

              {/* Message Composer */}
              <div
                onClick={() =>
                  triggerInspector(
                    "assistant-composer",
                    "Message Composer & Action Strip",
                    "AssistantComposer",
                    "components/assistant/AssistantComposer.tsx",
                    "Prompt textarea with keyboard shortcut support and attachment hooks"
                  )
                }
                className={cn(
                  "flex items-center gap-2 p-2 rounded-xl bg-[#161B22] border border-[#30363D] focus-within:border-[#00F2FE]/60 focus-within:ring-1 focus-within:ring-[#00F2FE]/30 transition-all",
                  isInspectorActive &&
                    "ring-1 ring-[#00F2FE]/50 bg-[#00F2FE]/5 cursor-pointer"
                )}
              >
                <button
                  type="button"
                  title="Attach reference document"
                  className="p-1.5 text-[#8B949E] hover:text-white rounded-lg hover:bg-[#21262D] transition-colors"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask anything about internal docs, codebase, or systems..."
                  className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-[#8B949E] focus:outline-none px-1"
                />

                <button
                  type="button"
                  disabled={!inputValue.trim() || isTyping}
                  onClick={() => handleSendMessage()}
                  className={cn(
                    "h-8 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer",
                    inputValue.trim() && !isTyping
                      ? "bg-[#00F2FE] hover:bg-[#38BDF8] text-black shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                      : "bg-[#21262D] text-[#6E7681] cursor-not-allowed"
                  )}
                >
                  <span>Send</span>
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View B: Knowledge Base Explorer View */}
        {activeTab === "knowledge" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#21262D]">
              <div>
                <h3 className="font-bold text-sm text-white">Indexed Knowledge Base</h3>
                <p className="text-xs text-[#8B949E]">
                  Internal documentation and repositories synced into vector memory.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-[#8B949E]" />
                <input
                  type="text"
                  placeholder="Search index..."
                  value={kbSearch}
                  onChange={(e) => setKbSearch(e.target.value)}
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-[#8B949E] focus:outline-none focus:border-[#00F2FE]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {KNOWLEDGE_SOURCES.filter((s) =>
                s.name.toLowerCase().includes(kbSearch.toLowerCase())
              ).map((src) => {
                const Icon = src.icon;
                return (
                  <div
                    key={src.id}
                    className="p-3.5 rounded-xl border border-[#21262D] bg-[#161B22]/70 hover:border-[#30363D] space-y-2 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-[#0E1117] border border-[#30363D] flex items-center justify-center text-[#00F2FE]">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium text-xs text-white truncate">
                          {src.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#3FB950] flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Synced
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8B949E] pt-1 border-t border-[#21262D]">
                      <span>{src.type} · {src.size}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("chat");
                          handleSendMessage(`Search details in ${src.name}`);
                        }}
                        className="text-[#00F2FE] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Query source <ChevronRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View C: Recent Conversations View */}
        {activeTab === "history" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            <h3 className="font-bold text-sm text-white pb-2 border-b border-[#21262D]">
              Recent Conversations
            </h3>

            <div className="space-y-2">
              {RECENT_THREADS.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => {
                    setActiveTab("chat");
                    handleSendMessage(`Resume thread: ${thread.title}`);
                  }}
                  className="p-3 rounded-xl border border-[#21262D] bg-[#161B22]/60 hover:border-[#00F2FE]/50 hover:bg-[#161B22] flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="h-4 w-4 text-[#00F2FE]" />
                    <div>
                      <div className="text-xs font-medium text-white">{thread.title}</div>
                      <div className="text-[10px] font-mono text-[#8B949E]">
                        {thread.count} messages · {thread.date}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#8B949E]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
