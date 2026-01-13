"use client";

import { useState } from "react";
import { Bell, ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

type Level = "info" | "warning" | "success";

interface Announcement {
  id:      string;
  level:   Level;
  title:   string;
  body:    string;
  date:    string;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id:    "ann-001",
    level: "info",
    title: "Second Semester 2025/2026 registration is open",
    body:  "Students may now register for courses for the second semester. Registration closes March 14, 2026. Ensure your tuition payment is confirmed before registering.",
    date:  "January 10, 2026",
  },
  {
    id:    "ann-002",
    level: "success",
    title: "Protocol upgrade v0.2 deployed to Testnet",
    body:  "The governance and scholarship contracts have been upgraded with multi-institution support. No action required for existing students.",
    date:  "January 6, 2026",
  },
  {
    id:    "ann-003",
    level: "warning",
    title: "Freighter wallet extension update required",
    body:  "Freighter v5.5 or later is required to sign Soroban transactions on this portal. Update your extension before the next session.",
    date:  "December 20, 2025",
  },
];

const levelConfig: Record<Level, { icon: typeof Info; color: string; badge: "blue" | "gold" | "green" }> = {
  info:    { icon: Info,          color: "border-su-blue/20 bg-su-blue/5",   badge: "blue"  },
  warning: { icon: AlertTriangle, color: "border-su-gold/20 bg-su-gold/5",   badge: "gold"  },
  success: { icon: CheckCircle2,  color: "border-su-green/20 bg-su-green/5", badge: "green" },
};

export function Announcements() {
  const [expanded, setExpanded] = useState<string | null>(ANNOUNCEMENTS[0]?.id ?? null);

  return (
    <div className="card-glass rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-su-gold" />
        <h3 className="text-white font-semibold text-sm">Announcements</h3>
        <Badge variant="gold">{ANNOUNCEMENTS.length}</Badge>
      </div>

      <div className="space-y-2">
        {ANNOUNCEMENTS.map((ann) => {
          const { icon: Icon, color, badge } = levelConfig[ann.level];
          const open = expanded === ann.id;

          return (
            <div key={ann.id} className={`rounded-xl border p-3 ${color}`}>
              <button
                className="w-full flex items-start gap-3 text-left"
                onClick={() => setExpanded(open ? null : ann.id)}
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0 text-inherit opacity-70" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-snug">{ann.title}</p>
                  <p className="text-su-text text-xs mt-0.5">{ann.date}</p>
                </div>
                {open ? (
                  <ChevronUp className="w-4 h-4 text-su-text shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-su-text shrink-0 mt-0.5" />
                )}
              </button>
              {open && (
                <p className="text-su-text text-sm leading-relaxed mt-2 pl-7">
                  {ann.body}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
