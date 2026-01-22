"use client";

import { BarChart2, TrendingUp, Users, CreditCard, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const MONTHLY_ENROLLMENTS = [
  { month: "Aug",  count: 42  },
  { month: "Sep",  count: 187 },
  { month: "Oct",  count: 223 },
  { month: "Nov",  count: 198 },
  { month: "Dec",  count: 94  },
  { month: "Jan",  count: 156 },
];

const FACULTY_DIST = [
  { name: "Stellar Blockchain Science",    pct: 28 },
  { name: "Computer Science",              pct: 22 },
  { name: "Law",                           pct: 14 },
  { name: "Medicine",                      pct: 12 },
  { name: "Engineering",                   pct: 10 },
  { name: "Other",                         pct: 14 },
];

const FEE_TREND = [
  { month: "Aug", usdc: 21000  },
  { month: "Sep", usdc: 93500  },
  { month: "Oct", usdc: 111500 },
  { month: "Nov", usdc: 99000  },
  { month: "Dec", usdc: 47000  },
  { month: "Jan", usdc: 78000  },
];

const maxEnroll  = Math.max(...MONTHLY_ENROLLMENTS.map((d) => d.count));
const maxFee     = Math.max(...FEE_TREND.map((d) => d.usdc));

export default function AdminAnalyticsPage() {
  return (
    <div className="p-8 max-w-5xl space-y-8">
      <div className="flex items-center gap-3">
        <BarChart2 className="w-6 h-6 text-su-gold" />
        <h1 className="text-2xl font-display font-bold text-white">Analytics</h1>
        <Badge variant="blue">2025/2026 Session</Badge>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students",   value: "1,240", icon: Users,    color: "text-blue-400"   },
          { label: "Active Courses",   value: "86",    icon: Award,    color: "text-su-green"   },
          { label: "USDC Collected",   value: "$450K", icon: CreditCard, color: "text-su-gold"  },
          { label: "Credentials Issued", value: "238", icon: TrendingUp, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="card-glass rounded-xl p-5 space-y-3">
            <div className={`w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-su-text text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly enrollments bar chart */}
      <div className="card-glass rounded-xl p-6 space-y-5">
        <h2 className="text-white font-semibold">Monthly Enrollments</h2>
        <div className="flex items-end gap-3 h-40">
          {MONTHLY_ENROLLMENTS.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-su-text text-xs">{d.count}</span>
              <div
                className="w-full bg-su-gold/70 rounded-t-md transition-all"
                style={{ height: `${(d.count / maxEnroll) * 100}%` }}
              />
              <span className="text-su-text text-xs">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column: faculty dist + fee trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty distribution */}
        <div className="card-glass rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Students by Faculty</h2>
          <div className="space-y-3">
            {FACULTY_DIST.map((f) => (
              <div key={f.name} className="space-y-1">
                <div className="flex justify-between text-xs text-su-text">
                  <span>{f.name}</span>
                  <span>{f.pct}%</span>
                </div>
                <div className="h-1.5 bg-su-navy rounded-full overflow-hidden">
                  <div
                    className="h-full bg-su-gold rounded-full"
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee collection trend */}
        <div className="card-glass rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold">USDC Collected (monthly)</h2>
          <div className="flex items-end gap-3 h-36">
            {FEE_TREND.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-su-text text-xs">${(d.usdc / 1000).toFixed(0)}K</span>
                <div
                  className="w-full bg-su-green/70 rounded-t-md transition-all"
                  style={{ height: `${(d.usdc / maxFee) * 100}%` }}
                />
                <span className="text-su-text text-xs">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
