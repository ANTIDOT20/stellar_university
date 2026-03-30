"use client";

import { useState } from "react";
import { Shield, Plus, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Proposal {
  id:           number;
  title:        string;
  description:  string;
  proposer:     string;
  votesFor:     number;
  votesAgainst: number;
  quorum:       number;
  status:       "Active" | "Passed" | "Rejected" | "Executed" | "Cancelled";
  endsAt:       string;
}

const MOCK: Proposal[] = [
  {
    id:          1,
    title:       "Increase tuition fee for Level 500+ by 10%",
    description: "Aligning fees with operational costs for postgraduate-level courses.",
    proposer:    "Dean of Sciences",
    votesFor:    4,
    votesAgainst: 1,
    quorum:      7,
    status:      "Active",
    endsAt:      "2025-06-20",
  },
  {
    id:          2,
    title:       "Add Department of Quantum Computing",
    description: "Establish a new department under Faculty of Physical Sciences.",
    proposer:    "Academic Board",
    votesFor:    6,
    votesAgainst: 0,
    quorum:      7,
    status:      "Passed",
    endsAt:      "2025-06-01",
  },
  {
    id:          3,
    title:       "Reduce minimum scholarship GPA to 3.75",
    description: "Broaden access to the VC Excellence Award.",
    proposer:    "Student Affairs",
    votesFor:    2,
    votesAgainst: 5,
    quorum:      7,
    status:      "Rejected",
    endsAt:      "2025-05-28",
  },
];

const STATUS_VARIANT: Record<string, "green" | "red" | "gold" | "blue" | "default"> = {
  Active:    "blue",
  Passed:    "green",
  Rejected:  "red",
  Executed:  "gold",
  Cancelled: "default",
};

export default function GovernancePage() {
  const [proposals]    = useState(MOCK);
  const [voting, setVoting] = useState<number | null>(null);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">Governance</h1>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          New Proposal
        </Button>
      </div>

      <div className="space-y-4">
        {proposals.map((p) => {
          const total   = p.votesFor + p.votesAgainst;
          const forPct  = total ? (p.votesFor / p.quorum) * 100 : 0;

          return (
            <div key={p.id} className="card-glass rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-su-text">#{p.id}</span>
                    <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
                  </div>
                  <h3 className="text-white font-semibold">{p.title}</h3>
                  <p className="text-su-text text-sm">{p.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-su-text">
                <span>Proposed by: <span className="text-white">{p.proposer}</span></span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {p.status === "Active" ? `Ends ${p.endsAt}` : `Ended ${p.endsAt}`}
                </span>
              </div>

              {/* Vote bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-su-text">
                  <span>{p.votesFor} for</span>
                  <span>{p.votesAgainst} against</span>
                  <span>Quorum: {total}/{p.quorum}</span>
                </div>
                <div className="h-2 bg-su-navy rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-su-green rounded-l-full transition-all"
                    style={{ width: `${forPct}%` }}
                  />
                  <div
                    className="h-full bg-red-500/60 transition-all"
                    style={{ width: `${total ? (p.votesAgainst / p.quorum) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {p.status === "Active" && (
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    onClick={() => setVoting(p.id)}
                    loading={voting === p.id}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Vote For
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="w-3.5 h-3.5" />
                    Vote Against
                  </Button>
                </div>
              )}
              {p.status === "Passed" && (
                <div className="flex gap-3">
                  <Button size="sm">
                    Execute
                  </Button>
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
