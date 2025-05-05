import Link from "next/link";
import {
  GraduationCap, Shield, Zap, Globe, Network, ArrowRight,
  CheckCircle, BookOpen, Users, Award, Layers, Wallet,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { FACULTIES } from "@/data/faculties";
import { STATS } from "@/data/constants";

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-su-gold/5 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-su-green/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-su-gold/10 border border-su-gold/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-su-gold animate-pulse-slow" />
          <span className="text-su-gold text-sm font-medium">Built on Stellar · Powered by Soroban</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
          <span className="text-white">The World&apos;s First</span>
          <br />
          <span className="gradient-text">On-Chain University</span>
        </h1>

        <p className="text-su-text text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10">
          Admit. Register. Pay. Graduate.{" "}
          <span className="text-white font-medium">Everything on Stellar.</span>
          {" "}8 Faculties. 40+ Departments. Zero certificate fraud.
          A credential layer any dApp can query. Cross-border tuition rails for Africa and beyond.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/apply"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 group"
          >
            Apply for Admission
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/faculties"
            className="btn-outline text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Explore Faculties
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-su-border/30 rounded-2xl overflow-hidden border border-su-border/30">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-su-slate/40 px-6 py-5 text-center">
              <div className="text-3xl font-bold gradient-text">{stat.value}{stat.suffix}</div>
              <div className="text-su-text text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-su-text/50">
        <div className="w-0.5 h-10 bg-gradient-to-b from-su-border/0 via-su-border to-su-border/0 animate-pulse" />
      </div>
    </section>
  );
}

