"use client";

import React from "react";
import { InspectorRegion } from "@/lib/preview/types";
import {
  FileCode2,
  X,
  Copy,
  Check,
  Bot,
  Route,
  Layers,
  Info,
} from "lucide-react";
import { useState } from "react";

interface PreviewInspectorProps {
  isInspectorActive: boolean;
  selectedRegion: InspectorRegion | null;
  onCloseRegion: () => void;
}

export function PreviewInspector({
  isInspectorActive,
  selectedRegion,
  onCloseRegion,
}: PreviewInspectorProps) {
  const [copied, setCopied] = useState(false);

  if (!isInspectorActive && !selectedRegion) return null;

  const handleCopyPath = () => {
    if (!selectedRegion) return;
    navigator.clipboard.writeText(selectedRegion.filePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      {/* Top Banner Notice when Inspector Mode is ON */}
      {isInspectorActive && (
        <div className="bg-[#00F2FE]/10 border-b border-[#00F2FE]/25 px-4 py-1.5 text-xs text-[#00F2FE] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE]" />
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              Visual Component Inspector Active
            </span>
            <span className="hidden md:inline text-[11px] text-[#C9D1D9]">
              — Click any outlined region in the preview to inspect its component architecture, route, and state.
            </span>
          </div>
          {selectedRegion && (
            <span className="font-mono text-[10px] text-[#8B949E] hidden sm:inline">
              Selected: &lt;{selectedRegion.componentName} /&gt;
            </span>
          )}
        </div>
      )}

      {/* Floating Inspector Panel when a region is clicked */}
      {selectedRegion && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-xl border border-[#00F2FE]/40 bg-[#0E1117]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,242,254,0.15)] p-4 text-xs space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-[#21262D] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-[#00F2FE]/15 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="font-mono font-bold text-white text-xs">
                  &lt;{selectedRegion.componentName} /&gt;
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-[#8B949E]">
                  <Route className="h-2.5 w-2.5 text-[#A855F7]" />
                  <span>{selectedRegion.route}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseRegion}
              className="text-[#8B949E] hover:text-white p-1 rounded-md hover:bg-[#161B22] transition-colors"
              title="Close Inspector Panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Component Source File Path */}
          <div className="rounded-lg bg-[#161B22] p-2 border border-[#30363D] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 font-mono text-[11px] text-[#C9D1D9]">
              <FileCode2 className="h-3.5 w-3.5 text-[#00F2FE] shrink-0" />
              <span className="truncate">{selectedRegion.filePath}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyPath}
              className="px-2 py-0.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white text-[10px] font-mono shrink-0 transition-colors flex items-center gap-1"
              title="Copy path"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-[#3FB950]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Agent Swarm Attribution */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8B949E] bg-[#161B22]/50 p-2 rounded-lg border border-[#21262D]">
            <div className="flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-[#00F2FE]" />
              <span>Created by:</span>
              <span className="text-white font-semibold capitalize">
                {selectedRegion.agentRole} Agent
              </span>
            </div>
            <span className="text-[10px] text-[#A855F7] bg-[#A855F7]/10 px-1.5 py-0.5 rounded border border-[#A855F7]/20">
              Step {selectedRegion.stepNumber}
            </span>
          </div>

          {/* Description */}
          <p className="text-[#8B949E] leading-relaxed text-[11px]">
            {selectedRegion.description}
          </p>

          {/* State Snapshot */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-[#8B949E]">
              <Info className="h-3 w-3 text-[#00F2FE]" />
              <span>Active State Snapshot</span>
            </div>
            <pre className="p-2 rounded-lg bg-[#090A0F] border border-[#21262D] text-[10px] font-mono text-[#00F2FE] overflow-x-auto max-h-28">
              {JSON.stringify(selectedRegion.stateSnapshot, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}
