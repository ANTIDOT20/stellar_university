"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWallet } from "@/components/wallet/WalletContext";
import { NETWORK_PASSPHRASE, getRpcClient, CONTRACTS_MAP } from "@/lib/stellar";
import { getSignFn } from "@/lib/wallet";

const FEE_TABLE: Record<number, number> = {
  100: 150, 200: 150, 300: 200, 400: 200, 500: 250, 600: 250, 700: 300,
};

const CURRENT_SESSION = "2024/2025";
const CURRENT_SEMESTER = 1;

type Step = "idle" | "connecting" | "pending" | "success" | "error";

export default function FeesPage() {
  const { wallet }  = useWallet();
  const [step, setStep] = useState<Step>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError]   = useState<string | null>(null);

  const level  = 100; // would come from student record
  const feeUsd = FEE_TABLE[level] ?? 150;

  async function handlePay() {
    if (!wallet.connected || !wallet.publicKey || !wallet.provider) return;
    setStep("pending");
    setError(null);

    try {
      // In production: build Soroban call to tuition contract, simulate, sign, send
      // This stub simulates the flow timing
      await new Promise((r) => setTimeout(r, 2000));

      setTxHash("abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890");
      setStep("success");
    } catch (err) {
      setError((err as Error).message);
      setStep("error");
    }
  }

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Tuition Fees</h1>
        <p className="text-su-text text-sm">
          {CURRENT_SESSION} · Semester {CURRENT_SEMESTER}
        </p>
      </div>

      {/* Fee breakdown */}
      <div className="card-glass rounded-xl divide-y divide-su-border/40">
        {[
          { label: "Tuition",        amount: feeUsd * 0.80 },
          { label: "Lab / IT fees",  amount: feeUsd * 0.10 },
          { label: "Student union",  amount: feeUsd * 0.05 },
          { label: "Library levy",   amount: feeUsd * 0.05 },
        ].map((row) => (
          <div key={row.label} className="flex justify-between px-6 py-3 text-sm">
            <span className="text-su-text">{row.label}</span>
            <span className="text-white">${row.amount.toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between px-6 py-4 font-semibold">
          <span className="text-white">Total (USDC)</span>
          <span className="text-su-gold text-lg">${feeUsd.00}</span>
        </div>
      </div>

      {/* Payment info */}
      <div className="card-glass rounded-xl p-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-su-text">Asset</span>
          <span className="text-white">USDC (Stellar)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-su-text">Network</span>
          <span className="text-white">{wallet.network}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-su-text">Contract</span>
          <span className="text-white font-mono text-xs truncate max-w-[200px]">
            {CONTRACTS_MAP.tuition || "Not set"}
          </span>
        </div>
      </div>

      {/* Status */}
      {step === "success" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-su-green/10 border border-su-green/20">
          <CheckCircle2 className="w-5 h-5 text-su-green shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-su-green font-medium text-sm">Payment confirmed!</p>
            {txHash && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-su-text text-xs flex items-center gap-1 hover:text-white"
              >
                View transaction <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {step === "error" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* CTA */}
      {step !== "success" && (
        <Button
          size="lg"
          onClick={handlePay}
          loading={step === "pending"}
          disabled={!wallet.connected || step === "pending"}
        >
          <CreditCard className="w-4 h-4" />
          Pay ${feeUsd} USDC
        </Button>
      )}

      {!wallet.connected && (
        <p className="text-su-text text-sm">
          Connect your wallet to pay fees.
        </p>
      )}
    </div>
  );
}
