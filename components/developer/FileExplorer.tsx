"use client";

import React, { useState, useMemo } from "react";
import { VirtualDirectory, VirtualFile } from "@/lib/developer/types";
import { cn } from "@/lib/utils";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileCode2,
  FileCode,
  FileJson,
  FileText,
  Search,
  X,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

interface FileExplorerProps {
  rootDirectory: VirtualDirectory;
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  allFiles: Record<string, VirtualFile>;
}

function getFileIcon(lang: VirtualFile["language"], name: string) {
  if (name.endsWith(".svg") || name.endsWith(".png") || name.endsWith(".ico")) {
    return <ImageIcon className="h-3.5 w-3.5 text-[#3FB950] shrink-0" />;
  }
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
    case "markdown":
      return <FileText className="h-3.5 w-3.5 text-[#8B949E] shrink-0" />;
    default:
      return <FileText className="h-3.5 w-3.5 text-[#8B949E] shrink-0" />;
  }
}

interface TreeDirectoryItemProps {
  dir: VirtualDirectory;
  level: number;
  openPaths: Set<string>;
  onTogglePath: (path: string) => void;
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
}

function TreeDirectoryItem({
  dir,
  level,
  openPaths,
  onTogglePath,
  activeFileId,
  onSelectFile,
}: TreeDirectoryItemProps) {
  const isOpen = openPaths.has(dir.path);

  return (
    <div className="select-none font-mono text-xs">
      {/* Folder Row */}
      <div
        onClick={() => onTogglePath(dir.path)}
        className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#161B22]/70 cursor-pointer text-[#C9D1D9] hover:text-white transition-colors group"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <span className="text-[#6E7681] group-hover:text-[#8B949E]">
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>

        {isOpen ? (
          <FolderOpen className="h-3.5 w-3.5 text-[#00F2FE] shrink-0" />
        ) : (
          <Folder className="h-3.5 w-3.5 text-[#8B949E] shrink-0 group-hover:text-[#C9D1D9]" />
        )}

        <span className="truncate text-xs font-medium">{dir.name}</span>
      </div>

      {/* Sub-tree */}
      {isOpen && (
        <div>
          {/* Subdirectories */}
          {dir.subdirectories.map((subDir) => (
            <TreeDirectoryItem
              key={subDir.path}
              dir={subDir}
              level={level + 1}
              openPaths={openPaths}
              onTogglePath={onTogglePath}
              activeFileId={activeFileId}
              onSelectFile={onSelectFile}
            />
          ))}

          {/* Files in this directory */}
          {dir.files.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={cn(
                  "flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors group",
                  isActive
                    ? "bg-[#161B22] text-white border-l-2 border-l-[#00F2FE] font-medium"
                    : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]/50 border-l-2 border-l-transparent"
                )}
                style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {getFileIcon(file.language, file.name)}
                  <span className="truncate text-xs">{file.name}</span>
                </div>

                {file.isModified && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] shrink-0"
                    title="Modified file"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({
  rootDirectory,
  activeFileId,
  onSelectFile,
  allFiles,
}: FileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openPaths, setOpenPaths] = useState<Set<string>>(() => {
    const paths = new Set<string>();
    // Open src, src/app, src/components, src/components/dashboard by default
    paths.add("src");
    paths.add("src/app");
    paths.add("src/components");
    paths.add("src/components/dashboard");
    return paths;
  });

  const togglePath = (path: string) => {
    setOpenPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  // Filtered files when searching
  const filteredFileList = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return Object.values(allFiles).filter(
      (file) =>
        file.name.toLowerCase().includes(query) ||
        file.path.toLowerCase().includes(query)
    );
  }, [searchQuery, allFiles]);

  return (
    <div className="h-full flex flex-col bg-[#0E1117] border-r border-[#21262D] select-none overflow-hidden">
      {/* Explorer Top Toolbar */}
      <div className="h-9 px-3 border-b border-[#21262D] flex items-center justify-between text-xs font-mono text-[#8B949E] shrink-0">
        <span className="uppercase text-[10px] font-semibold tracking-wider text-[#6E7681]">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              // Expand all or reset
              setOpenPaths(
                new Set([
                  "src",
                  "src/app",
                  "src/components",
                  "src/components/dashboard",
                  "src/components/ui",
                  "src/lib",
                  "src/styles",
                  "public",
                ])
              );
            }}
            className="p-1 rounded text-[#6E7681] hover:text-[#C9D1D9] hover:bg-[#161B22]"
            title="Expand All Folders"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Quick Search / Filter Input */}
      <div className="p-2 border-b border-[#21262D] shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-[#6E7681]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-8 pr-7 py-1 text-xs font-mono bg-[#161B22] text-white border border-[#30363D] rounded focus:outline-none focus:border-[#00F2FE] placeholder-[#6E7681]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 text-[#6E7681] hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tree or Search Results */}
      <div className="flex-1 overflow-y-auto p-1.5 no-scrollbar">
        {filteredFileList ? (
          <div className="space-y-0.5 font-mono text-xs">
            <div className="px-2 py-1 text-[10px] text-[#6E7681] uppercase tracking-wider">
              {filteredFileList.length} matches found
            </div>
            {filteredFileList.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-[#6E7681]">
                No files match &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredFileList.map((file) => {
                const isActive = file.id === activeFileId;
                return (
                  <div
                    key={file.id}
                    onClick={() => onSelectFile(file.id)}
                    className={cn(
                      "flex items-center justify-between py-1.5 px-2 rounded cursor-pointer transition-colors",
                      isActive
                        ? "bg-[#161B22] text-white border-l-2 border-l-[#00F2FE]"
                        : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]/50 border-l-2 border-l-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(file.language, file.name)}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-xs text-white">{file.name}</span>
                        <span className="truncate text-[10px] text-[#6E7681]">
                          {file.path}
                        </span>
                      </div>
                    </div>
                    {file.isModified && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-0.5">
            {/* Root Project Label */}
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-semibold text-[#8B949E] uppercase tracking-wider">
              <span>{rootDirectory.name}</span>
            </div>

            {/* Subdirectories */}
            {rootDirectory.subdirectories.map((dir) => (
              <TreeDirectoryItem
                key={dir.path}
                dir={dir}
                level={0}
                openPaths={openPaths}
                onTogglePath={togglePath}
                activeFileId={activeFileId}
                onSelectFile={onSelectFile}
              />
            ))}

            {/* Root Files (package.json, README.md, etc.) */}
            {rootDirectory.files.map((file) => {
              const isActive = file.id === activeFileId;
              return (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file.id)}
                  className={cn(
                    "flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors font-mono text-xs group",
                    isActive
                      ? "bg-[#161B22] text-white border-l-2 border-l-[#00F2FE] font-medium"
                      : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]/50 border-l-2 border-l-transparent"
                  )}
                  style={{ paddingLeft: "14px" }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getFileIcon(file.language, file.name)}
                    <span className="truncate text-xs">{file.name}</span>
                  </div>

                  {file.isModified && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] shrink-0"
                      title="Modified file"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
