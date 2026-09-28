"use client";

import React from "react";
import { SupportTicket, TicketPriority, TicketSentiment } from "@/lib/preview/types";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Inbox,
  Sparkles,
} from "lucide-react";

interface TicketListProps {
  tickets: SupportTicket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  isInspectorActive?: boolean;
  onInspect?: () => void;
}

const PRIORITY_STYLES: Record<TicketPriority, { bg: string; text: string; border: string }> = {
  urgent: {
    bg: "bg-[#EF4444]/15",
    text: "text-[#EF4444]",
    border: "border-[#EF4444]/30",
  },
  high: {
    bg: "bg-[#F59E0B]/15",
    text: "text-[#F59E0B]",
    border: "border-[#F59E0B]/30",
  },
  normal: {
    bg: "bg-[#38BDF8]/15",
    text: "text-[#38BDF8]",
    border: "border-[#38BDF8]/30",
  },
  low: {
    bg: "bg-[#8B949E]/15",
    text: "text-[#8B949E]",
    border: "border-[#8B949E]/30",
  },
};

const SENTIMENT_STYLES: Record<TicketSentiment, { label: string; text: string; dotColor: string }> = {
  negative: { label: "Negative", text: "text-[#FCA5A5]", dotColor: "bg-[#EF4444]" },
  frustrated: { label: "Frustrated", text: "text-[#FCA5A5]", dotColor: "bg-[#EF4444]" },
  anxious: { label: "Anxious", text: "text-[#FCD34D]", dotColor: "bg-[#F59E0B]" },
  inquiring: { label: "Inquiring", text: "text-[#93C5FD]", dotColor: "bg-[#38BDF8]" },
  satisfied: { label: "Satisfied", text: "text-[#86EFAC]", dotColor: "bg-[#3FB950]" },
};

export function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
  isInspectorActive = false,
  onInspect,
}: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8B949E] space-y-2 select-none">
        <Inbox className="h-8 w-8 text-[#30363D]" />
        <h4 className="text-xs font-semibold text-white">No Tickets Found</h4>
        <p className="text-[11px] max-w-xs text-[#6E7681]">
          No active customer support tickets match the current filter or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        if (isInspectorActive && onInspect) {
          e.stopPropagation();
          onInspect();
        }
      }}
      className={cn(
        "flex-1 overflow-y-auto divide-y divide-[#21262D] select-none",
        isInspectorActive &&
          "relative ring-1 ring-[#00F2FE]/50 hover:ring-[#00F2FE] cursor-crosshair"
      )}
    >
      {/* Inspector Tag if Active */}
      {isInspectorActive && (
        <div className="sticky top-1 float-right mr-2 z-20 font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 pointer-events-none">
          &lt;TicketList /&gt;
        </div>
      )}

      {tickets.map((ticket) => {
        const isSelected = ticket.id === selectedTicketId;
        const priorityConfig = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.normal;
        const sentimentConfig = SENTIMENT_STYLES[ticket.sentiment] || SENTIMENT_STYLES.inquiring;

        return (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket.id)}
            className={cn(
              "p-3.5 sm:p-4 cursor-pointer transition-all duration-150 border-l-2 relative group",
              isSelected
                ? "bg-[#161B22] border-l-[#00F2FE] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                : "bg-transparent border-l-transparent hover:bg-[#161B22]/50 hover:border-l-[#30363D]"
            )}
          >
            {/* Top row: Customer Name + Time + Status */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                {/* Avatar Badge */}
                <div className="h-6 w-6 rounded-full bg-[#21262D] text-[#C9D1D9] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-[#30363D]">
                  {ticket.customerAvatar}
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-white truncate text-xs">
                    {ticket.customerName}
                  </span>
                  <span className="text-[10px] font-mono text-[#8B949E] hidden sm:inline truncate">
                    · {ticket.company}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-[#8B949E]">
                <span>{ticket.timestamp}</span>
                {ticket.status === "resolved" && (
                  <span title="Resolved">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#3FB950]" />
                  </span>
                )}
                {ticket.status === "in_progress" && (
                  <span className="h-2 w-2 rounded-full bg-[#F59E0B]" title="In Progress" />
                )}
                {ticket.status === "open" && (
                  <span className="h-2 w-2 rounded-full bg-[#00F2FE] animate-pulse" title="Open" />
                )}
                {ticket.status === "closed" && (
                  <span className="h-2 w-2 rounded-full bg-[#6E7681]" title="Closed" />
                )}
              </div>
            </div>

            {/* Middle: Subject */}
            <h4
              className={cn(
                "mt-1.5 text-xs sm:text-sm font-medium line-clamp-1 transition-colors",
                isSelected ? "text-white font-semibold" : "text-[#C9D1D9] group-hover:text-white"
              )}
            >
              {ticket.subject}
            </h4>

            {/* Bottom row: Priority + Sentiment + Category Badges */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
              {/* Priority */}
              <span
                className={cn(
                  "px-2 py-0.5 rounded border uppercase font-semibold",
                  priorityConfig.bg,
                  priorityConfig.text,
                  priorityConfig.border
                )}
              >
                {ticket.priority}
              </span>

              {/* Sentiment */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#161B22] border border-[#30363D] text-[#C9D1D9]">
                <span className={cn("h-1.5 w-1.5 rounded-full", sentimentConfig.dotColor)} />
                <span className={sentimentConfig.text}>{sentimentConfig.label}</span>
              </span>

              {/* Category */}
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#21262D]/60 text-[#8B949E] border border-[#30363D]/60">
                {ticket.category}
              </span>

              {/* AI Confidence Pill */}
              <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-[#00F2FE]/80 bg-[#00F2FE]/5 px-1.5 py-0.5 rounded border border-[#00F2FE]/20">
                <Sparkles className="h-2.5 w-2.5 text-[#00F2FE]" />
                <span>{ticket.aiSummary.confidence}% Match</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
