"use client";

import React, { useState, useRef, useEffect } from "react";
import { TerminalEntry } from "@/lib/developer/types";
import { executeSimulatedCommand } from "@/lib/developer/mock-terminal";
import { cn } from "@/lib/utils";
import {
  Terminal as TerminalIcon,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Trash2,
  CornerDownLeft,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface DeveloperTerminalProps {
  entries: TerminalEntry[];
  onAddEntries: (newEntries: TerminalEntry[]) => void;
  onClear: () => void;
  modifiedCount: number;
  modifiedFileNames: string[];
}

type TerminalTab = "terminal" | "output" | "problems";

export function DeveloperTerminal({
  entries,
  onAddEntries,
  onClear,
  modifiedCount,
  modifiedFileNames,
}: DeveloperTerminalProps) {
  const [activeTab, setActiveTab] = useState<TerminalTab>("terminal");
  const [inputVal, setInputVal] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new entries
  useEffect(() => {
    if (scrollRef.current && !isCollapsed) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, isCollapsed, activeTab]);

  const handleRunCommand = (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === "clear") {
      onClear();
      setInputVal("");
      return;
    }

    const generated = executeSimulatedCommand(
      trimmed,
      modifiedCount,
      modifiedFileNames
    );
    onAddEntries(generated);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRunCommand(inputVal);
    }
  };

  return (
    <div
      className={cn(
        "w-full border-t border-[#30363D] bg-[#0E1117] flex flex-col font-mono text-xs transition-all duration-200 z-20 shrink-0",
        isCollapsed ? "h-9" : isMaximized ? "h-80 sm:h-96" : "h-52 sm:h-64"
      )}
    >
      {/* Terminal Header Bar */}
      <div className="h-9 px-3 border-b border-[#21262D] bg-[#161B22]/80 flex items-center justify-between select-none shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("terminal");
              setIsCollapsed(false);
            }}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors",
              activeTab === "terminal" && !isCollapsed
                ? "bg-[#090A0F] text-[#00F2FE] border border-[#00F2FE]/30 font-semibold"
                : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#21262D]"
            )}
          >
            <TerminalIcon className="h-3.5 w-3.5" />
            <span>Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("output");
              setIsCollapsed(false);
            }}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors",
              activeTab === "output" && !isCollapsed
                ? "bg-[#090A0F] text-[#00F2FE] border border-[#00F2FE]/30 font-semibold"
                : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#21262D]"
            )}
          >
            <Play className="h-3 w-3" />
            <span>Output</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("problems");
              setIsCollapsed(false);
            }}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors",
              activeTab === "problems" && !isCollapsed
                ? "bg-[#090A0F] text-[#00F2FE] border border-[#00F2FE]/30 font-semibold"
                : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#21262D]"
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-[#3FB950]" />
            <span>Problems (0)</span>
          </button>
        </div>

        {/* Quick Commands + Panel Controls */}
        <div className="flex items-center gap-2">
          {!isCollapsed && activeTab === "terminal" && (
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-[10px] text-[#6E7681]">Quick:</span>
              <button
                type="button"
                onClick={() => handleRunCommand("npm run build")}
                className="px-2 py-0.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[11px] text-[#C9D1D9] hover:text-white transition-colors"
              >
                build
              </button>
              <button
                type="button"
                onClick={() => handleRunCommand("npm run lint")}
                className="px-2 py-0.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[11px] text-[#C9D1D9] hover:text-white transition-colors"
              >
                lint
              </button>
              <button
                type="button"
                onClick={() => handleRunCommand("git status")}
                className="px-2 py-0.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[11px] text-[#C9D1D9] hover:text-white transition-colors"
              >
                git status
              </button>
            </div>
          )}

          {!isCollapsed && activeTab === "terminal" && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded text-[#6E7681] hover:text-white hover:bg-[#21262D] transition-colors"
              title="Clear Terminal Buffer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Maximize/Minimize */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsMaximized((prev) => !prev)}
              className="p-1 rounded text-[#6E7681] hover:text-white hover:bg-[#21262D] transition-colors hidden sm:inline-block"
              title={isMaximized ? "Restore Height" : "Maximize Terminal"}
            >
              {isMaximized ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          {/* Collapse/Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1 rounded text-[#6E7681] hover:text-white hover:bg-[#21262D] transition-colors"
            title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
          >
            {isCollapsed ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#090A0F] overflow-hidden">
          {activeTab === "terminal" && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Output Scroll area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-2 select-text font-mono text-xs"
              >
                {entries.map((item) => {
                  if (item.type === "command") {
                    return (
                      <div key={item.id} className="flex items-start gap-2 text-white">
                        <span className="text-[#3FB950] font-bold select-none">
                          supportdesk-ai (main) $
                        </span>
                        <span>{item.content}</span>
                      </div>
                    );
                  }
                  if (item.type === "error") {
                    return (
                      <pre
                        key={item.id}
                        className="text-[#F85149] whitespace-pre-wrap font-mono leading-relaxed"
                      >
                        {item.content}
                      </pre>
                    );
                  }
                  if (item.type === "info") {
                    return (
                      <pre
                        key={item.id}
                        className="text-[#38BDF8] whitespace-pre-wrap font-mono leading-relaxed"
                      >
                        {item.content}
                      </pre>
                    );
                  }
                  return (
                    <pre
                      key={item.id}
                      className="text-[#8B949E] whitespace-pre-wrap font-mono leading-relaxed"
                    >
                      {item.content}
                    </pre>
                  );
                })}
              </div>

              {/* Interactive Prompt Bar */}
              <div className="h-9 px-3 border-t border-[#21262D] bg-[#0E1117] flex items-center gap-2 shrink-0">
                <span className="text-[#3FB950] font-semibold text-xs shrink-0 select-none">
                  supportdesk-ai (main) $
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type command (npm run build, git status, help)..."
                  className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-[#484F58]"
                  spellCheck={false}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => handleRunCommand(inputVal)}
                  disabled={!inputVal.trim()}
                  className="p-1 rounded text-[#6E7681] hover:text-[#00F2FE] disabled:opacity-30 disabled:hover:text-[#6E7681] transition-colors"
                  title="Execute command (Enter)"
                >
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "output" && (
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-[#8B949E] space-y-1">
              <div className="text-[#00F2FE] font-semibold">
                [Next.js Fast Refresh & Turbopack Daemon Log]
              </div>
              <div>[ ready ] started server on 0.0.0.0:3000, url: http://localhost:3000</div>
              <div>[ info ] loaded env from /projects/prj_supportdesk/.env.example</div>
              <div>[ event ] client connected to HMR WebSocket channel</div>
              <div className="text-[#3FB950]">
                ✓ Compiled /page in 218ms (478 modules)
              </div>
              <div className="text-[#6E7681]">
                [ watcher ] listening for file modifications in src/...
              </div>
            </div>
          )}

          {activeTab === "problems" && (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-[#8B949E]">
              <CheckCircle2 className="h-8 w-8 text-[#3FB950] mb-2" />
              <p className="text-white font-semibold text-sm">
                No problems have been detected in the workspace.
              </p>
              <p className="text-xs text-[#6E7681] mt-1">
                TypeScript typecheck and ESLint validations passed cleanly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
