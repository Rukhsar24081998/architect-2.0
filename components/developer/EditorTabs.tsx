"use client";

import React from "react";
import { EditorTab } from "@/lib/developer/types";
import { cn } from "@/lib/utils";
import {
  FileCode2,
  FileText,
  FileJson,
  X,
  FileCode,
} from "lucide-react";

interface EditorTabsProps {
  openTabs: EditorTab[];
  activeFileId: string | null;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string, e: React.MouseEvent) => void;
}

function getFileTabIcon(lang: EditorTab["language"]) {
  switch (lang) {
    case "tsx":
    case "jsx":
      return <FileCode2 className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />;
    case "typescript":
    case "javascript":
      return <FileCode className="h-3.5 w-3.5 text-[#00F2FE] shrink-0" />;
    case "json":
      return <FileJson className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />;
    case "css":
      return <FileCode2 className="h-3.5 w-3.5 text-[#A855F7] shrink-0" />;
    default:
      return <FileText className="h-3.5 w-3.5 text-[#8B949E] shrink-0" />;
  }
}

export function EditorTabs({
  openTabs,
  activeFileId,
  onSelectTab,
  onCloseTab,
}: EditorTabsProps) {
  if (openTabs.length === 0) {
    return (
      <div className="h-9 border-b border-[#21262D] bg-[#0E1117] flex items-center px-4 text-xs font-mono text-[#6E7681] select-none">
        No active editor tab
      </div>
    );
  }

  return (
    <div className="h-9 border-b border-[#21262D] bg-[#0E1117] flex items-center overflow-x-auto select-none no-scrollbar">
      {openTabs.map((tab) => {
        const isActive = tab.fileId === activeFileId;

        return (
          <div
            key={tab.fileId}
            onClick={() => onSelectTab(tab.fileId)}
            className={cn(
              "group h-full flex items-center gap-2 px-3 border-r border-[#21262D] text-xs font-mono cursor-pointer transition-colors relative shrink-0",
              isActive
                ? "bg-[#090A0F] text-white border-t-2 border-t-[#00F2FE] font-medium"
                : "bg-[#161B22]/60 text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]"
            )}
          >
            {/* File Icon */}
            {getFileTabIcon(tab.language)}

            {/* File Name */}
            <span className="truncate max-w-[140px]">{tab.fileName}</span>

            {/* Modified Dot / Close Button */}
            <div className="flex items-center ml-1">
              {tab.isModified ? (
                <span
                  onClick={(e) => onCloseTab(tab.fileId, e)}
                  className="h-2 w-2 rounded-full bg-[#F59E0B] group-hover:hidden"
                  title="Unsaved changes"
                />
              ) : null}

              <button
                type="button"
                onClick={(e) => onCloseTab(tab.fileId, e)}
                className={cn(
                  "p-0.5 rounded text-[#6E7681] hover:text-white hover:bg-[#21262D] transition-colors",
                  tab.isModified ? "hidden group-hover:block" : "block"
                )}
                title="Close Tab"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
