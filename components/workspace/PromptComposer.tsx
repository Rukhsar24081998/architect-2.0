"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

export interface PromptComposerProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function PromptComposer({
  value,
  onChange,
  onSend,
  isLoading,
  disabled = false,
  placeholder = "Tell Architect what you want to build...",
  autoFocus = false,
}: PromptComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  // Auto-resize textarea to fit text (up to max height)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        Math.max(textareaRef.current.scrollHeight, 52),
        180
      )}px`;
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSend();
      }
    }
  };

  return (
    <div className="relative rounded-2xl border border-[#30363D] bg-[#0E1117] p-3 sm:p-3.5 shadow-2xl transition-all duration-200 focus-within:border-[#00F2FE]/70 focus-within:ring-2 focus-within:ring-[#00F2FE]/20 focus-within:shadow-[0_0_30px_rgba(0,242,254,0.12)]">
      <textarea
        ref={textareaRef}
        rows={2}
        value={value}
        disabled={isLoading || disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isLoading ? "Architect is thinking..." : placeholder}
        className="w-full bg-transparent text-sm sm:text-[15px] text-[#F0F6FC] placeholder:text-[#8B949E]/60 focus:outline-none resize-none leading-relaxed min-h-[52px] max-h-[180px] px-1"
      />

      {/* Bottom Action Strip */}
      <div className="flex items-center justify-between pt-2 px-1 border-t border-[#21262D]/60 text-xs text-[#8B949E]">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-mono text-[10px] text-[#8B949E]/70">
            ↵ Send &nbsp;·&nbsp; Shift + ↵ New line
          </span>
        </div>

        <button
          type="button"
          disabled={!canSend}
          onClick={onSend}
          className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
            canSend
              ? "bg-[#00F2FE] text-[#090A0F] shadow-[0_0_15px_rgba(0,242,254,0.4)] hover:bg-[#38BDF8] hover:scale-105 active:scale-95 cursor-pointer"
              : "bg-[#21262D] text-[#6E7681] cursor-not-allowed"
          }`}
          title={canSend ? "Send message (Enter)" : "Enter text to send"}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#00F2FE]" />
          ) : (
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          )}
        </button>
      </div>
    </div>
  );
}
