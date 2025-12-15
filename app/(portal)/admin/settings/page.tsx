"use client";

import { useState } from "react";
import { Settings, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const ENV_VARS = [
  { key: "NEXT_PUBLIC_CONTRACT_STUDENT_REGISTRY", label: "Student Registry Contract" },
  { key: "NEXT_PUBLIC_CONTRACT_CREDENTIAL",       label: "Credential Contract"        },
  { key: "NEXT_PUBLIC_CONTRACT_IDENTITY",         label: "Identity Contract"          },
  { key: "NEXT_PUBLIC_CONTRACT_TUITION",          label: "Tuition Contract"           },
  { key: "NEXT_PUBLIC_CONTRACT_ANCHOR",           label: "Anchor Contract"            },
];

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-su-gold" />
        <h1 className="text-2xl font-display font-bold text-white">Protocol Settings</h1>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-5">
        <h2 className="text-white font-semibold">Contract Addresses</h2>
        <div className="space-y-4">
          {ENV_VARS.map((v) => (
            <div key={v.key} className="space-y-1.5">
              <label className="text-su-text text-xs uppercase tracking-wider">{v.label}</label>
              <input
                type="text"
                defaultValue={process.env[v.key] ?? ""}
                readOnly
                className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-su-gold/5 border border-su-gold/20 text-sm">
          <AlertCircle className="w-4 h-4 text-su-gold shrink-0" />
          <span className="text-su-text">
            Contract addresses are set via environment variables. Redeploy the app to update.
          </span>
        </div>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Network</h2>
        <div className="flex items-center justify-between">
          <span className="text-su-text text-sm">Stellar Network</span>
          <Badge variant={process.env.NEXT_PUBLIC_STELLAR_NETWORK === "MAINNET" ? "green" : "blue"}>
            {process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "TESTNET"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-su-text text-sm">RPC URL</span>
          <span className="text-white text-xs font-mono">
            {process.env.NEXT_PUBLIC_SOROBAN_RPC_URL?.replace("https://", "") ?? "soroban-testnet.stellar.org"}
          </span>
        </div>
      </div>
    </div>
  );
}
