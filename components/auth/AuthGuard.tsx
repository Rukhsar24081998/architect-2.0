"use client";

import React, { useSyncExternalStore, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

const emptySubscribe = () => () => {};

function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      // Store redirect target if desired, then navigate to login
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, isLoading, isAuthenticated, router, pathname]);

  // During SSR and before initial client mount, render children to preserve SSR markup and prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#090A0F] text-[#F0F6FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#00F2FE]" />
          <p className="text-xs text-[#8B949E] font-mono">Verifying workspace session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#090A0F] text-[#F0F6FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#00F2FE]" />
          <p className="text-xs text-[#8B949E] font-mono">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
