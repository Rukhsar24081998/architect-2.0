"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "secondary" | "outline" | "cyan" | "violet";
  size?: "xs" | "sm" | "md" | "lg";
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = "ghost", size = "md", label, children, ...props },
    ref
  ) => {
    const sizeClasses = {
      xs: "h-6 w-6 text-xs",
      sm: "h-7 w-7 text-xs",
      md: "h-8 w-8 text-sm",
      lg: "h-10 w-10 text-base",
    };

    const variantClasses = {
      ghost:
        "bg-transparent text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22] active:bg-[#21262D]",
      secondary:
        "bg-[#161B22] text-[#C9D1D9] border border-[#30363D] hover:bg-[#21262D] hover:text-white",
      outline:
        "border border-[#30363D] bg-transparent text-[#8B949E] hover:text-white hover:border-[#58A6FF]/40 hover:bg-[#161B22]",
      cyan:
        "bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/20 hover:bg-[#00F2FE]/20",
      violet:
        "bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 hover:bg-[#A855F7]/20",
    };

    return (
      <button
        ref={ref}
        title={label}
        aria-label={label}
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58A6FF] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
