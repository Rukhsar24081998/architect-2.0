"use client";

import React, { useMemo } from "react";
import { VirtualFile } from "@/lib/developer/types";
import { cn } from "@/lib/utils";
import { GitCompare, X, RotateCcw, Plus, Minus, Check } from "lucide-react";

interface DiffViewerProps {
  activeFile: VirtualFile;
  onClose: () => void;
  onRevert?: (fileId: string) => void;
}

interface DiffLine {
  type: "unchanged" | "added" | "removed";
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

function computeDiff(original: string, current: string): DiffLine[] {
  const origLines = original.split("\n");
  const currLines = current.split("\n");
  const diff: DiffLine[] = [];

  // Simple, deterministic LCS-based or line-matching diff for visual credibility
  let i = 0;
  let j = 0;
  let oldLine = 1;
  let newLine = 1;

  while (i < origLines.length || j < currLines.length) {
    if (i < origLines.length && j < currLines.length && origLines[i] === currLines[j]) {
      diff.push({
        type: "unchanged",
        oldLineNumber: oldLine,
        newLineNumber: newLine,
        content: origLines[i],
      });
      i++;
      j++;
      oldLine++;
      newLine++;
    } else {
      // Lookahead match
      let matchInCurr = -1;
      for (let k = j; k < Math.min(j + 5, currLines.length); k++) {
        if (origLines[i] === currLines[k]) {
          matchInCurr = k;
          break;
        }
      }

      let matchInOrig = -1;
      for (let k = i; k < Math.min(i + 5, origLines.length); k++) {
        if (currLines[j] === origLines[k]) {
          matchInOrig = k;
          break;
        }
      }

      if (matchInCurr !== -1 && (matchInOrig === -1 || matchInCurr - j <= matchInOrig - i)) {
        // currLines[j] through currLines[matchInCurr - 1] are additions
        while (j < matchInCurr) {
          diff.push({
            type: "added",
            newLineNumber: newLine,
            content: currLines[j],
          });
          j++;
          newLine++;
        }
      } else if (matchInOrig !== -1) {
        // origLines[i] through origLines[matchInOrig - 1] are deletions
        while (i < matchInOrig) {
          diff.push({
            type: "removed",
            oldLineNumber: oldLine,
            content: origLines[i],
          });
          i++;
          oldLine++;
        }
      } else {
        // Mismatch: show deletion then addition if available
        if (i < origLines.length) {
          diff.push({
            type: "removed",
            oldLineNumber: oldLine,
            content: origLines[i],
          });
          i++;
          oldLine++;
        }
        if (j < currLines.length) {
          diff.push({
            type: "added",
            newLineNumber: newLine,
            content: currLines[j],
          });
          j++;
          newLine++;
        }
      }
    }
  }

  return diff;
}

export function DiffViewer({ activeFile, onClose, onRevert }: DiffViewerProps) {
  const diffLines = useMemo(() => {
    return computeDiff(activeFile.originalContent, activeFile.content);
  }, [activeFile.originalContent, activeFile.content]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const line of diffLines) {
      if (line.type === "added") added++;
      if (line.type === "removed") removed++;
    }
    return { added, removed };
  }, [diffLines]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A0F] overflow-hidden select-none">
      {/* Diff Toolbar */}
      <div className="h-10 border-b border-[#21262D] bg-[#0E1117] px-4 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <GitCompare className="h-4 w-4 text-[#00F2FE]" />
          <span className="font-semibold text-white truncate max-w-[200px]">
            {activeFile.name}
          </span>
          <span className="text-[#6E7681] text-[11px] truncate max-w-[280px]">
            ({activeFile.path})
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3FB950]/15 text-[#3FB950] font-semibold">
              +{stats.added}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F85149]/15 text-[#F85149] font-semibold">
              -{stats.removed}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRevert && activeFile.isModified && (
            <button
              type="button"
              onClick={() => onRevert(activeFile.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white transition-colors text-[11px]"
              title="Discard unsaved changes for this file"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Discard Changes</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161B22] hover:bg-[#21262D] text-[#8B949E] hover:text-white border border-[#30363D] transition-colors text-[11px]"
          >
            <X className="h-3.5 w-3.5" />
            <span>Close Diff</span>
          </button>
        </div>
      </div>

      {/* Diff Content Lines */}
      <div className="flex-1 overflow-auto font-mono text-xs select-text">
        {diffLines.length === 0 || (!stats.added && !stats.removed) ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#8B949E]">
            <Check className="h-8 w-8 text-[#3FB950] mb-2" />
            <p className="font-semibold text-white text-sm">No Changes Detected</p>
            <p className="text-xs text-[#6E7681] mt-1">
              Working copy matches the last committed baseline for {activeFile.name}.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <tbody>
              {diffLines.map((line, idx) => {
                const isAdded = line.type === "added";
                const isRemoved = line.type === "removed";

                return (
                  <tr
                    key={idx}
                    className={cn(
                      "leading-5 transition-colors font-mono text-[11px]",
                      isAdded && "bg-[#3FB950]/10 text-[#7EE787]",
                      isRemoved && "bg-[#F85149]/10 text-[#FFA198]",
                      !isAdded && !isRemoved && "hover:bg-[#161B22]/50 text-[#C9D1D9]"
                    )}
                  >
                    {/* Old line number */}
                    <td className="w-10 px-2 py-0.5 text-right text-[#484F58] select-none border-r border-[#21262D]/40">
                      {line.oldLineNumber ?? ""}
                    </td>

                    {/* New line number */}
                    <td className="w-10 px-2 py-0.5 text-right text-[#484F58] select-none border-r border-[#21262D]/40">
                      {line.newLineNumber ?? ""}
                    </td>

                    {/* Change symbol */}
                    <td className="w-5 px-1 py-0.5 text-center select-none font-bold">
                      {isAdded && <Plus className="h-3 w-3 inline text-[#3FB950]" />}
                      {isRemoved && <Minus className="h-3 w-3 inline text-[#F85149]" />}
                    </td>

                    {/* Line content */}
                    <td className="px-3 py-0.5 whitespace-pre overflow-x-auto">
                      {line.content || " "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Diff Footer Note */}
      <div className="h-6 border-t border-[#21262D] bg-[#0E1117] px-4 flex items-center justify-between text-[10px] font-mono text-[#8B949E] shrink-0">
        <span>Unified Git Working Tree Diff</span>
        <span>Baseline: commit c9f28a1 (main)</span>
      </div>
    </div>
  );
}
