import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { EnvironmentStudio } from "@/components/studios/EnvironmentStudio";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectEnvironmentPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  return <EnvironmentStudio project={project} />;
}
