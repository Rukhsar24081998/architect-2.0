import { SupportTicket, SupportMetrics, InspectorRegion } from "./types";

export const INITIAL_SUPPORT_METRICS: SupportMetrics = {
  openTickets: 18,
  avgResponseTime: "1.2m",
  csat: "98.4%",
  highPriority: 4,
};

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "#1042",
    customerName: "Sarah Chen",
    customerEmail: "sarah.c@stripe.corp",
    customerAvatar: "SC",
    company: "Stripe",
    plan: "Enterprise Pro",
    subject: "Customer can't login",
    priority: "high",
    sentiment: "negative",
    status: "open",
    category: "Auth & SSO",
    timestamp: "2m ago",
    assignee: "Alex Rivera",
    conversation: [
      {
        id: "msg_1042_1",
        sender: "customer",
        senderName: "Sarah Chen",
        content:
          "I have attempted to reset my password three times through the SSO portal. The magic link redirects back to the login page without clearing the expired session.",
        timestamp: "10:42 AM",
      },
      {
        id: "msg_1042_2",
        sender: "system",
        senderName: "AI Session Guard",
        senderRole: "System Bot",
        content:
          "Detected session token mismatch (HTTP 401). Auth cookie flagged as stale across Supabase refresh callback.",
        timestamp: "10:43 AM",
      },
    ],
    aiSummary: {
      coreIssue: "Customer is unable to access their account after a password reset.",
      detectedIntent: "Requesting password reset and session invalidation",
      confidence: 98,
      recommendedAction:
        "Invalidate active user session tokens and dispatch a single-use verified magic login bypass link.",
    },
    suggestedReply:
      "Hi, thanks for reaching out. I can help you get back into your account. We detected an SSO session state collision where an old authentication token was lingering in the cookie cache. I have reset your active sessions—please click the secure bypass link sent to your email to log in.",
  },
  {
    id: "tkt_102",
    customerName: "Marcus Vance",
    customerEmail: "m.vance@finflow.io",
    customerAvatar: "MV",
    company: "FinFlow",
    plan: "Enterprise Pro",
    subject: "Payment charged twice",
    priority: "high",
    sentiment: "frustrated",
    status: "in_progress",
    category: "Billing & Payments",
    timestamp: "14m ago",
    assignee: "Alex Rivera",
    conversation: [
      {
        id: "msg_102_1",
        sender: "customer",
        senderName: "Marcus Vance",
        content:
          "Our credit card was billed twice ($149.00 x 2) for our monthly subscription renewal this morning. Transaction references are #TX-9021 and #TX-9022.",
        timestamp: "10:28 AM",
      },
      {
        id: "msg_102_2",
        sender: "agent",
        senderName: "Alex Rivera",
        senderRole: "Support Lead",
        content:
          "Looking into Stripe invoice logs right now, Marcus. Pulling duplicate charge receipts.",
        timestamp: "10:31 AM",
      },
    ],
    aiSummary: {
      coreIssue: "Duplicate webhook retry event triggered concurrent payment intents in Stripe.",
      detectedIntent: "Immediate refund request for duplicate $149 subscription charge",
      confidence: 96,
      recommendedAction:
        "Process automatic refund for charge #TX-9022 and attach receipt confirmation.",
    },
    suggestedReply:
      "Hi Marcus, apologies for the inconvenience. Our billing webhook received a duplicate acknowledgement during cloud maintenance, which created two payment intents. I have processed a full reversal of $149.00 for #TX-9022. You should see the credit reflect on your card within 2-3 business days. Your subscription remains active on Enterprise Pro.",
  },
  {
    id: "tkt_103",
    customerName: "Elena Rostova",
    customerEmail: "elena@cloudscale.net",
    customerAvatar: "ER",
    company: "CloudScale",
    plan: "Growth",
    subject: "API integration not working",
    priority: "high",
    sentiment: "anxious",
    status: "open",
    category: "API & Webhooks",
    timestamp: "45m ago",
    assignee: "Devon Vance",
    conversation: [
      {
        id: "msg_103_1",
        sender: "customer",
        senderName: "Elena Rostova",
        content:
          "We configured the webhook destination to `https://api.cloudscale.net/v1/support-events`, but all deliveries are returning HTTP 429 Rate Exceeded. Our worker handles up to 50 events/sec.",
        timestamp: "09:55 AM",
      },
    ],
    aiSummary: {
      coreIssue: "Batch webhook egress throttled by default 30 req/min sandbox policy.",
      detectedIntent: "Rate limit increase for production webhook stream",
      confidence: 94,
      recommendedAction:
        "Upgrade workspace egress burst rate to 200 req/sec and trigger batch replay.",
    },
    suggestedReply:
      "Hello Elena, our telemetry confirms your endpoint was temporarily throttled under our default sandbox egress ceiling (30 req/min). I have elevated your workspace limit to 250 req/sec and scheduled a replay of the 14 unacknowledged webhook deliveries. Please check your ingestion logs in 5 minutes.",
  },
  {
    id: "tkt_104",
    customerName: "David Kim",
    customerEmail: "dkim@hypergrowth.tech",
    customerAvatar: "DK",
    company: "HyperGrowth",
    plan: "Growth",
    subject: "Can't access my account",
    priority: "normal",
    sentiment: "inquiring",
    status: "open",
    category: "Account Access",
    timestamp: "1h ago",
    assignee: "Sarah Lin",
    conversation: [
      {
        id: "msg_104_1",
        sender: "customer",
        senderName: "David Kim",
        content:
          "When I attempt to log into the HyperGrowth workspace, it says 'Organization membership suspended'. I haven't received any email regarding this.",
        timestamp: "09:30 AM",
      },
    ],
    aiSummary: {
      coreIssue: "Seat unassigned during quarterly admin team member cleanup.",
      detectedIntent: "Account reactivation and role verification",
      confidence: 91,
      recommendedAction:
        "Notify customer that organization owner (admin@hypergrowth.tech) needs to re-assign seat.",
    },
    suggestedReply:
      "Hi David, our audit log indicates your seat was unassigned during an internal team audit conducted by your organization owner (admin@hypergrowth.tech) yesterday. Because account access is governed by your company workspace policies, please request your workspace admin to re-add your profile from Settings > Members.",
  },
  {
    id: "tkt_105",
    customerName: "Olivia Wright",
    customerEmail: "olivia@solardata.co",
    customerAvatar: "OW",
    company: "SolarData",
    plan: "Starter",
    subject: "Invoice amount looks incorrect",
    priority: "normal",
    sentiment: "inquiring",
    status: "resolved",
    category: "Invoices",
    timestamp: "3h ago",
    assignee: "Alex Rivera",
    conversation: [
      {
        id: "msg_105_1",
        sender: "customer",
        senderName: "Olivia Wright",
        content:
          "Invoice #INV-2049 is billed at $210 instead of our usual $150. Did the pricing tier change?",
        timestamp: "07:15 AM",
      },
      {
        id: "msg_105_2",
        sender: "agent",
        senderName: "Alex Rivera",
        senderRole: "Support Lead",
        content:
          "Hi Olivia! The additional $60 reflects the pro-rated addition of 3 developer seats added midway through your billing cycle on Sept 10th ($20/seat).",
        timestamp: "07:45 AM",
      },
      {
        id: "msg_105_3",
        sender: "customer",
        senderName: "Olivia Wright",
        content:
          "Ah, perfectly clear! I had forgotten our engineers onboarded three interns last week. Thank you!",
        timestamp: "08:10 AM",
      },
    ],
    aiSummary: {
      coreIssue: "Pro-rated seat addition on monthly billing cycle.",
      detectedIntent: "Billing explanation and reconciliation",
      confidence: 99,
      recommendedAction: "Confirm breakdown and issue itemized receipt.",
    },
    suggestedReply:
      "Glad to help, Olivia! If you ever need an itemized seat breakdown before the billing date, you can view real-time estimates under Settings > Subscriptions.",
  },
];

