"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/lib/workspace-context";
import { useAuth } from "@/lib/auth-context";
import { DEMO_PERSONAS } from "@/lib/auth";
import { ModeToggle } from "./ModeToggle";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownDivider,
} from "@/components/ui/Dropdown";
import {
  Layers,
  ChevronDown,
  GitBranch,
  Bot,
  User,
  Settings,
  LogOut,
  FolderGit2,
  Check,
} from "lucide-react";

export function TopNav() {
  const router = useRouter();
  const { currentProject, mode, setMode } = useWorkspace();
  const { user, activePersona, switchPersona, logout } = useAuth();

  const handleSwitchPersona = (personaId: string) => {
    const updatedUser = switchPersona(personaId);
    setMode(updatedUser.preferredMode);
  };

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-12 w-full border-b border-[#30363D] bg-[#0E1117] px-3 sm:px-4 flex items-center justify-between z-40 select-none shrink-0">
      {/* Left: Brand & Project Context */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group transition-opacity hover:opacity-90 shrink-0"
        >
          <div className="h-7 w-7 rounded-[6px] bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#A855F7] p-0.5 flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.3)]">
            <div className="h-full w-full bg-[#090A0F] rounded-[5px] flex items-center justify-center">
              <Layers className="h-4 w-4 text-[#00F2FE] transition-transform group-hover:scale-105" />
            </div>
          </div>
          <span className="font-bold text-sm tracking-tight text-white hidden sm:inline-block">
            ARCHITECT <span className="text-[#00F2FE] font-mono text-xs">2.0</span>
          </span>
        </Link>

        {currentProject && (
          <>
            <div className="h-4 w-[1px] bg-[#30363D] hidden sm:block shrink-0" />

            {/* Project Quick Info */}
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href={`/projects/${currentProject.id}`}
                className="text-xs font-medium text-[#F0F6FC] hover:text-[#00F2FE] transition-colors truncate max-w-[140px] sm:max-w-[200px]"
                title={currentProject.name}
              >
                {currentProject.name}
              </Link>

              {mode === "dev" && (
                <Badge variant="outline" size="sm" className="hidden md:inline-flex items-center gap-1 font-mono">
                  <GitBranch className="h-3 w-3 text-[#8B949E]" />
                  <span>{currentProject.currentBranch || "main"}</span>
                </Badge>
              )}
            </div>
          </>
        )}
      </div>

      {/* Center: Tactile Mode Toggle */}
      <div className="flex items-center justify-center">
        <ModeToggle />
      </div>

      {/* Right: Status, AI Activity & User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {currentProject && mode === "dev" && (
          <div className="hidden lg:flex items-center gap-2">
            <StatusIndicator status={currentProject.status} />
            <Badge
              variant="violet"
              size="sm"
              dot
              className="hidden xl:inline-flex items-center gap-1"
            >
              <Bot className="h-3 w-3" />
              <span>Agent Swarm Ready</span>
            </Badge>
          </div>
        )}

        {mode === "dev" && (
          <div className="h-4 w-[1px] bg-[#30363D] hidden lg:block shrink-0" />
        )}

        {/* User Persona Profile Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-2 p-1 rounded-[6px] hover:bg-[#161B22] transition-colors cursor-pointer">
              <Avatar
                name={user.name}
                size="sm"
                status="online"
                src={user.avatar}
              />
              {mode === "dev" && (
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-medium text-[#F0F6FC] leading-none truncate max-w-[90px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#8B949E] capitalize leading-tight">
                    {user.role}
                  </span>
                </div>
              )}
              <ChevronDown className="h-3 w-3 text-[#8B949E]" />
            </div>
          </DropdownTrigger>
          <DropdownContent align="right" className="w-64">
            <div className="px-3 py-2 border-b border-[#30363D]/60 mb-1">
              <p className="text-xs font-semibold text-white">{user?.name || "Demo User"}</p>
              <p className="text-[11px] text-[#8B949E] truncate">{user?.email || "demo@architect.ai"}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge
                  variant={user?.role === "engineer" ? "violet" : "cyan"}
                  size="sm"
                >
                  {activePersona?.title || user?.role}
                </Badge>
              </div>
            </div>

            <DropdownItem onClick={() => router.push("/dashboard")}>
              <FolderGit2 className="h-3.5 w-3.5 text-[#8B949E]" />
              <span>Projects Dashboard</span>
            </DropdownItem>

            <DropdownItem onClick={() => router.push("/settings")}>
              <Settings className="h-3.5 w-3.5 text-[#8B949E]" />
              <span>Workspace Settings</span>
            </DropdownItem>

            <DropdownDivider />

            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#6E7681]">
              Switch Persona
            </div>

            {DEMO_PERSONAS.map((persona) => {
              const isCurrent = user?.id === persona.id;
              return (
                <DropdownItem
                  key={persona.id}
                  onClick={() => handleSwitchPersona(persona.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <User
                      className={`h-3.5 w-3.5 ${
                        persona.role === "engineer"
                          ? "text-[#A855F7]"
                          : "text-[#00F2FE]"
                      }`}
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-medium text-white">
                        {persona.name}
                      </span>
                      <span className="text-[10px] text-[#8B949E]">
                        {persona.role === "engineer" ? "Engineer (Dev Mode)" : "Founder/PM (Build Mode)"}
                      </span>
                    </div>
                  </div>
                  {isCurrent && <Check className="h-3.5 w-3.5 text-[#10B981]" />}
                </DropdownItem>
              );
            })}

            <DropdownDivider />

            <DropdownItem destructive onClick={handleSignOut}>
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  );
}
