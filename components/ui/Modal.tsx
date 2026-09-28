"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
  className,
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#090A0F]/80 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-200"
      />

      {/* Dialog box */}
      <div
        className={cn(
          "relative w-full rounded-[12px] bg-[#161B22] border border-[#30363D] p-6 shadow-2xl z-10",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          maxWidthStyles[maxWidth],
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8B949E] hover:text-[#F0F6FC] transition-colors p-1 rounded-[4px] hover:bg-[#21262D]"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {title && (
          <div className="mb-4 pr-6">
            <h2 className="text-base font-semibold text-[#F0F6FC]">{title}</h2>
            {description && (
              <p className="mt-1 text-xs text-[#8B949E] leading-relaxed">{description}</p>
            )}
          </div>
        )}

        <div className="text-sm text-[#C9D1D9]">{children}</div>

        {footer && (
          <div className="mt-6 pt-4 border-t border-[#30363D]/60 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