export const INSPECTOR_REGIONS: Record<string, InspectorRegion> = {
  sidebar: {
    id: "sidebar",
    name: "SupportSidebar",
    componentName: "SupportSidebar",
    filePath: "components/preview/SupportSidebar.tsx",
    route: "/inbox",
    agentRole: "frontend",
    stepNumber: 2,
    description:
      "Responsive navigation sidebar featuring SupportDesk AI brand, unread badge counters, and real-time swarm guard status indicator.",
    stateSnapshot: {
      activeTab: "inbox",
      inboxUnreadCount: 5,
      ticketsTotal: 24,
      aiGuardActive: true,
    },
  },
  metrics: {
    id: "metrics",
    name: "MetricsHeaderStrip",
    componentName: "MetricsHeaderStrip",
    filePath: "components/preview/SupportInbox.tsx",
    route: "/inbox",
    agentRole: "backend",
    stepNumber: 3,
    description:
      "Real-time operational KPI strip aggregating Open Tickets, SLA Response Times, and customer sentiment CSAT percentage.",
    stateSnapshot: {
      openTickets: 18,
      avgResponseTime: "1.2m",
      csatScore: "98.4%",
      highPriorityQueue: 4,
    },
  },
  search_filter: {
    id: "search_filter",
    name: "TicketFilterControl",
    componentName: "TicketFilterControl",
    filePath: "components/preview/SupportInbox.tsx",
    route: "/inbox",
    agentRole: "frontend",
    stepNumber: 4,
    description:
      "Interactive multi-criteria search and filter toolbar supporting keyword filtering, status tags, and priority classification.",
    stateSnapshot: {
      filterStatus: "all",
      filterPriority: "all",
      filterSentiment: "all",
      searchQuery: "",
    },
  },
  ticket_list: {
    id: "ticket_list",
    name: "TicketList",
    componentName: "TicketList",
    filePath: "components/preview/TicketList.tsx",
    route: "/inbox",
    agentRole: "frontend",
    stepNumber: 4,
    description:
      "Prioritized triage queue displaying customer sentiment badges, urgency tags, and instantaneous selection state bindings.",
    stateSnapshot: {
      selectedTicketId: "tkt_101",
      totalRendered: 5,
      filterApplied: false,
    },
  },
  ticket_detail: {
    id: "ticket_detail",
    name: "TicketDetail",
    componentName: "TicketDetail",
    filePath: "components/preview/TicketDetail.tsx",
    route: "/inbox/[ticketId]",
    agentRole: "frontend",
    stepNumber: 5,
    description:
      "Comprehensive ticket inspection panel showing customer context card, conversation timeline, and diagnostic metadata.",
    stateSnapshot: {
      activeTicket: "tkt_101",
      customerCompany: "Stripe",
      planTier: "Enterprise Pro",
      messagesCount: 2,
    },
  },
  ai_summary: {
    id: "ai_summary",
    name: "AIDiagnosticSummary",
    componentName: "AIDiagnosticSummary",
    filePath: "components/preview/TicketDetail.tsx",
    route: "/inbox/[ticketId]",
    agentRole: "backend",
    stepNumber: 3,
    description:
      "Automated triage assessment card generated by the Architect Swarm backend agent, identifying root cause and intent.",
    stateSnapshot: {
      confidence: 98,
      detectedCategory: "Auth & SSO",
      hasRecommendedAction: true,
    },
  },
  response_composer: {
    id: "response_composer",
    name: "ResponseComposer",
    componentName: "ResponseComposer",
    filePath: "components/preview/TicketDetail.tsx",
    route: "/inbox/[ticketId]",
    agentRole: "frontend",
    stepNumber: 5,
    description:
      "Interactive response composer with one-click AI generation simulation, suggested reply injection, and reply dispatch.",
    stateSnapshot: {
      isGenerating: false,
      hasDraft: true,
      canSend: true,
    },
  },
};
