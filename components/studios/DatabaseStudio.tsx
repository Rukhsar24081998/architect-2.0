"use client";

import React, { useState } from "react";
import { ProjectDetails } from "@/lib/types";
import {
  Database,
  Table as TableIcon,
  Key,
  Link as LinkIcon,
  Shield,
  Layers,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

interface DatabaseStudioProps {
  project: ProjectDetails;
}

interface ColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkTarget?: string;
  nullable?: boolean;
}

interface TableDef {
  id: string;
  name: string;
  description: string;
  columns: ColumnDef[];
  sampleRecords: Record<string, string | number>[];
}

const SCHEMA_TABLES: TableDef[] = [
  {
    id: "users",
    name: "users",
    description: "Customer accounts, support staff profiles, and auth credentials.",
    columns: [
      { name: "id", type: "uuid", isPk: true },
      { name: "email", type: "varchar(255)", nullable: false },
      { name: "name", type: "text", nullable: false },
      { name: "role", type: "varchar(32)", nullable: false },
      { name: "created_at", type: "timestamptz", nullable: false },
    ],
    sampleRecords: [
      {
        id: "usr_01",
        email: "alex.rivera@example.com",
        name: "Alex Rivera",
        role: "founder",
        created_at: "2026-09-24 10:00:00 UTC",
      },
      {
        id: "usr_02",
        email: "sarah.chen@example.com",
        name: "Sarah Chen",
        role: "agent",
        created_at: "2026-09-25 11:30:00 UTC",
      },
      {
        id: "usr_03",
        email: "marcus.vance@example.com",
        name: "Marcus Vance",
        role: "customer",
        created_at: "2026-09-26 14:15:00 UTC",
      },
    ],
  },
  {
    id: "tickets",
    name: "tickets",
    description: "Customer support inquiries, priority levels, and triage assignments.",
    columns: [
      { name: "id", type: "uuid", isPk: true },
      { name: "customer_id", type: "uuid", isFk: true, fkTarget: "users.id" },
      { name: "title", type: "text", nullable: false },
      { name: "status", type: "varchar(32)", nullable: false },
      { name: "priority", type: "varchar(32)", nullable: false },
      { name: "created_at", type: "timestamptz", nullable: false },
    ],
    sampleRecords: [
      {
        id: "tkt_101",
        customer_id: "usr_03",
        title: "Cannot reset SSO credentials",
        status: "in_progress",
        priority: "urgent",
        created_at: "2026-09-28 09:20:00 UTC",
      },
      {
        id: "tkt_102",
        customer_id: "usr_01",
        title: "Billing invoice discrepancy for Q3",
        status: "resolved",
        priority: "medium",
        created_at: "2026-09-28 10:05:00 UTC",
      },
      {
        id: "tkt_103",
        customer_id: "usr_03",
        title: "Feature request: Dark mode theme export",
        status: "open",
        priority: "low",
        created_at: "2026-09-28 12:40:00 UTC",
      },
    ],
  },
  {
    id: "chat_sessions",
    name: "chat_sessions",
    description: "Conversations handled by AI assistant or escalated to human agents.",
    columns: [
      { name: "id", type: "uuid", isPk: true },
      { name: "ticket_id", type: "uuid", isFk: true, fkTarget: "tickets.id" },
      { name: "user_id", type: "uuid", isFk: true, fkTarget: "users.id" },
      { name: "channel", type: "varchar(32)", nullable: false },
      { name: "message_count", type: "int4", nullable: false },
      { name: "last_active_at", type: "timestamptz", nullable: false },
    ],
    sampleRecords: [
      {
        id: "ses_801",
        ticket_id: "tkt_101",
        user_id: "usr_03",
        channel: "web",
        message_count: 8,
        last_active_at: "2026-09-28 09:28:14 UTC",
      },
      {
        id: "ses_802",
        ticket_id: "tkt_102",
        user_id: "usr_01",
        channel: "web",
        message_count: 4,
        last_active_at: "2026-09-28 10:18:22 UTC",
      },
      {
        id: "ses_803",
        ticket_id: "tkt_103",
        user_id: "usr_03",
        channel: "email",
        message_count: 2,
        last_active_at: "2026-09-28 12:45:00 UTC",
      },
    ],
  },
];

