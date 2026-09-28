"use client";

import React, { useState } from "react";
import { ViewportMode, InspectorRegion } from "@/lib/preview/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Server,
  Activity,
  ArrowUpRight,
  Sparkles,
  Search,
  Database,
  KeyRound,
  Settings,
} from "lucide-react";

interface DashboardPreviewProps {
  productName?: string;
  viewportMode: ViewportMode;
  isInspectorActive?: boolean;
  onSelectInspectorRegion?: (region: InspectorRegion) => void;
}

export function DashboardPreview({
  productName = "Analytics Dashboard",
  viewportMode,
  isInspectorActive = false,
  onSelectInspectorRegion,
}: DashboardPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isMobile = viewportMode === "mobile";
  const isTablet = viewportMode === "tablet";

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
      route: "/dashboard",
      agentRole: "frontend",
      stepNumber: 2,
      description,
      stateSnapshot: {
        activeTab,
        timeRange,
        recordsCount: filteredRecords.length,
      },
    });
  };

  const records = [
    { id: "rec_101", name: "User Auth Session Guard", category: "Security", reqs: "1.2M", status: "active", uptime: "100%" },
    { id: "rec_102", name: "Stripe Webhook Pipeline", category: "Billing", reqs: "480K", status: "active", uptime: "99.98%" },
    { id: "rec_103", name: "Embedding Vector Search", category: "AI / ML", reqs: "890K", status: "active", uptime: "99.95%" },
    { id: "rec_104", name: "Realtime WebSocket Hub", category: "Network", reqs: "2.4M", status: "testing", uptime: "99.90%" },
    { id: "rec_105", name: "Transactional Email Relay", category: "Messaging", reqs: "140K", status: "active", uptime: "100%" },
  ];

  const recentActivity = [
    { id: "act_1", event: "Automated database schema backup verified", user: "system", time: "4m ago", status: "success" },
    { id: "act_2", event: "Deployment pipeline v2.4 passed all canary checks", user: "devops", time: "18m ago", status: "success" },
    { id: "act_3", event: "API key rotation completed for production gateway", user: "sarah (engineer)", time: "1h ago", status: "info" },
    { id: "act_4", event: "New enterprise customer onboarded (Acme Corp)", user: "billing", time: "3h ago", status: "success" },
  ];

  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex bg-[#0A0D14] text-[#C9D1D9] font-sans overflow-hidden select-none antialiased">
      {/* 1. Sidebar */}
      <aside
        onClick={() =>
          triggerInspector(
            "dashboard-nav",
            "Dashboard Navigation Sidebar",
            "DashboardSidebar",
            "components/dashboard/DashboardSidebar.tsx",
            "Navigation routing for metrics, entities, and settings"
          )
        }
        className={cn(
          "h-full border-r border-[#21262D] bg-[#0E1117] flex flex-col justify-between shrink-0 transition-all",
          isInspectorActive &&
            "hover:border-[#00F2FE]/70 hover:bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30",
          isMobile || isTablet ? "w-16 items-center p-2" : "w-56 p-3"
        )}
      >
        <div className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-2 pb-3 border-b border-[#21262D]">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#00F2FE] to-[#A855F7] p-0.5 flex items-center justify-center shrink-0">
              <div className="h-full w-full bg-[#0A0D14] rounded-[6px] flex items-center justify-center font-bold text-xs text-[#00F2FE]">
                <LayoutDashboard className="h-4 w-4" />
              </div>
            </div>
            {!isMobile && !isTablet && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-white truncate">
                  {productName}
                </span>
                <span className="text-[10px] font-mono text-[#8B949E]">
                  v2.0 · Production
                </span>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "activity", label: "Activity Logs", icon: Activity },
              { id: "database", label: "Data Records", icon: Database },
              { id: "keys", label: "API Keys", icon: KeyRound },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(item.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-[#161B22] text-white border border-[#30363D]"
                      : "text-[#8B949E] hover:text-white hover:bg-[#161B22]/50 border border-transparent",
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
              <span>Cluster State</span>
              <span className="text-[#3FB950] font-semibold">Healthy</span>
            </div>
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#3FB950] mx-auto block" />
          )}
        </div>
      </aside>

      {/* 2. Main Dashboard Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#0A0D14]">
        {/* Top Header */}
        <div
          onClick={() =>
            triggerInspector(
              "dashboard-header",
              "Dashboard Header & Filter Strip",
              "DashboardHeader",
              "components/dashboard/DashboardHeader.tsx",
              "Dashboard title, time window toggles, and Architect build badge"
            )
          }
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 border-b border-[#21262D] pb-4 transition-all",
            isInspectorActive &&
              "p-2 rounded border border-[#00F2FE]/40 bg-[#00F2FE]/5 cursor-pointer"
          )}
        >
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {productName}
            </h2>
            <p className="text-xs text-[#8B949E]">
              Real-time application performance metrics, active sessions, and telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Time Filter */}
            <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded-lg p-0.5 text-[11px] font-mono">
              {["7d", "30d", "90d"].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-2 py-0.5 rounded cursor-pointer transition-colors uppercase",
                    timeRange === range
                      ? "bg-[#00F2FE]/20 text-[#00F2FE] font-bold"
                      : "text-[#8B949E] hover:text-white"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00F2FE] bg-[#00F2FE]/10 px-2.5 py-1 rounded-lg border border-[#00F2FE]/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Built by Architect</span>
            </span>
          </div>
        </div>

        {/* 3. KPI Metrics Grid */}
        <div
          onClick={() =>
            triggerInspector(
              "kpi-cards",
              "KPI Metric Cards",
              "KpiGrid",
              "components/dashboard/KpiGrid.tsx",
              "Core application performance indicators with trend metrics"
            )
          }
          className={cn(
            "grid grid-cols-2 lg:grid-cols-4 gap-3 transition-all",
            isInspectorActive &&
              "p-1 rounded border border-[#00F2FE]/40 bg-[#00F2FE]/5 cursor-pointer"
          )}
        >
          <div className="p-3.5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-1">
            <div className="text-[10px] font-mono text-[#8B949E] uppercase flex items-center justify-between">
              <span>Total Volume</span>
              <TrendingUp className="h-3.5 w-3.5 text-[#3FB950]" />
            </div>
            <div className="text-xl font-bold font-mono text-white">48,219</div>
            <div className="flex items-center gap-1 text-[10px] text-[#3FB950] font-mono">
              <ArrowUpRight className="h-3 w-3" />
              <span>+14.2% vs prior period</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-1">
            <div className="text-[10px] font-mono text-[#8B949E] uppercase flex items-center justify-between">
              <span>Active Sessions</span>
              <Users className="h-3.5 w-3.5 text-[#A855F7]" />
            </div>
            <div className="text-xl font-bold font-mono text-white">1,480</div>
            <div className="text-[10px] text-[#A855F7] font-mono">
              <span>98.6% auth retention</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-1">
            <div className="text-[10px] font-mono text-[#8B949E] uppercase flex items-center justify-between">
              <span>P95 Response Time</span>
              <Server className="h-3.5 w-3.5 text-[#00F2FE]" />
            </div>
            <div className="text-xl font-bold font-mono text-[#00F2FE]">38ms</div>
            <div className="text-[10px] text-[#8B949E] font-mono">
              <span>Edge cached in 24 regions</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-1">
            <div className="text-[10px] font-mono text-[#8B949E] uppercase flex items-center justify-between">
              <span>Service Health</span>
              <span className="h-2 w-2 rounded-full bg-[#3FB950] animate-pulse" />
            </div>
            <div className="text-xl font-bold font-mono text-[#3FB950]">99.98%</div>
            <div className="text-[10px] text-[#3FB950] font-mono">
              <span>Zero critical alerts</span>
            </div>
          </div>
        </div>

        {/* 4. Chart / Visual Metric Section */}
        <div
          onClick={() =>
            triggerInspector(
              "metrics-chart",
              "Telemetry Trend Chart",
              "TelemetryChart",
              "components/dashboard/TelemetryChart.tsx",
              "Visual activity trend graph with multi-day metric distribution"
            )
          }
          className={cn(
            "p-4 rounded-xl border border-[#21262D] bg-[#0E1117] space-y-3 transition-all",
            isInspectorActive &&
              "hover:border-[#00F2FE]/70 hover:bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30"
          )}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold uppercase text-white flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#00F2FE]" />
              Throughput & Request Distribution
            </h3>
            <span className="text-[11px] font-mono text-[#8B949E]">
              Interval: 4-hour aggregates
            </span>
          </div>

          {/* SVG Area Sparkline / Bar Graph */}
          <div className="h-32 w-full flex items-end gap-1.5 sm:gap-2 pt-2 px-1">
            {[45, 62, 58, 80, 75, 90, 84, 95, 78, 88, 92, 100, 85, 94, 98].map(
              (val, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div
                    style={{ height: `${val}%` }}
                    className="w-full rounded-t bg-gradient-to-t from-[#00F2FE]/20 via-[#00F2FE]/60 to-[#00F2FE] group-hover:from-[#00F2FE]/40 group-hover:to-[#38BDF8] transition-all"
                  />
                  <span className="text-[9px] font-mono text-[#6E7681] hidden sm:inline">
                    {idx + 1}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* 5. Split Section: Activity Feed & Data Records */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Records Table */}
          <div
            onClick={() =>
              triggerInspector(
                "records-table",
                "Data Records Explorer",
                "RecordsTable",
                "components/dashboard/RecordsTable.tsx",
                "Searchable database entity records and operational state"
              )
            }
            className={cn(
              "lg:col-span-2 rounded-xl border border-[#21262D] bg-[#0E1117] overflow-hidden transition-all",
              isInspectorActive &&
                "hover:border-[#00F2FE]/70 hover:bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30"
            )}
          >
            <div className="p-3.5 border-b border-[#21262D] flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase text-white">
                Application Data Records
              </h3>

              <div className="relative">
                <Search className="h-3 w-3 absolute left-2.5 top-2 text-[#8B949E]" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#161B22] border border-[#30363D] rounded-md pl-7 pr-2 py-1 text-[11px] text-white placeholder:text-[#8B949E] focus:outline-none focus:border-[#00F2FE]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#161B22]/50 text-[#8B949E] font-mono text-[10px] uppercase border-b border-[#21262D]">
                  <tr>
                    <th className="p-2.5">Record</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Volume</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262D]">
                  {filteredRecords.map((row) => (
                    <tr key={row.id} className="hover:bg-[#161B22]/40 transition-colors">
                      <td className="p-2.5">
                        <div className="font-medium text-white">{row.name}</div>
                        <div className="text-[10px] font-mono text-[#8B949E]">{row.id}</div>
                      </td>
                      <td className="p-2.5 font-mono text-[#8B949E]">{row.category}</td>
                      <td className="p-2.5 font-mono text-[#C9D1D9]">{row.reqs}</td>
                      <td className="p-2.5">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#3FB950] bg-[#3FB950]/10 px-1.5 py-0.5 rounded border border-[#3FB950]/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#3FB950]" />
                          <span className="capitalize">{row.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div
            onClick={() =>
              triggerInspector(
                "activity-feed",
                "Realtime Activity Stream",
                "ActivityFeed",
                "components/dashboard/ActivityFeed.tsx",
                "Audit trail of user actions, deployments, and automated alerts"
              )
            }
            className={cn(
              "rounded-xl border border-[#21262D] bg-[#0E1117] p-3.5 space-y-3 transition-all",
              isInspectorActive &&
                "hover:border-[#00F2FE]/70 hover:bg-[#00F2FE]/5 cursor-pointer ring-1 ring-[#00F2FE]/30"
            )}
          >
            <h3 className="font-mono text-xs font-semibold uppercase text-white flex items-center justify-between">
              <span>Recent Activity</span>
              <span className="text-[10px] text-[#3FB950] font-normal">Streaming</span>
            </h3>

            <div className="space-y-2.5">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-[#161B22]/50 border border-[#21262D] space-y-1 text-xs"
                >
                  <p className="text-white text-[11px] leading-snug">{item.event}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8B949E]">
                    <span className="text-[#00F2FE]">{item.user}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
