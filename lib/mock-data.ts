import { ProjectDetails, User } from "./types";

export const SEED_USERS: User[] = [
  {
    id: "usr_alex_founder",
    name: "Alex Rivera",
    email: "alex@supportdesk.ai",
    role: "founder",
    avatar: "",
    preferredMode: "build",
  },
  {
    id: "usr_sarah_dev",
    name: "Sarah Chen",
    email: "sarah.chen@fintech.io",
    role: "engineer",
    avatar: "",
    preferredMode: "dev",
  },
];

export const SEED_PROJECTS: ProjectDetails[] = [
  // =========================================================================
  // 1. SaaS SupportDesk AI (Build Mode Showcase)
  // =========================================================================
  {
    id: "prj_supportdesk",
    name: "SaaS SupportDesk AI",
    description: "AI-driven customer support triage desk with automated ticket sentiment tagging and instant chat resolution.",
    template: "nextjs-saas",
    status: "deployed",
    currentBranch: "main",
    liveUrl: "https://supportdesk-ai.architect.live",
    createdAt: "2026-09-20T10:00:00.000Z",
    updatedAt: "2026-09-24T14:30:00.000Z",
    files: [
      {
        id: "file_sd_01",
        projectId: "prj_supportdesk",
        path: "src/App.tsx",
        language: "tsx",
        version: 4,
        updatedAt: "2026-09-24T14:20:00.000Z",
        content: `import React, { useState } from 'react';
import { TicketList } from './components/TicketList';
import { MetricsHeader } from './components/MetricsHeader';
import { TicketModal } from './components/TicketModal';

export default function App() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">SupportDesk AI</h1>
            <p className="text-sm text-slate-400">Automated Triage & Live Conversation Queue</p>
          </div>
          <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium rounded-lg shadow-sm transition">
            + New Ticket
          </button>
        </header>

        <MetricsHeader />
        <TicketList onSelectTicket={setSelectedTicket} />
        {selectedTicket && (
          <TicketModal ticketId={selectedTicket} onClose={() => setSelectedTicket(null)} />
        )}
      </div>
    </div>
  );
}`,
      },
      {
        id: "file_sd_02",
        projectId: "prj_supportdesk",
        path: "src/components/TicketList.tsx",
        language: "tsx",
        version: 3,
        updatedAt: "2026-09-24T14:15:00.000Z",
        content: `import React from 'react';

interface Ticket {
  id: string;
  title: string;
  customer: string;
  sentiment: 'positive' | 'neutral' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
}

const SAMPLE_TICKETS: Ticket[] = [
  { id: 'TCK-101', title: 'Payment gateway timeout on checkout', customer: 'Acme Corp', sentiment: 'urgent', status: 'open' },
  { id: 'TCK-102', title: 'How do I add a new team member?', customer: 'Nova Labs', sentiment: 'positive', status: 'resolved' },
  { id: 'TCK-103', title: 'Webhook signature validation failing', customer: 'Starlight Inc', sentiment: 'urgent', status: 'in_progress' },
];

export function TicketList({ onSelectTicket }: { onSelectTicket: (id: string) => void }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h2 className="font-semibold text-white">Live Queue</h2>
        <span className="text-xs text-slate-400">3 active tickets</span>
      </div>
      <div className="divide-y divide-slate-800">
        {SAMPLE_TICKETS.map(t => (
          <div
            key={t.id}
            onClick={() => onSelectTicket(t.id)}
            className="p-4 hover:bg-slate-850 cursor-pointer flex items-center justify-between transition"
          >
            <div>
              <span className="text-xs font-mono text-cyan-400">{t.id}</span>
              <h3 className="text-sm font-medium text-slate-200">{t.title}</h3>
              <p className="text-xs text-slate-500">{t.customer}</p>
            </div>
            <span className={\`text-xs px-2.5 py-1 rounded-full font-medium \${
              t.sentiment === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-300'
            }\`}>
              {t.sentiment}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      },
      {
        id: "file_sd_03",
        projectId: "prj_supportdesk",
        path: "src/api/tickets.ts",
        language: "typescript",
        version: 2,
        updatedAt: "2026-09-24T13:50:00.000Z",
        content: `export async function getTickets() {
  return [
    { id: 'TCK-101', title: 'Payment gateway timeout', sentiment: 'urgent' },
    { id: 'TCK-102', title: 'Add team member', sentiment: 'positive' }
  ];
}`,
      },
    ],
    messages: [
      {
        id: "msg_sd_01",
        projectId: "prj_supportdesk",
        sender: "user",
        content: "Build an AI-powered customer support desk with ticket triage, sentiment analysis, and a real-time conversation queue.",
        createdAt: "2026-09-24T12:00:00.000Z",
      },
      {
        id: "msg_sd_02",
        projectId: "prj_supportdesk",
        sender: "architect",
        content: "I've structured a 4-step Build Plan for SupportDesk AI:\n\n1. **Metrics Header**: High-level resolution rates & active ticket counts.\n2. **Live Queue & Sentiment Badges**: Visual indicators (Urgent / Neutral / Positive).\n3. **Detail Modal & Response AI**: Interactive chat thread per ticket.\n4. **API Simulation**: Mock ticket data handler.\n\nReview the plan on the right and click **Approve & Build** to begin.",
        suggestedActions: [
          { label: "Approve & Build Plan", action: "approve_plan" },
          { label: "Add CSV Export Button", action: "add_csv_export" },
        ],
        createdAt: "2026-09-24T12:00:04.000Z",
      },
      {
        id: "msg_sd_03",
        projectId: "prj_supportdesk",
        sender: "user",
        content: "Looks great. Please approve and build it now.",
        createdAt: "2026-09-24T12:01:00.000Z",
      },
      {
        id: "msg_sd_04",
        projectId: "prj_supportdesk",
        sender: "architect",
        content: "All components have been built and tested. The live preview is ready for testing! You can click any ticket in the preview to inspect details.",
        createdAt: "2026-09-24T12:02:15.000Z",
      },
    ],
    buildPlans: [
      {
        id: "bp_sd_01",
        projectId: "prj_supportdesk",
        title: "Initial Application Scaffold & Queue System",
        status: "completed",
        createdAt: "2026-09-24T12:00:04.000Z",
        updatedAt: "2026-09-24T12:02:10.000Z",
        steps: [
          { id: "step_1", title: "Design Metrics Header", description: "Display live counters for open tickets, resolution SLA, and CSAT score.", status: "done", targetFile: "src/components/MetricsHeader.tsx" },
          { id: "step_2", title: "Implement Ticket Queue", description: "Interactive table with urgency badges and row click handlers.", status: "done", targetFile: "src/components/TicketList.tsx" },
          { id: "step_3", title: "Create Ticket Detail Modal", description: "Flyout dialog showing ticket metadata and conversation timeline.", status: "done", targetFile: "src/components/TicketModal.tsx" },
          { id: "step_4", title: "Wire Mock Ticket API", description: "In-memory store providing realistic ticket updates.", status: "done", targetFile: "src/api/tickets.ts" },
        ],
      },
    ],
    agents: [
      {
        id: "ag_arch_01",
        projectId: "prj_supportdesk",
        name: "Architect Lead",
        role: "architect",
        status: "completed",
        progress: 100,
        thoughtLog: [
          { id: "t1", timestamp: "12:00:05", message: "Decomposed prompt into 4 component milestones.", type: "action" },
          { id: "t2", timestamp: "12:02:10", message: "Plan execution verified with 0 lint errors.", type: "success" },
        ],
      },
      {
        id: "ag_fe_01",
        projectId: "prj_supportdesk",
        name: "Frontend Engineer",
        role: "frontend",
        status: "completed",
        progress: 100,
        thoughtLog: [
          { id: "t3", timestamp: "12:01:10", message: "Generated TicketList.tsx with Tailwind styles.", type: "action" },
          { id: "t4", timestamp: "12:01:45", message: "Added responsive dialog modal for ticket inspection.", type: "action" },
        ],
      },
      {
        id: "ag_be_01",
        projectId: "prj_supportdesk",
        name: "Backend Engineer",
        role: "backend",
        status: "completed",
        progress: 100,
        thoughtLog: [
          { id: "t5", timestamp: "12:01:20", message: "Created /api/tickets in-memory route handler.", type: "action" },
        ],
      },
      {
        id: "ag_qa_01",
        projectId: "prj_supportdesk",
        name: "QA & Verification",
        role: "qa",
        status: "completed",
        progress: 100,
        thoughtLog: [
          { id: "t6", timestamp: "12:02:00", message: "Validated interactive ticket selection in sandbox.", type: "success" },
        ],
      },
    ],
    deployments: [
      {
        id: "dep_sd_01",
        projectId: "prj_supportdesk",
        environment: "production",
        status: "live",
        liveUrl: "https://supportdesk-ai.architect.live",
        commitSha: "8f4a21e",
        commitMessage: "feat: initial release with ticket triage and metrics",
        durationSeconds: 24,
        createdAt: "2026-09-24T12:05:00.000Z",
        logs: [
          "Building production bundle (Next.js 14)...",
          "Optimizing assets & Tailwind CSS...",
          "Running pre-flight checks: 4 tests passed, 0 warnings.",
          "Deployed to edge CDN: https://supportdesk-ai.architect.live",
        ],
      },
    ],
    integrations: [
      { id: "int_stripe", projectId: "prj_supportdesk", provider: "stripe", name: "Stripe Billing", description: "Customer subscription sync", status: "connected" },
      { id: "int_resend", projectId: "prj_supportdesk", provider: "resend", name: "Resend Email", description: "Automated ticket notifications", status: "connected" },
    ],
    environmentVariables: [
      { id: "env_1", projectId: "prj_supportdesk", key: "NEXT_PUBLIC_APP_ENV", value: "production", target: "production", isSecret: false, createdAt: "2026-09-24T10:00:00Z" },
      { id: "env_2", projectId: "prj_supportdesk", key: "STRIPE_SECRET_KEY", value: "sk_live_51Mxxxxxxxxxxxx", target: "production", isSecret: true, createdAt: "2026-09-24T10:05:00Z" },
    ],
    activity: [
      { id: "act_1", projectId: "prj_supportdesk", actor: "Alex Rivera", actorRole: "user", type: "project_created", summary: "Created project from idea prompt", createdAt: "2026-09-24T12:00:00.000Z" },
      { id: "act_2", projectId: "prj_supportdesk", actor: "Architect Lead", actorRole: "agent", type: "plan_approved", summary: "Plan approved with 4 milestones", createdAt: "2026-09-24T12:01:00.000Z" },
      { id: "act_3", projectId: "prj_supportdesk", actor: "DevOps Engine", actorRole: "system", type: "deployed", summary: "Shipped v1.0.0 to https://supportdesk-ai.architect.live", createdAt: "2026-09-24T12:05:00.000Z" },
    ],
  },

  // =========================================================================
  // 2. FinTech Ledger API (Developer Mode Showcase)
  // =========================================================================
  {
    id: "prj_fintech_api",
    name: "FinTech Ledger API",
    description: "Double-entry accounting ledger engine with RS256 cryptographic signing and ACID audit trails.",
    template: "api-service",
    status: "ready",
    currentBranch: "feat/rs256-auth",
    createdAt: "2026-09-22T08:00:00.000Z",
    updatedAt: "2026-09-24T16:00:00.000Z",
    files: [
      {
        id: "file_ft_01",
        projectId: "prj_fintech_api",
        path: "src/server.ts",
        language: "typescript",
        version: 6,
        updatedAt: "2026-09-24T15:30:00.000Z",
        content: `import express from 'express';
import { verifyJwtRS256 } from './auth/jwt';
import { postTransaction } from './ledger/transaction';

const app = express();
app.use(express.json());

// Secure ledger transaction route with asymmetric RS256 token verification
app.post('/api/ledger/entries', verifyJwtRS256, async (req, res) => {
  try {
    const entry = await postTransaction(req.body);
    res.status(201).json({ status: 'success', entry });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default app;`,
      },
      {
        id: "file_ft_02",
        projectId: "prj_fintech_api",
        path: "src/auth/jwt.ts",
        language: "typescript",
        version: 5,
        updatedAt: "2026-09-24T15:45:00.000Z",
        content: `import { Request, Response, NextFunction } from 'express';

export function verifyJwtRS256(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }
  // Cryptographic RS256 public key verification logic
  next();
}`,
      },
      {
        id: "file_ft_03",
        projectId: "prj_fintech_api",
        path: "tests/auth.test.ts",
        language: "typescript",
        version: 3,
        updatedAt: "2026-09-24T15:50:00.000Z",
        content: `import { describe, it, expect } from 'vitest';

describe('RS256 Auth Middleware', () => {
  it('should reject requests without bearer token', () => {
    expect(true).toBe(true);
  });
  it('should validate signed JWT payload correctly', () => {
    expect(true).toBe(true);
  });
});`,
      },
    ],
    messages: [
      {
        id: "msg_ft_01",
        projectId: "prj_fintech_api",
        sender: "user",
        content: "Migrate legacy symmetric HMAC tokens to asymmetric RS256 JWT validation and add corresponding unit tests.",
        createdAt: "2026-09-24T15:00:00.000Z",
      },
      {
        id: "msg_ft_02",
        projectId: "prj_fintech_api",
        sender: "architect",
        content: "Created branch `feat/rs256-auth`. Backend Agent updated `src/auth/jwt.ts` and QA Agent added test assertions in `tests/auth.test.ts`. All 8 tests pass.",
        createdAt: "2026-09-24T15:05:00.000Z",
      },
    ],
    buildPlans: [
      {
        id: "bp_ft_01",
        projectId: "prj_fintech_api",
        title: "Migrate Auth to Asymmetric RS256",
        status: "completed",
        createdAt: "2026-09-24T15:00:00.000Z",
        updatedAt: "2026-09-24T15:10:00.000Z",
        steps: [
          { id: "s1", title: "Update Token Verifier", description: "Use RSA public key validation in jwt.ts", status: "done", targetFile: "src/auth/jwt.ts" },
          { id: "s2", title: "Add Test Assertions", description: "Validate expired and valid RS256 tokens", status: "done", targetFile: "tests/auth.test.ts" },
        ],
      },
    ],
    agents: [
      {
        id: "ag_be_02",
        projectId: "prj_fintech_api",
        name: "Security & Backend Agent",
        role: "backend",
        status: "idle",
        progress: 100,
        thoughtLog: [
          { id: "t7", timestamp: "15:02:00", message: "Configured RS256 public key verification.", type: "action" },
        ],
      },
      {
        id: "ag_qa_02",
        projectId: "prj_fintech_api",
        name: "QA Test Agent",
        role: "qa",
        status: "idle",
        progress: 100,
        thoughtLog: [
          { id: "t8", timestamp: "15:04:00", message: "Ran test suite: 8 passing, 0 failing.", type: "success" },
        ],
      },
    ],
    deployments: [
      {
        id: "dep_ft_01",
        projectId: "prj_fintech_api",
        environment: "staging",
        status: "live",
        liveUrl: "https://fintech-ledger-staging.architect.live",
        commitSha: "9c12b7a",
        commitMessage: "feat: add RS256 JWT auth validation",
        durationSeconds: 18,
        createdAt: "2026-09-24T15:15:00.000Z",
        logs: ["Staging deployment online."],
      },
    ],
    integrations: [
      { id: "int_gh", projectId: "prj_fintech_api", provider: "github", name: "GitHub Repository", description: "Synced with sarah-dev/fintech-ledger-api", status: "connected" },
      { id: "int_sb", projectId: "prj_fintech_api", provider: "supabase", name: "Supabase DB", description: "PostgreSQL transaction pool", status: "connected" },
    ],
    environmentVariables: [
      { id: "env_ft_1", projectId: "prj_fintech_api", key: "JWT_PUBLIC_KEY", value: "-----BEGIN PUBLIC KEY-----...", target: "development", isSecret: true, createdAt: "2026-09-22T08:00:00Z" },
    ],
    activity: [
      { id: "act_ft_1", projectId: "prj_fintech_api", actor: "Sarah Chen", actorRole: "user", type: "project_created", summary: "Imported repository from GitHub", createdAt: "2026-09-22T08:00:00.000Z" },
      { id: "act_ft_2", projectId: "prj_fintech_api", actor: "Security Agent", actorRole: "agent", type: "test_passed", summary: "All 8 unit tests passed on branch feat/rs256-auth", createdAt: "2026-09-24T15:05:00.000Z" },
    ],
  },

  // =========================================================================
  // 3. HealthTrack Mobile Web (Multi-Agent In-Progress Showcase)
  // =========================================================================
  {
    id: "prj_healthtrack",
    name: "HealthTrack Mobile Web",
    description: "Responsive patient vitals monitor with dynamic heart-rate telemetry and appointment scheduling.",
    template: "mobile-web",
    status: "building",
    currentBranch: "main",
    createdAt: "2026-09-24T17:00:00.000Z",
    updatedAt: "2026-09-24T18:30:00.000Z",
    files: [
      {
        id: "file_ht_01",
        projectId: "prj_healthtrack",
        path: "src/pages/Dashboard.tsx",
        language: "tsx",
        version: 1,
        updatedAt: "2026-09-24T17:30:00.000Z",
        content: `export default function Dashboard() {
  return (
    <div className="p-4 bg-slate-950 text-white min-h-screen">
      <h1 className="text-xl font-bold text-cyan-400">HealthTrack Vitals</h1>
      <p className="text-sm text-slate-400">Live patient biometric sync...</p>
    </div>
  );
}`,
      },
    ],
    messages: [
      {
        id: "msg_ht_01",
        projectId: "prj_healthtrack",
        sender: "user",
        content: "Build a responsive patient vitals dashboard with live heart-rate chart and doctor appointment booking.",
        createdAt: "2026-09-24T17:00:00.000Z",
      },
      {
        id: "msg_ht_02",
        projectId: "prj_healthtrack",
        sender: "architect",
        content: "Plan accepted. Frontend Agent is currently drafting BiometricGraph.tsx and Backend Agent is configuring /api/appointments.",
        createdAt: "2026-09-24T17:01:00.000Z",
      },
    ],
    buildPlans: [
      {
        id: "bp_ht_01",
        projectId: "prj_healthtrack",
        title: "Patient Biometrics & Appointment Module",
        status: "in_progress",
        createdAt: "2026-09-24T17:01:00.000Z",
        updatedAt: "2026-09-24T17:15:00.000Z",
        steps: [
          { id: "ht_s1", title: "Patient Dashboard Shell", description: "Mobile-first responsive container", status: "done", targetFile: "src/pages/Dashboard.tsx" },
          { id: "ht_s2", title: "Live Biometric Chart", description: "SVG pulse rate telemetry component", status: "active", targetFile: "src/components/BiometricGraph.tsx" },
          { id: "ht_s3", title: "Appointment Calendar Integration", description: "Doctor booking slot picker", status: "pending", targetFile: "src/api/appointments.ts" },
        ],
      },
    ],
    agents: [
      {
        id: "ag_fe_ht",
        projectId: "prj_healthtrack",
        name: "Frontend Agent",
        role: "frontend",
        status: "running",
        currentTask: "Synthesizing BiometricGraph.tsx",
        progress: 65,
        thoughtLog: [
          { id: "t9", timestamp: "17:10:00", message: "Drafting SVG telemetry animation curve.", type: "action" },
        ],
      },
      {
        id: "ag_be_ht",
        projectId: "prj_healthtrack",
        name: "Backend Agent",
        role: "backend",
        status: "thinking",
        currentTask: "Designing appointment slot booking schema",
        progress: 30,
        thoughtLog: [
          { id: "t10", timestamp: "17:12:00", message: "Analyzing calendar availability constraints.", type: "info" },
        ],
      },
    ],
    deployments: [],
    integrations: [],
    environmentVariables: [],
    activity: [
      { id: "act_ht_1", projectId: "prj_healthtrack", actor: "Alex Rivera", actorRole: "user", type: "project_created", summary: "Initiated HealthTrack Mobile Web project", createdAt: "2026-09-24T17:00:00.000Z" },
    ],
  },
];
