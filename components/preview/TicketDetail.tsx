"use client";

import React, { useState, useRef } from "react";
import { SupportTicket, TicketStatus, TicketPriority, TicketSentiment } from "@/lib/preview/types";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Send,
  Wand2,
  Building,
  Mail,
  ArrowLeft,
  Check,
  CheckCircle2,
  MessageSquare,
  UserCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TicketDetailProps {
  ticket: SupportTicket;
  onSendResponse: (ticketId: string, replyText: string) => void;
  onStatusChange?: (ticketId: string, newStatus: TicketStatus) => void;
  onAssignChange?: (ticketId: string, newAssignee: string) => void;
  onBackToList?: () => void;
  isInspectorActive?: boolean;
  onInspectAiSummary?: () => void;
  onInspectComposer?: () => void;
}

const PRIORITY_BADGES: Record<TicketPriority, { label: string; bg: string; text: string; border: string }> = {
  urgent: { label: "Urgent", bg: "bg-[#EF4444]/15", text: "text-[#EF4444]", border: "border-[#EF4444]/30" },
  high: { label: "High", bg: "bg-[#F59E0B]/15", text: "text-[#F59E0B]", border: "border-[#F59E0B]/30" },
  normal: { label: "Normal", bg: "bg-[#38BDF8]/15", text: "text-[#38BDF8]", border: "border-[#38BDF8]/30" },
  low: { label: "Low", bg: "bg-[#8B949E]/15", text: "text-[#8B949E]", border: "border-[#8B949E]/30" },
};

const SENTIMENT_BADGES: Record<TicketSentiment, { label: string; text: string; bg: string; border: string }> = {
  negative: { label: "Negative", text: "text-[#FCA5A5]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/25" },
  frustrated: { label: "Frustrated", text: "text-[#FCA5A5]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/25" },
  anxious: { label: "Anxious", text: "text-[#FCD34D]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/25" },
  inquiring: { label: "Inquiring", text: "text-[#93C5FD]", bg: "bg-[#38BDF8]/10", border: "border-[#38BDF8]/25" },
  satisfied: { label: "Satisfied", text: "text-[#86EFAC]", bg: "bg-[#3FB950]/10", border: "border-[#3FB950]/25" },
};

const ASSIGNEES = ["Alex Rivera", "Devon Vance", "Sarah Lin", "Unassigned"];