export function DatabaseStudio({ project }: DatabaseStudioProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>("users");

  const currentTable =
    SCHEMA_TABLES.find((t) => t.id === selectedTableId) || SCHEMA_TABLES[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#21262D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[8px] bg-[#161B22] border border-[#30363D] text-[#00F2FE]">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#F0F6FC] tracking-tight">Database</h1>
                <Badge variant="cyan" size="sm">
                  PostgreSQL / Supabase
                </Badge>
              </div>
              <p className="text-xs text-[#8B949E]">
                Explore the data model Architect prepared for {project.name}.
              </p>
            </div>
          </div>
        </div>

        {/* Engine status indicator */}
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-[6px] bg-[#161B22] border border-[#30363D] text-[#8B949E]">
          <Shield className="h-4 w-4 text-[#10B981]" />
          <span>RLS Enforced</span>
          <span className="text-[#30363D]">|</span>
          <span className="text-[#F0F6FC] font-semibold">{SCHEMA_TABLES.length} Tables</span>
        </div>
      </div>

      {/* Schema Overview Cards (3 tables grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#6E7681] flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-[#00F2FE]" />
            Relational Schema Definition
          </h2>
          <span className="text-[11px] text-[#8B949E]">Generated by Architect Backend Agent</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCHEMA_TABLES.map((table) => {
            const isSelected = selectedTableId === table.id;
            return (
              <div
                key={table.id}
                onClick={() => setSelectedTableId(table.id)}
                className={`p-4 rounded-[8px] border transition-all cursor-pointer select-none space-y-3 ${
                  isSelected
                    ? "bg-[#161B22] border-[#00F2FE]/50 shadow-[0_0_12px_rgba(0,242,254,0.1)]"
                    : "bg-[#0E1117] border-[#30363D] hover:border-[#484F58] hover:bg-[#161B22]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4 text-[#A855F7]" />
                    <span className="font-mono text-sm font-semibold text-[#F0F6FC]">
                      {table.name}
                    </span>
                  </div>
                  <Badge variant={isSelected ? "cyan" : "secondary"} size="sm">
                    {table.columns.length} cols
                  </Badge>
                </div>

                <p className="text-xs text-[#8B949E] line-clamp-2 leading-relaxed">
                  {table.description}
                </p>

                {/* Columns list preview */}
                <div className="pt-2 border-t border-[#21262D] space-y-1">
                  {table.columns.slice(0, 4).map((col) => (
                    <div
                      key={col.name}
                      className="flex items-center justify-between text-[11px] font-mono"
                    >
                      <span className="flex items-center gap-1.5 text-[#C9D1D9]">
                        {col.isPk ? (
                          <Key className="h-3 w-3 text-[#F59E0B]" />
                        ) : col.isFk ? (
                          <LinkIcon className="h-3 w-3 text-[#58A6FF]" />
                        ) : (
                          <span className="h-1 w-1 rounded-full bg-[#6E7681]" />
                        )}
                        <span>{col.name}</span>
                      </span>
                      <span className="text-[#6E7681]">{col.type}</span>
                    </div>
                  ))}
                  {table.columns.length > 4 && (
                    <div className="text-[10px] text-[#6E7681] font-mono pt-0.5">
                      +{table.columns.length - 4} more columns
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relationship Visualization Card */}
      <Card className="border-[#30363D] bg-[#0E1117]">
        <CardHeader className="py-3 px-5 border-b border-[#21262D]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-[#6E7681] flex items-center gap-2">
              <LinkIcon className="h-3.5 w-3.5 text-[#58A6FF]" />
              Entity Relationships (Foreign Keys)
            </CardTitle>
            <span className="text-[11px] text-[#8B949E] font-mono">3 Established Constraints</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-[6px] bg-[#161B22] border border-[#21262D] flex items-center gap-2">
              <span className="text-[#F0F6FC] font-semibold">users.id</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#00F2FE] shrink-0" />
              <span className="text-[#A855F7] font-semibold">tickets.customer_id</span>
              <span className="ml-auto text-[10px] text-[#6E7681]">1:N</span>
            </div>
            <div className="p-2.5 rounded-[6px] bg-[#161B22] border border-[#21262D] flex items-center gap-2">
              <span className="text-[#F0F6FC] font-semibold">users.id</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#00F2FE] shrink-0" />
              <span className="text-[#A855F7] font-semibold">chat_sessions.user_id</span>
              <span className="ml-auto text-[10px] text-[#6E7681]">1:N</span>
            </div>
            <div className="p-2.5 rounded-[6px] bg-[#161B22] border border-[#21262D] flex items-center gap-2">
              <span className="text-[#F0F6FC] font-semibold">tickets.id</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#00F2FE] shrink-0" />
              <span className="text-[#A855F7] font-semibold">chat_sessions.ticket_id</span>
              <span className="ml-auto text-[10px] text-[#6E7681]">1:1</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Records Browser Card */}
      <Card className="border-[#30363D] bg-[#0E1117] overflow-hidden">
        <CardHeader className="py-3 px-5 border-b border-[#21262D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#00F2FE]" />
              Sample Records: <span className="font-mono text-[#00F2FE]">{currentTable.name}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Deterministic sample data demonstrating active table structure.
            </CardDescription>
          </div>

          {/* Table Selector Tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-[6px] bg-[#161B22] border border-[#30363D] self-start sm:self-auto">
            {SCHEMA_TABLES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTableId(t.id)}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-mono transition-colors ${
                  selectedTableId === t.id
                    ? "bg-[#21262D] text-[#00F2FE] font-semibold"
                    : "text-[#8B949E] hover:text-[#F0F6FC]"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#161B22]/80 text-[#8B949E] uppercase text-[10px] border-b border-[#21262D]">
              <tr>
                {currentTable.columns.map((col) => (
                  <th key={col.name} className="py-2.5 px-4 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {col.isPk && <Key className="h-3 w-3 text-[#F59E0B]" />}
                      {col.isFk && <LinkIcon className="h-3 w-3 text-[#58A6FF]" />}
                      <span>{col.name}</span>
                      <span className="text-[9px] text-[#6E7681] lowercase">({col.type})</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262D]">
              {currentTable.sampleRecords.map((record, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#161B22]/50 transition-colors text-[#F0F6FC]"
                >
                  {currentTable.columns.map((col) => {
                    const value = record[col.name];
                    const isId = col.name === "id" || col.name.endsWith("_id");
                    return (
                      <td
                        key={col.name}
                        className={`py-2.5 px-4 whitespace-nowrap text-xs ${
                          isId ? "text-[#00F2FE] font-medium" : "text-[#C9D1D9]"
                        }`}
                      >
                        {String(value ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
