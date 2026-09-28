import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

export function Skeleton({
  variant = "rectangular",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[#161B22] border border-[#21262D]/60",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-[6px]",
        variant === "text" && "h-4 rounded-[4px] w-full my-1",
        className
      )}
      {...props}
    />
  );
}
