"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

export function Dropdown({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, close: () => setIsOpen(false) }}>
      <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children }: { children: React.ReactNode }) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownTrigger must be used inside Dropdown");

  return (
    <div
      onClick={() => context.setIsOpen(!context.isOpen)}
      className="cursor-pointer inline-flex"
    >
      {children}
    </div>
  );
}

export function DropdownContent({
  children,
  align = "right",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownContent must be used inside Dropdown");

  if (!context.isOpen) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1.5 min-w-[180px] rounded-[8px] bg-[#161B22] border border-[#30363D] p-1.5 shadow-xl text-[#F0F6FC]",
        align === "right" ? "right-0" : "left-0",
        "animate-in fade-in-0 zoom-in-95 duration-100",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  destructive = false,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  className?: string;
}) {
  const context = useContext(DropdownContext);

  const handleClick = () => {
    onClick?.();
    context?.close();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-2 rounded-[5px] px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer select-none",
        destructive
          ? "text-[#EF4444] hover:bg-[#EF4444]/15"
          : "text-[#C9D1D9] hover:bg-[#21262D] hover:text-[#F0F6FC]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownDivider({ className }: { className?: string }) {
  return <div className={cn("my-1 border-t border-[#30363D]/60", className)} />;
}
