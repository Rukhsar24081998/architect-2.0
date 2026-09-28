/**
 * Architect 2.0 — Interactive Preview Models
 * Defines data structures for the local deterministic interactive preview mini-applications.
 */

export type ViewportMode = "desktop" | "tablet" | "mobile";

export type TicketPriority = "urgent" | "high" | "normal" | "low";
export type TicketSentiment = "negative" | "frustrated" | "anxious" | "inquiring" | "satisfied";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface TicketMessage {
  id: string;
  sender: "customer" | "agent" | "system";
  senderName: string;
  senderRole?: string;
  content: string;
  timestamp: string; // Deterministic string e.g. "10:45 AM"
}

export interface TicketAISummary {
  coreIssue: string;
  detectedIntent: string;
  confidence: number; // 0 - 100
  recommendedAction: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  company: string;
  plan: "Enterprise Pro" | "Growth" | "Starter";
  subject: string;
  priority: TicketPriority;
  sentiment: TicketSentiment;
  status: TicketStatus;
  category: "Auth & SSO" | "Billing & Payments" | "API & Webhooks" | "Account Access" | "Invoices";
  timestamp: string; // Deterministic string e.g. "2m ago"
  assignee?: string;
  conversation: TicketMessage[];
  aiSummary: TicketAISummary;
  suggestedReply: string;
}

export interface SupportMetrics {
  openTickets: number;
  avgResponseTime: string;
  csat: string;
  highPriority: number;
}

export interface InspectorRegion {
  id: string;
  name: string;
  componentName: string;
  filePath: string;
  route: string;
  agentRole: "architect" | "frontend" | "backend" | "qa";
  stepNumber: number;
  description: string;
  stateSnapshot: Record<string, string | number | boolean>;
}
