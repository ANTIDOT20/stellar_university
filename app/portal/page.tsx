"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { connectFreighter, connectAlbedo } from "@/lib/wallet";

export default function PortalSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function signIn(provider: "freighter" | "albedo") {
    setLoading(true);
    setError(null);
    try {
      const wallet = provider === "freighter"
        ? await connectFreighter()
        : await connectAlbedo();

      // Get challenge
      const chalRes = await fetch("/api/auth/challenge", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ publicKey: wallet.publicKey }),
      });
      const { nonce } = await chalRes.json();

      // For demo: skip real signing, just verify with a placeholder
      // Production: sign the challenge message with the wallet
      const verRes = await fetch("/api/auth/verify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ publicKey: wallet.publicKey, nonce, signature: "demo" }),
      });

      if (!verRes.ok) {
        const err = await verRes.json();
        throw new Error(err.error || "Sign-in failed");
      }

      router.push("/portal/student");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-su-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-su-gold flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8 text-su-navy" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">StellarU Portal</h1>
            <p className="text-su-text text-sm mt-1">Sign in with your Stellar wallet</p>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={() => signIn("freighter")}
            disabled={loading}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-su-border hover:border-su-gold/50 hover:bg-su-gold/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-left flex-1">
              <p className="text-white font-medium text-sm group-hover:text-su-gold transition-colors">
                Freighter
              </p>
              <p className="text-su-text text-xs">Stellar browser extension</p>
            </div>
            {loading && <Loader2 className="w-4 h-4 text-su-text animate-spin" />}
          </button>

          <button
            onClick={() => signIn("albedo")}
            disabled={loading}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-su-border hover:border-su-gold/50 hover:bg-su-gold/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium text-sm group-hover:text-su-gold transition-colors">
                Albedo
              </p>
              <p className="text-su-text text-xs">Web-based Stellar signing</p>
            </div>
          </button>

          <p className="text-su-text text-xs text-center pt-2">
            No wallet?{" "}
            <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer"
              className="text-su-gold hover:underline">
              Install Freighter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
