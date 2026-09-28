"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Ticket,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SupportSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
  isInspectorActive?: boolean;
  onInspect?: () => void;
  isMobileCompact?: boolean;
}

export function SupportSidebar({
  activeTab,
  onTabChange,
  unreadCount = 5,
  isInspectorActive = false,
  onInspect,
  isMobileCompact = false,
}: SupportSidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tickets", label: "Tickets", icon: Ticket, count: unreadCount },
    { id: "customers", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      onClick={(e) => {
        if (isInspectorActive && onInspect) {
          e.stopPropagation();
          onInspect();
        }
      }}
      className={cn(
        "h-full border-r border-[#21262D] bg-[#0A0D14] flex flex-col justify-between select-none transition-all duration-200 shrink-0",
        isMobileCompact ? "w-14 p-2 items-center" : "w-52 sm:w-56 p-3",
        isInspectorActive &&
          "relative ring-1 ring-[#00F2FE]/50 hover:ring-[#00F2FE] cursor-crosshair group/inspector"
      )}
    >
      {/* Inspector Tag if Active */}
      {isInspectorActive && (
        <div className="absolute top-1 right-1 z-20 font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 pointer-events-none">
          &lt;SupportSidebar /&gt;
        </div>
      )}

      {/* Top Brand & Nav */}
      <div className="space-y-4">
        {/* SupportDesk Logo & Brand */}
        <div
          className={cn(
            "flex items-center gap-2.5 pb-3 border-b border-[#21262D]",
            isMobileCompact && "justify-center border-b-0 pb-1"
          )}
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#00F2FE] via-[#38BDF8] to-[#A855F7] p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,242,254,0.3)]">
            <div className="h-full w-full bg-[#0A0D14] rounded-[6px] flex items-center justify-center">
              <Zap className="h-4 w-4 text-[#00F2FE]" />
            </div>
          </div>

          {!isMobileCompact && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white tracking-tight">
                  SupportDesk
                </span>
                <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-[#8B949E] font-mono">
                v2.4.0 · Auto-Triage
              </span>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#161B22] text-white border border-[#30363D] shadow-sm font-semibold"
                    : "text-[#8B949E] hover:text-white hover:bg-[#161B22]/60 border border-transparent",
                  isMobileCompact && "justify-center px-0"
                )}
                title={item.label}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-[#00F2FE]" : "text-[#8B949E]"
                    )}
                  />
                  {!isMobileCompact && <span>{item.label}</span>}
                </div>

                {!isMobileCompact && item.count !== undefined && (
                  <span
                    className={cn(
                      "font-mono text-[10px] px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-[#00F2FE]/15 text-[#00F2FE] font-bold"
                        : "bg-[#21262D] text-[#8B949E]"
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Swarm Status & User Profile */}
      <div className="space-y-2 pt-3 border-t border-[#21262D]">
        {/* AI Guard Status */}
        {!isMobileCompact ? (
          <div className="p-2 rounded-lg bg-[#00F2FE]/5 border border-[#00F2FE]/20 flex items-center justify-between text-[11px] text-[#00F2FE]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono text-[10px] font-medium">AI Swarm Guard</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#3FB950] animate-pulse" />
          </div>
        ) : (
          <div className="flex justify-center" title="AI Swarm Guard: Active">
            <ShieldCheck className="h-4 w-4 text-[#00F2FE]" />
          </div>
        )}

        {/* User Card */}
        <div
          className={cn(
            "flex items-center gap-2 p-1.5 rounded-lg bg-[#161B22]/60 border border-[#21262D]",
            isMobileCompact && "justify-center p-1"
          )}
        >
          <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#38BDF8] to-[#A855F7] flex items-center justify-center font-bold text-[10px] text-white shrink-0">
            AR
          </div>
          {!isMobileCompact && (
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-white truncate">
                Alex Rivera
              </span>
              <span className="text-[9px] text-[#8B949E] font-mono truncate">
                Support Lead
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
