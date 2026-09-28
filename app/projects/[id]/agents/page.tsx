import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { AgentCommandCenter } from "@/components/agents/AgentCommandCenter";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectAgentsPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  const buildPlans = await storage.getBuildPlans(id);
  const agentRuns = await storage.getAgentRuns(id);

  return (
    <AgentCommandCenter
      project={project}
      initialPlans={buildPlans}
      initialRuns={agentRuns}
    />
  );
}
