"use client";

import { useState } from "react";
import { FileText, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { gpaToClass, formatGpa } from "@/lib/utils";

const MOCK_TRANSCRIPT = {
  student:    { name: "Ada Okafor", matric: "SU/2025/001", department: "Computer Science", faculty: "Faculty of Physical Sciences" },
  cumGpa:     4.12,
  sessions: [
    {
      label: "2024/2025 · First Semester",
      courses: [
        { code: "GST101", title: "Use of English",              cu: 2, score: 72, grade: "A", pts: 5 },
        { code: "GST102", title: "Nigerian Peoples and Culture", cu: 2, score: 68, grade: "B", pts: 4 },
        { code: "MTH101", title: "Elementary Mathematics I",     cu: 3, score: 85, grade: "A", pts: 5 },
        { code: "PHY101", title: "General Physics I",            cu: 3, score: 60, grade: "B", pts: 4 },
        { code: "CSC101", title: "Introduction to Computing",    cu: 3, score: 78, grade: "A", pts: 5 },
      ],
    },
  ],
};

function semGpa(courses: typeof MOCK_TRANSCRIPT.sessions[0]["courses"]) {
  const pts   = courses.reduce((a, c) => a + c.pts * c.cu, 0);
  const units = courses.reduce((a, c) => a + c.cu, 0);
  return units ? pts / units : 0;
}

export default function TranscriptPage() {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDownloading(false);
    // In production: generate PDF + upload to IPFS, trigger download
  }

  return (
    <div className="p-8 max-w-4xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Academic Transcript</h1>
          <p className="text-su-text text-sm mt-1">
            {MOCK_TRANSCRIPT.student.name} · {MOCK_TRANSCRIPT.student.matric}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button size="sm" onClick={handleDownload} loading={downloading}>
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Header card */}
      <div className="card-glass rounded-xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        {[
          { label: "Student",    value: MOCK_TRANSCRIPT.student.name       },
          { label: "Matric",     value: MOCK_TRANSCRIPT.student.matric     },
          { label: "Department", value: MOCK_TRANSCRIPT.student.department },
          { label: "Cum. GPA",   value: formatGpa(MOCK_TRANSCRIPT.cumGpa)  },
        ].map((r) => (
          <div key={r.label}>
            <p className="text-su-text text-xs">{r.label}</p>
            <p className="text-white font-medium">{r.value}</p>
          </div>
        ))}
      </div>

      {/* Session tables */}
      {MOCK_TRANSCRIPT.sessions.map((session) => {
        const gpa   = semGpa(session.courses);
        const units = session.courses.reduce((a, c) => a + c.cu, 0);
        return (
          <div key={session.label} className="card-glass rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-su-border/40 flex items-center justify-between">
              <p className="text-white font-semibold text-sm">{session.label}</p>
              <div className="flex items-center gap-3 text-xs text-su-text">
                <span>{units} units</span>
                <span>GPA: <span className="text-su-gold font-bold">{formatGpa(gpa)}</span></span>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-su-border/20">
                  {["Code", "Course Title", "CU", "Score", "Grade", "GP"].map((h) => (
                    <th key={h} className="text-left px-5 py-2.5 text-su-text text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-su-border/10">
                {session.courses.map((c) => (
                  <tr key={c.code} className="hover:bg-su-slate/10 transition-colors">
                    <td className="px-5 py-2.5 font-mono text-su-gold text-xs">{c.code}</td>
                    <td className="px-5 py-2.5 text-white">{c.title}</td>
                    <td className="px-5 py-2.5 text-su-text">{c.cu}</td>
                    <td className="px-5 py-2.5 text-white">{c.score}</td>
                    <td className="px-5 py-2.5">
                      <Badge variant={c.grade === "A" ? "green" : c.grade === "B" ? "blue" : "default"}>
                        {c.grade}
                      </Badge>
                    </td>
                    <td className="px-5 py-2.5 text-white">{c.pts}.0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Overall summary */}
      <div className="card-glass rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-su-text text-sm">Cumulative GPA</p>
          <p className="text-3xl font-bold text-su-gold">{formatGpa(MOCK_TRANSCRIPT.cumGpa)}</p>
        </div>
        <div className="text-right">
          <p className="text-su-text text-sm">Degree Classification (projected)</p>
          <p className="text-white font-semibold">{gpaToClass(MOCK_TRANSCRIPT.cumGpa).replace(/_/g, " ")}</p>
        </div>
      </div>
    </div>
  );
}
