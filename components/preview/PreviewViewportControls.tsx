"use client";

import React from "react";
import { ViewportMode } from "@/lib/preview/types";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewViewportControlsProps {
  currentMode: ViewportMode;
  onModeChange: (mode: ViewportMode) => void;
}

export function PreviewViewportControls({
  currentMode,
  onModeChange,
}: PreviewViewportControlsProps) {
  const options: { mode: ViewportMode; label: string; icon: React.ElementType; widthDesc: string }[] = [
    { mode: "desktop", label: "Desktop", icon: Monitor, widthDesc: "100%" },
    { mode: "tablet", label: "Tablet", icon: Tablet, widthDesc: "768px" },
    { mode: "mobile", label: "Mobile", icon: Smartphone, widthDesc: "390px" },
  ];

  return (
    <div
      role="group"
      aria-label="Viewport Controls"
      className="inline-flex items-center rounded-lg border border-[#30363D] bg-[#161B22] p-0.5 shadow-sm"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = currentMode === opt.mode;

        return (
          <button
            key={opt.mode}
            type="button"
            onClick={() => onModeChange(opt.mode)}
            title={`${opt.label} Viewport (${opt.widthDesc})`}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 select-none",
              isActive
                ? "bg-[#00F2FE]/15 text-[#00F2FE] shadow-[0_0_10px_rgba(0,242,254,0.15)] border border-[#00F2FE]/30 font-semibold"
                : "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]/60 border border-transparent"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
