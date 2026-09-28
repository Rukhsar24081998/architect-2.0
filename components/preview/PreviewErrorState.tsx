"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PreviewErrorStateProps {
  errorMsg?: string;
  onRetry: () => void;
}

export function PreviewErrorState({
  errorMsg = "An error occurred while mounting the interactive preview canvas.",
  onRetry,
}: PreviewErrorStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4 select-none">
      <div className="h-12 w-12 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <div className="space-y-1.5">
        <h4 className="text-sm font-semibold text-white">
          Preview couldn&apos;t be loaded.
        </h4>
        <p className="text-xs text-[#8B949E] leading-relaxed">
          {errorMsg}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="text-xs border-[#30363D] text-[#C9D1D9] hover:text-white"
      >
        <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-[#00F2FE]" />
        <span>Retry</span>
      </Button>
    </div>
  );
}
