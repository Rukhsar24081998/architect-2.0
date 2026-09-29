import React from "react";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { SettingsStudio } from "@/components/studios/SettingsStudio";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectSettingsPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  if (!project) {
    notFound();
  }

  return <SettingsStudio project={project} />;
}
