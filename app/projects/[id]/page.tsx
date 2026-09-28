import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { ProjectWorkspaceContainer } from "@/components/workspace/ProjectWorkspaceContainer";

interface ProjectWorkspacePageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams?:
    | Promise<{ initialPrompt?: string; mode?: string }>
    | { initialPrompt?: string; mode?: string };
}

export default async function ProjectWorkspacePage({
  params,
  searchParams,
}: ProjectWorkspacePageProps) {
  const { id } = await Promise.resolve(params);
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : undefined;
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <ProjectWorkspaceContainer
      initialProject={project}
      initialPrompt={resolvedSearchParams?.initialPrompt}
    />
  );
}

