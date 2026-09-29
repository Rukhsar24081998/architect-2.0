import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { IntegrationsStudio } from "@/components/studios/IntegrationsStudio";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectIntegrationsPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  return <IntegrationsStudio project={project} />;
}
