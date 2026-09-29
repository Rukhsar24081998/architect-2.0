import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { DeploymentsStudio } from "@/components/studios/DeploymentsStudio";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectDeploymentsPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  return <DeploymentsStudio project={project} />;
}
