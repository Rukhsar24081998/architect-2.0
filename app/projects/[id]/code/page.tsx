import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { DeveloperWorkspace } from "@/components/developer/DeveloperWorkspace";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectCodePage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  const buildPlans = await storage.getBuildPlans(id);
  const agentRuns = await storage.getAgentRuns(id);

  return (
    <DeveloperWorkspace
      project={project}
      initialPlans={buildPlans}
      initialRuns={agentRuns}
    />
  );
}
