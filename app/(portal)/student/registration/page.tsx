"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWallet } from "@/components/wallet/WalletContext";

interface Course {
  code:        string;
  title:       string;
  creditUnits: number;
  level:       number;
  semester:    number;
  compulsory:  boolean;
}

const AVAILABLE_COURSES: Course[] = [
  { code: "GST101", title: "Use of English",              creditUnits: 2, level: 100, semester: 1, compulsory: true  },
  { code: "GST102", title: "Nigerian Peoples and Culture", creditUnits: 2, level: 100, semester: 1, compulsory: true  },
  { code: "MTH101", title: "Elementary Mathematics I",     creditUnits: 3, level: 100, semester: 1, compulsory: true  },
  { code: "PHY101", title: "General Physics I",            creditUnits: 3, level: 100, semester: 1, compulsory: true  },
  { code: "CSC101", title: "Introduction to Computing",    creditUnits: 3, level: 100, semester: 1, compulsory: true  },
  { code: "CHM101", title: "General Chemistry I",          creditUnits: 3, level: 100, semester: 1, compulsory: false },
  { code: "STA101", title: "Probability and Statistics",   creditUnits: 2, level: 100, semester: 1, compulsory: false },
];

const MAX_UNITS = 24;

export default function RegistrationPage() {
  const { wallet }   = useWallet();
  const [selected, setSelected] = useState<string[]>(
    AVAILABLE_COURSES.filter((c) => c.compulsory).map((c) => c.code)
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const totalUnits = AVAILABLE_COURSES
    .filter((c) => selected.includes(c.code))
    .reduce((acc, c) => acc + c.creditUnits, 0);

  function toggle(code: string, compulsory: boolean) {
    if (compulsory) return;
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  async function handleSubmit() {
    if (!wallet.connected) return;
    setSubmitting(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            Course Registration
          </h1>
          <p className="text-su-text text-sm">2024/2025 · First Semester · Level 100</p>
        </div>
        <Badge variant={totalUnits <= MAX_UNITS ? "green" : "red"}>
          {totalUnits} / {MAX_UNITS} units
        </Badge>
      </div>

      {submitted ? (
        <div className="flex items-start gap-3 p-5 rounded-xl bg-su-green/10 border border-su-green/20">
          <CheckCircle2 className="w-5 h-5 text-su-green shrink-0 mt-0.5" />
          <div>
            <p className="text-su-green font-medium">Registration submitted on-chain!</p>
            <p className="text-su-text text-sm mt-1">
              Your course enrollment has been recorded on the Stellar blockchain.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {AVAILABLE_COURSES.map((course) => {
              const isSelected = selected.includes(course.code);
              return (
                <button
                  key={course.code}
                  onClick={() => toggle(course.code, course.compulsory)}
                  disabled={course.compulsory}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-su-gold/40 bg-su-gold/5"
                      : "border-su-border hover:border-su-border/80"
                  } ${course.compulsory ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? "border-su-gold bg-su-gold" : "border-su-border"
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-su-navy" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-su-gold">{course.code}</span>
                      {course.compulsory && <Badge>Compulsory</Badge>}
                    </div>
                    <p className="text-white text-sm mt-0.5">{course.title}</p>
                  </div>
                  <span className="text-su-text text-sm shrink-0">{course.creditUnits} units</span>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            size="lg"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!wallet.connected || submitting || totalUnits === 0 || totalUnits > MAX_UNITS}
          >
            <BookOpen className="w-4 h-4" />
            Register {selected.length} courses ({totalUnits} units)
          </Button>
        </>
      )}
    </div>
  );
}
