import React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("w-[1px] h-full bg-[#30363D]/60 self-stretch shrink-0", className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn("h-[1px] w-full bg-[#30363D]/60 shrink-0 my-2", className)}
      {...props}
    />
  );
}
