"use client";

import React, { useState } from "react";
import { EnvironmentVariable } from "@/lib/developer/types";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Lock,
  Globe,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface EnvironmentPanelProps {
  variables: EnvironmentVariable[];
  onAddVariable: (variable: Omit<EnvironmentVariable, "id">) => void;
  onDeleteVariable?: (id: string) => void;
}

export function EnvironmentPanel({
  variables,
  onAddVariable,
  onDeleteVariable,
}: EnvironmentPanelProps) {
  const { addToast } = useToast();
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New variable form state
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (envVar: EnvironmentVariable) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(envVar.value);
      }
      setCopiedId(envVar.id);
      setTimeout(() => setCopiedId(null), 2000);
      addToast({
        type: "success",
        title: "Copied to Clipboard",
        message: `${envVar.key} copied successfully.`,
      });
    } catch {
      // Fallback
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    onAddVariable({
      key: newKey.trim().toUpperCase(),
      value: newVal.trim(),
      isSecret,
      target: "production",
    });

    setNewKey("");
    setNewVal("");
    setIsSecret(false);
    setIsAdding(false);

    addToast({
      type: "success",
      title: "Environment Variable Added",
      message: `Configured ${newKey.trim().toUpperCase()} for developer workspace.`,
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#0E1117] border-r border-[#21262D] font-mono text-xs select-none overflow-hidden">
      {/* Panel Header */}
      <div className="h-9 px-3 border-b border-[#21262D] flex items-center justify-between text-[#8B949E] shrink-0">
        <span className="uppercase text-[10px] font-semibold tracking-wider text-[#6E7681]">
          Environment Variables
        </span>
        <button
          type="button"
          onClick={() => setIsAdding((prev) => !prev)}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#161B22] hover:bg-[#21262D] text-white border border-[#30363D] transition-colors text-[11px]"
        >
          <Plus className="h-3 w-3 text-[#00F2FE]" />
          <span>Add</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
        {/* ADD VARIABLE DRAWER / FORM */}
        {isAdding && (
          <form
            onSubmit={handleCreate}
            className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] space-y-2.5 animate-fadeIn"
          >
            <div className="text-[11px] font-semibold text-white">
              Add Variable
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#6E7681] block mb-1">
                Key Name
              </label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. STRIPE_API_KEY"
                className="w-full px-2 py-1 bg-[#090A0F] text-white border border-[#30363D] rounded text-xs focus:outline-none focus:border-[#00F2FE] placeholder-[#6E7681] font-mono uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#6E7681] block mb-1">
                Value
              </label>
              <input
                type="text"
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                placeholder="Value..."
                className="w-full px-2 py-1 bg-[#090A0F] text-white border border-[#30363D] rounded text-xs focus:outline-none focus:border-[#00F2FE] placeholder-[#6E7681] font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isSecretCheck"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
                className="rounded bg-[#090A0F] border-[#30363D] text-[#00F2FE] focus:ring-0"
              />
              <label
                htmlFor="isSecretCheck"
                className="text-[11px] text-[#C9D1D9] cursor-pointer"
              >
                Mask as Secret (encrypted at rest)
              </label>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={!newKey.trim()}
                className="flex-1 py-1 rounded bg-[#00F2FE] hover:bg-[#00D8E6] disabled:opacity-50 text-black font-semibold text-xs transition-colors"
              >
                Save Variable
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white transition-colors text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* VARIABLES LIST */}
        <div className="space-y-2">
          {variables.map((envVar) => {
            const isRevealed = revealedIds.has(envVar.id);
            const isCopied = copiedId === envVar.id;

            return (
              <div
                key={envVar.id}
                className="p-2.5 rounded-lg bg-[#161B22]/70 border border-[#21262D] hover:border-[#30363D] transition-colors space-y-1.5"
              >
                {/* Key Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {envVar.isSecret ? (
                      <Lock className="h-3 w-3 text-[#F59E0B] shrink-0" />
                    ) : (
                      <Globe className="h-3 w-3 text-[#38BDF8] shrink-0" />
                    )}
                    <span className="font-semibold text-white text-xs truncate">
                      {envVar.key}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {envVar.isSecret && (
                      <button
                        type="button"
                        onClick={() => toggleReveal(envVar.id)}
                        className="p-1 rounded text-[#6E7681] hover:text-white hover:bg-[#21262D] transition-colors"
                        title={isRevealed ? "Hide secret value" : "Reveal secret value"}
                      >
                        {isRevealed ? (
                          <EyeOff className="h-3 w-3 text-[#00F2FE]" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopy(envVar)}
                      className="p-1 rounded text-[#6E7681] hover:text-white hover:bg-[#21262D] transition-colors"
                      title="Copy value"
                    >
                      {isCopied ? (
                        <Check className="h-3 w-3 text-[#3FB950]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>

                    {onDeleteVariable && (
                      <button
                        type="button"
                        onClick={() => onDeleteVariable(envVar.id)}
                        className="p-1 rounded text-[#6E7681] hover:text-[#F85149] hover:bg-[#21262D] transition-colors"
                        title="Delete variable"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Value Display */}
                <div className="px-2 py-1 rounded bg-[#090A0F] border border-[#21262D] text-[11px] text-[#8B949E] break-all select-text font-mono">
                  {envVar.isSecret && !isRevealed
                    ? "••••••••••••••••••••••••"
                    : envVar.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="p-2.5 rounded bg-[#161B22]/30 border border-[#21262D] text-[10px] text-[#6E7681] leading-relaxed">
          Variables are decrypted into container memory during simulated execution and build checks.
        </div>
      </div>
    </div>
  );
}
