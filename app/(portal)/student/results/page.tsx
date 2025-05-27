"use client";

import { useState } from "react";
import { TrendingUp, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { gpaToClass, formatGpa } from "@/lib/utils";

interface GradeRow {
  code:        string;
  title:       string;
  creditUnits: number;
  score:       number;
  grade:       string;
  points:      number;
}

const MOCK_RESULTS: Record<string, GradeRow[]> = {
  "2024/2025 · S1": [
    { code: "GST101", title: "Use of English",               creditUnits: 2, score: 72, grade: "A", points: 5 },
    { code: "GST102", title: "Nigerian Peoples and Culture",  creditUnits: 2, score: 68, grade: "B", points: 4 },
    { code: "MTH101", title: "Elementary Mathematics I",      creditUnits: 3, score: 85, grade: "A", points: 5 },
    { code: "PHY101", title: "General Physics I",             creditUnits: 3, score: 60, grade: "B", points: 4 },
    { code: "CSC101", title: "Introduction to Computing",     creditUnits: 3, score: 78, grade: "A", points: 5 },
  ],
};

function computeGpa(rows: GradeRow[]): number {
  const total = rows.reduce((a, r) => a + r.points * r.creditUnits, 0);
  const units = rows.reduce((a, r) => a + r.creditUnits, 0);
  return units ? total / units : 0;
}

function gradeVariant(grade: string): "green" | "blue" | "gold" | "red" | "default" {
  if (grade === "A") return "green";
  if (grade === "B") return "blue";
  if (grade === "C") return "gold";
  return "red";
}

export default function ResultsPage() {
  const sessions = Object.keys(MOCK_RESULTS);
  const [active, setActive] = useState(sessions[0]);

  const rows = MOCK_RESULTS[active] ?? [];
  const gpa  = computeGpa(rows);
  const cls  = gpaToClass(gpa);

  return (
    <div className="p-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Academic Results</h1>
        <p className="text-su-text text-sm">Ada Okafor · SU/2025/001</p>
      </div>

      {/* GPA summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-glass rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-su-gold">{formatGpa(gpa)}</p>
          <p className="text-su-text text-xs mt-1">Current GPA</p>
        </div>
        <div className="card-glass rounded-xl p-5 text-center col-span-2">
          <p className="text-white font-semibold">
            {cls.replace(/_/g, " ")}
          </p>
          <p className="text-su-text text-xs mt-1">Degree classification (projected)</p>
        </div>
      </div>

      {/* Session tabs */}
      <div className="flex gap-2 flex-wrap">
        {sessions.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              active === s
                ? "bg-su-gold/10 text-su-gold border border-su-gold/30"
                : "text-su-text hover:text-white border border-su-border hover:border-su-border/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grades table */}
      <div className="card-glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-su-border/40">
              {["Code", "Course Title", "Units", "Score", "Grade", "Points"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-su-text text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-su-border/20">
            {rows.map((row) => (
              <tr key={row.code} className="hover:bg-su-slate/20 transition-colors">
                <td className="px-5 py-3 font-mono text-su-gold text-xs">{row.code}</td>
                <td className="px-5 py-3 text-white">{row.title}</td>
                <td className="px-5 py-3 text-su-text">{row.creditUnits}</td>
                <td className="px-5 py-3 text-white">{row.score}</td>
                <td className="px-5 py-3">
                  <Badge variant={gradeVariant(row.grade)}>{row.grade}</Badge>
                </td>
                <td className="px-5 py-3 text-white">{row.points}.0</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-su-border/40 bg-su-slate/20">
              <td colSpan={2} className="px-5 py-3 text-white font-medium">GPA this semester</td>
              <td className="px-5 py-3 text-su-text">
                {rows.reduce((a, r) => a + r.creditUnits, 0)} units
              </td>
              <td colSpan={3} className="px-5 py-3 text-su-gold font-bold">{formatGpa(gpa)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
