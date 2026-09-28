import React from "react";
import { storage } from "@/lib/storage";
import { AppShell } from "@/components/layout/AppShell";

interface ProjectLayoutProps {
  params: Promise<{ id: string }> | { id: string };
  children: React.ReactNode;
}

export default async function ProjectLayout({
  params,
  children,
}: ProjectLayoutProps) {
  const { id } = await Promise.resolve(params);
  const project = await storage.getProjectById(id);

  return (
    <AppShell initialProject={project}>
      {children}
    </AppShell>
  );
}
