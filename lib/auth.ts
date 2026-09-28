import { Persona, User } from "./types";

export const DEMO_PERSONAS: Persona[] = [
  {
    id: "usr_founder_alex",
    name: "Alex Morgan",
    role: "founder",
    title: "Founder & CEO",
    tagline: "Vision-driven & non-technical",
    email: "alex.morgan@stealth.ai",
    avatar: "",
    defaultMode: "build",
    description: "Describe what you want to build. Architect handles the technical details.",
  },
  {
    id: "usr_builder_jordan",
    name: "Jordan Lee",
    role: "builder",
    title: "Product Architect",
    tagline: "Product-focused & iterative",
    email: "jordan.lee@productflow.io",
    avatar: "",
    defaultMode: "build",
    description: "Turn product ideas into working software with AI assistance.",
  },
  {
    id: "usr_engineer_sarah",
    name: "Sarah Chen",
    role: "engineer",
    title: "Staff Software Engineer",
    tagline: "Systems, APIs & Architecture",
    email: "sarah.chen@fintech.io",
    avatar: "",
    defaultMode: "dev",
    description: "Work directly with code, agents, environments and infrastructure.",
  },
];

export const AUTH_STORAGE_KEY = "architect_auth_session";

export function getPersonaById(id: string): Persona | undefined {
  return DEMO_PERSONAS.find((p) => p.id === id);
}

export function personaToUser(persona: Persona): User {
  return {
    id: persona.id,
    name: persona.name,
    email: persona.email,
    role: persona.role,
    avatar: persona.avatar || "",
    preferredMode: persona.defaultMode,
  };
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    if (parsed && parsed.avatar && parsed.avatar.includes("unsplash.com")) {
      parsed.avatar = "";
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // ignore
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn("Failed to persist user session:", err);
  }
}

export function removeStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear user session:", err);
  }
}
