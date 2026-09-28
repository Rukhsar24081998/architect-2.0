import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { PreviewWorkspace } from "@/components/preview/PreviewWorkspace";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<{ planId?: string }> | { planId?: string };
}

export default async function ProjectPreviewPage({ params, searchParams }: PageProps) {
  const { id } = await Promise.resolve(params);
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  const buildPlans = await storage.getBuildPlans(id);
  const agentRuns = await storage.getAgentRuns(id);

  return (
    <PreviewWorkspace
      project={project}
      initialPlans={buildPlans}
      initialRuns={agentRuns}
      selectedPlanId={resolvedSearchParams.planId}
    />
  );
}
