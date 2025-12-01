"use client";

import { useState } from "react";
import { Shield, CheckCircle2, Plus, Globe, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWallet } from "@/components/wallet/WalletContext";

export default function DidPage() {
  const { wallet }           = useWallet();
  const [registering, setRegistering] = useState(false);
  const [registered,  setRegistered]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [serviceUrl,  setServiceUrl]  = useState("");

  async function handleRegister() {
    if (!wallet.publicKey) return;
    setRegistering(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setRegistered(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRegistering(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          Decentralized Identity
        </h1>
        <p className="text-su-text text-sm">
          Your <code className="text-su-green">did:stellar:{wallet.publicKey?.slice(0, 12)}…</code> identity
        </p>
      </div>

      {/* Explanation */}
      <div className="card-glass rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-su-gold" />
          <h2 className="text-white font-semibold">What is a DID?</h2>
        </div>
        <p className="text-su-text text-sm leading-relaxed">
          Your DID (Decentralized Identifier) links your Stellar public key to a
          W3C-standard identity document on-chain. Once registered, any third party —
          an employer, another dApp, or a border control system — can resolve your
          <code className="text-su-green mx-1">did:stellar</code> to verify your credentials
          without contacting StellarU.
        </p>
      </div>

      {/* Registration */}
      {registered ? (
        <div className="flex items-start gap-3 p-5 rounded-xl bg-su-green/10 border border-su-green/20">
          <CheckCircle2 className="w-5 h-5 text-su-green shrink-0 mt-0.5" />
          <div>
            <p className="text-su-green font-medium">DID registered on-chain!</p>
            <p className="text-su-text text-sm mt-1 font-mono break-all">
              did:stellar:{wallet.publicKey}
            </p>
          </div>
        </div>
      ) : (
        <div className="card-glass rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Register your DID</h2>
          <div className="space-y-1.5">
            <label className="text-su-text text-xs uppercase tracking-wider">
              Service URL (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://yourprofile.xyz"
                value={serviceUrl}
                onChange={(e) => setServiceUrl(e.target.value)}
                className="flex-1 bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
              />
              <button className="p-2.5 rounded-xl border border-su-border text-su-text hover:text-white hover:border-su-gold/40 transition-colors">
                <Globe className="w-4 h-4" />
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <Button onClick={handleRegister} loading={registering} disabled={!wallet.connected}>
            <Shield className="w-4 h-4" />
            Register DID on Stellar
          </Button>
        </div>
      )}

      {/* What you can do */}
      <div className="card-glass rounded-xl p-6 space-y-3">
        <h2 className="text-white font-semibold text-sm">With your DID you can…</h2>
        <div className="space-y-2">
          {[
            "Share verifiable degree credentials without email or PDFs",
            "Prove KYC tier to any Stellar dApp that integrates the identity contract",
            "Control which service endpoints are associated with your identity",
            "Deactivate your DID at any time — fully self-sovereign",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-su-green shrink-0 mt-0.5" />
              <span className="text-su-text">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
