"use client";

import React from "react";
import { Project } from "@/lib/types";
import { WorkspaceProvider } from "@/lib/workspace-context";
import { ToastProvider } from "@/components/ui/Toast";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";

export interface AppShellProps {
  initialProject?: Project | null;
  children: React.ReactNode;
}

export function AppShell({ initialProject = null, children }: AppShellProps) {
  return (
    <ToastProvider>
      <WorkspaceProvider initialProject={initialProject}>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090A0F] text-[#F0F6FC]">
          {/* Global Compact Top Navigation */}
          <TopNav />

          {/* Body: Side Navigation + Main Workspace Stage */}
          <div className="flex flex-1 overflow-hidden min-h-0">
            <SideNav />
            <main className="flex-1 overflow-y-auto bg-[#090A0F] relative focus:outline-none">
              {children}
            </main>
          </div>
        </div>
      </WorkspaceProvider>
    </ToastProvider>
  );
}
