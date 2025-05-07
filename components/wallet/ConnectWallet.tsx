"use client";

import { useState, useCallback } from "react";
import { Wallet, Loader2, ChevronDown, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { connectFreighter, connectAlbedo, disconnectWallet, truncateAddress } from "@/lib/wallet";
import type { WalletState } from "@/types";

interface Props {
  wallet: WalletState;
  onConnect: (state: WalletState) => void;
  onDisconnect: () => void;
  className?: string;
}

export function ConnectWallet({ wallet, onConnect, onDisconnect, className }: Props) {
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const [copied, setCopied]     = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleConnect = useCallback(async (provider: "freighter" | "albedo") => {
    setError(null);
    setLoading(true);
    try {
      const state = provider === "freighter"
        ? await connectFreighter()
        : await connectAlbedo();
      onConnect(state);
      setShowModal(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [onConnect]);

  const copyAddress = useCallback(async () => {
    if (!wallet.publicKey) return;
    await navigator.clipboard.writeText(wallet.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [wallet.publicKey]);

  if (!wallet.connected) {
    return (
      <>
        <Button
          size="sm"
          onClick={() => setShowModal(true)}
          loading={loading}
          className={className}
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>

        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-su-slate border border-su-border rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-1">
                <h2 className="text-white font-semibold text-lg">Connect Wallet</h2>
                <p className="text-su-text text-sm">Choose a Stellar wallet to continue</p>
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => handleConnect("freighter")}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-su-border hover:border-su-gold/50 hover:bg-su-gold/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <img src="/wallets/freighter.svg" alt="Freighter" className="w-6 h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <Wallet className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-medium text-sm group-hover:text-su-gold transition-colors">Freighter</div>
                    <div className="text-su-text text-xs">Official Stellar browser extension</div>
                  </div>
                </button>

                <button
                  onClick={() => handleConnect("albedo")}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-su-border hover:border-su-gold/50 hover:bg-su-gold/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-medium text-sm group-hover:text-su-gold transition-colors">Albedo</div>
                    <div className="text-su-text text-xs">Web-based Stellar signing service</div>
                  </div>
                </button>
              </div>

              <p className="text-su-text text-xs text-center">
                No wallet?{" "}
                <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" className="text-su-gold hover:underline">
                  Get Freighter
                </a>
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-su-border bg-su-slate/50 hover:border-su-gold/40 transition-all text-sm"
      >
        <div className="w-2 h-2 rounded-full bg-su-green" />
        <span className="text-white font-mono">
          {truncateAddress(wallet.publicKey ?? "")}
        </span>
        <ChevronDown className={`w-3 h-3 text-su-text transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-su-slate border border-su-border rounded-xl shadow-xl p-3 space-y-1 z-50">
          <div className="px-2 py-1.5 mb-2">
            <p className="text-su-text text-xs uppercase tracking-wider font-medium">Connected</p>
            <p className="text-white text-xs font-mono mt-1 break-all">
              {wallet.publicKey}
            </p>
          </div>

          <button
            onClick={copyAddress}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-su-text hover:text-white hover:bg-su-navy/60 text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-su-green" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Address"}
          </button>

          <a
            href={`https://stellar.expert/explorer/testnet/account/${wallet.publicKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-su-text hover:text-white hover:bg-su-navy/60 text-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on Explorer
          </a>

          <hr className="border-su-border/50 my-1" />

          <button
            onClick={() => { onDisconnect(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
