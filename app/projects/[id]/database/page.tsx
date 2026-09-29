import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { DatabaseStudio } from "@/components/studios/DatabaseStudio";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectDatabasePage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  return <DatabaseStudio project={project} />;
}
