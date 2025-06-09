"use client";

import { useState } from "react";
import { Award, Plus, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Scholarship {
  id:           number;
  name:         string;
  amount:       number;
  minGpa:       number;
  maxAwards:    number;
  awardedCount: number;
  status:       "Active" | "Expired";
}

const MOCK: Scholarship[] = [
  { id: 1, name: "Vice-Chancellor Excellence Award", amount: 500,  minGpa: 4.50, maxAwards: 10,  awardedCount: 3,  status: "Active" },
  { id: 2, name: "Blockchain Innovation Fund",       amount: 300,  minGpa: 4.00, maxAwards: 20,  awardedCount: 7,  status: "Active" },
  { id: 3, name: "Science Merit Bursary",            amount: 150,  minGpa: 3.50, maxAwards: 50,  awardedCount: 50, status: "Expired" },
  { id: 4, name: "Faculty of Medicine Award",        amount: 1000, minGpa: 4.20, maxAwards: 5,   awardedCount: 1,  status: "Active" },
];

export default function ScholarshipsPage() {
  const [scholarships] = useState(MOCK);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">Scholarships</h1>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          Create Scholarship
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Funds",     value: scholarships.filter((s) => s.status === "Active").length,                    icon: Trophy },
          { label: "Total Awarded",    value: scholarships.reduce((a, s) => a + s.awardedCount, 0),                        icon: Award  },
          { label: "Total USDC (est)", value: `$${scholarships.reduce((a, s) => a + s.amount * s.awardedCount, 0).toLocaleString()}`, icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="card-glass rounded-xl p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-su-gold/10 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-su-gold" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-su-text text-xs">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scholarships.map((s) => (
          <div key={s.id} className="card-glass rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-white font-semibold text-sm leading-snug max-w-[200px]">{s.name}</h3>
              <Badge variant={s.status === "Active" ? "green" : "default"}>{s.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Amount",   value: `$${s.amount} USDC` },
                { label: "Min GPA",  value: s.minGpa.toFixed(2)  },
                { label: "Awarded",  value: `${s.awardedCount} / ${s.maxAwards}` },
              ].map((r) => (
                <div key={r.label}>
                  <p className="text-su-text text-xs">{r.label}</p>
                  <p className="text-white font-medium">{r.value}</p>
                </div>
              ))}
            </div>
            <div className="w-full h-1.5 bg-su-navy rounded-full overflow-hidden">
              <div
                className="h-full bg-su-gold rounded-full transition-all"
                style={{ width: `${(s.awardedCount / s.maxAwards) * 100}%` }}
              />
            </div>
            {s.status === "Active" && (
              <Button variant="outline" size="sm">Award Student</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
