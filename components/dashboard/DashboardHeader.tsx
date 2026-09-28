"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export function DashboardHeader() {
  const { user, activePersona } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getSubtitle = () => {
    switch (user?.role) {
      case "founder":
        return "Here's what's happening across your products, builds, and live releases.";
      case "engineer":
        return "Here's what's happening across your repositories, active branches, and codebases.";
      case "builder":
      case "pm":
      default:
        return "Here's what's happening across your active projects and build iterations.";
    }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Builder";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30363D]">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          {activePersona && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-mono border border-[#30363D] bg-[#161B22] text-[#8B949E]">
              {activePersona.title}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[#8B949E] max-w-xl">
          {getSubtitle()}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Link href="/projects/new?tab=import">
          <Button
            variant="outline"
            size="md"
            leftIcon={<GithubIcon className="h-4 w-4 text-[#8B949E]" />}
            className="text-xs"
          >
            <span className="hidden md:inline">Import from</span> GitHub
          </Button>
        </Link>

        <Link href="/projects/new">
          <Button
            variant="cyan"
            size="md"
            leftIcon={<Plus className="h-4 w-4" />}
            className="text-xs font-semibold"
          >
            New Project
          </Button>
        </Link>
      </div>
    </div>
  );
}
