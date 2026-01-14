"use client";

import { useState } from "react";
import { Award, Search, Upload, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { truncateAddress } from "@stellaru/credential-sdk";

interface CredentialRow {
  id:       string;
  subject:  string;
  type:     string;
  session:  string;
  issuedAt: string;
  ipfsCid:  string;
  revoked:  boolean;
}

const MOCK_CREDENTIALS: CredentialRow[] = [
  { id: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2", subject: "GABC...XYZ1", type: "Degree",     session: "2024/2025", issuedAt: "Jan 10, 2026", ipfsCid: "QmXyz1",  revoked: false },
  { id: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3", subject: "GBCD...XYZ2", type: "Transcript", session: "2024/2025", issuedAt: "Jan 9, 2026",  ipfsCid: "QmXyz2",  revoked: false },
  { id: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4", subject: "GCDE...XYZ3", type: "KycTier2",   session: "2023/2024", issuedAt: "Oct 5, 2025",  ipfsCid: "QmXyz3",  revoked: true  },
];

export default function AdminCredentialsPage() {
  const [search,      setSearch]      = useState("");
  const [issueOpen,   setIssueOpen]   = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [uploadDone,  setUploadDone]  = useState(false);
  const [form,        setForm]        = useState({ subject: "", type: "Degree", session: "2025/2026" });

  const filtered = MOCK_CREDENTIALS.filter(
    (c) =>
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleIssue() {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setUploading(false);
    setUploadDone(true);
    setTimeout(() => { setUploadDone(false); setIssueOpen(false); }, 2500);
  }

  return (
    <div className="p-8 max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-su-gold" />
          <h1 className="text-2xl font-display font-bold text-white">Credentials</h1>
        </div>
        <Button onClick={() => setIssueOpen(true)}>
          <Upload className="w-4 h-4" />
          Issue Credential
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-su-text" />
        <input
          type="text"
          placeholder="Search by subject or type…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-su-navy/60 border border-su-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-su-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-su-border bg-su-navy/40">
              {["Credential ID", "Subject", "Type", "Session", "Issued", "IPFS", "Status"].map((h) => (
                <th key={h} className="text-left text-su-text text-xs uppercase tracking-wider px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((cred) => (
              <tr key={cred.id} className="border-b border-su-border/40 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-su-text">
                  {cred.id.slice(0, 16)}…
                </td>
                <td className="px-4 py-3 text-white font-mono text-xs">{cred.subject}</td>
                <td className="px-4 py-3">
                  <Badge variant="blue">{cred.type}</Badge>
                </td>
                <td className="px-4 py-3 text-su-text">{cred.session}</td>
                <td className="px-4 py-3 text-su-text">{cred.issuedAt}</td>
                <td className="px-4 py-3">
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${cred.ipfsCid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-su-gold text-xs hover:underline"
                  >
                    {cred.ipfsCid}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="px-4 py-3">
                  {cred.revoked ? (
                    <span className="flex items-center gap-1 text-red-400 text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Revoked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-su-green text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue modal */}
      <Modal open={issueOpen} onClose={() => setIssueOpen(false)} title="Issue Credential">
        {uploadDone ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="w-10 h-10 text-su-green" />
            <p className="text-white font-medium">Credential issued on-chain!</p>
            <p className="text-su-text text-sm text-center">Metadata pinned to IPFS and credential ID recorded in the contract.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-su-text text-xs uppercase tracking-wider">Student Public Key</label>
              <input
                type="text"
                placeholder="G…"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-su-text text-xs uppercase tracking-wider">Credential Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-su-gold/50"
              >
                {["Degree", "Diploma", "Transcript", "Certificate", "KycTier1", "KycTier2"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-su-text text-xs uppercase tracking-wider">Academic Session</label>
              <select
                value={form.session}
                onChange={(e) => setForm({ ...form, session: e.target.value })}
                className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-su-gold/50"
              >
                {["2024/2025", "2025/2026"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-su-gold/5 border border-su-gold/20 text-xs text-su-text">
              <Clock className="w-4 h-4 text-su-gold shrink-0" />
              Metadata will be pinned to IPFS via Pinata before the on-chain credential is issued.
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setIssueOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                loading={uploading}
                disabled={!form.subject}
                onClick={handleIssue}
              >
                Issue
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
