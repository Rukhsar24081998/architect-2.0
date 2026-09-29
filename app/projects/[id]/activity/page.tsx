import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { ActivityStudio } from "@/components/studios/ActivityStudio";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectActivityPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ActivityStudio project={project} />;
}
