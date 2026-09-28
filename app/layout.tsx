import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Architect 2.0 — AI-Native Software Development Workspace",
  description: "Simple by default. Powerful when needed. From human intent to production deployment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090A0F] text-[#F0F6FC] antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
