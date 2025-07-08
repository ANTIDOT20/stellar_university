"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/components/wallet/WalletContext";

interface UseFeesReturn {
  feesPaid:  boolean;
  loading:   boolean;
  error:     string | null;
  refetch:   () => void;
}

export function useFees(session: string, semester: number): UseFeesReturn {
  const { wallet }  = useWallet();
  const [feesPaid, setFeesPaid] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [tick,     setTick]     = useState(0);

  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return;

    let cancelled = false;
    setLoading(true);

    const url = `/api/payments?session=${encodeURIComponent(session)}&semester=${semester}`;
    fetch(url, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setFeesPaid(Boolean(data.feesPaid));
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
  }, [wallet.connected, wallet.publicKey, session, semester, tick]);

  return { feesPaid, loading, error, refetch: () => setTick((t) => t + 1) };
}
