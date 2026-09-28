"use client";

import React, { useState, useMemo } from "react";
import {
  SupportTicket,
  SupportMetrics,
  TicketStatus,
} from "@/lib/preview/types";
import { TicketList } from "./TicketList";
import { TicketDetail } from "./TicketDetail";
import { cn } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  X,
} from "lucide-react";

interface SupportInboxProps {
  initialTickets: SupportTicket[];
  metrics: SupportMetrics;
  isInspectorActive?: boolean;
  onInspectRegion?: (regionId: string) => void;
  isMobileCompact?: boolean;
}

export function SupportInbox({
  initialTickets,
  metrics,
  isInspectorActive = false,
  onInspectRegion,
  isMobileCompact = false,
}: SupportInboxProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    initialTickets[0]?.id || "tkt_101"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [mobileViewingDetail, setMobileViewingDetail] = useState<boolean>(false);

  // Filtered tickets computation
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSubject = t.subject.toLowerCase().includes(q);
        const matchesName = t.customerName.toLowerCase().includes(q);
        const matchesCompany = t.company.toLowerCase().includes(q);
        const matchesId = t.id.toLowerCase().includes(q);
        if (!matchesSubject && !matchesName && !matchesCompany && !matchesId) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && t.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== "all" && t.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  // Selected ticket
  const selectedTicket = useMemo(() => {
    return (
      tickets.find((t) => t.id === selectedTicketId) ||
      filteredTickets[0] ||
      tickets[0] ||
      null
    );
  }, [tickets, selectedTicketId, filteredTickets]);

  // Handle select ticket
  const handleSelectTicket = (id: string) => {
    setSelectedTicketId(id);
    setMobileViewingDetail(true);
  };

  // Handle sending response
  const handleSendResponse = (ticketId: string, replyText: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg_rep_${ticketId}_${t.conversation.length + 1}`,
            sender: "agent" as const,
            senderName: "Alex Rivera",
            senderRole: "Support Lead",
            content: replyText,
            timestamp: "Just now",
          };
          return {
            ...t,
            status: (t.status === "open" ? "in_progress" : t.status) as TicketStatus,
            conversation: [...t.conversation, newMsg],
          };
        }
        return t;
      })
    );
  };

  // Handle status change
  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const statusText =
            newStatus === "resolved"
              ? "Ticket marked as Resolved by Alex Rivera"
              : newStatus === "closed"
              ? "Ticket marked as Closed"
              : newStatus === "in_progress"
              ? "Ticket status set to In Progress"
              : "Ticket reopened";
          const sysMsg = {
            id: `msg_sys_${ticketId}_${t.conversation.length + 1}`,
            sender: "system" as const,
            senderName: "System",
            content: statusText,
            timestamp: "Just now",
          };
          return {
            ...t,
            status: newStatus,
            conversation: [...t.conversation, sysMsg],
          };
        }
        return t;
      })
    );
  };

  // Handle assign change
  const handleAssignChange = (ticketId: string, newAssignee: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const sysMsg = {
            id: `msg_sys_${ticketId}_${t.conversation.length + 1}`,
            sender: "system" as const,
            senderName: "System",
            content: `Ticket reassigned to ${newAssignee}`,
            timestamp: "Just now",
          };
          return {
            ...t,
            assignee: newAssignee,
            conversation: [...t.conversation, sysMsg],
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0D14]">
      {/* Top Header: Title, Search, and Filters */}
      <div
        onClick={(e) => {
          if (isInspectorActive && onInspectRegion) {
            e.stopPropagation();
            onInspectRegion("search_filter");
          }
        }}
        className={cn(
          "p-3.5 sm:p-4 border-b border-[#21262D] bg-[#0E1117] flex flex-wrap items-center justify-between gap-3 shrink-0 relative transition-all duration-150",
          isInspectorActive &&
            "ring-1 ring-[#00F2FE]/50 hover:ring-[#00F2FE] cursor-crosshair"
        )}
      >
        {isInspectorActive && (
          <div className="absolute top-1.5 right-2 font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40">
            &lt;TicketFilterControl /&gt;
          </div>
        )}

        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Support Inbox
          </h2>
          <span className="font-mono text-xs text-[#8B949E] px-2 py-0.5 rounded-full bg-[#161B22] border border-[#30363D]">
            {filteredTickets.length} / {tickets.length}
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#6E7681]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets, customers..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-[#161B22] border border-[#30363D] text-xs text-white placeholder-[#6E7681] focus:outline-none focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-[#6E7681] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg bg-[#161B22] border border-[#30363D] px-2.5 py-1.5 text-xs text-[#C9D1D9] focus:outline-none focus:border-[#00F2FE]"
          >
            <option value="all">Status: All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg bg-[#161B22] border border-[#30363D] px-2.5 py-1.5 text-xs text-[#C9D1D9] focus:outline-none focus:border-[#00F2FE]"
          >
            <option value="all">Priority: All</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Metrics Header Strip */}
      <div
        onClick={(e) => {
          if (isInspectorActive && onInspectRegion) {
            e.stopPropagation();
            onInspectRegion("metrics");
          }
        }}
        className={cn(
          "px-3.5 sm:px-4 py-2.5 border-b border-[#21262D] bg-[#161B22]/40 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs select-none shrink-0 relative transition-all duration-150",
          isInspectorActive &&
            "ring-1 ring-[#00F2FE]/50 hover:ring-[#00F2FE] cursor-crosshair"
        )}
      >
        {isInspectorActive && (
          <div className="absolute top-1 right-2 font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40">
            &lt;MetricsHeaderStrip /&gt;
          </div>
        )}

        {/* Metric 1 */}
        <div className="flex items-center gap-2 p-1.5 rounded-md">
          <div className="h-7 w-7 rounded-md bg-[#00F2FE]/10 border border-[#00F2FE]/25 flex items-center justify-center text-[#00F2FE]">
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#8B949E] uppercase">
              Open Tickets
            </div>
            <div className="font-bold text-white font-mono text-sm leading-tight">
              {tickets.filter((t) => t.status === "open" || t.status === "in_progress").length}
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex items-center gap-2 p-1.5 rounded-md">
          <div className="h-7 w-7 rounded-md bg-[#3FB950]/10 border border-[#3FB950]/25 flex items-center justify-center text-[#3FB950]">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#8B949E] uppercase">
              Avg Response
            </div>
            <div className="font-bold text-[#3FB950] font-mono text-sm leading-tight">
              {metrics.avgResponseTime}
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex items-center gap-2 p-1.5 rounded-md">
          <div className="h-7 w-7 rounded-md bg-[#A855F7]/10 border border-[#A855F7]/25 flex items-center justify-center text-[#A855F7]">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#8B949E] uppercase">
              CSAT Score
            </div>
            <div className="font-bold text-white font-mono text-sm leading-tight">
              {metrics.csat}
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="flex items-center gap-2 p-1.5 rounded-md">
          <div className="h-7 w-7 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/25 flex items-center justify-center text-[#EF4444]">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#8B949E] uppercase">
              High Priority
            </div>
            <div className="font-bold text-[#EF4444] font-mono text-sm leading-tight">
              {metrics.highPriority}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Content: Ticket List & Ticket Detail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Ticket List (Hidden on mobile if viewing detail) */}
        <div
          className={cn(
            "border-r border-[#21262D] flex flex-col h-full overflow-hidden transition-all",
            mobileViewingDetail && isMobileCompact ? "hidden" : "flex",
            isMobileCompact ? "w-full" : "w-full lg:w-[45%] xl:w-[40%]"
          )}
        >
          <TicketList
            tickets={filteredTickets}
            selectedTicketId={selectedTicket?.id || null}
            onSelectTicket={handleSelectTicket}
            isInspectorActive={isInspectorActive}
            onInspect={() => onInspectRegion && onInspectRegion("ticket_list")}
          />
        </div>

        {/* Right Column: Ticket Detail (Hidden on mobile if not viewing detail) */}
        <div
          className={cn(
            "flex-1 flex flex-col h-full overflow-hidden",
            !mobileViewingDetail && isMobileCompact ? "hidden" : "flex"
          )}
        >
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onSendResponse={handleSendResponse}
              onStatusChange={handleStatusChange}
              onAssignChange={handleAssignChange}
              onBackToList={() => setMobileViewingDetail(false)}
              isInspectorActive={isInspectorActive}
              onInspectAiSummary={() =>
                onInspectRegion && onInspectRegion("ai_summary")
              }
              onInspectComposer={() =>
                onInspectRegion && onInspectRegion("response_composer")
              }
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8B949E]">
              <p className="text-xs">Select a ticket from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
