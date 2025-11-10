import Link from "next/link";
import { FileText, Download, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whitepaper",
  description: "StellarU Protocol technical whitepaper — architecture, tokenomics, governance, and roadmap.",
};

const SECTIONS = [
  { num: "1",   title: "Abstract" },
  { num: "2",   title: "Introduction & Problem Statement" },
  { num: "3",   title: "University Protocol Architecture" },
  { num: "3.1", title: "Smart Contract Suite" },
  { num: "3.2", title: "Multi-tenant Deployment Model" },
  { num: "4",   title: "Identity Layer — did:stellar" },
  { num: "4.1", title: "DID Document Structure" },
  { num: "4.2", title: "Verifiable Credentials" },
  { num: "5",   title: "Anchor Payment Rails (SEP-31)" },
  { num: "5.1", title: "Cross-border Tuition Flow" },
  { num: "5.2", title: "Supported Currencies and Partners" },
  { num: "6",   title: "Governance" },
  { num: "7",   title: "Security Considerations" },
  { num: "8",   title: "Roadmap" },
  { num: "9",   title: "Conclusion" },
];

export default function WhitepaperPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <Badge variant="gold">Technical Whitepaper</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            StellarU Protocol v0.1
          </h1>
          <p className="text-su-text max-w-xl mx-auto">
            A decentralized university infrastructure built on Stellar — combining
            on-chain credentials, DID identity, and cross-border payment rails.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </a>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                Technical Docs
              </Button>
            </Link>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="card-glass rounded-2xl p-8 space-y-4">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-su-gold" />
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SECTIONS.map((s) => (
              <div key={s.num} className="flex items-center gap-3 py-1 text-sm border-b border-su-border/20">
                <span className="text-su-gold font-mono text-xs w-8 shrink-0">{s.num}</span>
                <span className="text-su-text">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Abstract */}
        <div className="card-glass rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-su-gold font-mono text-sm">1</span>
            <h2 className="text-white font-semibold text-xl">Abstract</h2>
          </div>
          <p className="text-su-text leading-relaxed">
            StellarU is an open-source protocol for decentralized university infrastructure
            on the Stellar blockchain. It addresses three connected problems: credential fraud
            in higher education, payment friction for international students, and the lack of
            a composable identity primitive in the Stellar ecosystem.
          </p>
          <p className="text-su-text leading-relaxed">
            The protocol consists of three layers: (1) a university contract suite built on
            Soroban for student registry, course enrollment, grading, and credential issuance;
            (2) a decentralized identity layer implementing the W3C DID specification as
            <code className="text-su-green mx-1">did:stellar</code>; and (3) SEP-31 anchor
            payment rails enabling cross-border tuition payment in any local currency.
          </p>
          <p className="text-su-text leading-relaxed">
            Any institution can deploy the same contracts in under one hour. All credentials
            are verifiable by any third party without contacting the issuing institution.
          </p>
        </div>

        <p className="text-su-text text-sm text-center">
          Full whitepaper available as PDF. Sections 3–9 released with v0.2 (Q1 2026).
        </p>
      </div>
    </main>
  );
}
