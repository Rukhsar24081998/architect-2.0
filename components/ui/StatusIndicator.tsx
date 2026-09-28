import React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "live"
  | "deployed"
  | "building"
  | "planning"
  | "ready"
  | "idle"
  | "draft"
  | "error"
  | "failed";

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  label?: string;
  pulse?: boolean;
}

export function StatusIndicator({
  status,
  label,
  pulse = true,
  className,
  ...props
}: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case "live":
      case "deployed":
        return "bg-[#10B981]";
      case "building":
      case "planning":
        return "bg-[#00F2FE]";
      case "ready":
      case "idle":
        return "bg-[#58A6FF]";
      case "draft":
        return "bg-[#F59E0B]";
      case "error":
      case "failed":
        return "bg-[#EF4444]";
      default:
        return "bg-[#8B949E]";
    }
  };

  const getStatusLabel = () => {
    if (label) return label;
    switch (status) {
      case "live":
      case "deployed":
        return "Live";
      case "building":
        return "Building...";
      case "planning":
        return "Planning";
      case "ready":
        return "Ready";
      case "idle":
        return "Idle";
      case "draft":
        return "Draft";
      case "error":
      case "failed":
        return "Error";
      default:
        return status;
    }
  };

  const isAnimated = pulse && (status === "building" || status === "live" || status === "planning");

  return (
    <div
      className={cn("inline-flex items-center gap-2 select-none", className)}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {isAnimated && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              getStatusColor()
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            getStatusColor()
          )}
        />
      </span>
      <span className="text-xs font-mono font-medium text-[#C9D1D9] capitalize">
        {getStatusLabel()}
      </span>
    </div>
  );
}
