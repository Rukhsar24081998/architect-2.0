"use client";

import React, { useState } from "react";
import { ViewportMode, InspectorRegion } from "@/lib/preview/types";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  Globe,
  Star,
  Terminal,
} from "lucide-react";

interface LandingPagePreviewProps {
  productName?: string;
  viewportMode: ViewportMode;
  isInspectorActive?: boolean;
  onSelectInspectorRegion?: (region: InspectorRegion) => void;
}

export function LandingPagePreview({
  productName = "SaaS Platform",
  viewportMode,
  isInspectorActive = false,
  onSelectInspectorRegion,
}: LandingPagePreviewProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [activeFeatureTab, setActiveFeatureTab] = useState<string>("agents");

  const isMobile = viewportMode === "mobile";

  const triggerInspector = (
    id: string,
    name: string,
    componentName: string,
    filePath: string,
    description: string
  ) => {
    if (!isInspectorActive || !onSelectInspectorRegion) return;
    onSelectInspectorRegion({
      id,
      name,
      componentName,
      filePath,
      route: "/",
      agentRole: "frontend",
      stepNumber: 2,
      description,
      stateSnapshot: {
        billingPeriod,
        activeFeatureTab,
      },
    });
  };

  return (
    <div className="w-full h-full bg-[#0A0D14] text-[#C9D1D9] font-sans overflow-y-auto select-none antialiased">
      {/* 1. Navigation Header */}
      <header
        onClick={() =>
          triggerInspector(
            "landing-nav",
            "Landing Header & Brand Nav",
            "LandingNav",
            "components/landing/LandingNav.tsx",
            "Top navigation bar with logo, links, and conversion CTA"
          )
        }
        className={cn(
          "w-full border-b border-[#21262D] bg-[#0E1117]/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 transition-all",
          isInspectorActive &&
            "hover:border-[#00F2FE]/70 hover:bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#A855F7] p-0.5 flex items-center justify-center shrink-0">
            <div className="h-full w-full bg-[#0A0D14] rounded-[6px] flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-[#00F2FE]" />
            </div>
          </div>
          <span className="font-bold text-sm text-white tracking-tight">
            {productName}
          </span>
        </div>

        {!isMobile && (
          <nav className="flex items-center gap-6 text-xs text-[#8B949E]">
            <span className="hover:text-white transition-colors cursor-pointer">Features</span>
            <span className="hover:text-white transition-colors cursor-pointer">Architecture</span>
            <span className="hover:text-white transition-colors cursor-pointer">Pricing</span>
            <span className="hover:text-white transition-colors cursor-pointer">Docs</span>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex text-xs text-[#8B949E] hover:text-white px-2.5 py-1 cursor-pointer">
            Sign In
          </span>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-[#00F2FE] hover:bg-[#38BDF8] text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(0,242,254,0.3)] cursor-pointer"
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        onClick={() =>
          triggerInspector(
            "landing-hero",
            "High-Impact Hero Section",
            "HeroSection",
            "components/landing/HeroSection.tsx",
            "Hero headline, proof badge, and primary conversion action buttons"
          )
        }
        className={cn(
          "max-w-4xl mx-auto px-4 pt-10 sm:pt-16 pb-12 text-center space-y-6 transition-all",
          isInspectorActive &&
            "p-3 rounded-2xl border border-[#00F2FE]/40 bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30"
        )}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-[11px] font-mono text-[#00F2FE]">
          <Sparkles className="h-3 w-3" />
          <span>Built by Architect 2.0 · Production Ready</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Scale your product workflows with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#A855F7]">
            {productName}
          </span>
        </h1>

        <p className="text-xs sm:text-base text-[#8B949E] max-w-xl mx-auto leading-relaxed">
          The next-generation application platform engineered for rapid software development,
          seamless API integrations, and instant cloud deployments.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-black font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,242,254,0.35)] cursor-pointer"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#C9D1D9] hover:text-white text-xs sm:text-sm transition-all cursor-pointer"
          >
            Explore Live Demo
          </button>
        </div>

        {/* Social Proof */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-mono text-[#8B949E]">
          <div className="flex items-center gap-1.5 text-[#3FB950]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>99.99% Uptime Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00F2FE]">
            <Star className="h-3.5 w-3.5 fill-[#00F2FE]" />
            <span>Loved by 10,000+ teams</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#A855F7]">
            <Shield className="h-3.5 w-3.5" />
            <span>SOC2 Type II Compliant</span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Product Showcase */}
      <section
        onClick={() =>
          triggerInspector(
            "product-showcase",
            "Interactive Product Mockup Canvas",
            "ProductShowcase",
            "components/landing/ProductShowcase.tsx",
            "Tabbed interactive preview showing autonomous agents and live telemetry"
          )
        }
        className={cn(
          "max-w-4xl mx-auto px-4 pb-16 transition-all",
          isInspectorActive &&
            "p-2 rounded-2xl border border-[#00F2FE]/40 bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30"
        )}
      >
        <div className="rounded-2xl border border-[#30363D] bg-[#0E1117] shadow-2xl overflow-hidden">
          {/* Showcase Top Bar */}
          <div className="px-4 py-2.5 border-b border-[#21262D] bg-[#161B22]/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F85149]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E3B341]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3FB950]/60" />
            </div>

            <div className="flex items-center gap-1 bg-[#0E1117] border border-[#21262D] rounded-lg p-0.5 text-[11px] font-mono">
              {[
                { id: "agents", label: "Autonomous Swarm" },
                { id: "sync", label: "Realtime Sync" },
                { id: "edge", label: "Edge Gateway" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={cn(
                    "px-2.5 py-1 rounded transition-colors cursor-pointer",
                    activeFeatureTab === tab.id
                      ? "bg-[#00F2FE]/20 text-[#00F2FE] font-bold"
                      : "text-[#8B949E] hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-[#3FB950]">Live Preview</span>
          </div>

          {/* Showcase Body */}
          <div className="p-6 sm:p-8 space-y-4">
            {activeFeatureTab === "agents" && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#21262D]">
                  <span className="text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-[#00F2FE]" />
                    Agent Orchestrator Pipeline
                  </span>
                  <span className="text-[#3FB950] text-[10px]">4/4 Tasks Complete</span>
                </div>
                <div className="space-y-2 text-[11px] text-[#8B949E]">
                  <div className="flex items-center gap-2 text-[#3FB950]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Architect: System architecture analyzed and decomposed</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#3FB950]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Frontend: Interactive components and viewport controls synced</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#3FB950]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Backend: API routes and Supabase connection verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#3FB950]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>QA: Test suite executed with zero regression errors</span>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === "sync" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-xl bg-[#161B22] border border-[#21262D] space-y-1">
                  <div className="text-lg font-bold font-mono text-[#00F2FE]">12ms</div>
                  <div className="text-[11px] text-[#8B949E]">WebSocket RTT</div>
                </div>
                <div className="p-4 rounded-xl bg-[#161B22] border border-[#21262D] space-y-1">
                  <div className="text-lg font-bold font-mono text-[#3FB950]">100%</div>
                  <div className="text-[11px] text-[#8B949E]">Data Durability</div>
                </div>
                <div className="p-4 rounded-xl bg-[#161B22] border border-[#21262D] space-y-1">
                  <div className="text-lg font-bold font-mono text-[#A855F7]">Real-time</div>
                  <div className="text-[11px] text-[#8B949E]">Conflict Resolution</div>
                </div>
              </div>
            )}

            {activeFeatureTab === "edge" && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-[#161B22] border border-[#21262D] flex items-center justify-between">
                  <span className="font-mono text-[#00F2FE]">GET /api/v1/telemetry</span>
                  <span className="text-[#3FB950] font-mono">200 OK · 24ms</span>
                </div>
                <div className="p-3 rounded-lg bg-[#161B22] border border-[#21262D] flex items-center justify-between">
                  <span className="font-mono text-[#00F2FE]">POST /api/v1/auth/session</span>
                  <span className="text-[#3FB950] font-mono">201 Created · 32ms</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights Grid */}
      <section
        onClick={() =>
          triggerInspector(
            "feature-cards",
            "Platform Feature Grid",
            "FeatureGrid",
            "components/landing/FeatureGrid.tsx",
            "Three-column value proposition feature cards"
          )
        }
        className={cn(
          "max-w-4xl mx-auto px-4 pb-16 transition-all",
          isInspectorActive &&
            "p-2 rounded-2xl border border-[#00F2FE]/40 bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30"
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-2">
            <div className="h-8 w-8 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Full-Stack Architecture</h3>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Synthesizes frontend components, server APIs, and database migrations in a single coherent flow.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-2">
            <div className="h-8 w-8 rounded-lg bg-[#3FB950]/10 border border-[#3FB950]/30 flex items-center justify-center text-[#3FB950]">
              <Globe className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Global Edge Deployment</h3>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Deploy your app to low-latency edge regions with automatic SSL, caching, and CDN routing.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-2">
            <div className="h-8 w-8 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center text-[#A855F7]">
              <Shield className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Enterprise Security</h3>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Granular role-based access control, encrypted session storage, and automated audit logging.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Pricing Matrix */}
      <section
        onClick={() =>
          triggerInspector(
            "pricing-matrix",
            "Pricing Matrix & Tier Switcher",
            "PricingSection",
            "components/landing/PricingSection.tsx",
            "Interactive monthly vs annual pricing cards with discount toggle"
          )
        }
        className={cn(
          "max-w-4xl mx-auto px-4 pb-16 transition-all",
          isInspectorActive &&
            "p-2 rounded-2xl border border-[#00F2FE]/40 bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30"
        )}
      >
        <div className="text-center space-y-3 pb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xs text-[#8B949E]">
            Start free, scale as your application traffic expands.
          </p>

          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-[#161B22] border border-[#30363D] text-xs font-mono">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={cn(
                "px-3 py-1 rounded-lg transition-colors cursor-pointer",
                billingPeriod === "monthly" ? "bg-[#00F2FE]/20 text-[#00F2FE] font-bold" : "text-[#8B949E]"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("annual")}
              className={cn(
                "px-3 py-1 rounded-lg transition-colors cursor-pointer",
                billingPeriod === "annual" ? "bg-[#00F2FE]/20 text-[#00F2FE] font-bold" : "text-[#8B949E]"
              )}
            >
              Annual (20% off)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Starter", price: billingPeriod === "annual" ? "$24" : "$29", desc: "For solo developers and prototypes", cta: "Start Free", feat: ["1 Project", "5 Agents", "10K Requests/mo"] },
            { name: "Pro", price: billingPeriod === "annual" ? "$64" : "$79", desc: "For fast-growing startups and teams", cta: "Start Pro Trial", popular: true, feat: ["Unlimited Projects", "Swarm Orchestration", "500K Requests/mo", "Priority Support"] },
            { name: "Enterprise", price: "Custom", desc: "For security-first scale enterprises", cta: "Contact Sales", feat: ["Dedicated VPC", "Custom SLA", "SOC2 Compliance", "24/7 Support"] },
          ].map((tier, idx) => (
            <div
              key={idx}
              className={cn(
                "p-5 rounded-2xl border space-y-4 relative flex flex-col justify-between",
                tier.popular
                  ? "bg-[#161B22] border-[#00F2FE]/60 shadow-[0_0_20px_rgba(0,242,254,0.15)]"
                  : "bg-[#0E1117] border-[#21262D]"
              )}
            >
              {tier.popular && (
                <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-[#00F2FE] text-black text-[10px] font-mono font-bold">
                  MOST POPULAR
                </span>
              )}

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-white">{tier.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-white">{tier.price}</span>
                  {tier.price !== "Custom" && (
                    <span className="text-[11px] text-[#8B949E] font-mono">/month</span>
                  )}
                </div>
                <p className="text-[11px] text-[#8B949E]">{tier.desc}</p>

                <ul className="space-y-1.5 pt-3 border-t border-[#21262D] text-xs">
                  {tier.feat.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[#C9D1D9]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#3FB950] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={cn(
                  "w-full py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer mt-4",
                  tier.popular
                    ? "bg-[#00F2FE] hover:bg-[#38BDF8] text-black shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                    : "bg-[#21262D] hover:bg-[#30363D] text-white"
                )}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-[#21262D] bg-[#0E1117] py-6 px-4 text-center text-xs text-[#8B949E] space-y-1">
        <p>© 2026 {productName}. All rights reserved.</p>
        <p className="text-[11px] font-mono text-[#6E7681]">
          Generated and rendered with Architect 2.0
        </p>
      </footer>
    </div>
  );
}
