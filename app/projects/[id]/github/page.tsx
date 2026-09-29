import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { GitHubStudio } from "@/components/studios/GitHubStudio";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectGitHubPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  return <GitHubStudio project={project} />;
}
