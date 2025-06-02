"use client";

import { useState } from "react";
import { BookOpen, Users, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWallet } from "@/components/wallet/WalletContext";

interface EnrolledStudent {
  matric:     string;
  name:       string;
  publicKey:  string;
  score:      number | null;
}

const MOCK_COURSE = {
  code:   "CSC301",
  title:  "Data Structures & Algorithms",
  units:  3,
  level:  300,
};

const MOCK_STUDENTS: EnrolledStudent[] = [
  { matric: "SU/2025/001", name: "Ada Okafor",       publicKey: "G...", score: null },
  { matric: "SU/2025/002", name: "Emeka Nwosu",       publicKey: "G...", score: null },
  { matric: "SU/2025/003", name: "Chioma Adeyemi",    publicKey: "G...", score: null },
  { matric: "SU/2025/004", name: "Tunde Fashola",     publicKey: "G...", score: null },
  { matric: "SU/2025/005", name: "Ngozi Obi",         publicKey: "G...", score: null },
];

export default function LecturerDashboard() {
  const { wallet } = useWallet();
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  function setScore(matric: string, score: number) {
    setStudents((prev) =>
      prev.map((s) => (s.matric === matric ? { ...s, score } : s))
    );
  }

  async function submitGrades() {
    const filled = students.every((s) => s.score !== null);
    if (!filled) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="p-8 max-w-4xl space-y-8">
      <div>
        <p className="text-su-text text-sm mb-1">Lecturer Portal</p>
        <h1 className="text-2xl font-display font-bold text-white">Grade Submission</h1>
      </div>

      {/* Course info */}
      <div className="card-glass rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-su-gold/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-su-gold" />
        </div>
        <div>
          <p className="text-white font-semibold">{MOCK_COURSE.title}</p>
          <p className="text-su-text text-sm">
            {MOCK_COURSE.code} · Level {MOCK_COURSE.level} · {MOCK_COURSE.units} units
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant="blue">{students.length} students</Badge>
        </div>
      </div>

      {submitted ? (
        <div className="flex items-start gap-3 p-5 rounded-xl bg-su-green/10 border border-su-green/20">
          <CheckCircle2 className="w-5 h-5 text-su-green shrink-0 mt-0.5" />
          <div>
            <p className="text-su-green font-medium">Grades submitted on-chain!</p>
            <p className="text-su-text text-sm mt-1">
              All {students.length} grade records have been written to the Stellar blockchain.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="card-glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-su-border/40">
                  {["Matric", "Student Name", "Score (0–100)", "Grade"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-su-text text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-su-border/20">
                {students.map((s) => {
                  const grade =
                    s.score === null ? "—" :
                    s.score >= 70 ? "A" :
                    s.score >= 60 ? "B" :
                    s.score >= 50 ? "C" :
                    s.score >= 45 ? "D" :
                    s.score >= 40 ? "E" : "F";

                  return (
                    <tr key={s.matric}>
                      <td className="px-5 py-3 font-mono text-su-gold text-xs">{s.matric}</td>
                      <td className="px-5 py-3 text-white">{s.name}</td>
                      <td className="px-5 py-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={s.score ?? ""}
                          onChange={(e) => setScore(s.matric, Number(e.target.value))}
                          className="w-24 bg-su-navy/60 border border-su-border rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-su-gold/50"
                          placeholder="—"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={
                            grade === "A" ? "green" :
                            grade === "B" ? "blue"  :
                            grade === "F" ? "red"   : "default"
                          }
                        >
                          {grade}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={submitGrades}
              loading={submitting}
              disabled={!wallet.connected || submitting || students.some((s) => s.score === null)}
            >
              <Send className="w-4 h-4" />
              Submit grades on-chain
            </Button>
            {students.some((s) => s.score === null) && (
              <p className="text-su-text text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Fill all scores before submitting
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
