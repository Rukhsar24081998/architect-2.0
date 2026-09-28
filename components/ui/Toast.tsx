"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-[#F59E0B] shrink-0" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-[#EF4444] shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-[#00F2FE] shrink-0" />;
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3.5 rounded-[8px] bg-[#161B22] border border-[#30363D] shadow-xl text-[#F0F6FC]",
              "animate-in slide-in-from-bottom-5 duration-200"
            )}
          >
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold leading-tight">{toast.title}</h4>
              {toast.message && (
                <p className="mt-1 text-xs text-[#8B949E] leading-normal">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors p-0.5 rounded-[4px] hover:bg-[#21262D]"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
