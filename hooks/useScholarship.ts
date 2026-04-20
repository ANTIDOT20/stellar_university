"use client";

import { useState, useEffect } from "react";

export interface ScholarshipItem {
  id:        string;
  name:      string;
  amount:    number;
  minGpa:    number;
  awarded:   number;
  maxAwards: number;
  deadline:  string;
  open:      boolean;
}

export function useScholarships() {
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    fetch("/api/scholarships")
      .then((r) => r.json())
      .then((data: ScholarshipItem[]) => setScholarships(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function apply(scholarshipId: string): Promise<void> {
    const res = await fetch("/api/scholarships", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ scholarshipId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Application failed");
    }
  }

  return { scholarships, loading, apply };
}
