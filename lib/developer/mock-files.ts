import { VirtualDirectory, VirtualFile } from "./types";

export const INITIAL_FILES_RECORD: Record<string, VirtualFile> = {
  "src/app/page.tsx": {
    id: "f_page_tsx",
    name: "page.tsx",
    path: "src/app/page.tsx",
    language: "tsx",
    relatedBuildStep: "Define Authentication Architecture & Session Boundary",
    agentRole: "frontend",
    originalContent: `import React from 'react';
import { SupportInbox } from '@/components/dashboard/SupportInbox';
import { MetricsHeader } from '@/components/dashboard/Metrics';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const metadata = {
  title: 'SupportDesk AI — Inbox',
  description: 'AI-assisted customer support triage queue',
};

export default async function SupportDeskPage() {
  return (
    <AuthGuard requiredTier="pro">
      <main className="min-h-screen bg-[#0A0D14] text-[#C9D1D9] flex flex-col">
        {/* Realtime KPI Strip */}
        <section className="px-6 py-4 border-b border-[#21262D] bg-[#0E1117]">
          <MetricsHeader />
        </section>

        {/* Primary Inbox Workspace */}
        <section className="flex-1 overflow-hidden">
          <SupportInbox />
        </section>
      </main>
    </AuthGuard>
  );
}`,
    content: `import React from 'react';
import { SupportInbox } from '@/components/dashboard/SupportInbox';
import { MetricsHeader } from '@/components/dashboard/Metrics';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const metadata = {
  title: 'SupportDesk AI — Inbox',
  description: 'AI-assisted customer support triage queue',
};

export default async function SupportDeskPage() {
  return (
    <AuthGuard requiredTier="pro">
      <main className="min-h-screen bg-[#0A0D14] text-[#C9D1D9] flex flex-col">
        {/* Realtime KPI Strip */}
        <section className="px-6 py-4 border-b border-[#21262D] bg-[#0E1117]">
          <MetricsHeader />
        </section>

        {/* Primary Inbox Workspace */}
        <section className="flex-1 overflow-hidden">
          <SupportInbox />
        </section>
      </main>
    </AuthGuard>
  );
}`,
  },

  "src/app/layout.tsx": {
    id: "f_layout_tsx",
    name: "layout.tsx",
    path: "src/app/layout.tsx",
    language: "tsx",
    relatedBuildStep: "Define Authentication Architecture & Session Boundary",
    agentRole: "architect",
    originalContent: `import React from 'react';
import '@/styles/globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={\`\${inter.variable} \${mono.variable} dark\`}>
      <body className="bg-[#0A0D14] text-[#C9D1D9] antialiased">
        {children}
      </body>
    </html>
  );
}`,
    content: `import React from 'react';
import '@/styles/globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={\`\${inter.variable} \${mono.variable} dark\`}>
      <body className="bg-[#0A0D14] text-[#C9D1D9] antialiased">
        {children}
      </body>
    </html>
  );
}`,
  },

  "src/components/dashboard/Metrics.tsx": {
    id: "f_metrics_tsx",
    name: "Metrics.tsx",
    path: "src/components/dashboard/Metrics.tsx",
    language: "tsx",
    relatedBuildStep: "Implement Sign-In & Registration UI",
    agentRole: "backend",
    originalContent: `import React from 'react';
import { Clock, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export function MetricsHeader() {
  const metrics = [
    { label: 'Open Tickets', value: '18', change: '+2 today', icon: Clock, color: 'text-[#00F2FE]' },
    { label: 'Avg Response', value: '1.2m', change: '94% automated', icon: Sparkles, color: 'text-[#3FB950]' },
    { label: 'CSAT Score', value: '98.4%', change: '4.9 / 5.0', icon: CheckCircle2, color: 'text-[#A855F7]' },
    { label: 'High Priority', value: '4', change: 'Needs triage', icon: AlertTriangle, color: 'text-[#EF4444]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="p-3.5 rounded-xl bg-[#161B22] border border-[#30363D]">
          <div className="flex items-center justify-between text-xs text-[#8B949E]">
            <span>{m.label}</span>
            <m.icon className={\`h-4 w-4 \${m.color}\`} />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{m.value}</div>
          <div className="text-[10px] text-[#8B949E] mt-0.5">{m.change}</div>
        </div>
      ))}
    </div>
  );
}`,
    content: `import React from 'react';
import { Clock, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export function MetricsHeader() {
  const metrics = [
    { label: 'Open Tickets', value: '18', change: '+2 today', icon: Clock, color: 'text-[#00F2FE]' },
    { label: 'Avg Response', value: '1.2m', change: '94% automated', icon: Sparkles, color: 'text-[#3FB950]' },
    { label: 'CSAT Score', value: '98.4%', change: '4.9 / 5.0', icon: CheckCircle2, color: 'text-[#A855F7]' },
    { label: 'High Priority', value: '4', change: 'Needs triage', icon: AlertTriangle, color: 'text-[#EF4444]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="p-3.5 rounded-xl bg-[#161B22] border border-[#30363D]">
          <div className="flex items-center justify-between text-xs text-[#8B949E]">
            <span>{m.label}</span>
            <m.icon className={\`h-4 w-4 \${m.color}\`} />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{m.value}</div>
          <div className="text-[10px] text-[#8B949E] mt-0.5">{m.change}</div>
        </div>
      ))}
    </div>
  );
}`,
  },

  "src/components/dashboard/TicketList.tsx": {
    id: "f_ticketlist_tsx",
    name: "TicketList.tsx",
    path: "src/components/dashboard/TicketList.tsx",
    language: "tsx",
    relatedBuildStep: "Build ticket triage interface",
    agentRole: "frontend",
    originalContent: `import React from 'react';
import { SupportTicket } from '@/lib/tickets';
import { Badge } from '@/components/ui/Badge';

interface TicketListProps {
  tickets: SupportTicket[];
  selectedId: string | null;
  onSelect: (ticket: SupportTicket) => void;
}

export function TicketList({ tickets, selectedId, onSelect }: TicketListProps) {
  return (
    <div className="divide-y divide-[#21262D] overflow-y-auto">
      {tickets.map((t) => {
        const active = t.id === selectedId;
        return (
          <div
            key={t.id}
            onClick={() => onSelect(t)}
            className={\`p-4 cursor-pointer transition-colors \${
              active ? 'bg-[#161B22] border-l-2 border-[#00F2FE]' : 'hover:bg-[#161B22]/50'
            }\`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">{t.customerName}</span>
              <span className="text-[#8B949E] font-mono">{t.timeAgo}</span>
            </div>
            <h4 className="text-sm font-medium text-[#C9D1D9] mt-1 line-clamp-1">{t.subject}</h4>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={t.priority === 'urgent' ? 'destructive' : 'secondary'}>
                {t.priority}
              </Badge>
              <span className="text-[10px] font-mono text-[#8B949E]">{t.sentiment}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
    content: `import React from 'react';
import { SupportTicket } from '@/lib/tickets';
import { Badge } from '@/components/ui/Badge';

interface TicketListProps {
  tickets: SupportTicket[];
  selectedId: string | null;
  onSelect: (ticket: SupportTicket) => void;
}

export function TicketList({ tickets, selectedId, onSelect }: TicketListProps) {
  return (
    <div className="divide-y divide-[#21262D] overflow-y-auto">
      {tickets.map((t) => {
        const active = t.id === selectedId;
        return (
          <div
            key={t.id}
            onClick={() => onSelect(t)}
            className={\`p-4 cursor-pointer transition-colors \${
              active ? 'bg-[#161B22] border-l-2 border-[#00F2FE]' : 'hover:bg-[#161B22]/50'
            }\`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">{t.customerName}</span>
              <span className="text-[#8B949E] font-mono">{t.timeAgo}</span>
            </div>
            <h4 className="text-sm font-medium text-[#C9D1D9] mt-1 line-clamp-1">{t.subject}</h4>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={t.priority === 'urgent' ? 'destructive' : 'secondary'}>
                {t.priority}
              </Badge>
              <span className="text-[10px] font-mono text-[#8B949E]">{t.sentiment}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
  },

  "src/components/dashboard/TicketDetail.tsx": {
    id: "f_ticketdetail_tsx",
    name: "TicketDetail.tsx",
    path: "src/components/dashboard/TicketDetail.tsx",
    language: "tsx",
    relatedBuildStep: "Build ticket triage interface",
    agentRole: "frontend",
    originalContent: `import React, { useState } from 'react';
import { SupportTicket } from '@/lib/tickets';
import { Button } from '@/components/ui/Button';
import { Sparkles, Send } from 'lucide-react';

interface TicketDetailProps {
  ticket: SupportTicket;
  onReply: (ticketId: string, reply: string) => void;
}

export function TicketDetail({ ticket, onReply }: TicketDetailProps) {
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    onReply(ticket.id, draft);
    setDraft('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0E1117] p-6 space-y-6">
      <div className="border-b border-[#21262D] pb-4">
        <h2 className="text-lg font-bold text-white">{ticket.subject}</h2>
        <div className="flex items-center gap-2 text-xs text-[#8B949E] mt-1">
          <span>{ticket.customerName} ({ticket.customerEmail})</span>
          <span>·</span>
          <span>{ticket.company}</span>
        </div>
      </div>

      {/* AI Triage Card */}
      <div className="p-4 rounded-xl bg-[#00F2FE]/5 border border-[#00F2FE]/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00F2FE]">
          <Sparkles className="h-4 w-4" />
          <span>AI Triage Summary</span>
        </div>
        <p className="text-xs text-[#C9D1D9]">{ticket.aiSummary}</p>
      </div>

      {/* Composer */}
      <div className="mt-auto space-y-3 pt-4 border-t border-[#21262D]">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Draft response..."
          className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-3 text-xs text-white"
          rows={4}
        />
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={handleSend}>
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Send Response
          </Button>
        </div>
      </div>
    </div>
  );
}`,
    content: `import React, { useState } from 'react';
import { SupportTicket } from '@/lib/tickets';
import { Button } from '@/components/ui/Button';
import { Sparkles, Send } from 'lucide-react';

interface TicketDetailProps {
  ticket: SupportTicket;
  onReply: (ticketId: string, reply: string) => void;
}

export function TicketDetail({ ticket, onReply }: TicketDetailProps) {
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    onReply(ticket.id, draft);
    setDraft('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0E1117] p-6 space-y-6">
      <div className="border-b border-[#21262D] pb-4">
        <h2 className="text-lg font-bold text-white">{ticket.subject}</h2>
        <div className="flex items-center gap-2 text-xs text-[#8B949E] mt-1">
          <span>{ticket.customerName} ({ticket.customerEmail})</span>
          <span>·</span>
          <span>{ticket.company}</span>
        </div>
      </div>

      {/* AI Triage Card */}
      <div className="p-4 rounded-xl bg-[#00F2FE]/5 border border-[#00F2FE]/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00F2FE]">
          <Sparkles className="h-4 w-4" />
          <span>AI Triage Summary</span>
        </div>
        <p className="text-xs text-[#C9D1D9]">{ticket.aiSummary}</p>
      </div>

      {/* Composer */}
      <div className="mt-auto space-y-3 pt-4 border-t border-[#21262D]">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Draft response..."
          className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-3 text-xs text-white"
          rows={4}
        />
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={handleSend}>
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Send Response
          </Button>
        </div>
      </div>
    </div>
  );
}`,
  },

  "src/components/ui/Button.tsx": {
    id: "f_button_tsx",
    name: "Button.tsx",
    path: "src/components/ui/Button.tsx",
    language: "tsx",
    relatedBuildStep: "Implement UI Primitives",
    agentRole: "frontend",
    originalContent: `import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
  const variants = {
    primary: 'bg-[#00F2FE] hover:bg-[#00D8E6] text-black font-semibold',
    outline: 'border border-[#30363D] hover:bg-[#161B22] text-[#C9D1D9] hover:text-white',
    ghost: 'hover:bg-[#161B22] text-[#8B949E] hover:text-white',
  };
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  return <button className={\`\${base} \${variants[variant]} \${sizes[size]} \${className}\`} {...props} />;
}`,
    content: `import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
  const variants = {
    primary: 'bg-[#00F2FE] hover:bg-[#00D8E6] text-black font-semibold',
    outline: 'border border-[#30363D] hover:bg-[#161B22] text-[#C9D1D9] hover:text-white',
    ghost: 'hover:bg-[#161B22] text-[#8B949E] hover:text-white',
  };
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  return <button className={\`\${base} \${variants[variant]} \${sizes[size]} \${className}\`} {...props} />;
}`,
  },

  "src/components/ui/Badge.tsx": {
    id: "f_badge_tsx",
    name: "Badge.tsx",
    path: "src/components/ui/Badge.tsx",
    language: "tsx",
    relatedBuildStep: "Implement UI Primitives",
    agentRole: "frontend",
    originalContent: `import React from 'react';

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#161B22] border border-[#30363D] text-[#C9D1D9]">
      {children}
    </span>
  );
}`,
    content: `import React from 'react';

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#161B22] border border-[#30363D] text-[#C9D1D9]">
      {children}
    </span>
  );
}`,
  },

  "src/lib/tickets.ts": {
    id: "f_tickets_ts",
    name: "tickets.ts",
    path: "src/lib/tickets.ts",
    language: "typescript",
    relatedBuildStep: "Define Authentication Architecture & Session Boundary",
    agentRole: "backend",
    originalContent: `export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  company: string;
  subject: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  sentiment: 'frustrated' | 'anxious' | 'inquiring' | 'satisfied';
  status: 'open' | 'in_progress' | 'resolved';
  timeAgo: string;
  aiSummary: string;
}

export function classifyTicketUrgency(priority: string, sentiment: string): number {
  let score = 0;
  if (priority === 'urgent') score += 50;
  if (priority === 'high') score += 30;
  if (sentiment === 'frustrated') score += 20;
  return score;
}`,
    content: `export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  company: string;
  subject: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  sentiment: 'frustrated' | 'anxious' | 'inquiring' | 'satisfied';
  status: 'open' | 'in_progress' | 'resolved';
  timeAgo: string;
  aiSummary: string;
}

export function classifyTicketUrgency(priority: string, sentiment: string): number {
  let score = 0;
  if (priority === 'urgent') score += 50;
  if (priority === 'high') score += 30;
  if (sentiment === 'frustrated') score += 20;
  return score;
}`,
  },

  "src/lib/ai.ts": {
    id: "f_ai_ts",
    name: "ai.ts",
    path: "src/lib/ai.ts",
    language: "typescript",
    relatedBuildStep: "Route Protection & Middleware",
    agentRole: "architect",
    originalContent: `export async function generateTicketResolution(issue: string) {
  // Simulated streaming agent completion
  return {
    confidence: 0.98,
    action: 'Invalidate stale session cookie and dispatch reset link.',
  };
}`,
    content: `export async function generateTicketResolution(issue: string) {
  // Simulated streaming agent completion
  return {
    confidence: 0.98,
    action: 'Invalidate stale session cookie and dispatch reset link.',
  };
}`,
  },

  "src/styles/globals.css": {
    id: "f_globals_css",
    name: "globals.css",
    path: "src/styles/globals.css",
    language: "css",
    relatedBuildStep: "Implement UI Primitives",
    agentRole: "frontend",
    originalContent: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #0A0D14;
  --bg-secondary: #0E1117;
  --border-subtle: #21262D;
}`,
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #0A0D14;
  --bg-secondary: #0E1117;
  --border-subtle: #21262D;
}`,
  },

  "public/logo.svg": {
    id: "f_logo_svg",
    name: "logo.svg",
    path: "public/logo.svg",
    language: "svg",
    relatedBuildStep: "Project Initialization",
    agentRole: "frontend",
    originalContent: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#00F2FE" />
</svg>`,
    content: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#00F2FE" />
</svg>`,
  },

  "package.json": {
    id: "f_package_json",
    name: "package.json",
    path: "package.json",
    language: "json",
    relatedBuildStep: "Define Authentication Architecture & Session Boundary",
    agentRole: "architect",
    originalContent: `{
  "name": "supportdesk-ai",
  "version": "2.4.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.344.0",
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.0"
  }
}`,
    content: `{
  "name": "supportdesk-ai",
  "version": "2.4.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.344.0",
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.0"
  }
}`,
  },

  "README.md": {
    id: "f_readme_md",
    name: "README.md",
    path: "README.md",
    language: "markdown",
    relatedBuildStep: "Project Initialization",
    agentRole: "architect",
    originalContent: `# SaaS SupportDesk AI

AI-driven customer support triage desk with automated ticket sentiment tagging and instant chat resolution.

## Architecture

- **Framework:** Next.js 14 App Router + React 18
- **Authentication:** Supabase Auth Boundary with HTTP-only session cookies
- **AI Triage Swarm:** Multi-agent classifier with automated recommendation heuristics
- **Styling:** Tailwind CSS + Obsidian Theme

## Getting Started

\`\`\`bash
npm run dev
# Open http://localhost:3000
\`\`\`

## Swarm Agent Attribution

Generated and verified by the Architect 2.0 Multi-Agent Swarm (Architect, Frontend, Backend, QA).
`,
    content: `# SaaS SupportDesk AI

AI-driven customer support triage desk with automated ticket sentiment tagging and instant chat resolution.

## Architecture

- **Framework:** Next.js 14 App Router + React 18
- **Authentication:** Supabase Auth Boundary with HTTP-only session cookies
- **AI Triage Swarm:** Multi-agent classifier with automated recommendation heuristics
- **Styling:** Tailwind CSS + Obsidian Theme

## Getting Started

\`\`\`bash
npm run dev
# Open http://localhost:3000
\`\`\`

## Swarm Agent Attribution

Generated and verified by the Architect 2.0 Multi-Agent Swarm (Architect, Frontend, Backend, QA).
`,
  },

  ".env.example": {
    id: "f_env_example",
    name: ".env.example",
    path: ".env.example",
    language: "env",
    relatedBuildStep: "Define Authentication Architecture & Session Boundary",
    agentRole: "backend",
    originalContent: `NEXT_PUBLIC_APP_NAME="SupportDesk AI"
NEXT_PUBLIC_API_URL="https://api.supportdesk.ai/v1"
SUPABASE_URL="https://xyzcompany.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
DATABASE_URL="postgresql://postgres:password@localhost:5432/supportdesk"
`,
    content: `NEXT_PUBLIC_APP_NAME="SupportDesk AI"
NEXT_PUBLIC_API_URL="https://api.supportdesk.ai/v1"
SUPABASE_URL="https://xyzcompany.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
DATABASE_URL="postgresql://postgres:password@localhost:5432/supportdesk"
`,
  },
};

/**
 * Builds the hierarchical VirtualDirectory structure from the flat records
 */
export function buildVirtualFileTree(
  files: Record<string, VirtualFile>
): VirtualDirectory {
  return {
    name: "supportdesk-ai",
    path: "",
    isOpen: true,
    subdirectories: [
      {
        name: "src",
        path: "src",
        isOpen: true,
        subdirectories: [
          {
            name: "app",
            path: "src/app",
            isOpen: true,
            subdirectories: [],
            files: [
              files["src/app/page.tsx"],
              files["src/app/layout.tsx"],
            ].filter(Boolean),
          },
          {
            name: "components",
            path: "src/components",
            isOpen: true,
            subdirectories: [
              {
                name: "dashboard",
                path: "src/components/dashboard",
                isOpen: true,
                subdirectories: [],
                files: [
                  files["src/components/dashboard/Metrics.tsx"],
                  files["src/components/dashboard/TicketList.tsx"],
                  files["src/components/dashboard/TicketDetail.tsx"],
                ].filter(Boolean),
              },
              {
                name: "ui",
                path: "src/components/ui",
                isOpen: false,
                subdirectories: [],
                files: [
                  files["src/components/ui/Button.tsx"],
                  files["src/components/ui/Badge.tsx"],
                ].filter(Boolean),
              },
            ],
            files: [],
          },
          {
            name: "lib",
            path: "src/lib",
            isOpen: false,
            subdirectories: [],
            files: [
              files["src/lib/tickets.ts"],
              files["src/lib/ai.ts"],
            ].filter(Boolean),
          },
          {
            name: "styles",
            path: "src/styles",
            isOpen: false,
            subdirectories: [],
            files: [files["src/styles/globals.css"]].filter(Boolean),
          },
        ],
        files: [],
      },
      {
        name: "public",
        path: "public",
        isOpen: false,
        subdirectories: [],
        files: [files["public/logo.svg"]].filter(Boolean),
      },
    ],
    files: [
      files["package.json"],
      files["README.md"],
      files[".env.example"],
    ].filter(Boolean),
  };
}
