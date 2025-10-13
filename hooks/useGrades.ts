"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/components/wallet/WalletContext";
import { gradeFromScore, gradeToPoints } from "@/lib/utils";

export interface GradeEntry {
  courseCode:  string;
  courseTitle: string;
  creditUnits: number;
  score:       number;
  grade:       string;
  points:      number;
  session:     string;
  semester:    number;
}

interface UseGradesReturn {
  grades:  GradeEntry[];
  cumGpa:  number;
  loading: boolean;
  error:   string | null;
}

export function useGrades(studentKey?: string): UseGradesReturn {
  const { wallet } = useWallet();
  const [grades,  setGrades]  = useState<GradeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const target = studentKey ?? wallet.publicKey ?? null;

  useEffect(() => {
    if (!target) return;
    let cancelled = false;
    setLoading(true);

    const url = `/api/grades?student=${encodeURIComponent(target)}`;
    fetch(url, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          const mapped: GradeEntry[] = (data.grades ?? []).map((g: any) => ({
            courseCode:  g.courseCode,
            courseTitle: g.courseTitle,
            creditUnits: g.creditUnits,
            score:       g.score,
            grade:       gradeFromScore(g.score),
            points:      gradeToPoints(gradeFromScore(g.score)),
            session:     g.session,
            semester:    g.semester,
          }));
          setGrades(mapped);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [target]);

  const cumGpa = grades.length === 0
    ? 0
    : grades.reduce((a, g) => a + g.points * g.creditUnits, 0) /
      grades.reduce((a, g) => a + g.creditUnits, 0);

  return { grades, cumGpa, loading, error };
}
