/**
 * Architect 2.0 Build Plan Generation & Validation Engine
 * Structures user intent and project context into a clear, transparent Build Plan
 * with deterministic category recognition and schema verification.
 */

import Groq from "groq-sdk";
import { BuildPlan, RequirementsSummary } from "../types";
import { ProjectContextSummary } from "./prompts";
import { isGroqConfigured, GROQ_MODEL } from "./provider";

export interface GenerateBuildPlanParams {
  projectId: string;
  userPrompt: string;
  context: ProjectContextSummary;
  sourceMessageId?: string;
  requirementsSummary?: RequirementsSummary;
}

/**
 * Strict schema validator ensuring generated build plan conforms to domain constraints.
 */
export function validateBuildPlanSchema(data: unknown): {
  valid: boolean;
  errors: string[];
  plan?: Partial<BuildPlan>;
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Plan payload must be an object"] };
  }

  const p = data as Record<string, unknown>;

  if (!p.title || typeof p.title !== "string" || !p.title.trim()) {
    errors.push("Plan title is required");
  }

  if (!p.summary || typeof p.summary !== "string" || !p.summary.trim()) {
    errors.push("Plan summary is required");
  }

  if (!Array.isArray(p.steps) || p.steps.length === 0) {
    errors.push("Plan must contain at least 1 step");
  } else {
    const stepIds = new Set<string>();
    p.steps.forEach((step: unknown, index: number) => {
      if (!step || typeof step !== "object") {
        errors.push(`Step ${index + 1} must be an object`);
        return;
      }
      const s = step as Record<string, unknown>;

      // Normalize alternative naming from LLMs
      if (!s.title && typeof s.name === "string") {
        s.title = s.name;
      }
      if (!s.description) {
        if (Array.isArray(s.tasks)) {
          s.description = s.tasks.join("; ");
        } else if (typeof s.summary === "string") {
          s.description = s.summary;
        }
      }
      if (!s.id) {
        s.id = `step_${index + 1}`;
      }

      if (!s.title || typeof s.title !== "string") {
        errors.push(`Step ${index + 1} must have a title`);
      }
      if (!s.description || typeof s.description !== "string") {
        errors.push(`Step ${index + 1} must have a description`);
      }
      if (typeof s.id === "string") {
        const stepId = s.id;
        if (stepIds.has(stepId)) {
          s.id = `${stepId}_${index + 1}`;
        }
        stepIds.add(s.id as string);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    plan: errors.length === 0 ? (p as Partial<BuildPlan>) : undefined,
  };
}

/**
 * Deterministic build plan generator tailored to recognized categories and project context.
 */
export function generateDeterministicBuildPlan({
  projectId,
  userPrompt,
  context,
  sourceMessageId,
}: GenerateBuildPlanParams): BuildPlan {
  const lower = userPrompt.toLowerCase();
  const existingFiles = context.files || [];
  const now = new Date().toISOString();

  const findFileOr = (pattern: RegExp, fallback: string) => {
    return existingFiles.find((f) => pattern.test(f)) || fallback;
  };

  // 0a. CHATBOT / AI CONVERSATIONAL ASSISTANT
  if (/\b(chatbot|chat bot|conversational|assistant|ai assistant|dialogue|chat)\b/i.test(lower)) {
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: "Build AI Chatbot MVP",
      summary: `End-to-end plan to create an AI chatbot with conversational interface, message composer, state management, and Groq LLM response layer.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "medium",
      estimatedDurationMinutes: 20,
      assumptions: [
        "Groq API endpoint will power conversational responses.",
        "Local state will manage message history and streaming bubbles.",
      ],
      risks: [
        "Token length limits on large conversation context.",
      ],
      steps: [
        {
          id: "step_cb_1",
          order: 1,
          title: "Create Chat Interface & Message Thread",
          description: "Construct responsive chat message stream with user/assistant bubbles and typing indicators.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/chat/ChatInterface.tsx", "src/components/chat/ChatMessage.tsx"],
          dependencies: [],
        },
        {
          id: "step_cb_2",
          order: 2,
          title: "Add Message Composer & Submit Controls",
          description: "Build auto-resizing text input supporting Enter to submit and token limit counters.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/chat/MessageComposer.tsx"],
          dependencies: ["step_cb_1"],
        },
        {
          id: "step_cb_3",
          order: 3,
          title: "Implement Conversation State Management",
          description: "Establish session context, message history persistence, and optimistic state updates.",
          type: "architecture",
          status: "pending",
          affectedFiles: ["src/lib/chat-state.ts"],
          dependencies: ["step_cb_1"],
        },
        {
          id: "step_cb_4",
          order: 4,
          title: "Add AI Response Endpoint",
          description: "Create server route connecting to Groq LLM inference with system prompt engineering.",
          type: "backend",
          status: "pending",
          affectedFiles: ["src/app/api/chat/route.ts"],
          dependencies: ["step_cb_3"],
        },
        {
          id: "step_cb_5",
          order: 5,
          title: "Add Loading, Timeout & Error Recovery States",
          description: "Handle network failures, rate limits, and provide retry controls.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/chat/ChatStatus.tsx"],
          dependencies: ["step_cb_4"],
        },
        {
          id: "step_cb_6",
          order: 6,
          title: "Make Experience Responsive & Mobile-Optimized",
          description: "Ensure smooth scrolling and responsive layout across desktop and mobile screens.",
          type: "testing",
          status: "pending",
          affectedFiles: ["src/styles/chat.css"],
          dependencies: ["step_cb_5"],
        },
      ],
    };
  }

  // 0b. FOOD DELIVERY / RESTAURANT
  if (/\b(food delivery|food|restaurant|ordering|takeout|menu catalog)\b/i.test(lower)) {
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: "Build Food Delivery Application MVP",
      summary: `End-to-end implementation plan for food delivery app: menu catalog, shopping cart, checkout flow, and live order tracking.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "medium",
      estimatedDurationMinutes: 25,
      assumptions: [
        "Menu items will be structured with categories, prices, and dietary tags.",
        "Cart state will calculate subtotal and delivery fees in memory.",
      ],
      risks: [
        "Real-time driver tracking requires WebSocket or polling infrastructure.",
      ],
      steps: [
        {
          id: "step_fd_1",
          order: 1,
          title: "Design Restaurant & Menu Catalog UI",
          description: "Create responsive menu view with dish categories, item pricing, and dietary tag filters.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/menu/MenuCatalog.tsx", "src/components/menu/MenuItem.tsx"],
          dependencies: [],
        },
        {
          id: "step_fd_2",
          order: 2,
          title: "Add Shopping Cart & Item Customization Drawer",
          description: "Implement interactive cart drawer supporting quantity changes, special instructions, and subtotal calculation.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/cart/CartDrawer.tsx"],
          dependencies: ["step_fd_1"],
        },
        {
          id: "step_fd_3",
          order: 3,
          title: "Implement Checkout & Address Form",
          description: "Build delivery address input, contact verification, and order confirmation handler.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/checkout/CheckoutForm.tsx"],
          dependencies: ["step_fd_2"],
        },
        {
          id: "step_fd_4",
          order: 4,
          title: "Build Live Order Status Tracker",
          description: "Create visual progress stepper tracking order confirmation, kitchen preparation, and delivery status.",
          type: "testing",
          status: "pending",
          affectedFiles: ["src/components/orders/OrderTracker.tsx"],
          dependencies: ["step_fd_3"],
        },
      ],
    };
  }

  // 0c. SALES ANALYTICS / METRICS DASHBOARD
  if (/\b(analytics|sales dashboard|sales team|metrics|reporting|kpi|charts)\b/i.test(lower)) {
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: "Build Sales Analytics Dashboard",
      summary: `Construct an analytics dashboard with top-line KPI cards, revenue charts, sales pipeline table, and date range filters.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "medium",
      estimatedDurationMinutes: 20,
      assumptions: [
        "Time-series metric data will be aggregated across specified time ranges.",
      ],
      risks: [
        "Chart libraries must render cleanly without hydration mismatches.",
      ],
      steps: [
        {
          id: "step_sa_1",
          order: 1,
          title: "Construct KPI Metric Strip",
          description: "Build summary cards for Gross Revenue, Conversion Rate, Customer Acquisition Cost, and Deal Velocity.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/analytics/MetricCards.tsx"],
          dependencies: [],
        },
        {
          id: "step_sa_2",
          order: 2,
          title: "Create Interactive Revenue Trend Chart",
          description: "Implement responsive time-series chart showing historical sales trends and growth benchmarks.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/analytics/RevenueChart.tsx"],
          dependencies: ["step_sa_1"],
        },
        {
          id: "step_sa_3",
          order: 3,
          title: "Implement Sales Pipeline Stage Table",
          description: "Build pipeline table with deal stages, assigned reps, estimated value, and close probability.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/analytics/SalesPipeline.tsx"],
          dependencies: ["step_sa_1"],
        },
        {
          id: "step_sa_4",
          order: 4,
          title: "Add Date Range Filtering Controls",
          description: "Add quick filters for 7D, 30D, Quarter, and YTD with URL search param synchronization.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/analytics/DateFilter.tsx"],
          dependencies: ["step_sa_2", "step_sa_3"],
        },
      ],
    };
  }

  // 0d. SUPPORTDESK / TICKET TRIAGE
  if (/\b(supportdesk|support desk|ticket|tickets|triage|inbox queue)\b/i.test(lower)) {
    const uiFile = findFileOr(/ticket|inbox|list|app/i, "src/components/dashboard/TicketList.tsx");
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: "Enhance SupportDesk Ticket Triage System",
      summary: `Upgrade the ticket triage interface for ${context.name} with real-time status badges, SLA indicators, and AI-assisted response composer.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "medium",
      estimatedDurationMinutes: 16,
      assumptions: [
        "Ticket records conform to the existing domain schema.",
        "Obsidian design system tokens will style the triage queue.",
      ],
      risks: [
        "High ticket volume may require list virtualization.",
      ],
      steps: [
        {
          id: "step_sd_1",
          order: 1,
          title: "Optimize Ticket Queue & Status Badges",
          description: `Update ${uiFile} with real-time urgency indicators, SLA countdowns, and quick filter pills.`,
          type: "frontend",
          status: "pending",
          affectedFiles: [uiFile],
          dependencies: [],
        },
        {
          id: "step_sd_2",
          order: 2,
          title: "Build AI-Assisted Response Composer",
          description: "Implement suggested response generator drawer leveraging customer conversation context.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["src/components/dashboard/TicketDetail.tsx"],
          dependencies: ["step_sd_1"],
        },
        {
          id: "step_sd_3",
          order: 3,
          title: "Implement Ticket Assignment & Status API",
          description: "Add backend route handlers for batch assigning, status transitions, and resolution logging.",
          type: "backend",
          status: "pending",
          affectedFiles: ["src/app/api/tickets/route.ts"],
          dependencies: ["step_sd_1"],
        },
        {
          id: "step_sd_4",
          order: 4,
          title: "Validate Triage Workflow & Keyboard Shortcuts",
          description: "Verify triage navigation with keyboard controls (J/K next/prev, E to resolve).",
          type: "testing",
          status: "pending",
          affectedFiles: ["tests/triage.test.ts"],
          dependencies: ["step_sd_2", "step_sd_3"],
        },
      ],
    };
  }

  // 1. AUTHENTICATION
  if (/auth|login|signup|sign-in|session|oauth|jwt|credentials|password|user/.test(lower)) {
    const appFile = findFileOr(/app|main|index/i, "src/App.tsx");
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: `Add Supabase Authentication & Session Boundary`,
      summary: `Structure authentication architecture for ${context.name}, add sign-in form, session middleware, and user context injection into ${appFile}.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "medium",
      estimatedDurationMinutes: 18,
      assumptions: [
        "Supabase project instance credentials will be configured.",
        "User sessions will be managed via secure HTTP-only cookies.",
      ],
      risks: [
        "Existing unauthenticated route structure may require navigation guards.",
        "Session hydration timing could cause temporary layout shifts if unhandled.",
      ],
      steps: [
        {
          id: `step_auth_1`,
          order: 1,
          title: "Define Authentication Architecture & Session Boundary",
          description: "Establish auth middleware, cookie parser, and token refresh configuration.",
          type: "architecture",
          status: "pending",
          affectedFiles: ["lib/auth.ts", "lib/auth-context.tsx"],
          dependencies: [],
        },
        {
          id: `step_auth_2`,
          order: 2,
          title: "Implement Sign-In & Registration UI",
          description: "Create responsive login dialog with email/password validation and error banners.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["components/auth/LoginForm.tsx", "app/login/page.tsx"],
          dependencies: ["step_auth_1"],
        },
        {
          id: `step_auth_3`,
          order: 3,
          title: "Protect Application Routes & Inject User State",
          description: `Guard workspace routes against unauthenticated requests and expose user avatar in ${appFile}.`,
          type: "backend",
          status: "pending",
          affectedFiles: [appFile, "components/auth/AuthGuard.tsx"],
          dependencies: ["step_auth_1", "step_auth_2"],
        },
        {
          id: `step_auth_4`,
          order: 4,
          title: "Validate Authentication Flow & Session Persistence",
          description: "Verify login, sign-out, session recovery across browser refreshes, and invalid credential handling.",
          type: "testing",
          status: "pending",
          affectedFiles: ["tests/auth.test.ts"],
          dependencies: ["step_auth_3"],
        },
      ],
    };
  }

  // 2. DASHBOARD / UI / DESIGN (Requires explicit word boundaries so "build" doesn't match)
  if (/\b(dashboard|ui|design|layout|homepage|landing|theme|dark mode|modernize)\b/i.test(lower)) {
    const uiFile = findFileOr(/list|table|view|app/i, existingFiles[0] || "src/App.tsx");
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: `Modernize Presentation Layer & Dashboard UI`,
      summary: `Refactor ${context.name} UI with high-density information architecture, modular cards, real-time counters, and responsive layout.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "medium",
      estimatedDurationMinutes: 14,
      assumptions: [
        "Obsidian dark mode design tokens will be reused without external styling libraries.",
        "Sample metric data will be formatted for live display.",
      ],
      risks: [
        "High-density tables may require virtualization on low-spec mobile devices.",
      ],
      steps: [
        {
          id: `step_ui_1`,
          order: 1,
          title: "Structure Modular Component Hierarchy",
          description: `Break down ${uiFile} into modular metric strips, status indicators, and interactive list components.`,
          type: "frontend",
          status: "pending",
          affectedFiles: [uiFile, "components/dashboard/MetricsHeader.tsx"],
          dependencies: [],
        },
        {
          id: `step_ui_2`,
          order: 2,
          title: "Apply Obsidian Design Tokens & Responsive Grid",
          description: "Enforce Electric Cyan and Violet accents, subtle borders, and smooth hover micro-animations.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["app/globals.css", "components/ui/Card.tsx"],
          dependencies: ["step_ui_1"],
        },
        {
          id: `step_ui_3`,
          order: 3,
          title: "Integrate Real-Time Search & Status Filter Pills",
          description: "Implement interactive client filtering with keyboard shortcuts and empty states.",
          type: "frontend",
          status: "pending",
          affectedFiles: [uiFile],
          dependencies: ["step_ui_1"],
        },
        {
          id: `step_ui_4`,
          order: 4,
          title: "Verify Responsive Mobile & Tablet Layout",
          description: "Ensure touch targets meet accessibility criteria and columns collapse smoothly on small viewports.",
          type: "testing",
          status: "pending",
          affectedFiles: [uiFile],
          dependencies: ["step_ui_2", "step_ui_3"],
        },
      ],
    };
  }

  // 3. DATABASE / SCHEMA
  if (/database|db|schema|table|model|supabase|postgres|prisma|sql|migration|entity/.test(lower)) {
    const schemaFile = findFileOr(/schema|prisma|db|ticket|ledger/i, "prisma/schema.prisma");
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: `Design Relational Database Schema & Data Models`,
      summary: `Establish relational PostgreSQL schema, entity definitions, audit timestamps, and type-safe query interfaces for ${context.name}.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "medium",
      estimatedDurationMinutes: 16,
      assumptions: [
        "PostgreSQL connection string will be provided via environment variables.",
        "Foreign key cascades will preserve relational consistency.",
      ],
      risks: [
        "Modifying existing schema tables will require automated migration scripts.",
      ],
      steps: [
        {
          id: `step_db_1`,
          order: 1,
          title: "Specify Entity Relationship Model",
          description: `Define primary keys, indexes, foreign constraints, and audit columns in ${schemaFile}.`,
          type: "database",
          status: "pending",
          affectedFiles: [schemaFile],
          dependencies: [],
        },
        {
          id: `step_db_2`,
          order: 2,
          title: "Configure Database Client & Connection Pool",
          description: "Initialize type-safe query client with connection pooling and query telemetry.",
          type: "backend",
          status: "pending",
          affectedFiles: ["lib/db.ts"],
          dependencies: ["step_db_1"],
        },
        {
          id: `step_db_3`,
          order: 3,
          title: "Generate TypeScript Domain Interfaces",
          description: "Synchronize database schemas with application domain types in lib/types.ts.",
          type: "architecture",
          status: "pending",
          affectedFiles: ["lib/types.ts"],
          dependencies: ["step_db_1"],
        },
        {
          id: `step_db_4`,
          order: 4,
          title: "Create Mock Seed Script for Development",
          description: "Generate deterministic mock relational seed records for local sandbox validation.",
          type: "configuration",
          status: "pending",
          affectedFiles: ["scripts/seed.ts"],
          dependencies: ["step_db_2"],
        },
      ],
    };
  }

  // 4. PAYMENTS / STRIPE
  if (/payment|stripe|subscription|billing|checkout|pricing|tier|invoice/.test(lower)) {
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: `Integrate Stripe Checkout & Subscription Billing`,
      summary: `Implement commercial billing pipeline for ${context.name} with checkout sessions, webhook events, and entitlement gates.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "high",
      estimatedDurationMinutes: 22,
      assumptions: [
        "Stripe secret keys and webhook signing secrets will be provided.",
        "Customer IDs will be linked to application user accounts.",
      ],
      risks: [
        "Webhook network latency requires idempotent processing and optimistic UI feedback.",
      ],
      steps: [
        {
          id: `step_pay_1`,
          order: 1,
          title: "Configure Subscription Products & Price Tiers",
          description: "Define Starter and Pro plan limits, billing intervals, and feature flags.",
          type: "configuration",
          status: "pending",
          affectedFiles: ["config/pricing.ts"],
          dependencies: [],
        },
        {
          id: `step_pay_2`,
          order: 2,
          title: "Build Pricing Table & Checkout Dialog",
          description: "Render responsive pricing tiers with Stripe Checkout session redirect.",
          type: "frontend",
          status: "pending",
          affectedFiles: ["components/billing/PricingTable.tsx"],
          dependencies: ["step_pay_1"],
        },
        {
          id: `step_pay_3`,
          order: 3,
          title: "Implement Stripe Webhook Handler",
          description: "Listen for customer.subscription.created, updated, and deleted events with signature verification.",
          type: "backend",
          status: "pending",
          affectedFiles: ["app/api/webhooks/stripe/route.ts"],
          dependencies: ["step_pay_1"],
        },
        {
          id: `step_pay_4`,
          order: 4,
          title: "Enforce Feature Entitlements",
          description: "Gate advanced workspace capabilities based on active verified subscription tier.",
          type: "architecture",
          status: "pending",
          affectedFiles: ["lib/entitlements.ts"],
          dependencies: ["step_pay_3"],
        },
      ],
    };
  }

  // 5. API / BACKEND
  if (/api|endpoint|rest|route|backend|server|webhook|fetch|controller/.test(lower)) {
    const apiFile = findFileOr(/api|route|tickets|ledger/i, "src/api/routes.ts");
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: `Build REST API Endpoints & Route Handlers`,
      summary: `Implement versioned REST API endpoints for ${context.name} with input validation, error handling, and telemetry.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "medium",
      estimatedDurationMinutes: 15,
      assumptions: [
        "JSON REST conventions are preferred.",
        "Route handlers run on Node.js / Serverless runtime.",
      ],
      risks: [
        "Unauthenticated endpoints could expose sensitive internal data without middleware guards.",
      ],
      steps: [
        {
          id: `step_api_1`,
          order: 1,
          title: "Design REST API Contracts & Status Codes",
          description: `Define typed request bodies, error schemas, and response formats for ${apiFile}.`,
          type: "architecture",
          status: "pending",
          affectedFiles: [apiFile],
          dependencies: [],
        },
        {
          id: `step_api_2`,
          order: 2,
          title: "Implement Route Handlers with Input Validation",
          description: "Create GET, POST, PUT, DELETE handlers with schema validation and sanitization.",
          type: "backend",
          status: "pending",
          affectedFiles: [apiFile],
          dependencies: ["step_api_1"],
        },
        {
          id: `step_api_3`,
          order: 3,
          title: "Decouple Business Logic into Service Layer",
          description: "Extract data transformation logic from route handlers into reusable service modules.",
          type: "backend",
          status: "pending",
          affectedFiles: ["lib/services/resourceService.ts"],
          dependencies: ["step_api_2"],
        },
        {
          id: `step_api_4`,
          order: 4,
          title: "Write API Integration Contract Tests",
          description: "Validate 200 OK responses, 400 bad payload errors, and 404 not found handling.",
          type: "testing",
          status: "pending",
          affectedFiles: ["tests/api.test.ts"],
          dependencies: ["step_api_2"],
        },
      ],
    };
  }

  // 6. TESTING / QA
  if (/test|testing|jest|vitest|playwright|e2e|bug|fix|error|qa/.test(lower)) {
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: `Establish Automated Test Suite & QA Pipeline`,
      summary: `Configure unit testing, integration tests, and end-to-end user journey validation across branch ${context.currentBranch}.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "low",
      estimatedDurationMinutes: 12,
      assumptions: [
        "Codebase components are structured for testability without deep coupling.",
      ],
      risks: [
        "External service dependencies require reliable mock fixtures.",
      ],
      steps: [
        {
          id: `step_test_1`,
          order: 1,
          title: "Configure Test Runner & Environment Mocks",
          description: "Initialize test harness, DOM environment simulation, and coverage thresholds.",
          type: "configuration",
          status: "pending",
          affectedFiles: ["vitest.config.ts"],
          dependencies: [],
        },
        {
          id: `step_test_2`,
          order: 2,
          title: "Write Unit Tests for Core Domain Logic",
          description: "Verify state machines, calculation utilities, and data transformers.",
          type: "testing",
          status: "pending",
          affectedFiles: ["tests/unit/core.test.ts"],
          dependencies: ["step_test_1"],
        },
        {
          id: `step_test_3`,
          order: 3,
          title: "Implement API Route Integration Tests",
          description: "Test endpoint responses, status codes, and database query executions.",
          type: "testing",
          status: "pending",
          affectedFiles: ["tests/integration/api.test.ts"],
          dependencies: ["step_test_1"],
        },
        {
          id: `step_test_4`,
          order: 4,
          title: "Set Up Automated CI Test Verification",
          description: "Ensure test suite runs automatically before staging deployments.",
          type: "configuration",
          status: "pending",
          affectedFiles: [".github/workflows/test.yml"],
          dependencies: ["step_test_2", "step_test_3"],
        },
      ],
    };
  }

  // 7. DEPLOYMENT / PRODUCTION
  if (/deploy|deployment|production|vercel|ci\/cd|ship|release|live/.test(lower)) {
    return {
      id: `bp_${Date.now()}`,
      projectId,
      title: `Configure Production Deployment & CI Pipeline`,
      summary: `Prepare production build optimization, environment secrets check, and preview branch deployments for ${context.name}.`,
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      sourceMessageId,
      estimatedComplexity: "low",
      estimatedDurationMinutes: 10,
      assumptions: [
        "Hosting environment account (e.g. Vercel) will be connected.",
      ],
      risks: [
        "Missing environment secrets will cause runtime container failure.",
      ],
      steps: [
        {
          id: `step_dep_1`,
          order: 1,
          title: "Audit Production Build Bundle & Optimization",
          description: "Verify bundle size, tree-shaking, and zero TypeScript compilation errors.",
          type: "architecture",
          status: "pending",
          affectedFiles: ["next.config.ts"],
          dependencies: [],
        },
        {
          id: `step_dep_2`,
          order: 2,
          title: "Verify Production Environment Secrets",
          description: "Validate presence of database credentials and API keys in environment config.",
          type: "configuration",
          status: "pending",
          affectedFiles: [".env.example"],
          dependencies: ["step_dep_1"],
        },
        {
          id: `step_dep_3`,
          order: 3,
          title: "Configure Preview Branch Staging Pipeline",
          description: "Set up ephemeral preview deployments for pull request review.",
          type: "integration",
          status: "pending",
          affectedFiles: ["vercel.json"],
          dependencies: ["step_dep_2"],
        },
        {
          id: `step_dep_4`,
          order: 4,
          title: "Implement Health Check Probe",
          description: "Add uptime endpoint verifying database and service readiness.",
          type: "backend",
          status: "pending",
          affectedFiles: ["app/api/health/route.ts"],
          dependencies: ["step_dep_1"],
        },
      ],
    };
  }

  // 8. GENERAL / FALLBACK
  const sampleFile = existingFiles[0] || "src/App.tsx";
  return {
    id: `bp_${Date.now()}`,
    projectId,
    title: `Implement ${userPrompt.slice(0, 32).trim()}`,
    summary: `Structured execution plan to build "${userPrompt.trim()}" in ${context.name} adhering to ${context.template} standards.`,
    status: "proposed",
    createdAt: now,
    updatedAt: now,
    sourceMessageId,
    estimatedComplexity: "medium",
    estimatedDurationMinutes: 15,
    assumptions: [
      "Requirements conform to current project architecture and stack.",
    ],
    risks: [
      "Incremental modifications require testing before cutover.",
    ],
    steps: [
      {
        id: `step_gen_1`,
        order: 1,
        title: "Decompose Feature Specifications & Schemas",
        description: "Analyze user intent and establish component and data interface contracts.",
        type: "architecture",
        status: "pending",
        affectedFiles: ["lib/types.ts"],
        dependencies: [],
      },
      {
        id: `step_gen_2`,
        order: 2,
        title: "Implement Core Feature Logic & Presentation",
        description: `Implement required functionality and UI components starting from ${sampleFile}.`,
        type: "frontend",
        status: "pending",
        affectedFiles: [sampleFile],
        dependencies: ["step_gen_1"],
      },
      {
        id: `step_gen_3`,
        order: 3,
        title: "Integrate Data Flow & Route Handlers",
        description: "Connect frontend client interactions to backend service endpoints.",
        type: "backend",
        status: "pending",
        affectedFiles: ["app/api/resources/route.ts"],
        dependencies: ["step_gen_2"],
      },
      {
        id: `step_gen_4`,
        order: 4,
        title: "Validate Implementation & End-to-End Flow",
        description: "Run test suite to verify 0 regressions across existing application features.",
        type: "testing",
        status: "pending",
        affectedFiles: [sampleFile],
        dependencies: ["step_gen_3"],
      },
    ],
  };
}

