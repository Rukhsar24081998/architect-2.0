"use client";

import React, { useState } from "react";
import { ProjectDetails } from "@/lib/types";
import { ViewportMode } from "@/lib/preview/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Database,
  KeyRound,
  Settings,
  Sparkles,
  TrendingUp,
  Server,
  Users,
} from "lucide-react";

interface GenericAppPreviewProps {
  project: ProjectDetails;
  viewportMode: ViewportMode;
}

export function GenericAppPreview({
  project,
  viewportMode,
}: GenericAppPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const isMobile = viewportMode === "mobile";
  const isTablet = viewportMode === "tablet";

  return (
    <div className="w-full h-full flex bg-[#0A0D14] text-[#C9D1D9] font-sans overflow-hidden select-none">
      {/* Sidebar */}
      <aside
        className={cn(
          "h-full border-r border-[#21262D] bg-[#0E1117] flex flex-col justify-between p-3 shrink-0",
          isMobile || isTablet ? "w-14 items-center p-2" : "w-52"
        )}
      >
        <div className="space-y-4">
          {/* Brand */}
          <div className="flex items-center gap-2 pb-3 border-b border-[#21262D]">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#00F2FE] to-[#A855F7] p-0.5 flex items-center justify-center shrink-0">
              <div className="h-full w-full bg-[#0A0D14] rounded-[6px] flex items-center justify-center font-bold text-xs text-[#00F2FE]">
                {project.name.charAt(0)}
              </div>
            </div>
            {!isMobile && !isTablet && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-white truncate">
                  {project.name}
                </span>
                <span className="text-[10px] font-mono text-[#8B949E]">
                  v1.0.0 · Production
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "data", label: "Entities", icon: Database },
              { id: "api", label: "API Keys", icon: KeyRound },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-[#161B22] text-white border border-[#30363D]"
                      : "text-[#8B949E] hover:text-white hover:bg-[#161B22]/50",
                    (isMobile || isTablet) && "justify-center px-0"
                  )}
                  title={item.label}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-[#00F2FE]" : "text-[#8B949E]"
                    )}
                  />
                  {!isMobile && !isTablet && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="text-[10px] font-mono text-[#8B949E] p-2 rounded bg-[#161B22]/50 border border-[#21262D]">
          {!isMobile && !isTablet ? (
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="text-[#3FB950] font-semibold">Live Edge</span>
            </div>
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#3FB950] mx-auto block" />
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#21262D] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {project.name} Control Center
            </h2>
            <p className="text-xs text-[#8B949E]">
              {project.description || "Generated AI application running on live local sandbox."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00F2FE] bg-[#00F2FE]/10 px-2.5 py-1 rounded-lg border border-[#00F2FE]/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Architect Build Certified</span>
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-1">
            <div className="text-[10px] font-mono text-[#8B949E] uppercase flex items-center justify-between">
              <span>Total Requests</span>
              <TrendingUp className="h-3 w-3 text-[#3FB950]" />
            </div>
            <div className="text-xl font-bold font-mono text-white">48,219</div>
            <span className="text-[10px] text-[#3FB950] font-mono">+12.4% vs last week</span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-1">
            <div className="text-[10px] font-mono text-[#8B949E] uppercase flex items-center justify-between">
              <span>Latency (P95)</span>
              <Server className="h-3 w-3 text-[#00F2FE]" />
            </div>
            <div className="text-xl font-bold font-mono text-[#00F2FE]">42ms</div>
            <span className="text-[10px] text-[#8B949E] font-mono">Edge CDN optimized</span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-1">
            <div className="text-[10px] font-mono text-[#8B949E] uppercase flex items-center justify-between">
              <span>Active Sessions</span>
              <Users className="h-3 w-3 text-[#A855F7]" />
            </div>
            <div className="text-xl font-bold font-mono text-white">1,280</div>
            <span className="text-[10px] text-[#A855F7] font-mono">Concurrent users</span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-1">
            <div className="text-[10px] font-mono text-[#8B949E] uppercase flex items-center justify-between">
              <span>Health Status</span>
              <span className="h-2 w-2 rounded-full bg-[#3FB950] animate-pulse" />
            </div>
            <div className="text-xl font-bold font-mono text-[#3FB950]">99.98%</div>
            <span className="text-[10px] text-[#3FB950] font-mono">0 critical incidents</span>
          </div>
        </div>

        {/* Data Records Table */}
        <div className="rounded-xl border border-[#21262D] bg-[#0E1117] overflow-hidden">
          <div className="p-3.5 border-b border-[#21262D] flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold uppercase text-white">
              Application Data Records
            </h3>
            <span className="text-[11px] font-mono text-[#8B949E]">
              5 entities synced
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#161B22]/50 text-[#8B949E] font-mono text-[10px] uppercase border-b border-[#21262D]">
                <tr>
                  <th className="p-3">Record ID</th>
                  <th className="p-3">Title / Resource</th>
                  <th className="p-3">Environment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262D]">
                {[
                  { id: "rec_901", name: "User Auth Session Guard", env: "production", status: "active" },
                  { id: "rec_902", name: "Stripe Billing Webhook Handler", env: "production", status: "active" },
                  { id: "rec_903", name: "Ticket Sentiment Pipeline", env: "production", status: "synced" },
                  { id: "rec_904", name: "Realtime WebSocket Channel", env: "staging", status: "testing" },
                  { id: "rec_905", name: "Resend Transactional Mailer", env: "production", status: "active" },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-[#161B22]/40 transition-colors">
                    <td className="p-3 font-mono text-[#00F2FE]">{row.id}</td>
                    <td className="p-3 font-medium text-white">{row.name}</td>
                    <td className="p-3 font-mono text-[#8B949E] capitalize">{row.env}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#3FB950] bg-[#3FB950]/10 px-1.5 py-0.5 rounded border border-[#3FB950]/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3FB950]" />
                        <span className="capitalize">{row.status}</span>
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-[11px] text-[#00F2FE] hover:underline cursor-pointer">
                      Inspect →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
