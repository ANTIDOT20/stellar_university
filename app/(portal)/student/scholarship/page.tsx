"use client";

import { useState } from "react";
import { Star, CheckCircle2, XCircle, Clock, AlertCircle, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Scholarship {
  id:        string;
  name:      string;
  amount:    number;
  minGpa:    number;
  awarded:   number;
  maxAwards: number;
  deadline:  string;
  status:    "open" | "closed" | "awarded";
}

const SCHOLARSHIPS: Scholarship[] = [
  {
    id:        "sch-001",
    name:      "Stellar Foundation Excellence Award",
    amount:    500,
    minGpa:    4.5,
    awarded:   3,
    maxAwards: 10,
    deadline:  "February 28, 2026",
    status:    "open",
  },
  {
    id:        "sch-002",
    name:      "NUC STEM Merit Scholarship",
    amount:    300,
    minGpa:    3.5,
    awarded:   8,
    maxAwards: 20,
    deadline:  "March 15, 2026",
    status:    "open",
  },
  {
    id:        "sch-003",
    name:      "Blockchain Science Pioneer Grant",
    amount:    1000,
    minGpa:    4.0,
    awarded:   2,
    maxAwards: 5,
    deadline:  "January 10, 2026",
    status:    "closed",
  },
];

const STUDENT_GPA = 4.12;

export default function ScholarshipPage() {
  const [applying, setApplying] = useState<string | null>(null);
  const [applied,  setApplied]  = useState<Set<string>>(new Set());

  async function handleApply(id: string) {
    setApplying(id);
    await new Promise((r) => setTimeout(r, 1500));
    setApplied((prev) => new Set([...prev, id]));
    setApplying(null);
  }

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div className="flex items-center gap-3">
        <Star className="w-6 h-6 text-su-gold" />
        <h1 className="text-2xl font-display font-bold text-white">Scholarships</h1>
      </div>

      <div className="flex items-center gap-3 p-4 card-glass rounded-xl">
        <Award className="w-5 h-5 text-su-gold shrink-0" />
        <div>
          <p className="text-white text-sm font-medium">Your current GPA: <span className="text-su-gold">{STUDENT_GPA.toFixed(2)}</span></p>
          <p className="text-su-text text-xs mt-0.5">GPA is verified on-chain from your grading contract records.</p>
        </div>
      </div>

      <div className="space-y-4">
        {SCHOLARSHIPS.map((sch) => {
          const eligible  = STUDENT_GPA >= sch.minGpa;
          const isClosed  = sch.status === "closed";
          const wasApplied = applied.has(sch.id);
          const pct = Math.round((sch.awarded / sch.maxAwards) * 100);

          return (
            <div key={sch.id} className="card-glass rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-white font-semibold">{sch.name}</h2>
                  <p className="text-su-text text-sm mt-1">
                    ${sch.amount} USDC · Min GPA {sch.minGpa.toFixed(1)} · Deadline {sch.deadline}
                  </p>
                </div>
                {isClosed ? (
                  <Badge variant="red">Closed</Badge>
                ) : (
                  <Badge variant="green">Open</Badge>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-su-text">
                  <span>{sch.awarded} of {sch.maxAwards} awarded</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-su-navy rounded-full overflow-hidden">
                  <div
                    className="h-full bg-su-gold rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!eligible ? (
                  <div className="flex items-center gap-2 text-sm text-su-text">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    GPA below minimum ({sch.minGpa.toFixed(1)} required)
                  </div>
                ) : isClosed ? (
                  <div className="flex items-center gap-2 text-sm text-su-text">
                    <Clock className="w-4 h-4 shrink-0" />
                    Applications closed
                  </div>
                ) : wasApplied ? (
                  <div className="flex items-center gap-2 text-sm text-su-green">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Application submitted
                  </div>
                ) : (
                  <Button
                    loading={applying === sch.id}
                    onClick={() => handleApply(sch.id)}
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-su-gold/5 border border-su-gold/20 text-sm">
        <AlertCircle className="w-4 h-4 text-su-gold shrink-0 mt-0.5" />
        <p className="text-su-text">
          Scholarship funds are disbursed directly to your Stellar wallet via the scholarship contract.
          Awards are subject to admin confirmation and GPA verification on-chain.
        </p>
      </div>
    </div>
  );
}
