"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle2, XCircle, Search, ExternalLink, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { isValidCredentialId } from "@stellaru/credential-sdk";

interface VerifyResult {
  valid:       boolean;
  holder:      string;
  type:        string;
  issuer:      string;
  issuedAt:    string;
  degreeClass: string;
  ipfsCid:     string;
}

export default function VerifyPage() {
  const [id,       setId]      = useState("");
  const [result,   setResult]  = useState<VerifyResult | null>(null);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const idValid = isValidCredentialId(id.trim());

  async function handleVerify() {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSearched(true);

    try {
      const res = await fetch("/api/credentials", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ credentialId: id.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.valid) {
        setResult({
          valid:       true,
          holder:      data.holder ?? "Unknown",
          type:        data.type   ?? "Degree",
          issuer:      data.issuer ?? "StellarU",
          issuedAt:    data.issuedAt ? new Date(data.issuedAt * 1000).toLocaleDateString() : "—",
          degreeClass: data.degreeClass ?? "—",
          ipfsCid:     data.ipfsCid ?? "",
        });
      } else {
        setResult({ valid: false, holder: "", type: "", issuer: "", issuedAt: "", degreeClass: "", ipfsCid: "" });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-su-gold/10 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-su-gold" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            Verify a Credential
          </h1>
          <p className="text-su-text">
            Paste any StellarU credential ID to check its authenticity on-chain.
            No account needed — verification is fully public.
          </p>
        </div>

        {/* Search */}
        <div className="card-glass rounded-2xl p-6 space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Credential ID (64-char hex)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="flex-1 bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50 font-mono"
            />
            <Button onClick={handleVerify} loading={loading} disabled={!idValid || loading}>
              <Search className="w-4 h-4" />
              Verify
            </Button>
          </div>

          {id && !idValid && (
            <p className="text-su-text text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-su-gold" />
              Credential IDs are 64-character lowercase hex strings.
            </p>
          )}

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>

        {/* Result */}
        {searched && !loading && result && (
          <div className={`card-glass rounded-2xl p-6 space-y-5 border ${result.valid ? "border-su-green/30" : "border-red-500/30"}`}>
            <div className="flex items-center gap-3">
              {result.valid
                ? <CheckCircle2 className="w-6 h-6 text-su-green" />
                : <XCircle className="w-6 h-6 text-red-400" />}
              <div>
                <p className={`font-semibold ${result.valid ? "text-su-green" : "text-red-400"}`}>
                  {result.valid ? "Valid credential" : "Invalid or revoked"}
                </p>
                <p className="text-su-text text-xs">
                  {result.valid
                    ? "This credential exists on-chain and has not been revoked."
                    : "No valid credential found for this ID."}
                </p>
              </div>
            </div>

            {result.valid && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Holder",       value: result.holder    },
                  { label: "Type",         value: result.type      },
                  { label: "Issuer",       value: result.issuer    },
                  { label: "Issued",       value: result.issuedAt  },
                  { label: "Degree Class", value: result.degreeClass },
                ].map((r) => (
                  <div key={r.label}>
                    <p className="text-su-text text-xs">{r.label}</p>
                    <p className="text-white font-medium truncate">{r.value || "—"}</p>
                  </div>
                ))}
              </div>
            )}

            {result.valid && result.ipfsCid && (
              <a
                href={`https://ipfs.io/ipfs/${result.ipfsCid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-su-gold text-sm hover:underline"
              >
                View certificate on IPFS <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
