import React, { Suspense } from "react";
import { Metadata } from "next";
import { ProjectCreationStudio } from "@/components/projects/ProjectCreationStudio";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "New Project | Architect 2.0 Studio",
  description: "Start a new project from an idea or import an existing repository.",
};

function LoadingStudio() {
  return (
    <div className="min-h-screen w-full bg-[#090A0F] text-[#F0F6FC] flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 text-[#00F2FE] animate-spin" />
        <span className="text-sm font-medium text-[#8B949E]">
          Loading Project Creation Studio...
        </span>
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<LoadingStudio />}>
      <ProjectCreationStudio />
    </Suspense>
  );
}
