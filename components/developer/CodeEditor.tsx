"use client";

import React, { useRef, useState } from "react";
import { VirtualFile } from "@/lib/developer/types";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  activeFile: VirtualFile | null;
  onContentChange: (fileId: string, newContent: string) => void;
  onSave?: () => void;
}

export function CodeEditor({
  activeFile,
  onContentChange,
  onSave,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Sync scrolling between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Track cursor position for status bar
  const handleSelect = () => {
    const el = textareaRef.current;
    if (!el) return;
    const textBefore = el.value.substring(0, el.selectionStart);
    const lines = textBefore.split("\n");
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorPos({ line, col });
  };

  // Keyboard shortcut: Ctrl+S / Cmd+S to save, Tab to indent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      onSave?.();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el || !activeFile) return;

      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = el.value;

      const newVal = val.substring(0, start) + "  " + val.substring(end);
      onContentChange(activeFile.id, newVal);

      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + 2;
        handleSelect();
      }, 0);
    }
  };

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8B949E] bg-[#090A0F] select-none">
        <p className="text-xs font-mono">Select a file from the explorer to view and edit source code.</p>
      </div>
    );
  }

  const lines = activeFile.content.split("\n");
  const lineCount = lines.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090A0F] overflow-hidden">
      {/* Editor Body: Line Numbers + Textarea */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-xs">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 py-3 pr-3 text-right bg-[#090A0F] text-[#484F58] border-r border-[#21262D] select-none overflow-hidden shrink-0"
        >
          {Array.from({ length: lineCount }).map((_, i) => {
            const lineNum = i + 1;
            const isCurrent = lineNum === cursorPos.line;
            return (
              <div
                key={lineNum}
                className={cn(
                  "h-5 leading-5 font-mono text-[11px] transition-colors",
                  isCurrent ? "text-[#00F2FE] font-bold" : "text-[#484F58]"
                )}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Textarea Input Container */}
        <div className="flex-1 h-full overflow-hidden relative">
          <textarea
            ref={textareaRef}
            value={activeFile.content}
            onChange={(e) => onContentChange(activeFile.id, e.target.value)}
            onScroll={handleScroll}
            onSelect={handleSelect}
            onClick={handleSelect}
            onKeyUp={handleSelect}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="w-full h-full p-3 bg-transparent text-[#E6EDF3] leading-5 text-xs font-mono resize-none focus:outline-none focus:ring-0 border-none whitespace-pre overflow-auto"
            style={{ tabSize: 2 }}
          />
        </div>
      </div>

      {/* Editor Status Bar */}
      <div className="h-6 border-t border-[#21262D] bg-[#0E1117] px-3 flex items-center justify-between text-[10px] font-mono text-[#8B949E] select-none shrink-0 overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
          <span className="whitespace-nowrap">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="text-[#30363D]">|</span>
          <span className="whitespace-nowrap">{lineCount} lines</span>
          {activeFile.isModified && (
            <>
              <span className="text-[#30363D]">|</span>
              <span className="text-[#F59E0B] font-semibold whitespace-nowrap">● Modified</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
          <span className="hidden sm:inline whitespace-nowrap">Spaces: 2</span>
          <span className="text-[#30363D] hidden sm:inline">|</span>
          <span className="hidden md:inline whitespace-nowrap">UTF-8</span>
          <span className="text-[#30363D] hidden md:inline">|</span>
          <span className="text-[#00F2FE] capitalize whitespace-nowrap">{activeFile.language}</span>
        </div>
      </div>
    </div>
  );
}
