"use client";

import React, { useState } from "react";
import { ProjectDetails } from "@/lib/types";
import {
  Plug,
  Database,
  Cpu,
  CreditCard,
  Mail,
  ShieldCheck,
  Power,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

interface IntegrationsStudioProps {
  project: ProjectDetails;
}

interface ConnectorItem {
  id: string;
  name: string;
  purpose: string;
  category: string;
  description: string;
  status: "connected" | "disconnected";
  icon: React.ElementType;
  iconColor: string;
  docsUrl: string;
}

export function IntegrationsStudio({ project }: IntegrationsStudioProps) {
  const { addToast } = useToast();

  const [connectors, setConnectors] = useState<ConnectorItem[]>([
    {
      id: "supabase",
      name: "Supabase",
      purpose: "Database & Auth",
      category: "Infrastructure",
      description:
        "Managed PostgreSQL database, Row Level Security, and secure session management.",
      status: "connected",
      icon: Database,
      iconColor: "#10B981",
      docsUrl: "https://supabase.com/docs",
    },
    {
      id: "groq",
      name: "Groq",
      purpose: "AI Model Provider",
      category: "Artificial Intelligence",
      description:
        "Ultra-low latency inference engine running Llama 3.3 70B for conversational Build Mode.",
      status: "connected",
      icon: Cpu,
      iconColor: "#00F2FE",
      docsUrl: "https://groq.com/docs",
    },
    {
      id: "stripe",
      name: "Stripe",
      purpose: "Payments",
      category: "Monetization",
      description:
        "Customer checkout sessions, subscription tier billing, and recurring invoice webhooks.",
      status: "disconnected",
      icon: CreditCard,
      iconColor: "#58A6FF",
      docsUrl: "https://stripe.com/docs",
    },
    {
      id: "resend",
      name: "Resend",
      purpose: "Email",
      category: "Communication",
      description:
        "Automated customer ticket notifications, status alerts, and transactional delivery.",
      status: "disconnected",
      icon: Mail,
      iconColor: "#A855F7",
      docsUrl: "https://resend.com/docs",
    },
  ]);

  const connectedCount = connectors.filter((c) => c.status === "connected").length;

  const handleToggleConnect = (connector: ConnectorItem) => {
    const isConnecting = connector.status === "disconnected";
    const nextStatus: "connected" | "disconnected" = isConnecting
      ? "connected"
      : "disconnected";

    setConnectors((prev) =>
      prev.map((c) => (c.id === connector.id ? { ...c, status: nextStatus } : c))
    );

    if (isConnecting) {
      addToast({
        type: "success",
        title: "Integration Connected",
        message: `${connector.name} successfully connected to ${project.name}.`,
      });
    } else {
      addToast({
        type: "info",
        title: "Integration Disconnected",
        message: `${connector.name} credentials unlinked.`,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#21262D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-[#161B22] border border-[#30363D] text-[#00F2FE]">
              <Plug className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#F0F6FC] tracking-tight">Integrations</h1>
                <Badge variant="cyan" size="sm">
                  {connectedCount} of {connectors.length} Connected
                </Badge>
              </div>
              <p className="text-xs text-[#8B949E]">
                Connect external cloud services, AI providers, and billing engines.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Secrets Note */}
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-[6px] bg-[#161B22] border border-[#30363D] text-[#8B949E]">
          <ShieldCheck className="h-4 w-4 text-[#10B981]" />
          <span>Encrypted Credentials</span>
          <span className="text-[#30363D]">|</span>
          <span className="text-[#F0F6FC] font-semibold">Zero-Trust Vault</span>
        </div>
      </div>

      {/* Connector Grid (2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectors.map((connector) => {
          const Icon = connector.icon;
          const isConnected = connector.status === "connected";

          return (
            <Card
              key={connector.id}
              className={`border transition-all ${
                isConnected
                  ? "border-[#30363D] bg-[#0E1117] hover:border-[#484F58]"
                  : "border-[#21262D] bg-[#0E1117]/60 hover:border-[#30363D]"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-[8px] border border-[#30363D] bg-[#161B22]"
                      style={{ color: connector.iconColor }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#F0F6FC]">
                          {connector.name}
                        </span>
                        <Badge
                          variant={isConnected ? "success" : "secondary"}
                          size="sm"
                          dot
                        >
                          {isConnected ? "Connected" : "Not connected"}
                        </Badge>
                      </div>
                      <span className="text-xs text-[#6E7681] font-mono">
                        {connector.purpose}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#8B949E] leading-relaxed">
                  {connector.description}
                </p>

                {/* Footer Action Bar */}
                <div className="pt-3 border-t border-[#21262D] flex items-center justify-between">
                  <span className="text-[11px] text-[#6E7681] font-mono">
                    Category: {connector.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleToggleConnect(connector)}
                        leftIcon={<Power className="h-3 w-3 text-[#10B981]" />}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleToggleConnect(connector)}
                        leftIcon={<Plug className="h-3 w-3 text-[#00F2FE]" />}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
