"use client";

import React, { useEffect } from "react";
import { ProjectDetails } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-context";
import { AIWorkspace } from "./AIWorkspace";
import { DeveloperWorkspace } from "@/components/developer/DeveloperWorkspace";

export interface ProjectWorkspaceContainerProps {
  initialProject: ProjectDetails;
  initialPrompt?: string;
}

export function ProjectWorkspaceContainer({
  initialProject,
  initialPrompt,
}: ProjectWorkspaceContainerProps) {
  const { mode, setMode } = useWorkspace();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "build") {
        setMode("build");
      }
    }
  }, [setMode]);

  if (mode === "dev") {
    return <DeveloperWorkspace project={initialProject} />;
  }

  return (
    <AIWorkspace
      initialProject={initialProject}
      initialPrompt={initialPrompt}
    />
  );
}

