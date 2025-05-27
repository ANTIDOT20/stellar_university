"use client";

import { useState } from "react";
import { Award, Shield, ExternalLink, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWallet } from "@/components/wallet/WalletContext";

interface Credential {
  id:          string;
  type:        string;
  issuer:      string;
  issuedAt:    string;
  ipfsCid:     string;
  degreeClass: string;
  session:     string;
  verified:    boolean;
}

const MOCK_CREDS: Credential[] = [];

export default function CertificatePage() {
  const { wallet } = useWallet();
  const [requesting, setRequesting] = useState(false);

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Credentials</h1>
        <p className="text-su-text text-sm">
          On-chain verifiable credentials issued to your Stellar address
        </p>
      </div>

      {/* How it works */}
      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-su-gold" />
          <h2 className="text-white font-semibold">How credentials work</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { step: "1", text: "Degree is awarded on-chain by admin after graduation" },
            { step: "2", text: "Certificate PDF stored on IPFS — CID recorded in contract" },
            { step: "3", text: "Anyone can verify with the credential ID — no university contact needed" },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-su-gold/20 text-su-gold text-xs font-bold flex items-center justify-center shrink-0">
                {s.step}
              </span>
              <p className="text-su-text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credential list */}
      {MOCK_CREDS.length === 0 ? (
        <div className="card-glass rounded-xl p-10 text-center space-y-3">
          <Award className="w-10 h-10 text-su-text mx-auto" />
          <p className="text-white font-medium">No credentials yet</p>
          <p className="text-su-text text-sm max-w-sm mx-auto">
            Credentials are minted on-chain when you complete a programme.
            You are currently in Level 100 — keep studying!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_CREDS.map((cred) => (
            <div key={cred.id} className="card-glass rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold">{cred.type}</p>
                  <p className="text-su-text text-sm">{cred.degreeClass} · {cred.session}</p>
                </div>
                <Badge variant={cred.verified ? "green" : "default"}>
                  {cred.verified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="text-xs font-mono text-su-text">ID: {cred.id}</div>
              <div className="flex gap-2">
                <a
                  href={`https://ipfs.io/ipfs/${cred.ipfsCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3.5 h-3.5" />
                    IPFS
                  </Button>
                </a>
                <Button size="sm">
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification tool */}
      <div className="card-glass rounded-xl p-6 space-y-3">
        <h2 className="text-white font-semibold">Verify any credential</h2>
        <p className="text-su-text text-sm">
          Enter a credential ID to verify it on-chain.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Credential ID (hex or base64)"
            className="flex-1 bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
          />
          <Button variant="outline">Verify</Button>
        </div>
      </div>
    </div>
  );
}
