import Link from "next/link";
import { Shield, Globe, Award, Code2, Users, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FACULTIES, getTotalDepartments } from "@/data/faculties";
import { STATS } from "@/data/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About StellarU",
  description: "Learn about StellarU — a decentralized science university protocol built on the Stellar blockchain with NUC-aligned curriculum.",
};

const LAYERS = [
  {
    icon: BookOpen,
    phase: "Phase 1 · Live",
    title: "University Protocol",
    body:
      "On-chain student registry, course enrollment, grading, and degree credentialing. Any institution can fork and deploy the same Soroban contracts with their own branding.",
    color: "text-su-gold",
    bg:    "bg-su-gold/10",
    badge: "green" as const,
  },
  {
    icon: Shield,
    phase: "Phase 2 · In Development",
    title: "Identity & Credential Layer",
    body:
      "A DID primitive for the Stellar ecosystem. Issue verifiable credentials (degrees, transcripts, KYC tiers) that any dApp can verify without contacting the university.",
    color: "text-blue-400",
    bg:    "bg-blue-500/10",
    badge: "blue" as const,
  },
  {
    icon: Globe,
    phase: "Phase 3 · Roadmap",
    title: "SEP-31 Anchor Rails",
    body:
      "Cross-border tuition payments over Stellar's anchor network. Pay from any fiat currency via local payment channels — settlement happens in USDC on-chain.",
    color: "text-su-green",
    bg:    "bg-su-green/10",
    badge: "default" as const,
  },
];

const TEAM = [
  { role: "Protocol Lead",      initials: "TF" },
  { role: "Smart Contracts",    initials: "AA" },
  { role: "Frontend Engineer",  initials: "MK" },
  { role: "Academic Liaison",   initials: "OB" },
];

export default function AboutPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* Hero */}
        <section className="text-center space-y-5">
          <Badge variant="gold">About StellarU</Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            A university built{" "}
            <span className="gradient-text">on-chain</span>
          </h1>
          <p className="text-su-text text-lg max-w-2xl mx-auto leading-relaxed">
            StellarU is both a science university and an open protocol. Every
            admission, transcript, and degree certificate lives on the Stellar
            blockchain — tamper-proof and globally verifiable.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: FACULTIES.length,        label: "Faculties" },
            { value: getTotalDepartments(),   label: "Departments" },
            { value: STATS[2].value,          label: "On-chain txns" },
            { value: STATS[0].value,          label: "Students enrolled" },
          ].map((s) => (
            <div key={s.label} className="card-glass rounded-xl p-5 text-center">
              <p className="text-3xl font-display font-bold text-white">{s.value}</p>
              <p className="text-su-text text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Mission */}
        <section className="card-glass rounded-2xl p-8 md:p-10 space-y-4">
          <h2 className="text-2xl font-display font-bold text-white">Our Mission</h2>
          <p className="text-su-text leading-relaxed">
            Nigeria produces some of Africa's brightest science graduates, yet
            credential fraud, payment friction, and opaque admission processes
            undermine the value of those qualifications. StellarU was built to
            fix all three at once — using the Stellar network's low-cost, fast
            settlement layer and Soroban smart contracts for programmable rules.
          </p>
          <p className="text-su-text leading-relaxed">
            Beyond our own campus, we ship the entire protocol as open-source
            MIT-licensed software. Any university, polytechnic, or training
            provider can fork it, customise the curriculum, and deploy their
            own instance in under an hour.
          </p>
        </section>

        {/* Architecture layers */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">Three-Layer Architecture</h2>
            <p className="text-su-text">
              Designed so each layer is independently useful for the broader Stellar ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LAYERS.map((layer) => (
              <div key={layer.title} className="card-glass rounded-2xl p-6 space-y-4">
                <div className={`w-10 h-10 rounded-xl ${layer.bg} flex items-center justify-center`}>
                  <layer.icon className={`w-5 h-5 ${layer.color}`} />
                </div>
                <div>
                  <p className="text-xs text-su-text mb-1">{layer.phase}</p>
                  <h3 className="text-white font-semibold mb-2">{layer.title}</h3>
                  <p className="text-su-text text-sm leading-relaxed">{layer.body}</p>
                </div>
                <Badge variant={layer.badge}>
                  {layer.phase.split(" · ")[1]}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Smart contracts */}
        <section className="card-glass rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-su-gold" />
            <h2 className="text-xl font-display font-bold text-white">Smart Contract Suite</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              "student_registry", "course_registry", "enrollment",
              "tuition", "grading", "credential", "scholarship",
              "governance", "identity", "anchor",
            ].map((c) => (
              <div
                key={c}
                className="px-3 py-2 rounded-lg bg-su-navy/60 border border-su-border text-center"
              >
                <code className="text-xs text-su-green">{c}</code>
              </div>
            ))}
          </div>
          <p className="text-su-text text-sm">
            All contracts are written in Rust targeting Soroban and are MIT-licensed.
            See{" "}
            <Link href="/docs" className="text-su-gold hover:underline">
              docs
            </Link>{" "}
            for deployment guides.
          </p>
        </section>

        {/* Team */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-white text-center">Core Team</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEAM.map((m) => (
              <div key={m.role} className="card-glass rounded-xl p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-su-gold/20 text-su-gold font-bold flex items-center justify-center text-lg mx-auto">
                  {m.initials}
                </div>
                <p className="text-su-text text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-5">
          <h2 className="text-2xl font-display font-bold text-white">
            Ready to be part of it?
          </h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/apply">
              <Button size="lg">Apply Now</Button>
            </Link>
            <a href="https://github.com/stellaru-protocol" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">View on GitHub</Button>
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
