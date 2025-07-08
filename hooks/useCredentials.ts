"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/components/wallet/WalletContext";
import type { CredentialRecord } from "@/types";

interface UseCredentialsReturn {
  credentials: CredentialRecord[];
  loading:     boolean;
  error:       string | null;
}

export function useCredentials(): UseCredentialsReturn {
  const { wallet } = useWallet();
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!wallet.connected) {
      setCredentials([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch("/api/credentials", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setCredentials(data.credentials ?? []);
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
  }, [wallet.connected]);

  return { credentials, loading, error };
}
