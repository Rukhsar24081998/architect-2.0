import React from "react";
import { ActivityEvent } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import {
  Activity,
  Bot,
  User,
  CheckCircle2,
  Rocket,
  FileCode,
} from "lucide-react";

interface RecentActivityProps {
  activities: ActivityEvent[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getEventIcon = (type: string, role: string) => {
    if (type === "deployed") {
      return <Rocket className="h-3.5 w-3.5 text-[#10B981]" />;
    }
    if (type === "test_passed") {
      return <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />;
    }
    if (type === "file_modified" || type === "file_created") {
      return <FileCode className="h-3.5 w-3.5 text-[#58A6FF]" />;
    }
    if (type === "plan_approved") {
      return <CheckCircle2 className="h-3.5 w-3.5 text-[#00F2FE]" />;
    }
    if (role === "agent") {
      return <Bot className="h-3.5 w-3.5 text-[#A855F7]" />;
    }
    return <User className="h-3.5 w-3.5 text-[#8B949E]" />;
  };

  return (
    <div className="p-4 rounded-[8px] bg-[#0E1117] border border-[#30363D] space-y-3 shadow-sm select-none">
      <div className="flex items-center justify-between border-b border-[#21262D]/60 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#00F2FE]" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Recent Activity
          </h3>
        </div>
        <span className="text-[10px] text-[#6E7681] font-mono">Live Audit</span>
      </div>

      {activities.length === 0 ? (
        <p className="text-xs text-[#6E7681] py-4 text-center">
          No recent activity recorded yet.
        </p>
      ) : (
        <div className="space-y-2">
          {activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="p-2.5 rounded-[6px] bg-[#161B22]/50 hover:bg-[#161B22] border border-transparent hover:border-[#30363D] transition-colors flex items-start gap-2.5"
            >
              <div className="mt-0.5 shrink-0">
                {getEventIcon(act.type, act.actorRole)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#F0F6FC] leading-snug truncate">
                  {act.summary}
                </p>

                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#8B949E] font-mono">
                  {act.projectName && (
                    <span className="text-[#00F2FE] truncate max-w-[120px]">
                      {act.projectName}
                    </span>
                  )}
                  <span>•</span>
                  <span>{act.actor}</span>
                  <span>•</span>
                  <span suppressHydrationWarning>{formatTimestamp(act.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
