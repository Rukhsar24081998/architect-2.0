import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "cyan"
    | "violet"
    | "success"
    | "warning"
    | "destructive";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-[#161B22] text-[#F0F6FC] border border-[#30363D]",
    secondary: "bg-[#21262D] text-[#8B949E] border border-transparent",
    outline: "bg-transparent text-[#8B949E] border border-[#30363D]",
    cyan: "bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/25",
    violet: "bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/25",
    success: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25",
    destructive: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/25",
  };

  const dotColors = {
    default: "bg-[#8B949E]",
    secondary: "bg-[#8B949E]",
    outline: "bg-[#8B949E]",
    cyan: "bg-[#00F2FE]",
    violet: "bg-[#A855F7]",
    success: "bg-[#10B981]",
    warning: "bg-[#F59E0B]",
    destructive: "bg-[#EF4444]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-mono",
    md: "px-2.5 py-1 text-xs font-mono",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
