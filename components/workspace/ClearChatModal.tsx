"use client";

import React, { useEffect } from "react";
import { Trash2, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ClearChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isClearing?: boolean;
}

export function ClearChatModal({
  isOpen,
  onClose,
  onConfirm,
  isClearing = false,
}: ClearChatModalProps) {
  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isClearing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isClearing, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      {/* Click outside to cancel */}
      <div
        className="absolute inset-0"
        onClick={!isClearing ? onClose : undefined}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-chat-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#30363D] bg-[#0E1117] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
      >
        {/* Header: Icon + Title + Close Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 flex items-center justify-center text-[#F85149] shrink-0">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="clear-chat-title"
                className="text-base font-bold text-white tracking-tight"
              >
                Clear this conversation?
              </h3>
              <span className="text-[11px] font-mono text-[#8B949E]">
                Conversation reset · Workspace preserved
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isClearing}
            className="text-[#8B949E] hover:text-white p-1 rounded-md hover:bg-[#161B22] transition-colors disabled:opacity-40"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Informative Body Copy */}
        <div className="space-y-3">
          <p className="text-xs text-[#C9D1D9] leading-relaxed">
            Your chat messages will be removed from this workspace. Your project, build plans, agents, preview, and code will not be affected.
          </p>

          {/* Safety Reassurance Card */}
          <div className="p-3 rounded-xl bg-[#161B22]/70 border border-[#21262D] space-y-1.5 text-xs text-[#8B949E]">
            <div className="flex items-center gap-1.5 text-[#3FB950] font-mono text-[11px] font-medium">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>What remains safe:</span>
            </div>
            <ul className="space-y-1 text-[11px] pl-5 list-disc text-[#8B949E]">
              <li>Project files, repository &amp; code</li>
              <li>Approved build plans &amp; milestones</li>
              <li>Agent swarm execution history &amp; runs</li>
              <li>Interactive preview &amp; environment variables</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons: Cancel vs Clear chat */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isClearing}
            className="text-xs border-[#30363D] text-[#C9D1D9] hover:text-white"
          >
            Cancel
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isClearing}
            className="px-3.5 py-1.5 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-semibold shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isClearing ? "Clearing..." : "Clear chat"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
