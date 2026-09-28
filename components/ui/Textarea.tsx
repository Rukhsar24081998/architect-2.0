"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full rounded-[6px] bg-[#0E1117] border border-[#30363D] p-3 text-sm text-[#F0F6FC] placeholder:text-[#6E7681]",
            "transition-colors duration-150 resize-y min-h-[80px]",
            "focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
