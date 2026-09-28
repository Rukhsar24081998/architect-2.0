"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "cyan"
    | "violet";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58A6FF] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-[#161B22] text-[#F0F6FC] border border-[#30363D] hover:bg-[#21262D] hover:border-[#58A6FF]/40 active:bg-[#0E1117] shadow-sm",
      secondary:
        "bg-[#21262D] text-[#C9D1D9] border border-transparent hover:bg-[#30363D] hover:text-white active:bg-[#161B22]",
      outline:
        "border border-[#30363D] bg-transparent text-[#C9D1D9] hover:bg-[#161B22] hover:text-white hover:border-[#484F58]",
      ghost:
        "bg-transparent text-[#8B949E] hover:bg-[#161B22] hover:text-[#F0F6FC] active:bg-[#21262D]",
      destructive:
        "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/20 hover:border-[#EF4444]/40 active:bg-[#EF4444]/30",
      cyan:
        "bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#090A0F] font-semibold hover:opacity-95 shadow-[0_0_12px_rgba(0,242,254,0.25)] active:scale-[0.98]",
      violet:
        "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-semibold hover:opacity-95 shadow-[0_0_12px_rgba(168,85,247,0.25)] active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-7 px-2.5 text-xs rounded-[6px] gap-1.5",
      md: "h-9 px-3.5 text-sm rounded-[6px] gap-2",
      lg: "h-11 px-5 text-base rounded-[8px] gap-2.5",
      icon: "h-8 w-8 p-0 rounded-[6px] justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