/**
 * Top-level planning orchestrator: calls real LLM if configured, validates schema,
 * or safely falls back to deterministic generator.
 */
export async function generateBuildPlan(
  params: GenerateBuildPlanParams
): Promise<BuildPlan> {
  // 1. Try real LLM via Groq if configured
  if (isGroqConfigured()) {
    try {
      const apiKey = process.env.GROQ_API_KEY!.trim();
      console.log(`[AI] Build Plan generation: calling Groq (${GROQ_MODEL})`);

      const groq = new Groq({ apiKey });

      const systemPrompt = `You are Architect, an AI software architect inside Architect 2.0.
Your job is to generate a structured, professional Build Plan JSON for the user's software request.

CRITICAL INSTRUCTIONS:
1. Prioritize the user's latest request over background project context.
   If the user asks to build a chatbot, generate a chatbot plan (e.g. Chat Interface, Message Composer, Conversation State, AI Response API, Loading/Error States).
   If the user asks for a food delivery app, generate a food delivery plan (Restaurant Catalog, Cart & Checkout, Order Tracking).
   Do NOT mention SupportDesk or tickets unless the user explicitly requested SupportDesk changes.
2. Output 4 to 6 sequential implementation steps.
3. Each step must have:
   - "id": string (e.g. "step_1", "step_2")
   - "order": number (1, 2, 3...)
   - "title": string (concise action title)
   - "description": string (clear technical description)
   - "type": one of ["architecture", "frontend", "backend", "database", "integration", "testing", "configuration"]
   - "status": "pending"
   - "affectedFiles": string[] (realistic file paths)
   - "dependencies": string[] (e.g. ["step_1"])
4. Set "estimatedComplexity" to "low", "medium", or "high".
5. Set "estimatedDurationMinutes" to a realistic number (e.g. 15 to 45).
6. Provide 2-3 realistic "assumptions" and 1-2 realistic "risks".

You MUST return ONLY a JSON object matching this schema:
{
  "title": string,
  "summary": string,
  "estimatedComplexity": "low" | "medium" | "high",
  "estimatedDurationMinutes": number,
  "assumptions": string[],
  "risks": string[],
  "steps": [
    {
      "id": string,
      "order": number,
      "title": string,
      "description": string,
      "type": "architecture" | "frontend" | "backend" | "database" | "integration" | "testing" | "configuration",
      "status": "pending",
      "affectedFiles": string[],
      "dependencies": string[]
    }
  ]
}`;

      const summarySection = params.requirementsSummary
        ? `\n\nDISCOVERY REQUIREMENTS:\n- Product: ${params.requirementsSummary.product}\n- Target Users: ${params.requirementsSummary.users}\n- Core Purpose: ${params.requirementsSummary.corePurpose}\n- Knowledge/Data: ${params.requirementsSummary.knowledge || "Standard"}\n- Persistence: ${params.requirementsSummary.persistence || "Database storage"}\n- Recommended Stack: ${params.requirementsSummary.recommendedStack || "Next.js, TypeScript, TailwindCSS, Supabase"}`
        : "";

      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `User intent: "${params.userPrompt}"${summarySection}\n\nGenerate an actionable, structured build plan for this request.`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const jsonStr = completion.choices?.[0]?.message?.content;
      if (jsonStr) {
        const parsed = JSON.parse(jsonStr);
        const validated = validateBuildPlanSchema(parsed);
        if (validated.valid && validated.plan) {
          const now = new Date().toISOString();
          console.log(`[AI] Build Plan generated via Groq (title: "${validated.plan.title}")`);
          return {
            id: `bp_${Date.now()}`,
            projectId: params.projectId,
            title: validated.plan.title!,
            summary: validated.plan.summary!,
            status: "proposed",
            createdAt: now,
            updatedAt: now,
            sourceMessageId: params.sourceMessageId,
            steps: (validated.plan.steps || []).map((s, idx) => ({
              id: s.id || `step_${idx + 1}`,
              order: s.order ?? idx + 1,
              title: s.title,
              description: s.description,
              type: s.type || "frontend",
              status: "pending",
              affectedFiles: s.affectedFiles || [],
              dependencies: s.dependencies || [],
            })),
            risks: validated.plan.risks || [],
            assumptions: validated.plan.assumptions || [],
            estimatedComplexity: validated.plan.estimatedComplexity || "medium",
            estimatedDurationMinutes: validated.plan.estimatedDurationMinutes || 15,
          };
        }
      }
    } catch (err: unknown) {
      const safeError = err instanceof Error ? err.message : "Unknown error";
      console.warn(`[AI] Groq Build Plan generation failed (${safeError}). Falling back to deterministic plan.`);
    }
  }

  // 2. Fallback to deterministic generator
  return generateDeterministicBuildPlan(params);
}
