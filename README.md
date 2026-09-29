# Architect 2.0

> **Live Demo:** [architect-20-psi.vercel.app](https://architect-20-psi.vercel.app)  
> **Repository:** [github.com/Rukhsar24081998/architect-2.0](https://github.com/Rukhsar24081998/architect-2.0)

> **Architect 2.0 is an AI-native software development workspace that turns natural-language product ideas into structured build plans, coordinated agent execution, interactive previews, and developer-ready project workspaces.**

Architect 2.0 is built on a single organizing principle: **"Simple by default. Powerful when needed."** 

Traditional development workflows force teams to pick between oversimplified no-code prompt generators and fragmented, intimidating command-line environments. Architect 2.0 unifies both worlds into a single progressive workspace: **Build Mode** offers founders, product managers, designers, and operators a prompt-first, intent-driven experience, while **Developer Mode** exposes full IDE control, code editing, terminal commands, and version diffs without losing project context.

---

## Links

- **Live Demo:** https://architect-20-psi.vercel.app
- **GitHub Repository:** https://github.com/Rukhsar24081998/architect-2.0

---

## What is Architect 2.0?

Software development teams typically face a severe disconnect between intent and implementation:
- Non-technical stakeholders describe ideas in natural language but struggle to verify architectural plans or inspect code.
- Professional developers must manually translate loosely defined PRDs into milestone roadmaps, database schemas, and boilerplate pull requests.
- Standard AI code generation tools generate raw code snippets without milestone governance, role-specific agents, or context-linked reviews.

Architect 2.0 bridges this divide through a continuous, progressive product journey:

```
Idea  ──►  Requirements Discovery  ──►  Structured Build Plan  ──►  Coordinated Agent Swarm  ──►  Interactive Preview  ──►  Developer Mode (IDE)  ──►  Operational Studios
```

Users begin by describing an idea in plain English. The workspace clarifies scope, extracts formal requirements, proposes an actionable milestone roadmap, coordinates specialized AI agents, renders an interactive live sandbox, and grants direct access to the underlying code and infrastructure whenever technical depth is required.

---

## Core Experience

### 1. Build Mode
A prompt-first conversational workspace that focuses entirely on product intent.
- **Natural-Language Intent Discovery:** Users describe features or entire applications in plain English.
- **Contextual Clarification:** Rather than making blind assumptions, Architect asks structured follow-up questions with quick-select chips (e.g., target platforms, authentication providers, data persistence).
- **Automated Requirements Extraction:** Continuously synthesizes dialogue into a living **Requirements Discovery Card** (*Product, Target Users, Core Purpose, Knowledge Sources, Persistence, Recommended Stack*).
- **Persistent Project Conversation:** Every discussion thread is stored with the project for team continuity.
- **Dual-Engine AI Intelligence:** Powered by **Groq** (`llama-3.3-70b-versatile`) for ultra-low latency inference, paired with a deterministic offline orchestration engine that guarantees reliable execution even when API keys are unconfigured.

### 2. Build Plan
A product-first milestone roadmap that bridges human intent and technical execution.
- **Milestone-Based Steps:** Plans are organized into sequential, understandable product milestones rather than opaque Git diffs.
- **Progressive Technical Disclosure:** Step summaries are plain English by default; expanding an individual step reveals targeted files, API endpoints, agent task assignments, and architectural assumptions.
- **Governance & Approval Workflow:** Users review and approve proposed milestones before work begins.
  > *"Approving a plan makes it ready for agent execution; approval does not itself execute the plan."*

### 3. Agent Command Center
A visual orchestration cockpit managing four simulated specialized agents:
- **Architect Agent:** System architecture design, database entity modeling, and route planning.
- **Frontend Agent:** User interfaces, component hierarchy, responsive layouts, and state binding.
- **Backend Agent:** API route handlers, data persistence contracts, and authentication boundaries.
- **QA Agent:** Test coverage verification, lint checks, validation suites, and regression testing.
- **Real-Time Telemetry:** Displays step progress bars, token consumption metrics, live activity log streams, and an inspectable agent detail drawer.
- **Swarm Controls:** Full execution lifecycle management including Pause, Resume, Stop/Abort, and "Run Again" state resets.
- *Note:* The current prototype uses a deterministic simulation engine to demonstrate the multi-agent interaction model without requiring long-running local background processes.

### 4. Contextual Interactive Preview
A live sandbox where users can interact with working applications immediately.
- **Deterministic Scenario Selection:** Architect evaluates the approved build plan and automatically mounts the corresponding interactive scenario:
  - **Internal Assistant / AI Chatbot:** Multi-turn conversational interface with starter prompts and knowledge-base search.
  - **SupportDesk:** Customer support ticket triage queue, sentiment indicators, and live ticket resolution.
  - **Analytics Dashboard:** Real-time KPI summary metrics, traffic distributions, and activity trends.
  - **Generic SaaS / Landing:** Modern marketing hero, value propositions, and customer onboarding flow.
- **Responsive Viewport Controls:** Toggle preview frames between Desktop (100%), Tablet (768px), and Mobile (375px).
- **Component Inspector:** Interactive element picker displaying UI hierarchy and component metadata.

### 5. Developer Mode
A full-featured professional IDE built directly into the workspace (accessible via header toggle or `⌘M`).
- **File Explorer:** Virtual file system tree with directory navigation and file icons.
- **Syntax-Highlighted Code Editor:** Tabbed editor supporting TypeScript, TSX, CSS, JSON, and Markdown with line numbering and dirty buffer indicators.
- **Interactive Terminal:** Responds to standard project commands (`npm run build`, `npm run dev`, `npm test`, `git status`, `help`, `clear`).
- **Source Control & Git Diff Viewer:** Inline visual diff viewer showing line-by-line additions and deletions, commit history, and a commit composer.
- **Architect Context Panel:** A dedicated sidebar linking open code files directly back to the active Build Plan milestone, user prompt, and agent rationale.
- **Responsive 1024px Drawer:** Automatically collapses the context panel into an on-demand slide-over drawer on smaller desktop displays to preserve editor width.

### 6. Secondary Studios
Dedicated operational and technical studios linked directly from the navigation:
- **Activity (`/activity`):** Chronological audit trail of all project events with category filtering (*Plans, Agents, Commits, Deployments*) and real-time search.
- **Environment (`/environment`):** AES-256 encrypted secrets vault with key masking/unmasking, clipboard copy, variable addition, and deletion.
- **GitHub (`/github`):** Repository metadata, default branch protection, active Pull Request inspection (#14 with passing automated checks), and recent commit history.
- **Database (`/database`):** Visual relational schema browser (`users`, `tickets`, `chat_sessions`), primary/foreign key mappings, entity relationship constraint cards, and tabbed sample record tables.
- **Integrations (`/integrations`):** Connector marketplace featuring Supabase, Groq AI, Stripe, and Resend with interactive status toggles.
- **Deployments (`/deployments`):** Production release dashboard displaying edge CDN domains, global latency metrics, 5-stage release pipeline stepper, deployment history, and instant rollback triggers.
- **Settings (`/settings`):** General project configuration, default workspace mode preferences (Build Mode vs Developer Mode), AI model telemetry, and protected Danger Zone controls.

---

## Product Workflow

1. **Create or Import Project:** Initialize from prompt templates or simulate repository import.
2. **Describe Intent:** Enter what you want to build in natural language within Build Mode.
3. **Contextual Discovery:** Answer clarification questions with one-click suggestion chips.
4. **Requirements Synthesis:** Architect automatically structures dialogue into an actionable requirements card.
5. **Generate Build Plan:** Propose a 5-step milestone roadmap detailing affected files and technical scope.
6. **Approve Plan:** Review architectural scope and transition the plan into an approved, ready-to-execute state.
7. **Orchestrate Agent Swarm:** Monitor the Architect, Frontend, Backend, and QA agents in the Command Center.
8. **Verify in Live Preview:** Test the interactive sandbox across Desktop, Tablet, and Mobile viewports.
9. **Switch to Developer Mode:** Toggle into the full IDE (`⌘M`) to review TypeScript code, inspect Git diffs, or execute simulated terminal commands.
10. **Manage Project Lifecycle:** Inspect project activity feeds, manage environment secrets, review pull requests, and trigger deployment rollbacks across secondary studios.

---

## Build Mode vs Developer Mode

| Capability | Build Mode | Developer Mode |
| :--- | :--- | :--- |
| **Primary Audience** | Founders, PMs, Designers, Operators | Full-Stack Engineers & Technical Leads |
| **Primary Language** | Natural product language | Code, syntax, and directory trees |
| **Interface Paradigm** | Prompt-first & visual | Code-first & IDE-native |
| **Requirements** | Conversational discovery questions | Architect Context panel linking code to intent |
| **Roadmap** | 5-step milestone Build Plan | Virtual file tree and file tabs |
| **Execution** | Multi-agent swarm cockpit & logs | Interactive simulated terminal & CLI |
| **Verification** | Contextual live interactive preview | Side-by-side Git diff viewer & commit composer |
| **Configuration** | Simplified progressive disclosure | Secrets vault, database schemas, and Git history |

> *"Both modes operate on the same unified project context—switching modes never loses progress, state, or context."*

---

## Architecture

Architect 2.0 is designed as a modular, local-first Next.js workspace application:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              AppShell                                  │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ TopNav (Mode Toggle, Project Breadcrumbs, Persona Switcher)    │   │
│   ├───────────────────────┬────────────────────────────────────────┤   │
│   │ SideNav               │ Main Stage Viewport                    │   │
│   │  • Workspace (Core)   │  • Build Mode / Chat                   │   │
│   │  • Technical Studios  │  • Build Plan / Step Roadmap           │   │
│   │  • Operations Studios │  • Agent Command Center                │   │
│   │                       │  • Live Interactive Preview            │   │
│   │                       │  • Developer Mode (IDE & Terminal)     │   │
│   │                       │  • Secondary Studios (DB, Git, Ops)    │   │
│   └───────────────────────┴────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Workspace Context Engine                        │
│   • WorkspaceProvider (Global project state, active plan, mode)        │
│   • ToastProvider (Unified notification feedback system)               │
│   • AuthContext (Persona profiles: Alex Rivera, Sarah Chen, Marcus)    │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│      Server Route Handlers        │ │        AI & Scenario Logic       │
│  • /api/projects                  │ │  • Groq SDK (Llama 3.3 70B)      │
│  • /api/build-plans               │ │  • Deterministic Intent Fallback │
│  • /api/agent-runs                │ │  • detectPreviewScenario Selector│
│  • /api/chat                      │ │  • Virtual File System Engine    │
└───────────────────────────────────┘ └──────────────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│        Local Store Layer          │
│  • JSON-backed data/store.json    │
│  • Isolated storage engine        │
└───────────────────────────────────┘
```

- **Frontend:** Next.js App Router with React 19, TypeScript strict mode, and Tailwind CSS.
- **Design System:** Custom dark Obsidian aesthetic (`#090A0F`, `#0E1117`, `#161B22`, `#21262D`, `#30363D`) accented with electric cyan (`#00F2FE`) and violet (`#A855F7`).
- **State Management:** Native React Context (`WorkspaceContext`, `ToastContext`, `AuthContext`) paired with custom hooks.
- **Persistence:** Local JSON-backed document store (`data/store.json`) with transactional file read/write adapters.
- **AI Inference:** Groq SDK running `llama-3.3-70b-versatile` with an automated deterministic fallback engine for offline reliability.
- **Live Preview:** Pure React component sandbox routing scenarios deterministically using `detectPreviewScenario()`.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server Components, routing, and API route handlers |
| **Runtime & Core** | React 19 + TypeScript 5 | Modern component architecture with end-to-end type safety |
| **Styling** | Tailwind CSS 4 | Responsive utilities, CSS variables, and dark Obsidian theme |
| **Icons** | Lucide React | Consistent, scalable iconography across all subsystems |
| **AI Inference** | Groq SDK (`groq-sdk`) | High-speed LLM inference for conversational intent discovery |
| **State Management** | React Context & Hooks | Reactive synchronization across modes, plans, and studios |
| **Local Persistence** | JSON Document Store | Deterministic, file-backed state storage (`data/store.json`) |
| **Code Highlighting** | Custom Virtual IDE | Syntax-highlighted code editor, terminal, and diff viewer |
| **Quality & Linting** | ESLint 9 + TypeScript | Strict static analysis with zero lint warnings or build errors |
| **Deployment Target** | Vercel / Node.js Engine | Standards-compliant Next.js application |

---

## Getting Started

### Prerequisites
- **Node.js:** v20.x or v22.x (LTS recommended)
- **npm:** v10+

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rukhsar24081998/architect-2.0.git
   cd architect-2.0
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *(Optional)* Add your Groq API Key to enable live cloud LLM inference in Build Mode. If left blank, Architect automatically engages its deterministic offline intelligence engine:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Verification Commands

```bash
# Run ESLint validation
npm run lint

# Run optimized production build
npm run build
```

---

## Assessment Demo Guide

**Live application:** https://architect-20-psi.vercel.app

To experience the primary end-to-end golden path:

1. **Explore Landing (`/`):** Click **"Explore Interactive Demo"** or **"Launch Workspace"**.
2. **Review Dashboard (`/dashboard`):** Inspect workspace metrics and select the canonical project **"SaaS SupportDesk AI"** (`prj_supportdesk`).
3. **Build Mode (`/projects/prj_supportdesk?mode=build`):** Review the intent dialogue (*"I want to build an internal assistant chatbot"*) and the synthesized Requirements Discovery Card.
4. **Build Plan (`?planId=bp_1790610350675`):** Inspect the 5-step milestone roadmap and review progressive technical details.
5. **Agent Command Center (`/projects/prj_supportdesk/agents`):** Inspect the completed 4-agent swarm (`Architect`, `Frontend`, `Backend`, `QA`) with live execution logs.
6. **Contextual Live Preview (`/projects/prj_supportdesk/preview`):** Interact with the mounted **Internal Assistant Chatbot** sandbox and toggle responsive viewports.
7. **Developer Mode (`/projects/prj_supportdesk/code` or `⌘M`):** Toggle to the full IDE to inspect code, run terminal commands, and review Git diffs.
8. **Explore Secondary Studios:** Review the Database schema ERD (`/database`), Environment secrets (`/environment`), GitHub PR status (`/github`), and Deployment history (`/deployments`).
