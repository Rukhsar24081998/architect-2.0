"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Project, WorkspaceMode } from "./types";

interface WorkspaceContextType {
  mode: WorkspaceMode;
  setMode: (mode: WorkspaceMode) => void;
  toggleMode: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

const STORAGE_KEY_MODE = "architect_workspace_mode";
const STORAGE_KEY_SIDEBAR = "architect_sidebar_collapsed";

export function WorkspaceProvider({
  initialProject = null,
  children,
}: {
  initialProject?: Project | null;
  children: React.ReactNode;
}) {
  // Lazy initializers prevent setState inside useEffect
  const [mode, setModeState] = useState<WorkspaceMode>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_MODE) as WorkspaceMode;
        if (saved === "build" || saved === "dev") return saved;
      } catch {
        // LocalStorage unavailable
      }
    }
    return "build";
  });

  const [isSidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SIDEBAR);
        if (saved !== null) return saved === "true";
      } catch {
        // LocalStorage unavailable
      }
    }
    return false;
  });

  const [currentProject, setCurrentProject] = useState<Project | null>(initialProject);

  const setMode = useCallback((newMode: WorkspaceMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY_MODE, newMode);
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "build" ? "dev" : "build";
      try {
        localStorage.setItem(STORAGE_KEY_MODE, next);
      } catch {
        // LocalStorage unavailable
      }
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_SIDEBAR, String(next));
      } catch {
        // LocalStorage unavailable
      }
      return next;
    });
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    try {
      localStorage.setItem(STORAGE_KEY_SIDEBAR, String(collapsed));
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Keyboard shortcut listener: Cmd+M or Ctrl+M toggles mode
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMode();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMode]);

  return (
    <WorkspaceContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        isSidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        currentProject,
        setCurrentProject,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