// ── Why StellarU ──────────────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    icon: Shield,
    title: "Zero Certificate Fraud",
    desc: "Every degree lives on-chain. Any employer verifies a graduate in seconds — no registrar phone call, no forged transcript, no third-party verification service.",
    color: "text-su-gold",
    bg: "bg-su-gold/10",
  },
  {
    icon: Zap,
    title: "Instant Tuition Payments",
    desc: "Parents in the diaspora pay in local currency; USDC lands in the treasury in seconds via SEP-31. No SWIFT, no 5-day delays, no 8% transfer fees.",
    color: "text-su-green",
    bg: "bg-su-green/10",
  },
  {
    icon: Globe,
    title: "Borderless Education",
    desc: "A Stellar wallet is a student's global identity. Study from anywhere, pay from anywhere, carry your verifiable credential anywhere in the world.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Network,
    title: "Ecosystem Infrastructure",
    desc: "StellarU&apos;s credential layer is a public good. Any Stellar dApp — DeFi protocols, DAOs, employers — can query wallet credentials through the open SDK.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

function WhySection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-su-navy-2/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="green" className="mb-4">Why StellarU</Badge>
          <h2 className="section-heading mb-4">Education Reimagined for the Blockchain Era</h2>
          <p className="section-sub max-w-2xl mx-auto">
            Not a &quot;blockchain add-on&quot; to a legacy system. The blockchain IS the system of record.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="card-glass p-6 hover:border-su-border transition-colors group">
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-5`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-su-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-su-text text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Faculties Preview ─────────────────────────────────────────────────────────
function FacultiesPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <Badge variant="gold" className="mb-4">Academic Structure</Badge>
            <h2 className="section-heading">8 Faculties. 40+ Departments.</h2>
            <p className="section-sub mt-2 max-w-xl">
              Nigerian NUC-aligned curriculum from physical sciences to the world&apos;s first Stellar Blockchain Science faculty.
            </p>
          </div>
          <Link href="/faculties" className="btn-outline inline-flex items-center gap-2 shrink-0">
            View All Faculties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FACULTIES.map((faculty) => (
            <Link
              key={faculty.id}
              href={`/faculties/${faculty.slug}`}
              className={`card-glass p-6 hover:border-su-border/80 transition-all duration-200 group ${
                faculty.isFlagship ? "lg:col-span-2 border-su-gold/30 bg-su-gold/5" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-su-slate flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${faculty.color}`}>{faculty.code}</span>
                </div>
                {faculty.isFlagship && <Badge variant="gold">Flagship</Badge>}
              </div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-su-gold transition-colors line-clamp-2">
                {faculty.name}
              </h3>
              <p className="text-su-text text-xs mb-4 line-clamp-2">{faculty.description}</p>
              <div className="flex items-center gap-3 text-xs text-su-text">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {faculty.departments.length} Depts
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
const STEPS = [
  {
    step: "01",
    icon: Wallet,
    title: "Connect Your Wallet",
    desc: "Your Stellar wallet is your university identity. No username, no password — just your keypair.",
    color: "text-su-gold",
  },
  {
    step: "02",
    icon: GraduationCap,
    title: "Apply & Get Admitted",
    desc: "Submit your application on-chain. Once admitted, your student record is minted to the student_registry contract.",
    color: "text-blue-400",
  },
  {
    step: "03",
    icon: BookOpen,
    title: "Register & Pay Tuition",
    desc: "Register courses each semester via the enrollment contract. Pay tuition in XLM or USDC — or via cross-border NGN rails.",
    color: "text-su-green",
  },
  {
    step: "04",
    icon: Award,
    title: "Graduate with an On-Chain Degree",
    desc: "Your degree is issued to the credential contract. Employers verify in one contract call — no registrar required.",
    color: "text-purple-400",
  },
];

function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-su-navy-2/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="blue" className="mb-4">How It Works</Badge>
          <h2 className="section-heading mb-4">From Admission to Graduation — All On-Chain</h2>
          <p className="section-sub max-w-2xl mx-auto">
            Every critical academic milestone is an immutable Stellar transaction.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-su-border to-transparent z-0" />
              )}
              <div className="card-glass p-6 relative z-10">
                <div className={`text-xs font-bold tracking-widest ${step.color} mb-4`}>{step.step}</div>
                <div className={`w-12 h-12 rounded-xl bg-su-slate flex items-center justify-center mb-4`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-3">{step.title}</h3>
                <p className="text-su-text text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Protocol Layers ───────────────────────────────────────────────────────────
const LAYERS = [
  {
    phase: "Phase 1 · Live",
    title: "The University Protocol",
    desc: "A complete, deployable university on Soroban. Student registry, course enrollment, tuition, grading, and credential issuance — all on-chain contracts any institution can fork and run.",
    features: [
      "10 Soroban smart contracts",
      "Multi-tenant — any university can deploy",
      "NUC-aligned Nigerian curriculum",
      "MIT licensed",
    ],
    color: "border-su-gold/30 bg-su-gold/5",
    badge: "gold" as const,
  },
  {
    phase: "Phase 2 · In Development",
    title: "The Identity Layer",
    desc: "A public-good DID primitive for Stellar. Academic credentials, professional certs, and KYC tiers all attach to wallets. One SDK call — any dApp can verify.",
    features: [
      "Open credential standard for Stellar",
      "SDK: npm install @stellaru/sdk",
      "DeFi, DAOs, employers all integrate",
      "Revocable, expirable credentials",
    ],
    color: "border-su-green/30 bg-su-green/5",
    badge: "green" as const,
  },
  {
    phase: "Phase 3 · Roadmap",
    title: "The Anchor Rails",
    desc: "SEP-31 compliant cross-border tuition payment infrastructure. Parents send in local currency — USDC lands in the treasury. Reusable by any institution on the protocol.",
    features: [
      "SEP-31 cross-border payments",
      "NGN, GBP, USD → USDC on Stellar",
      "No SWIFT, no bank delays",
      "Open-source payment module",
    ],
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "blue" as const,
  },
];

function ProtocolSection() {
  return (
    <section id="protocol" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">Infrastructure for Stellar</Badge>
          <h2 className="section-heading mb-4">
            Three Layers.{" "}
            <span className="gradient-text">One Protocol.</span>
          </h2>
          <p className="section-sub max-w-2xl mx-auto">
            StellarU is infrastructure, not just a university. Every layer is open-source and reusable by the entire Stellar ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {LAYERS.map((layer) => (
            <div key={layer.title} className={`card-glass ${layer.color} p-8`}>
              <Badge variant={layer.badge} className="mb-5">{layer.phase}</Badge>
              <h3 className="text-xl font-bold text-white mb-3">{layer.title}</h3>
              <p className="text-su-text text-sm leading-relaxed mb-6">{layer.desc}</p>
              <ul className="space-y-2.5">
                {layer.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-su-text">
                    <CheckCircle className="w-4 h-4 text-su-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-su-navy-2/40">
      <div className="max-w-4xl mx-auto text-center">
        <div className="card-glass border-su-gold/20 bg-su-gold/5 p-12 md:p-16">
          <div className="w-16 h-16 rounded-2xl bg-su-gold/20 flex items-center justify-center mx-auto mb-6">
            <Layers className="w-8 h-8 text-su-gold" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Build the Future of Education?
          </h2>
          <p className="text-su-text text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Apply as a student, deploy the protocol for your institution, or integrate the credential SDK into your Stellar dApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/apply" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 group">
              Apply for Admission
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/docs/deploy" className="btn-outline text-lg px-8 py-4 inline-flex items-center gap-2">
              Deploy the Protocol
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhySection />
        <FacultiesPreview />
        <HowItWorks />
        <ProtocolSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
