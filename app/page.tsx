import Link from "next/link";
import { Sparkles, ArrowRight, Layers, LogIn } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-[#090A0F] text-[#F0F6FC]">
      <div className="max-w-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE] text-xs font-mono">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Architect 2.0 • Phase 3 Authentication & Onboarding Ready</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Simple by default. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#A855F7]">
              Powerful when needed.
            </span>
          </h1>
          <p className="text-sm text-[#8B949E] max-w-lg mx-auto">
            AI-native software development workspace bridging non-technical founders and senior software engineers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[6px] bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] px-5 py-2.5 text-sm font-semibold text-[#090A0F] transition hover:opacity-95 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In / Choose Persona</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#30363D] bg-[#161B22] px-5 py-2.5 text-sm font-medium text-[#C9D1D9] transition hover:bg-[#21262D] hover:text-white"
          >
            <Layers className="h-4 w-4 text-[#8B949E]" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/projects/prj_supportdesk"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#30363D] bg-[#161B22] px-5 py-2.5 text-sm font-medium text-[#C9D1D9] transition hover:bg-[#21262D] hover:text-white"
          >
            <span>Demo Project</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
