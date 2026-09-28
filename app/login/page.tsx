"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DEMO_PERSONAS } from "@/lib/auth";
import { Persona } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Layers,
  Sparkles,
  Terminal,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Boxes,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPersona } = useAuth();
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(
    DEMO_PERSONAS[0].id
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedPersona =
    DEMO_PERSONAS.find((p) => p.id === selectedPersonaId) || DEMO_PERSONAS[0];

  const getRedirectTarget = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("redirect") || "/dashboard";
    }
    return "/dashboard";
  };

  const handleContinue = (personaId?: string) => {
    setIsLoading(true);
    const targetPersonaId = personaId || selectedPersonaId;
    loginWithPersona(targetPersonaId);

    const redirectTarget = getRedirectTarget();
    setTimeout(() => {
      router.push(redirectTarget);
    }, 200);
  };

  const handleSimulatedOAuth = (provider: "github" | "google") => {
    setIsLoading(true);
    // GitHub defaults to Sarah (Engineer), Google defaults to Alex (Founder)
    const targetId =
      provider === "github" ? "usr_engineer_sarah" : "usr_founder_alex";
    loginWithPersona(targetId);

    const redirectTarget = getRedirectTarget();
    setTimeout(() => {
      router.push(redirectTarget);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-[#090A0F] text-[#F0F6FC] flex flex-col lg:flex-row">
      {/* ===================================================================== */}
      {/* Left Column: Product Positioning & Architectural Visualization       */}
      {/* ===================================================================== */}
      <div className="flex-1 bg-gradient-to-b from-[#0E1117] via-[#090A0F] to-[#090A0F] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#30363D]">
        {/* Brand Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[8px] bg-gradient-to-br from-[#00F2FE] via-[#4FACFE] to-[#A855F7] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <div className="h-full w-full bg-[#090A0F] rounded-[7px] flex items-center justify-center">
                <Layers className="h-5 w-5 text-[#00F2FE]" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">
                ARCHITECT <span className="text-[#00F2FE] font-mono text-xs">2.0</span>
              </span>
              <p className="text-[11px] text-[#8B949E] font-mono">
                AI-Native Software Development Workspace
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#00F2FE]/25 bg-[#00F2FE]/10 text-[#00F2FE] text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5" />
              <span>One Project. Two Adaptive Modes.</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Simple by default. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#A855F7]">
                Powerful when needed.
              </span>
            </h1>

            <p className="text-sm text-[#8B949E] leading-relaxed">
              Move seamlessly from natural language intent into production software.
              Whether you are a founder describing requirements or an engineer refactoring code,
              Architect adapts to your exact level of control.
            </p>
          </div>
        </div>

        {/* Architectural Flow Diagram */}
        <div className="my-8 py-6 border-y border-[#21262D]/70 space-y-4 max-w-lg">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#6E7681]">
            Adaptive Software Pipeline
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-[8px] bg-[#161B22]/80 border border-[#30363D] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00F2FE]">
                <Sparkles className="h-4 w-4" />
                <span>Build Mode</span>
              </div>
              <p className="text-[11px] text-[#8B949E] leading-relaxed">
                Natural language, transparent build plans, live preview, and instant deployment.
              </p>
            </div>

            <div className="p-3.5 rounded-[8px] bg-[#161B22]/80 border border-[#30363D] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A855F7]">
                <Terminal className="h-4 w-4" />
                <span>Developer Mode</span>
              </div>
              <p className="text-[11px] text-[#8B949E] leading-relaxed">
                Virtual file explorer, code editor, Git branches, terminal tests, and schema control.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#8B949E] px-1 pt-1">
            <span className="flex items-center gap-1.5">
              <Boxes className="h-3.5 w-3.5 text-[#00F2FE]" /> Human Intent
            </span>
            <span className="text-[#30363D]">&rarr;</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-[#A855F7]" /> Agent Swarm
            </span>
            <span className="text-[#30363D]">&rarr;</span>
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Production
            </span>
          </div>
        </div>

        {/* Footer Credibility */}
        <div className="flex items-center gap-2 text-xs text-[#6E7681]">
          <ShieldCheck className="h-4 w-4 text-[#10B981]" />
          <span>Evaluation Prototype • Local persistence active in /data</span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* Right Column: Persona Selection & Instant Sign In                     */}
      {/* ===================================================================== */}
      <div className="w-full lg:w-[480px] xl:w-[540px] bg-[#090A0F] p-8 sm:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Select Your Persona
            </h2>
            <p className="text-xs text-[#8B949E]">
              Choose how you want to experience Architect 2.0 today.
            </p>
          </div>

          {/* Persona Selection Cards */}
          <div className="space-y-3">
            {DEMO_PERSONAS.map((persona: Persona) => {
              const isSelected = selectedPersonaId === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => setSelectedPersonaId(persona.id)}
                  className={`p-3.5 rounded-[8px] border transition-all duration-150 cursor-pointer select-none ${
                    isSelected
                      ? persona.role === "engineer"
                        ? "bg-[#161B22] border-[#A855F7] shadow-[0_0_12px_rgba(168,85,247,0.15)] ring-1 ring-[#A855F7]/30"
                        : "bg-[#161B22] border-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.15)] ring-1 ring-[#00F2FE]/30"
                      : "bg-[#0E1117] border-[#30363D] hover:border-[#484F58] hover:bg-[#161B22]/60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={persona.avatar}
                      name={persona.name}
                      size="md"
                      status="online"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <h3 className="text-sm font-semibold text-white truncate">
                            {persona.name}
                          </h3>
                          <span className="text-[10px] text-[#8B949E]">
                            • {persona.title}
                          </span>
                        </div>

                        <Badge
                          variant={persona.role === "engineer" ? "violet" : "cyan"}
                          size="sm"
                        >
                          {persona.defaultMode === "dev" ? "⚡ Dev Mode" : "✨ Build Mode"}
                        </Badge>
                      </div>

                      <p className="mt-1 text-xs text-[#8B949E] leading-relaxed">
                        {persona.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Action Button */}
          <Button
            variant={selectedPersona.role === "engineer" ? "violet" : "cyan"}
            size="lg"
            className="w-full text-sm font-semibold py-3"
            isLoading={isLoading}
            onClick={() => handleContinue()}
            rightIcon={<ArrowRight className="h-4 w-4 ml-1" />}
          >
            Continue as {selectedPersona.name.split(" ")[0]} ({selectedPersona.defaultMode === "dev" ? "Developer Mode" : "Build Mode"})
          </Button>

          {/* Subtle Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#30363D]/60" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
              <span className="bg-[#090A0F] px-2 text-[#6E7681]">
                or simulated 1-click oauth
              </span>
            </div>
          </div>

          {/* Simulated OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="md"
              disabled={isLoading}
              onClick={() => handleSimulatedOAuth("github")}
              className="text-xs justify-center"
            >
              <svg className="h-4 w-4 mr-1.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              disabled={isLoading}
              onClick={() => handleSimulatedOAuth("google")}
              className="text-xs justify-center"
            >
              <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </Button>
          </div>

          <p className="text-[11px] text-[#6E7681] text-center pt-2 leading-relaxed">
            By continuing, you start an authenticated session with local prototype persistence.
            Switch personas anytime from the top navigation bar.
          </p>
        </div>
      </div>
    </div>
  );
}
