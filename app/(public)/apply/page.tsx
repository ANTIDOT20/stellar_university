"use client";

import { useState } from "react";
import { GraduationCap, CheckCircle2, AlertCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FACULTIES } from "@/data/faculties";
import { connectFreighter } from "@/lib/wallet";
import type { WalletState } from "@/types";
import type { Metadata } from "next";

type Step = "wallet" | "form" | "confirm" | "done";

export default function ApplyPage() {
  const [step, setStep]       = useState<Step>("wallet");
  const [wallet, setWallet]   = useState<WalletState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName:    "",
    lastName:     "",
    email:        "",
    facultyId:    "",
    departmentId: "",
    statement:    "",
  });

  const selectedFaculty = FACULTIES.find((f) => f.id === form.facultyId);

  async function connectWallet() {
    setLoading(true);
    setError(null);
    try {
      const state = await connectFreighter();
      setWallet(state);
      setStep("form");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function submitApplication() {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setStep("done");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="gold">Admissions 2025/2026</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            Apply to StellarU
          </h1>
          <p className="text-su-text">
            Connect your Stellar wallet — it becomes your student ID.
            No passwords, no paper forms.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 justify-center">
          {(["wallet", "form", "confirm", "done"] as Step[]).map((s, i) => {
            const steps: Step[] = ["wallet", "form", "confirm", "done"];
            const current = steps.indexOf(step);
            const idx     = steps.indexOf(s);
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full border text-xs flex items-center justify-center font-medium transition-colors ${
                  idx < current  ? "bg-su-green border-su-green text-su-navy" :
                  idx === current ? "border-su-gold text-su-gold"              :
                                    "border-su-border text-su-text"
                }`}>
                  {idx < current ? "✓" : i + 1}
                </div>
                {i < 3 && <div className={`w-8 h-px ${idx < current ? "bg-su-green" : "bg-su-border"}`} />}
              </div>
            );
          })}
        </div>

        <div className="card-glass rounded-2xl p-8 space-y-6">
          {step === "wallet" && (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-su-gold/10 flex items-center justify-center mx-auto">
                <Wallet className="w-8 h-8 text-su-gold" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">Connect your Stellar wallet</h2>
                <p className="text-su-text text-sm mt-1">
                  Your public key will be your on-chain student identity.
                </p>
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <Button size="lg" onClick={connectWallet} loading={loading}>
                <Wallet className="w-4 h-4" />
                Connect Freighter
              </Button>
            </div>
          )}

          {step === "form" && (
            <div className="space-y-5">
              <h2 className="text-white font-semibold">Personal Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "firstName", label: "First Name" },
                  { key: "lastName",  label: "Last Name" },
                ].map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-su-text text-xs uppercase tracking-wider">{f.label}</label>
                    <input
                      type="text"
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <label className="text-su-text text-xs uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-su-text text-xs uppercase tracking-wider">Faculty</label>
                <select
                  value={form.facultyId}
                  onChange={(e) => setForm((p) => ({ ...p, facultyId: e.target.value, departmentId: "" }))}
                  className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-su-gold/50"
                >
                  <option value="">Select faculty…</option>
                  {FACULTIES.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              {selectedFaculty && (
                <div className="space-y-1.5">
                  <label className="text-su-text text-xs uppercase tracking-wider">Department</label>
                  <select
                    value={form.departmentId}
                    onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))}
                    className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-su-gold/50"
                  >
                    <option value="">Select department…</option>
                    {selectedFaculty.departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <Button
                size="lg"
                onClick={() => setStep("confirm")}
                disabled={!form.firstName || !form.lastName || !form.email || !form.departmentId}
              >
                Continue
              </Button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-5">
              <h2 className="text-white font-semibold">Review Application</h2>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Name",       value: `${form.firstName} ${form.lastName}` },
                  { label: "Email",      value: form.email },
                  { label: "Faculty",    value: selectedFaculty?.name },
                  { label: "Wallet",     value: wallet?.publicKey?.slice(0, 20) + "…" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between border-b border-su-border/30 pb-2">
                    <span className="text-su-text">{r.label}</span>
                    <span className="text-white font-medium">{r.value}</span>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("form")}>Back</Button>
                <Button onClick={submitApplication} loading={loading}>Submit Application</Button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-su-green mx-auto" />
              <h2 className="text-white font-semibold text-lg">Application submitted!</h2>
              <p className="text-su-text text-sm max-w-sm mx-auto">
                Your application has been recorded on Stellar. You will receive an
                email confirmation and can check your status in the portal.
              </p>
              <Button onClick={() => window.location.href = "/portal"}>
                Open Portal
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
