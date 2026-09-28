"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  status?: "online" | "idle" | "offline";
}

export function getInitials(str?: string): string {
  if (!str) return "U";
  const parts = str.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  name = "User",
  size = "md",
  status,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    xs: "h-5 w-5 text-[10px]",
    sm: "h-7 w-7 text-xs",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };

  const hasValidSrc = Boolean(
    src && typeof src === "string" && src.trim().length > 0 && !imageError
  );

  return (
    <div
      className={cn("relative inline-flex shrink-0 select-none", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-full bg-[#161B22] border border-[#30363D] overflow-hidden flex items-center justify-center font-mono font-semibold text-[#00F2FE]",
          sizeStyles[size]
        )}
      >
        {hasValidSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2 w-2 rounded-full ring-2 ring-[#090A0F]",
            status === "online" && "bg-[#10B981]",
            status === "idle" && "bg-[#F59E0B]",
            status === "offline" && "bg-[#8B949E]"
          )}
        />
      )}
    </div>
  );
}
