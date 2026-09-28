"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B949E]">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full h-9 rounded-[6px] bg-[#0E1117] border border-[#30363D] px-3 text-sm text-[#F0F6FC] placeholder:text-[#6E7681]",
            "transition-colors duration-150",
            "focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8B949E]">
            {rightIcon}
          </div>
        )}
        {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
