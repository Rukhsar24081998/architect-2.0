"use client";

import React, { useState } from "react";
import { VirtualFile, GitCommit } from "@/lib/developer/types";
import { cn } from "@/lib/utils";
import {
  GitBranch,
  GitCommit as GitCommitIcon,
  Check,
  Eye,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface GitPanelProps {
  branch?: string;
  modifiedFiles: VirtualFile[];
  commits: GitCommit[];
  onCommit: (message: string) => void;
  onSelectFile: (fileId: string) => void;
  onViewDiff: (fileId: string) => void;
}

export function GitPanel({
  branch = "main",
  modifiedFiles,
  commits,
  onCommit,
  onSelectFile,
  onViewDiff,
}: GitPanelProps) {
  const [commitMessage, setCommitMessage] = useState("");
  const [justCommitted, setJustCommitted] = useState(false);

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim() || modifiedFiles.length === 0) return;

    onCommit(commitMessage.trim());
    setCommitMessage("");
    setJustCommitted(true);
    setTimeout(() => setJustCommitted(false), 3000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0E1117] border-r border-[#21262D] font-mono text-xs select-none overflow-hidden">
      {/* Panel Header */}
      <div className="h-9 px-3 border-b border-[#21262D] flex items-center justify-between text-[#8B949E] shrink-0">
        <span className="uppercase text-[10px] font-semibold tracking-wider text-[#6E7681]">
          Source Control
        </span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161B22] border border-[#21262D] text-[11px] text-white">
          <GitBranch className="h-3 w-3 text-[#A855F7]" />
          <span>{branch}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
        {/* COMMIT COMPOSER */}
        <section className="space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-[#6E7681] font-semibold flex items-center justify-between">
            <span>Commit to {branch}</span>
            {justCommitted && (
              <span className="text-[#3FB950] flex items-center gap-1 normal-case font-normal text-[11px]">
                <Check className="h-3 w-3" />
                Committed!
              </span>
            )}
          </div>

          <form onSubmit={handleCommitSubmit} className="space-y-2">
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder={
                modifiedFiles.length > 0
                  ? "Commit message (e.g. Update ticket triage UI)..."
                  : "No changes to commit"
              }
              rows={2}
              disabled={modifiedFiles.length === 0}
              className="w-full p-2 bg-[#161B22] text-white border border-[#30363D] rounded focus:outline-none focus:border-[#00F2FE] placeholder-[#6E7681] text-xs resize-none disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            />

            <button
              type="submit"
              disabled={!commitMessage.trim() || modifiedFiles.length === 0}
              className="w-full py-1.5 px-3 rounded bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] hover:from-[#00D8E6] hover:to-[#0284C7] disabled:from-[#21262D] disabled:to-[#21262D] text-black disabled:text-[#6E7681] font-semibold text-xs transition-all duration-150 flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,242,254,0.2)] disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
            >
              <GitCommitIcon className="h-3.5 w-3.5" />
              <span>Commit Changes</span>
            </button>
          </form>
        </section>

        {/* CHANGES LIST */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#6E7681] font-semibold">
            <span>Changes</span>
            <span className={cn(
              "px-1.5 py-0.2 rounded font-semibold",
              modifiedFiles.length > 0
                ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                : "bg-[#21262D] text-[#8B949E]"
            )}>
              {modifiedFiles.length}
            </span>
          </div>

          {modifiedFiles.length === 0 ? (
            <div className="p-3 rounded-lg bg-[#161B22]/40 border border-[#21262D] text-center text-[#6E7681] text-xs">
              Working tree clean. No modified files.
            </div>
          ) : (
            <div className="space-y-1">
              {modifiedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 rounded bg-[#161B22] border border-[#21262D] hover:border-[#30363D] transition-colors group"
                >
                  <div
                    onClick={() => onSelectFile(file.id)}
                    className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="h-4 w-4 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-bold text-[10px] flex items-center justify-center shrink-0">
                      M
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-xs truncate group-hover:text-[#00F2FE]">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-[#6E7681] truncate">
                        {file.path}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewDiff(file.id)}
                    className="p-1 rounded text-[#8B949E] hover:text-[#00F2FE] hover:bg-[#21262D] transition-colors shrink-0"
                    title="View side-by-side diff"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RECENT COMMITS */}
        <section className="space-y-2 pt-2 border-t border-[#21262D]">
          <div className="text-[10px] uppercase tracking-wider text-[#6E7681] font-semibold flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-[#A855F7]" />
            <span>Recent Commits</span>
          </div>

          <div className="space-y-1.5">
            {commits.map((commit) => (
              <div
                key={commit.id}
                className="p-2 rounded bg-[#161B22]/60 border border-[#21262D] hover:bg-[#161B22] transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-medium truncate max-w-[190px]">
                    {commit.message}
                  </span>
                  <span className="text-[10px] text-[#00F2FE] bg-[#00F2FE]/10 px-1 py-0.2 rounded font-mono">
                    {commit.sha}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#6E7681]">
                  <span>{commit.author}</span>
                  <span>{commit.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SYNC STATUS */}
        <div className="p-2 rounded bg-[#161B22]/40 border border-[#21262D] text-[10px] text-[#6E7681] flex items-center justify-between">
          <span className="flex items-center gap-1 text-[#3FB950]">
            <ShieldCheck className="h-3 w-3" />
            Branch synced with remote
          </span>
          <span className="text-[#8B949E]">origin/{branch}</span>
        </div>
      </div>
    </div>
  );
}
