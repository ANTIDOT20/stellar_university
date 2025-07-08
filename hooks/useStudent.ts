"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/components/wallet/WalletContext";
import type { StudentRecord } from "@/types";

interface UseStudentReturn {
  student:  StudentRecord | null;
  loading:  boolean;
  error:    string | null;
  refetch:  () => void;
}

export function useStudent(): UseStudentReturn {
  const { wallet }  = useWallet();
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [tick,    setTick]    = useState(0);

  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) {
      setStudent(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/students", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setStudent(data.studentData ?? null);
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
  }, [wallet.connected, wallet.publicKey, tick]);

  return {
    student,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}
