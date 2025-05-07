"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { WalletState } from "@/types";
import { disconnectWallet } from "@/lib/wallet";

interface WalletContextValue {
  wallet: WalletState;
  setWallet: (state: WalletState) => void;
  disconnect: () => void;
}

const defaultWallet: WalletState = {
  connected: false,
  publicKey: null,
  network:   "TESTNET",
  provider:  null,
};

const WalletContext = createContext<WalletContextValue>({
  wallet:     defaultWallet,
  setWallet:  () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWalletState] = useState<WalletState>(defaultWallet);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("stellaru_wallet");
      if (stored) {
        const parsed = JSON.parse(stored) as WalletState;
        if (parsed.connected && parsed.publicKey) setWalletState(parsed);
      }
    } catch {}
  }, []);

  function setWallet(state: WalletState) {
    setWalletState(state);
    try {
      if (state.connected) {
        sessionStorage.setItem("stellaru_wallet", JSON.stringify(state));
      } else {
        sessionStorage.removeItem("stellaru_wallet");
      }
    } catch {}
  }

  function disconnect() {
    setWallet(disconnectWallet());
  }

  return (
    <WalletContext.Provider value={{ wallet, setWallet, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  return useContext(WalletContext);
}
