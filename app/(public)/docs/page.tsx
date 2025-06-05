import Link from "next/link";
import { Code2, BookOpen, Shield, Globe, Terminal, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "StellarU Protocol documentation — deploy your own university, integrate credentials, and use the SEP-31 anchor rails.",
};

const SECTIONS = [
  {
    icon:  BookOpen,
    title: "Getting Started",
    links: [
      { label: "Introduction",           href: "#" },
      { label: "Architecture Overview",  href: "#" },
      { label: "Quick Start (Testnet)",  href: "#" },
    ],
  },
  {
    icon:  Code2,
    title: "Smart Contracts",
    links: [
      { label: "student_registry",       href: "#" },
      { label: "course_registry",        href: "#" },
      { label: "enrollment",             href: "#" },
      { label: "tuition",                href: "#" },
      { label: "grading",                href: "#" },
      { label: "credential",             href: "#" },
      { label: "scholarship",            href: "#" },
      { label: "governance",             href: "#" },
    ],
  },
  {
    icon:  Shield,
    title: "Identity Layer",
    links: [
      { label: "did:stellar spec",       href: "#" },
      { label: "Issuing credentials",    href: "#" },
      { label: "Verifying credentials",  href: "#" },
      { label: "Credential SDK",         href: "#" },
    ],
  },
  {
    icon:  Globe,
    title: "Anchor Rails (SEP-31)",
    links: [
      { label: "Payment flow overview",  href: "#" },
      { label: "Anchor contract API",    href: "#" },
      { label: "Off-chain backend",      href: "#" },
      { label: "Supported currencies",   href: "#" },
    ],
  },
  {
    icon:  Terminal,
    title: "Deploy Your University",
    links: [
      { label: "Prerequisites",          href: "#" },
      { label: "Contract deployment",    href: "#" },
      { label: "Environment variables",  href: "#" },
      { label: "Customising branding",   href: "#" },
    ],
  },
];

const CONTRACT_EXAMPLES = [
  {
    title: "Register a student",
    code: `// student_registry
const result = await contract.invoke({
  method: "register",
  args: [
    new Address(studentPublicKey),
    nativeToScVal("SU/2025/001", { type: "string" }),
    nativeToScVal("Ada", { type: "string" }),
    nativeToScVal("Okafor", { type: "string" }),
    nativeToScVal("CSC", { type: "string" }),
    nativeToScVal(100, { type: "u32" }),
  ],
});`,
  },
  {
    title: "Verify a credential",
    code: `// credential contract
const verified = await contract.invoke({
  method: "verify",
  args: [credentialIdBytes],
});
// returns true | false — no university API call needed`,
  },
  {
    title: "Resolve a DID",
    code: `// identity contract — did:stellar:<pubkey>
const didDoc = await contract.invoke({
  method: "resolve",
  args: [new Address(publicKey)],
});
console.log(didDoc.service_urls, didDoc.active);`,
  },
];

export default function DocsPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div>
              <Badge variant="gold">Documentation</Badge>
              <h1 className="text-2xl font-display font-bold text-white mt-3">
                StellarU Protocol
              </h1>
              <p className="text-su-text text-sm mt-2">
                v0.1.0-testnet
              </p>
            </div>

            {SECTIONS.map((section) => (
              <div key={section.title} className="space-y-2">
                <div className="flex items-center gap-2">
                  <section.icon className="w-4 h-4 text-su-gold" />
                  <h3 className="text-white text-sm font-semibold">{section.title}</h3>
                </div>
                <ul className="space-y-1.5 pl-6">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-su-text text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Main */}
          <div className="lg:col-span-3 space-y-12">
            <section className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-white">
                Introduction
              </h2>
              <p className="text-su-text leading-relaxed">
                StellarU Protocol is an open-source, multi-tenant university infrastructure
                built on the Stellar blockchain. It consists of three independent but
                composable layers: the University Protocol (Soroban smart contracts for
                student registry, courses, grading, and credentials), the Identity Layer
                (a did:stellar DID primitive), and the Anchor Rails (SEP-31 cross-border
                tuition payment infrastructure).
              </p>
              <p className="text-su-text leading-relaxed">
                Any institution — university, polytechnic, bootcamp — can deploy its own
                instance from the same MIT-licensed codebase in under an hour.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-white">
                Code Examples
              </h2>
              {CONTRACT_EXAMPLES.map((ex) => (
                <div key={ex.title} className="space-y-2">
                  <h3 className="text-white font-medium text-sm">{ex.title}</h3>
                  <pre className="bg-su-navy/80 border border-su-border rounded-xl p-5 overflow-x-auto text-xs text-su-green leading-relaxed">
                    <code>{ex.code}</code>
                  </pre>
                </div>
              ))}
            </section>

            <section className="card-glass rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-display font-bold text-white">
                Deploy your own university
              </h2>
              <ol className="space-y-3 text-sm text-su-text list-none">
                {[
                  "Fork the GitHub repository",
                  "Copy .env.example → .env and set your Stellar keypair and RPC URL",
                  "Run `stellar contract deploy` for each contract in /contracts",
                  "Update NEXT_PUBLIC_CONTRACT_* env vars with deployed addresses",
                  "Deploy the Next.js frontend on Vercel or self-host",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-su-gold/20 text-su-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <a href="https://github.com/stellaru-protocol" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-su-gold text-sm hover:underline">
                View on GitHub <ArrowRight className="w-4 h-4" />
              </a>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
