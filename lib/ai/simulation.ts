/**
 * Architect 2.0 Deterministic Simulation Engine
 * Generates context-grounded architectural responses recognizing specific intent categories
 * when real LLM credentials (Groq) are unavailable or when requests fail.
 */

import { MessageAction, RequirementsSummary } from "../types";
import { ProjectContextSummary } from "./prompts";

export interface SimulatedResponse {
  content: string;
  thinking: string;
  contextFiles: string[];
  suggestedActions: MessageAction[];
  summary: string;
  category: string;
  question?: string | null;
  options?: string[];
  requirementsSummary?: RequirementsSummary | null;
  isReadyForBuildPlan?: boolean;
}

export function generateSimulatedResponse(
  prompt: string,
  context: ProjectContextSummary
): SimulatedResponse {
  const lower = prompt.toLowerCase();
  const existingFiles = context.files || [];
  const cleanPrompt = prompt.trim();

  // Helper to find existing file or fallback
  const findExistingOr = (pattern: RegExp, fallback: string) => {
    const found = existingFiles.find((f) => pattern.test(f));
    return found || fallback;
  };

  // Helper to construct option actions
  const makeOptionActions = (options: string[], includePlanAction = false): MessageAction[] => {
    const actions: MessageAction[] = options.map((opt) => ({
      label: opt,
      action: "select_option",
      payload: { option: opt, content: opt },
    }));
    if (includePlanAction) {
      actions.push({ label: "Create Build Plan →", action: "create_plan" });
    }
    return actions;
  };

  // 1. CHATBOT / CONVERSATIONAL AI REQUIREMENTS DISCOVERY
  if (/\b(chatbot|chat bot|conversational|assistant|ai assistant|dialogue|chat interface)\b/i.test(lower)) {
    // Stage D: Summary if persistence, docs, or enough discovery answers
    if (/\b(save|history|persistence|supabase|documentation|faq|ticket|knowledge|company doc)\b/i.test(lower)) {
      const summary: RequirementsSummary = {
        product: "Customer Support Chatbot",
        users: "Customers and website visitors",
        corePurpose: "Answer support questions and resolve common issues",
        knowledge: "Company documentation and FAQs",
        persistence: "Conversation history stored per user",
        recommendedStack: "Next.js + TypeScript + TailwindCSS + Supabase",
      };
      return {
        category: "chatbot",
        summary: "AI chatbot requirements summary",
        thinking: `Synthesizing confirmed chatbot specifications: customer support scope, widget delivery, FAQ knowledge, and Supabase conversation history.`,
        contextFiles: [],
        requirementsSummary: summary,
        isReadyForBuildPlan: true,
        question: null,
        options: [],
        suggestedActions: [
          {
            label: "Create Build Plan →",
            action: "create_plan",
            payload: { requirementsSummary: summary },
          },
        ],
        content: `Here's what I've understood:

**Customer Support Chatbot**

- **Users**: Customers and website visitors
- **Purpose**: Answer support questions and resolve common issues
- **Knowledge**: Company documentation and FAQs
- **Persistence**: Conversation history stored per user
- **Recommended stack**: Next.js + TypeScript + TailwindCSS + Supabase`,
      };
    }

    // Stage C: Knowledge source
    if (/\b(widget|visitors|portal|channel|slack|customers|mobile app|whatsapp|multiple channels)\b/i.test(lower)) {
      const opts = [
        "Company documentation and FAQs",
        "Uploaded support ticket history",
        "Live website URL",
        "Custom instructions",
      ];
      return {
        category: "chatbot",
        summary: "chatbot knowledge discovery",
        thinking: `Delivery channel established. Identifying knowledge domain and response grounding sources.`,
        contextFiles: [],
        question: "What knowledge source should the chatbot use when answering?",
        options: opts,
        suggestedActions: makeOptionActions(opts, false),
        content: `Understood. Next, let's determine how the chatbot will find answers:

**What knowledge source should the chatbot use when answering?**`,
      };
    }

    // Stage B: Audience & Channel
    if (/\b(customer support|support|internal|team|education|tutoring|lead|general-purpose)\b/i.test(lower)) {
      const opts = [
        "Website widget",
        "Mobile app",
        "WhatsApp / messaging",
        "Multiple channels",
      ];
      return {
        category: "chatbot",
        summary: "chatbot audience discovery",
        thinking: `Core purpose defined. Clarifying user audience and primary interface channel.`,
        contextFiles: [],
        question: "Where should customers interact with it?",
        options: opts,
        suggestedActions: makeOptionActions(opts, false),
        content: `Got it — a customer support chatbot.

**Where should customers interact with it?**`,
      };
    }

    // Stage A: Initial Idea -> Ask main job
    const initialOpts = [
      "Customer support",
      "Internal assistant",
      "Education",
      "Lead generation",
      "General-purpose",
    ];
    return {
      category: "chatbot",
      summary: "chatbot purpose discovery",
      thinking: `Analyzing initial request "${cleanPrompt.slice(0, 36)}...". Asking primary use-case to scope the MVP.`,
      contextFiles: [],
      question: "What will be its primary job?",
      options: initialOpts,
      suggestedActions: makeOptionActions(initialOpts, false),
      content: `Great! Let's shape your chatbot.

**What will be its primary job?**`,
    };
  }


  // 2. FOOD DELIVERY / RESTAURANT
  if (/\b(food delivery|food|restaurant|ordering|takeout|menu catalog|meals)\b/i.test(lower)) {
    if (/\b(cart|checkout|tracking|delivery|address|payment)\b/i.test(lower)) {
      const summary: RequirementsSummary = {
        product: "Food Delivery & Takeout App",
        users: "Hungry customers & restaurant staff",
        corePurpose: "Browse menus, customize dishes, checkout, and track delivery in real time",
        knowledge: "Structured restaurant menu catalog with dish pricing and tags",
        persistence: "Order history and cart state stored in database",
        recommendedStack: "Next.js, TypeScript, TailwindCSS, Supabase",
      };
      return {
        category: "food_delivery",
        summary: "food delivery requirements summary",
        thinking: `Synthesizing food delivery requirements: menu catalog, cart calculation, and order tracking.`,
        contextFiles: [],
        requirementsSummary: summary,
        isReadyForBuildPlan: true,
        question: null,
        options: [],
        suggestedActions: [
          {
            label: "Create Build Plan →",
            action: "create_plan",
            payload: { requirementsSummary: summary },
          },
        ],
        content: `Here's what I've understood:

- **Product**: Food Delivery & Takeout App
- **Users**: Hungry customers & restaurant staff
- **Core Purpose**: Browse menus, customize dishes, checkout, and track delivery in real time
- **Knowledge**: Structured restaurant menu catalog with dish pricing and tags
- **Persistence**: Order history and cart state stored in database
- **Recommended Stack**: Next.js, TypeScript, TailwindCSS, Supabase

Ready to create your Build Plan.`,
      };
    }

    const opts = [
      "Single-restaurant online ordering & takeout",
      "Multi-restaurant delivery marketplace",
      "Meal-kit / weekly subscription delivery",
      "Campus / localized courier ordering",
    ];
    return {
      category: "food_delivery",
      summary: "food delivery model discovery",
      thinking: `Scoping food delivery ordering model and customer checkout flow.`,
      contextFiles: [],
      question: "What is the core ordering model for your food delivery app?",
      options: opts,
      suggestedActions: makeOptionActions(opts, false),
      content: `For a **Food Delivery Application**, let's establish the primary focus for the first release.

**What is the core ordering model?**`,
    };
  }

  // 3. ANALYTICS / SALES DASHBOARD
  if (/\b(analytics|sales dashboard|sales team|metrics|reporting|kpi|charts|conversion)\b/i.test(lower)) {
    if (/\b(mrr|churn|revenue|conversion|pipeline|filter)\b/i.test(lower)) {
      const summary: RequirementsSummary = {
        product: "SaaS Subscription Analytics Dashboard",
        users: "Founders, finance teams, and growth leaders",
        corePurpose: "Monitor revenue growth, churn rate, lifetime value, and cohort retention",
        knowledge: "Stripe subscription transactions & billing event logs",
        persistence: "Aggregated time-series metrics stored in database",
        recommendedStack: "Next.js, TypeScript, TailwindCSS, Supabase",
      };
      return {
        category: "analytics",
        summary: "analytics requirements summary",
        thinking: `Synthesizing analytics requirements: KPI cards, time-series visualizations, and cohort filtering.`,
        contextFiles: [],
        requirementsSummary: summary,
        isReadyForBuildPlan: true,
        question: null,
        options: [],
        suggestedActions: [
          {
            label: "Create Build Plan →",
            action: "create_plan",
            payload: { requirementsSummary: summary },
          },
        ],
        content: `Here's what I've understood:

- **Product**: SaaS Subscription Analytics Dashboard
- **Users**: Founders, finance teams, and growth leaders
- **Core Purpose**: Monitor revenue growth, churn rate, lifetime value, and cohort retention
- **Knowledge**: Stripe subscription transactions & billing event logs
- **Persistence**: Aggregated time-series metrics stored in database
- **Recommended Stack**: Next.js, TypeScript, TailwindCSS, Supabase

Ready to create your Build Plan.`,
      };
    }

    const opts = [
      "SaaS subscription metrics (MRR, churn, LTV)",
      "E-commerce sales & conversion funnel",
      "Marketing campaign traffic & attribution",
      "Team productivity & customer support SLAs",
    ];
    return {
      category: "analytics",
      summary: "analytics domain discovery",
      thinking: `Scoping analytics domain: identifying primary metric types and reporting scope.`,
      contextFiles: [],
      question: "What metrics will the dashboard primarily track?",
      options: opts,
      suggestedActions: makeOptionActions(opts, false),
      content: `For an **Analytics Dashboard**, let's pinpoint the core data domain.

**What metrics will the dashboard primarily track?**`,
    };
  }


  // 4. AUTHENTICATION
  if (/\b(auth|authentication|login|signup|sign-in|session|oauth|jwt|credentials|password|user)\b/i.test(lower)) {
    const appFile = findExistingOr(/app|main|index/i, "src/App.tsx");
    return {
      category: "authentication",
      summary: "authentication architecture",
      thinking: `Evaluating session boundary and route protection for authentication flow.`,
      contextFiles: existingFiles.filter((f) => /auth|app|route|user/i.test(f)).slice(0, 2),
      suggestedActions: [
        { label: "Create build plan", action: "create_plan" },
        { label: "Inspect architecture", action: "inspect_arch" },
      ],
      content: `I will structure an authentication layer with secure session boundaries:

### Proposed Architecture & Steps:
1. **Define the Auth Boundary**: Establish session middleware and secure HTTP-only cookie handlers.
2. **Implement User Sign-In & Onboarding**: Add passwordless / OAuth authentication screens with persona-aware redirection.
3. **Protect Application Routes**: Guard core workspace paths against unauthenticated requests.
4. **Context Injection**: Expose user credentials and permissions to \`${appFile}\`.

Next, I can turn this into a structured **Build Plan** for execution.`,
    };
  }

  // 5. SPECIFIC SUPPORTDESK / TICKET TRIAGE
  if (/\b(supportdesk|support desk|ticket|tickets|triage|inbox queue|sla)\b/i.test(lower)) {
    const uiFile = findExistingOr(/ticket|inbox|list|app/i, "src/components/dashboard/TicketList.tsx");
    return {
      category: "supportdesk",
      summary: "SupportDesk ticket triage interface",
      thinking: `Analyzing ${context.name} ticket triage workflow in ${uiFile}.`,
      contextFiles: [uiFile].filter(Boolean),
      suggestedActions: [
        { label: "Create build plan", action: "create_plan" },
        { label: "Review current code", action: "review_code" },
      ],
      content: `I'll enhance the customer support triage queue for **${context.name}**:

### Implementation Roadmap:
1. **Ticket Triage Queue**: High-density ticket listing with real-time status badges, urgency flags, and SLA timers.
2. **AI-Assisted Composer**: Suggested response generator leveraging customer context and previous resolutions.
3. **Customer Context Drawer**: Split-pane view exposing customer tier, order history, and sentiment scores.
4. **Keyboard Shortcuts**: Quick triage actions (J/K navigation, E to resolve, A to assign).

Would you like me to generate a build plan for these SupportDesk enhancements?`,
    };
  }

  // 6. GENERAL DASHBOARD / UI (Guarded by word boundaries so "build" does not match)
  if (/\b(dashboard|ui|design|layout|homepage|landing|theme|dark mode|modernize|styling)\b/i.test(lower)) {
    const uiFile = findExistingOr(/list|table|view|app/i, existingFiles[0] || "src/App.tsx");
    return {
      category: "ui",
      summary: "UI presentation layer",
      thinking: `Synthesizing responsive UI architecture for ${context.name}.`,
      contextFiles: [uiFile].filter(Boolean),
      suggestedActions: [
        { label: "Create build plan", action: "create_plan" },
        { label: "Review current code", action: "review_code" },
      ],
      content: `I'll structure the presentation layer with a focus on high-density information architecture:

### UI Implementation Roadmap:
1. **Component Hierarchy**: Structure modular cards, real-time status indicators, and clean metric strips.
2. **Visual Tokens**: Apply the Obsidian dark theme with Electric Cyan and Violet accents for active state feedback.
3. **State & Responsiveness**: Optimize component layout for desktop-first data display with responsive mobile stacking.
4. **Micro-Interactions**: Integrate smooth state transitions and subtle hover feedback without layout shifts.

Would you like me to generate a build plan for these UI components?`,
    };
  }

  // 7. DATABASE / SCHEMA
  if (/\b(database|db|schema|table|model|supabase|postgres|prisma|sql|migration|entity)\b/i.test(lower)) {
    const schemaFile = findExistingOr(/schema|prisma|db|ticket|ledger/i, "src/types/schema.ts");
    return {
      category: "database",
      summary: "data schema and persistence models",
      thinking: `Formulating relational schema based on domain requirements.`,
      contextFiles: existingFiles.filter((f) => /schema|prisma|model/i.test(f)),
      suggestedActions: [
        { label: "Create build plan", action: "create_plan" },
        { label: "Inspect architecture", action: "inspect_arch" },
      ],
      content: `I will design a scalable data model ensuring relational integrity and fast queries:

### Proposed Schema Strategy:
1. **Core Domain Entities**: Define primary keys, foreign constraints, and audit timestamps (\`createdAt\`, \`updatedAt\`).
2. **Row-Level Security (RLS)**: Enforce tenant isolation and access policies at the database layer.
3. **Type-Safe Client**: Generate TypeScript interfaces aligned with \`${schemaFile}\`.
4. **Data Seed Script**: Provide mock relational records for local sandbox validation.

Review the specification above. When ready, we can convert this to a build plan.`,
    };
  }

  // 8. API / BACKEND
  if (/\b(api|endpoint|rest|route|backend|server|webhook|fetch|controller)\b/i.test(lower)) {
    const apiFile = findExistingOr(/api|route|tickets|ledger/i, "src/api/routes.ts");
    return {
      category: "api",
      summary: "backend API endpoint architecture",
      thinking: `Auditing REST endpoint contracts around ${apiFile}.`,
      contextFiles: [apiFile].filter(Boolean),
      suggestedActions: [
        { label: "Review current code", action: "review_code" },
        { label: "Create build plan", action: "create_plan" },
      ],
      content: `I will structure the backend API endpoints adhering to clean REST conventions:

### Backend Design:
1. **Endpoint Routing**: Create versioned handlers under \`/api/*\` with typed request schemas.
2. **Validation & Sanitization**: Reject malformed payloads early with explicit HTTP error responses.
3. **Service Layer**: Decouple business logic from route handlers in \`${apiFile}\`.
4. **Telemetry & Logging**: Log execution duration and error stack traces to the activity stream.

I can structure these endpoints into an actionable build plan whenever you're ready.`,
    };
  }

  // 9. GENERAL / DYNAMIC INTENT FALLBACK
  return {
    category: "general",
    summary: `${cleanPrompt.slice(0, 32)} architecture`,
    thinking: `Interpreting user intent "${cleanPrompt.slice(0, 50)}...". Formulating modular implementation roadmap.`,
    contextFiles: [],
    suggestedActions: [
      { label: "Create build plan", action: "create_plan" },
      { label: "Inspect architecture", action: "inspect_arch" },
    ],
    content: `I understand you want to build: **"${cleanPrompt}"**.

### Recommended Architecture & Implementation Steps:
1. **Requirements Decomposition**: Define the core domain entities, data models, and API interfaces.
2. **Component & UI Scaffolding**: Build responsive presentation views with modular components.
3. **Business Logic & State**: Implement state management and backend integration endpoints.
4. **Quality & Validation**: Add end-to-end assertions and error boundaries.

Would you like me to turn this into an executable Build Plan?`,
  };
}
