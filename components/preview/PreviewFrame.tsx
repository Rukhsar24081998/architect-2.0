"use client";

import React, { useState } from "react";
import { ViewportMode } from "@/lib/preview/types";
import { cn } from "@/lib/utils";
import {
  Lock,
  RotateCcw,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface PreviewFrameProps {
  viewportMode: ViewportMode;
  projectDomain?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  children: React.ReactNode;
}

export function PreviewFrame({
  viewportMode,
  projectDomain = "supportdesk-ai.architect.live",
  onRefresh,
  isRefreshing = false,
  children,
}: PreviewFrameProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://${projectDomain}/inbox`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const isMobile = viewportMode === "mobile";
  const isTablet = viewportMode === "tablet";
  const isDesktop = viewportMode === "desktop";

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-start p-2 sm:p-4 overflow-hidden bg-[#07090E]">
      {/* Outer Browser Window Mockup */}
      <div
        className={cn(
          "w-full flex flex-col rounded-2xl border border-[#30363D] bg-[#0E1117] shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden",
          isDesktop && "max-w-[1240px] h-full min-h-[520px]",
          isTablet && "w-[768px] h-full min-h-[520px] max-w-full border-[#30363D]",
          isMobile &&
            "w-[390px] h-full min-h-[520px] max-w-full rounded-[44px] border-[8px] border-[#21262D] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(0,242,254,0.1)] relative"
        )}
      >
        {/* Mobile Top Speaker / Dynamic Island Notch */}
        {isMobile && (
          <div className="w-full bg-[#161B22] pt-2 pb-1.5 flex items-center justify-center relative z-20 select-none">
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end pr-2">
              <span className="h-2 w-2 rounded-full bg-[#3FB950]/80" />
            </div>
          </div>
        )}

        {/* Browser Top Navigation Chrome Bar */}
        <div
          className={cn(
            "border-b border-[#21262D] bg-[#161B22]/90 backdrop-blur-sm px-3 sm:px-4 py-2 flex items-center justify-between gap-3 shrink-0 select-none",
            isMobile && "py-1.5 text-[10px]"
          )}
        >
          {/* Traffic Lights (macOS dots) */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />

            {/* Back / Forward Controls */}
            {!isMobile && (
              <div className="hidden sm:flex items-center gap-1 ml-2 text-[#6E7681]">
                <button
                  type="button"
                  disabled
                  className="p-1 rounded hover:bg-[#21262D] disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled
                  className="p-1 rounded hover:bg-[#21262D] disabled:opacity-30"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Central URL / Address Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="flex items-center justify-between rounded-lg bg-[#0E1117] border border-[#30363D] px-2.5 py-1 text-xs font-mono text-[#C9D1D9] shadow-inner">
              <div className="flex items-center gap-1.5 min-w-0">
                <Lock className="h-3 w-3 text-[#3FB950] shrink-0" />
                <span className="truncate text-[11px] text-[#8B949E]">
                  https://
                  <span className="text-white font-medium">{projectDomain}</span>
                  /inbox
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-1">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="p-1 text-[#6E7681] hover:text-white rounded transition-colors"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-[#3FB950]" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
                {onRefresh && (
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="p-1 text-[#6E7681] hover:text-white rounded transition-colors disabled:opacity-40"
                    title="Reload inside frame"
                  >
                    <RotateCcw
                      className={cn(
                        "h-3 w-3",
                        isRefreshing && "animate-spin text-[#00F2FE]"
                      )}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#8B949E] shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-[#00F2FE]" />
            <span>Sandbox Edge</span>
          </div>
        </div>

        {/* Browser Viewport View Container */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-[#0A0D14]">
          {children}
        </div>

        {/* Mobile Bottom Home Bar */}
        {isMobile && (
          <div className="w-full bg-[#161B22] py-2 flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-[#6E7681] rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
