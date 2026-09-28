"use client";

import React, { useState } from "react";
import { ViewportMode, InspectorRegion } from "@/lib/preview/types";
import {
  INITIAL_SUPPORT_TICKETS,
  INITIAL_SUPPORT_METRICS,
  INSPECTOR_REGIONS,
} from "@/lib/preview/mock-supportdesk";
import { SupportSidebar } from "./SupportSidebar";
import { SupportInbox } from "./SupportInbox";
import {
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface SupportDeskPreviewProps {
  viewportMode: ViewportMode;
  isInspectorActive?: boolean;
  onSelectInspectorRegion?: (region: InspectorRegion) => void;
}

export function SupportDeskPreview({
  viewportMode,
  isInspectorActive = false,
  onSelectInspectorRegion,
}: SupportDeskPreviewProps) {
  // Default to tickets so the user immediately sees the ticket list + detail
  const [activeTab, setActiveTab] = useState<string>("tickets");

  // Local settings toggles for realistic interactivity
  const [autoTriageEnabled, setAutoTriageEnabled] = useState(true);
  const [slaEscalationEnabled, setSlaEscalationEnabled] = useState(true);
  const [autoDeflectionEnabled, setAutoDeflectionEnabled] = useState(false);

  const isMobile = viewportMode === "mobile";
  const isTablet = viewportMode === "tablet";

  const handleInspectRegion = (regionId: string) => {
    if (onSelectInspectorRegion && INSPECTOR_REGIONS[regionId]) {
      onSelectInspectorRegion(INSPECTOR_REGIONS[regionId]);
    }
  };

  return (
    <div className="w-full h-full flex bg-[#0A0D14] text-[#C9D1D9] font-sans antialiased overflow-hidden select-none">
      {/* Mini App Sidebar */}
      <SupportSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={5}
        isInspectorActive={isInspectorActive}
        onInspect={() => handleInspectRegion("sidebar")}
        isMobileCompact={isMobile || isTablet}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Tickets / Inbox Tab (The primary SupportDesk experience) */}
        {(activeTab === "tickets" || activeTab === "inbox") && (
          <SupportInbox
            initialTickets={INITIAL_SUPPORT_TICKETS}
            metrics={INITIAL_SUPPORT_METRICS}
            isInspectorActive={isInspectorActive}
            onInspectRegion={handleInspectRegion}
            isMobileCompact={isMobile}
          />
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#21262D] pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Support Operations Dashboard
                </h2>
                <p className="text-xs text-[#8B949E] font-mono mt-0.5">
                  Real-time AI triage overview &amp; queue telemetry
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("tickets")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/30 text-xs font-medium font-mono transition-colors"
              >
                <span>Open Ticket Queue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-xl bg-[#161B22]/70 border border-[#21262D] space-y-1">
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="text-[10px] font-mono uppercase">Open Queue</span>
                  <Clock className="h-4 w-4 text-[#00F2FE]" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">18</div>
                <div className="text-[11px] text-[#3FB950] font-mono">↓ 4 vs yesterday</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161B22]/70 border border-[#21262D] space-y-1">
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="text-[10px] font-mono uppercase">AI Deflection</span>
                  <Sparkles className="h-4 w-4 text-[#A855F7]" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">68.2%</div>
                <div className="text-[11px] text-[#A855F7] font-mono">142 tickets auto-resolved</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161B22]/70 border border-[#21262D] space-y-1">
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="text-[10px] font-mono uppercase">Avg Resolution</span>
                  <TrendingUp className="h-4 w-4 text-[#3FB950]" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#3FB950]">1.2m</div>
                <div className="text-[11px] text-[#6E7681] font-mono">Target: &lt; 5m</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161B22]/70 border border-[#21262D] space-y-1">
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="text-[10px] font-mono uppercase">CSAT Score</span>
                  <CheckCircle2 className="h-4 w-4 text-[#00F2FE]" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">98.4%</div>
                <div className="text-[11px] text-[#3FB950] font-mono">99.1% positive reviews</div>
              </div>
            </div>

            {/* Weekly Volume & Triage Accuracy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#161B22]/50 border border-[#21262D] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Weekly Inbound Volume
                  </h4>
                  <span className="text-[10px] font-mono text-[#6E7681]">Last 7 days</span>
                </div>
                <div className="space-y-2 pt-1">
                  {[
                    { day: "Mon", count: 48, pct: "75%" },
                    { day: "Tue", count: 62, pct: "95%" },
                    { day: "Wed", count: 54, pct: "82%" },
                    { day: "Thu", count: 39, pct: "60%" },
                    { day: "Fri", count: 42, pct: "65%" },
                  ].map((d) => (
                    <div key={d.day} className="flex items-center gap-3 text-xs font-mono">
                      <span className="w-8 text-[#8B949E]">{d.day}</span>
                      <div className="flex-1 h-3 bg-[#0E1117] rounded-full overflow-hidden border border-[#21262D]">
                        <div
                          className="h-full bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] rounded-full"
                          style={{ width: d.pct }}
                        />
                      </div>
                      <span className="w-8 text-right text-white font-semibold">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Triage Categories */}
              <div className="p-4 rounded-xl bg-[#161B22]/50 border border-[#21262D] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Intent &amp; Category Breakdown
                </h4>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: "Auth & SSO", count: "38%", color: "bg-[#00F2FE]" },
                    { label: "Billing & Payments", count: "29%", color: "bg-[#F59E0B]" },
                    { label: "API & Webhooks", count: "18%", color: "bg-[#A855F7]" },
                    { label: "Account Access", count: "15%", color: "bg-[#3FB950]" },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#C9D1D9]">{cat.label}</span>
                        <span className="text-white font-semibold">{cat.count}</span>
                      </div>
                      <div className="h-2 w-full bg-[#0E1117] rounded-full overflow-hidden border border-[#21262D]">
                        <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.count }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#21262D] pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Customer Organizations
                </h2>
                <p className="text-xs text-[#8B949E] font-mono mt-0.5">
                  5 enterprise accounts actively linked via Stripe &amp; Supabase
                </p>
              </div>
              <span className="text-xs font-mono text-[#00F2FE] bg-[#00F2FE]/10 px-2.5 py-1 rounded border border-[#00F2FE]/25">
                Total MRR: $12,100
              </span>
            </div>

            <div className="rounded-xl border border-[#21262D] bg-[#161B22]/50 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1117] border-b border-[#21262D] text-[#8B949E] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3 text-right">Active Tickets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262D]">
                  {[
                    { name: "Stripe", contact: "Sarah Chen", plan: "Enterprise Pro", seats: 14, tickets: 1, mrr: "$4,200" },
                    { name: "FinFlow", contact: "Marcus Vance", plan: "Enterprise Pro", seats: 8, tickets: 1, mrr: "$2,400" },
                    { name: "CloudScale", contact: "Elena Rostova", plan: "Growth", seats: 5, tickets: 1, mrr: "$1,500" },
                    { name: "HyperGrowth", contact: "David Kim", plan: "Growth", seats: 12, tickets: 1, mrr: "$3,600" },
                    { name: "SolarData", contact: "Olivia Wright", plan: "Starter", seats: 2, tickets: 0, mrr: "$400" },
                  ].map((cust) => (
                    <tr key={cust.name} className="hover:bg-[#161B22] transition-colors">
                      <td className="p-3 font-semibold text-white">{cust.name}</td>
                      <td className="p-3 text-[#C9D1D9]">{cust.contact}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30">
                          {cust.plan}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[#8B949E]">{cust.seats} seats</td>
                      <td className="p-3 text-right">
                        <span className={`font-mono font-semibold ${cust.tickets > 0 ? "text-[#00F2FE]" : "text-[#3FB950]"}`}>
                          {cust.tickets > 0 ? `${cust.tickets} Open` : "All Resolved"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="border-b border-[#21262D] pb-3">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Support Analytics &amp; SLAs
              </h2>
              <p className="text-xs text-[#8B949E] font-mono mt-0.5">
                Telemetry measured over 1,420 resolved support interactions
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#161B22]/70 border border-[#21262D] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#8B949E]">First Contact Resolution</span>
                <div className="text-2xl font-bold font-mono text-[#3FB950]">92.4%</div>
                <p className="text-xs text-[#6E7681]">924 of 1,000 inquiries resolved in 1 turn.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#161B22]/70 border border-[#21262D] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#8B949E]">SLA Compliance Rate</span>
                <div className="text-2xl font-bold font-mono text-[#00F2FE]">99.8%</div>
                <p className="text-xs text-[#6E7681]">Under 15-minute response SLA met cleanly.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#161B22]/70 border border-[#21262D] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#8B949E]">Customer Sentiment Shift</span>
                <div className="text-2xl font-bold font-mono text-[#A855F7]">+34%</div>
                <p className="text-xs text-[#6E7681]">Negative sentiment inverted post-resolution.</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="border-b border-[#21262D] pb-3">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                SupportDesk AI Configuration
              </h2>
              <p className="text-xs text-[#8B949E] font-mono mt-0.5">
                Runtime policies and triage automation triggers
              </p>
            </div>

            <div className="space-y-4 max-w-xl">
              <div className="p-4 rounded-xl bg-[#161B22]/60 border border-[#21262D] flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-xs text-white">AI Real-time Triage Suggestions</div>
                  <div className="text-[11px] text-[#8B949E]">Generate contextual response drafts automatically upon ticket ingest.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoTriageEnabled(!autoTriageEnabled)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors ${autoTriageEnabled ? "bg-[#00F2FE]" : "bg-[#30363D]"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-black transition-transform ${autoTriageEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#161B22]/60 border border-[#21262D] flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-xs text-white">Urgent SLA Escalation Webhooks</div>
                  <div className="text-[11px] text-[#8B949E]">Alert on-call engineers via Slack when High/Urgent tickets exceed 5 minutes.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSlaEscalationEnabled(!slaEscalationEnabled)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors ${slaEscalationEnabled ? "bg-[#00F2FE]" : "bg-[#30363D]"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-black transition-transform ${slaEscalationEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#161B22]/60 border border-[#21262D] flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-xs text-white">Autonomous Ticket Deflection</div>
                  <div className="text-[11px] text-[#8B949E]">Automatically dispatch AI solutions if match confidence exceeds 95%.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoDeflectionEnabled(!autoDeflectionEnabled)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors ${autoDeflectionEnabled ? "bg-[#00F2FE]" : "bg-[#30363D]"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-black transition-transform ${autoDeflectionEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