export function TicketDetail({
  ticket,
  onSendResponse,
  onStatusChange,
  onAssignChange,
  onBackToList,
  isInspectorActive = false,
  onInspectAiSummary,
  onInspectComposer,
}: TicketDetailProps) {
  const [replyDraft, setReplyDraft] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [justSent, setJustSent] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const composerRef = useRef<HTMLTextAreaElement>(null);

  // Trigger feedback flash
  const flashNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2500);
  };

  // Simulate AI response generation
  const handleGenerateReply = () => {
    setIsGenerating(true);
    setReplyDraft("");

    const fullText = ticket.suggestedReply;
    let currentIdx = 0;

    const interval = setInterval(() => {
      currentIdx += 8;
      if (currentIdx >= fullText.length) {
        setReplyDraft(fullText);
        setIsGenerating(false);
        clearInterval(interval);
      } else {
        setReplyDraft(fullText.slice(0, currentIdx));
      }
    }, 25);
  };

  const handleUseSuggestion = () => {
    setReplyDraft(ticket.suggestedReply);
    composerRef.current?.focus();
  };

  const handleSend = () => {
    if (!replyDraft.trim()) return;
    onSendResponse(ticket.id, replyDraft.trim());
    setReplyDraft("");
    setJustSent(true);
    setTimeout(() => setJustSent(false), 2400);
  };

  // Action Button Handlers
  const handleReplyAction = () => {
    if (!replyDraft) {
      setReplyDraft(ticket.suggestedReply);
    }
    composerRef.current?.focus();
    composerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResolveAction = () => {
    const nextStatus = ticket.status === "resolved" ? "open" : "resolved";
    if (onStatusChange) {
      onStatusChange(ticket.id, nextStatus);
    }
    flashNotice(nextStatus === "resolved" ? "Ticket marked as Resolved" : "Ticket reopened");
  };

  const handleCloseAction = () => {
    if (onStatusChange) {
      onStatusChange(ticket.id, "closed");
    }
    flashNotice("Ticket marked as Closed");
  };

  const handleCycleAssign = () => {
    const currentIdx = ASSIGNEES.indexOf(ticket.assignee || "Unassigned");
    const nextAssignee = ASSIGNEES[(currentIdx + 1) % ASSIGNEES.length];
    if (onAssignChange) {
      onAssignChange(ticket.id, nextAssignee);
    }
    flashNotice(`Assigned to ${nextAssignee}`);
  };

  const priorityStyle = PRIORITY_BADGES[ticket.priority] || PRIORITY_BADGES.normal;
  const sentimentStyle = SENTIMENT_BADGES[ticket.sentiment] || SENTIMENT_BADGES.inquiring;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0D14]">
      {/* Top Header: Mobile Back + Subject + Customer Meta */}
      <div className="p-3.5 sm:p-4 border-b border-[#21262D] bg-[#0E1117] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {onBackToList && (
            <button
              type="button"
              onClick={onBackToList}
              className="lg:hidden p-1.5 rounded-lg border border-[#30363D] bg-[#161B22] text-[#8B949E] hover:text-white"
              title="Back to Ticket List"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#00F2FE] bg-[#00F2FE]/10 px-2 py-0.5 rounded border border-[#00F2FE]/25">
                {ticket.id}
              </span>
              <span className="text-[10px] font-mono text-[#8B949E] uppercase">
                {ticket.category}
              </span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white truncate mt-1">
              {ticket.subject}
            </h3>
          </div>
        </div>

        {/* Customer Context Strip */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#C9D1D9]">
            <Building className="h-3.5 w-3.5 text-[#8B949E]" />
            <span className="font-medium">{ticket.company}</span>
          </div>
          <span className="text-[10px] font-mono text-[#A855F7] bg-[#A855F7]/10 px-2 py-0.5 rounded border border-[#A855F7]/25 font-semibold">
            {ticket.plan}
          </span>
        </div>
      </div>

      {/* Realistic Action Buttons Bar (Reply, Resolve, Assign, Close) */}
      <div className="px-3.5 sm:px-4 py-2 border-b border-[#21262D] bg-[#161B22]/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReplyAction}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/30 text-xs font-medium transition-colors"
            title="Compose a reply"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Reply</span>
          </button>

          <button
            type="button"
            onClick={handleResolveAction}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
              ticket.status === "resolved"
                ? "bg-[#3FB950]/20 text-[#3FB950] border-[#3FB950]/40"
                : "bg-[#161B22] text-[#8B949E] hover:text-[#3FB950] hover:bg-[#3FB950]/10 border-[#30363D] hover:border-[#3FB950]/30"
            )}
            title={ticket.status === "resolved" ? "Reopen ticket" : "Mark as resolved"}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{ticket.status === "resolved" ? "Resolved" : "Resolve"}</span>
          </button>

          <button
            type="button"
            onClick={handleCycleAssign}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161B22] text-[#8B949E] hover:text-white hover:bg-[#21262D] border border-[#30363D] text-xs font-medium transition-colors"
            title="Click to cycle assignee"
          >
            <UserCheck className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span className="truncate max-w-[110px]">
              {ticket.assignee || "Assign"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCloseAction}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#161B22] text-[#8B949E] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#30363D] text-xs font-medium transition-colors"
            title="Close ticket"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Close</span>
          </button>
        </div>

        {/* Right Status Indicator / Notice */}
        <div className="flex items-center gap-2 ml-auto">
          {actionNotice && (
            <span className="text-[11px] font-mono text-[#00F2FE] animate-in fade-in flex items-center gap-1">
              <Check className="h-3 w-3" />
              {actionNotice}
            </span>
          )}

          {/* Status Changer Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#8B949E] uppercase hidden sm:inline">
              Status:
            </span>
            <select
              value={ticket.status}
              onChange={(e) => onStatusChange && onStatusChange(ticket.id, e.target.value as TicketStatus)}
              className={cn(
                "rounded px-2 py-0.5 text-xs font-mono font-medium border bg-[#0E1117] focus:outline-none transition-colors",
                ticket.status === "resolved"
                  ? "text-[#3FB950] border-[#3FB950]/40"
                  : ticket.status === "in_progress"
                  ? "text-[#F59E0B] border-[#F59E0B]/40"
                  : ticket.status === "closed"
                  ? "text-[#8B949E] border-[#8B949E]/40"
                  : "text-[#00F2FE] border-[#00F2FE]/40"
              )}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scrollable Conversation Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Customer Contact & Ticket Metadata Card */}
        <div className="p-3.5 rounded-lg border border-[#21262D] bg-[#161B22]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#00F2FE]/20 to-[#A855F7]/20 border border-[#00F2FE]/30 flex items-center justify-center font-mono font-bold text-white text-xs shrink-0">
              {ticket.customerAvatar}
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{ticket.customerName}</div>
              <div className="text-[11px] text-[#8B949E] font-mono flex items-center gap-1">
                <Mail className="h-3 w-3 text-[#6E7681]" />
                <span>{ticket.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Badges: Priority, Sentiment, Status, Assignee */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority */}
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[9px] font-mono text-[#6E7681] uppercase">Priority</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded border text-[11px] font-mono font-semibold uppercase",
                  priorityStyle.bg,
                  priorityStyle.text,
                  priorityStyle.border
                )}
              >
                {priorityStyle.label}
              </span>
            </div>

            {/* Sentiment */}
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[9px] font-mono text-[#6E7681] uppercase">Sentiment</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded border text-[11px] font-mono font-medium",
                  sentimentStyle.bg,
                  sentimentStyle.text,
                  sentimentStyle.border
                )}
              >
                {sentimentStyle.label}
              </span>
            </div>

            {/* Status */}
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[9px] font-mono text-[#6E7681] uppercase">Status</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded border text-[11px] font-mono font-semibold capitalize",
                  ticket.status === "resolved"
                    ? "bg-[#3FB950]/15 text-[#3FB950] border-[#3FB950]/30"
                    : ticket.status === "in_progress"
                    ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                    : ticket.status === "closed"
                    ? "bg-[#8B949E]/15 text-[#8B949E] border-[#8B949E]/30"
                    : "bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/30"
                )}
              >
                {ticket.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* AI Diagnostic Summary Card */}
        <div
          onClick={(e) => {
            if (isInspectorActive && onInspectAiSummary) {
              e.stopPropagation();
              onInspectAiSummary();
            }
          }}
          className={cn(
            "rounded-xl border border-[#00F2FE]/30 bg-gradient-to-br from-[#00F2FE]/5 via-transparent to-[#A855F7]/5 p-3.5 sm:p-4 space-y-2 relative transition-all duration-150",
            isInspectorActive &&
              "ring-1 ring-[#00F2FE] cursor-crosshair shadow-[0_0_15px_rgba(0,242,254,0.15)]"
          )}
        >
          {isInspectorActive && (
            <div className="absolute top-2 right-2 font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40">
              &lt;AIDiagnosticSummary /&gt;
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#00F2FE]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Summary &amp; Intent</span>
            </div>
            <span className="font-mono text-[10px] text-[#3FB950] bg-[#3FB950]/10 px-2 py-0.5 rounded border border-[#3FB950]/20 font-bold">
              {ticket.aiSummary.confidence}% Match
            </span>
          </div>

          <p className="text-xs text-[#C9D1D9] leading-relaxed">
            <strong className="text-white">AI Summary:</strong>{" "}
            {ticket.aiSummary.coreIssue}
          </p>

          <p className="text-[11px] text-[#8B949E]">
            <strong className="text-[#C9D1D9]">Recommended Action:</strong>{" "}
            {ticket.aiSummary.recommendedAction}
          </p>
        </div>

        {/* Conversation Thread */}
        <div className="space-y-3 pt-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#8B949E] flex items-center justify-between">
            <span>Conversation History</span>
            <span className="text-[#6E7681]">{ticket.conversation.length} messages</span>
          </div>

          {ticket.conversation.map((msg) => {
            const isCustomer = msg.sender === "customer";
            const isSystem = msg.sender === "system";

            return (
              <div
                key={msg.id}
                className={cn(
                  "p-3.5 rounded-xl border text-xs leading-relaxed space-y-1.5 max-w-[90%]",
                  isCustomer
                    ? "bg-[#161B22] border-[#30363D] text-[#C9D1D9] mr-auto"
                    : isSystem
                    ? "bg-[#090A0F] border-[#21262D] text-[#8B949E] font-mono text-[11px] mx-auto w-full max-w-full"
                    : "bg-[#00F2FE]/10 border-[#00F2FE]/30 text-white ml-auto"
                )}
              >
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-[#8B949E]">
                  <span className="font-semibold text-white">
                    {msg.senderName}
                    {msg.senderRole && (
                      <span className="text-[#00F2FE] ml-1">({msg.senderRole})</span>
                    )}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <p>{msg.content}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Response Composer Dock */}
      <div
        onClick={(e) => {
          if (isInspectorActive && onInspectComposer) {
            e.stopPropagation();
            onInspectComposer();
          }
        }}
        className={cn(
          "p-3.5 sm:p-4 border-t border-[#21262D] bg-[#0E1117] space-y-3 shrink-0 relative transition-all duration-150",
          isInspectorActive &&
            "ring-1 ring-[#00F2FE] cursor-crosshair shadow-[0_0_15px_rgba(0,242,254,0.15)]"
        )}
      >
        {isInspectorActive && (
          <div className="absolute top-1.5 right-2 font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40">
            &lt;ResponseComposer /&gt;
          </div>
        )}

        {/* AI Suggested Quick Injection Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#00F2FE] font-mono text-[11px]">
            <Sparkles className="h-3 w-3" />
            <span>AI Suggested Response</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUseSuggestion}
              className="text-[11px] font-mono text-[#8B949E] hover:text-[#00F2FE] transition-colors underline underline-offset-2"
            >
              Insert Suggestion
            </button>
            <button
              type="button"
              onClick={handleGenerateReply}
              disabled={isGenerating}
              className="flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/30 transition-all disabled:opacity-50"
            >
              <Wand2 className={cn("h-3 w-3", isGenerating && "animate-spin")} />
              <span>{isGenerating ? "Generating..." : "Generate Reply"}</span>
            </button>
          </div>
        </div>

        {/* Textarea Input */}
        <div className="relative">
          <textarea
            ref={composerRef}
            value={replyDraft}
            onChange={(e) => setReplyDraft(e.target.value)}
            placeholder="Type your customer reply, or click 'Insert Suggestion' to use the AI synthesized response..."
            rows={3}
            className="w-full rounded-lg bg-[#161B22] border border-[#30363D] p-2.5 text-xs text-white placeholder-[#6E7681] focus:outline-none focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]/40 resize-none font-sans"
          />
        </div>

        {/* Composer Actions */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#8B949E]">
            {replyDraft.length} characters · Markdown supported
          </span>

          <div className="flex items-center gap-2">
            {justSent && (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#3FB950] animate-in fade-in">
                <Check className="h-3.5 w-3.5" />
                <span>Response dispatched!</span>
              </span>
            )}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSend}
              disabled={!replyDraft.trim() || isGenerating}
              className="text-xs font-medium bg-[#00F2FE] hover:bg-[#00D8E6] text-black font-semibold shadow-[0_0_12px_rgba(0,242,254,0.3)] disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5 mr-1" />
              <span>Send Response</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
