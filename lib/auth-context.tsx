"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Persona, User } from "./types";
import {
  DEMO_PERSONAS,
  getPersonaById,
  personaToUser,
  removeStoredUser,
  setStoredUser,
  AUTH_STORAGE_KEY,
} from "./auth";

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  activePersona: Persona | undefined;
  loginWithPersona: (personaId: string) => User;
  switchPersona: (personaId: string) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_USER = personaToUser(DEMO_PERSONAS[0]);

function subscribeAuth(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("architect-auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("architect-auth-change", callback);
  };
}

function getStoredUserRaw(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AUTH_STORAGE_KEY) || "";
}

function getServerRaw(): string {
  return "";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const rawSession = useSyncExternalStore(subscribeAuth, getStoredUserRaw, getServerRaw);
  const [fallbackUser, setFallbackUser] = useState<User>(() => DEFAULT_USER);

  // Compute active user deterministically
  const user: User = useMemo(() => {
    if (!rawSession) return fallbackUser;
    try {
      const parsed = JSON.parse(rawSession) as User;
      if (parsed && parsed.name) {
        return {
          ...parsed,
          avatar:
            parsed.avatar && !parsed.avatar.includes("unsplash.com")
              ? parsed.avatar
              : "",
        };
      }
    } catch {
      // ignore
    }
    return fallbackUser;
  }, [rawSession, fallbackUser]);

  const loginWithPersona = useCallback((personaId: string): User => {
    const persona = getPersonaById(personaId) || DEMO_PERSONAS[0];
    const newUser = personaToUser(persona);
    setFallbackUser(newUser);
    setStoredUser(newUser);

    try {
      localStorage.setItem("architect_workspace_mode", persona.defaultMode);
      window.dispatchEvent(new Event("architect-auth-change"));
    } catch {
      // LocalStorage unavailable
    }

    return newUser;
  }, []);

  const switchPersona = useCallback(
    (personaId: string): User => {
      return loginWithPersona(personaId);
    },
    [loginWithPersona]
  );

  const logout = useCallback(() => {
    removeStoredUser();
    setFallbackUser(DEFAULT_USER);
    try {
      window.dispatchEvent(new Event("architect-auth-change"));
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const activePersona: Persona | undefined = useMemo(() => {
    return (
      DEMO_PERSONAS.find((p) => p.id === user.id) || {
        id: user.id,
        name: user.name,
        role: user.role,
        title:
          user.role === "founder"
            ? "Founder"
            : user.role === "engineer"
            ? "Engineer"
            : "Builder",
        tagline: "Active User",
        email: user.email,
        avatar: user.avatar,
        defaultMode: user.preferredMode,
        description: "",
      }
    );
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
        isLoading: false,
        activePersona,
        loginWithPersona,
        switchPersona,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
