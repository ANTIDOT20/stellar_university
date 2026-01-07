import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Shield, Anchor, BookOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

type Section =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "code"; text: string }
  | { type: "table"; rows: string[][] };

type Post = {
  slug:    string;
  title:   string;
  date:    string;
  readMin: number;
  tag:     string;
  icon:    string;
  sections: Section[];
};

const POSTS: Record<string, Post> = {
  "soroban-contracts-testnet": {
    slug:    "soroban-contracts-testnet",
    title:   "All 10 StellarU Soroban contracts are live on Testnet",
    date:    "October 10, 2025",
    readMin: 6,
    tag:     "Protocol",
    icon:    "star",
    sections: [
      { type: "p", text: "The StellarU protocol is composed of 10 Soroban smart contracts, each responsible for a distinct slice of the university lifecycle. After three months of iterative development and internal testing, we deployed the complete suite to the Stellar Testnet last week." },
      { type: "h2", text: "The Contract Suite" },
      { type: "p", text: "student_registry — The foundational registry. Every student on the protocol is anchored to their Stellar public key. The contract stores their faculty, department, level, and status (Active / Suspended / Graduated). Matric numbers are unique and enforced on-chain." },
      { type: "p", text: "course_registry — Stores all course offerings: code, title, credit units, faculty, level, and optional lecturer assignment. Courses can be deactivated but not deleted — historical integrity is preserved." },
      { type: "p", text: "enrollment — Session-scoped enrollment records. A student enrolls in a course for a specific session and semester. The contract enforces a 24-unit cap and checks that the student is active before accepting the call." },
      { type: "p", text: "tuition — Handles USDC fee collection via Stellar's native token interface. Per-level fees are stored on-chain and updateable by admin. The contract verifies payment hasn't already been made before calling token::Client::transfer." },
      { type: "p", text: "grading — Receives grade submissions from assigned lecturers. Grades are immutable once submitted. Score-to-grade mapping follows NUC conventions: 70–100 → A, 60–69 → B, 50–59 → C, 45–49 → D, 40–44 → E, < 40 → F." },
      { type: "p", text: "credential — Issues verifiable on-chain credentials (Degree, Diploma, Transcript, Certificate, KycTier1, KycTier2). IDs are deterministic SHA-256 hashes of subject + type + session. Revocation is admin-gated." },
      { type: "p", text: "scholarship — Manages scholarship pools. Admins create scholarships with a minimum GPA requirement and award cap. The contract reads GPA from the grading contract and disburses funds via token transfer." },
      { type: "p", text: "governance — A council-based proposal system. Council members vote on proposals; quorum triggers status transitions. Designed for protocol upgrades, fee changes, and policy modifications." },
      { type: "p", text: "identity — Implements the did:stellar primitive. Any Stellar keypair can register a DID document with service URLs. Trusted issuers are managed by admin." },
      { type: "p", text: "anchor — SEP-31 escrow contract. Operators initiate transfers on behalf of cross-border senders; the contract holds USDC in escrow until the operator confirms delivery or the 24-hour TTL expires." },
      { type: "h2", text: "What's Next" },
      { type: "p", text: "Over the next month we're wiring the frontend portal to live contract calls — replacing all stub data with real Soroban simulations and transactions. Watch this space." },
    ],
  },
  "did-stellar-primer": {
    slug:    "did-stellar-primer",
    title:   "did:stellar — a DID primitive built for the ecosystem",
    date:    "September 22, 2025",
    readMin: 8,
    tag:     "Identity",
    icon:    "shield",
    sections: [
      { type: "p", text: "The W3C Decentralized Identifiers specification defines a URI scheme for verifiable, decentralized digital identities that don't require a central registry. Stellar's account model — public keys as first-class citizens — makes it a natural fit." },
      { type: "h2", text: "The did:stellar Method" },
      { type: "p", text: "A did:stellar identifier is simply: did:stellar:<G-address>, where <G-address> is a 56-character Stellar public key in StrKey encoding." },
      { type: "code", text: "did:stellar:GBVZZ4PHVXKWM2T3PQVX2KZUKEQSQ5KBEQXHEVKH5NJQBQYDDJNKQZ2" },
      { type: "p", text: "Anyone who knows a subject's Stellar address can construct their DID without contacting any server. Resolution requires a single Soroban call to the identity contract." },
      { type: "h2", text: "Beyond Universities" },
      { type: "p", text: "The identity contract is fully independent from the university contracts. Any dApp on Stellar can call is_trusted_issuer to check if a credential issuer is authorised, or call resolve to fetch the DID document for any public key." },
      { type: "p", text: "This is how a DeFi protocol on Stellar could gate access to KYC-tier-2 users — without running their own identity infrastructure." },
      { type: "h2", text: "SDK Usage" },
      { type: "code", text: `import { DidResolver } from "@stellaru/credential-sdk";\n\nconst resolver = new DidResolver(client, IDENTITY_CONTRACT_ID);\nconst doc = await resolver.resolve("did:stellar:GBVZZ4…");` },
    ],
  },
  "sep31-anchor-rails": {
    slug:    "sep31-anchor-rails",
    title:   "Paying tuition with NGN via SEP-31: a walkthrough",
    date:    "September 5, 2025",
    readMin: 5,
    tag:     "Anchor",
    icon:    "anchor",
    sections: [
      { type: "p", text: "Amaka is a 200-level Computer Science student at StellarU. She lives in Lagos. Her semester tuition is 1,500 USDC — but she doesn't hold USDC. She has naira in her GTBank account. Here is how she pays, step by step." },
      { type: "h2", text: "Step 1 — Get a Quote" },
      { type: "p", text: "Amaka opens the StellarU portal and navigates to Pay Fees. The portal calls the anchor quote API with from=NGN&amount=1500. At ₦1,580/USD, she'll pay ₦2,370,000. The 0.5% anchor fee is included." },
      { type: "h2", text: "Step 2 — Initiate the Transfer" },
      { type: "p", text: "The portal calls the anchor API to create a pending transfer record. The anchor issues a bank reference code and receiving account details. Amaka transfers ₦2,370,000 from her GTBank app to the anchor's NGN collection account." },
      { type: "h2", text: "Step 3 — Escrow on Stellar" },
      { type: "p", text: "Once the anchor confirms the NGN credit, the operator wallet calls initiate_transfer on the anchor Soroban contract. This moves 1,500 USDC into the escrow contract with a 24-hour TTL." },
      { type: "h2", text: "Step 4 — Tuition Contract Payment" },
      { type: "p", text: "The operator calls complete_transfer, releasing USDC from escrow to Amaka's wallet. Her wallet calls pay on the tuition contract, which marks her semester as paid." },
      { type: "h2", text: "Supported Currencies" },
      { type: "table", rows: [
        ["Currency", "Rate (approx)"],
        ["NGN", "₦1,580 / USDC"],
        ["GHS", "₵14.2 / USDC"],
        ["KES", "KSh 128 / USDC"],
        ["ZAR", "R18.7 / USDC"],
      ]},
    ],
  },
  "faculty-blockchain-science": {
    slug:    "faculty-blockchain-science",
    title:   "Introducing the Faculty of Stellar Blockchain Science",
    date:    "August 18, 2025",
    readMin: 4,
    tag:     "Academics",
    icon:    "book",
    sections: [
      { type: "p", text: "When we designed StellarU, we asked: what would a university look like if it were built natively on a blockchain, for people who want to build on that blockchain? The Faculty of Stellar Blockchain Science is our answer." },
      { type: "h2", text: "Why a Dedicated Faculty?" },
      { type: "p", text: "Every other faculty at StellarU teaches a traditional discipline — Law, Medicine, Engineering — with blockchain credentials as the delivery mechanism. The Faculty of Blockchain Science teaches Stellar itself as the subject." },
      { type: "p", text: "Students learn Soroban contract development, the Stellar Consensus Protocol, tokenomics design, DeFi architecture, and the SEP standards suite." },
      { type: "h2", text: "Programme Structure" },
      { type: "p", text: "BSc Stellar Blockchain Science (4 years): Year 1 covers Distributed Systems fundamentals and Stellar basics. Year 2 introduces Soroban contract development and the Stellar SDK. Year 3 covers DeFi design, SEP-24/31, and governance. Year 4 includes a research project and smart contract security auditing." },
      { type: "h2", text: "NUC Alignment" },
      { type: "p", text: "The programme meets NUC minimum academic standards for Computer Science programmes with Blockchain Science as a specialisation. Credit units follow the NUC framework: minimum 12, maximum 24 per semester." },
      { type: "h2", text: "Enrolment" },
      { type: "p", text: "The faculty is open to all students enrolled at StellarU. Connect your Stellar wallet, apply through the portal, and start your on-chain academic journey." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = POSTS[params.slug];
  if (!post) return {};
  return { title: post.title };
}

function PostIcon({ icon }: { icon: string }) {
  const cls = "w-5 h-5 text-su-gold";
  if (icon === "shield") return <Shield className={cls} />;
  if (icon === "anchor") return <Anchor className={cls} />;
  if (icon === "book")   return <BookOpen className={cls} />;
  return <Star className={cls} />;
}

function RenderSection({ section }: { section: Section }) {
  if (section.type === "h2") {
    return <h2 className="text-xl font-display font-bold text-white mt-8 mb-3">{section.text}</h2>;
  }
  if (section.type === "h3") {
    return <h3 className="text-lg font-semibold text-white mt-6 mb-2">{section.text}</h3>;
  }
  if (section.type === "code") {
    return (
      <pre className="bg-su-navy/80 border border-su-border rounded-xl p-4 overflow-x-auto text-xs text-su-green font-mono my-4 whitespace-pre-wrap">
        {section.text}
      </pre>
    );
  }
  if (section.type === "table") {
    const [header, ...rows] = section.rows;
    return (
      <table className="w-full text-sm my-4 border-collapse">
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i} className="text-left text-white font-semibold border-b border-su-border pb-2 pr-6">{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="text-su-text py-2 pr-6 border-b border-su-border/40">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return <p className="text-su-text leading-relaxed mb-4">{section.text}</p>;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];
  if (!post) notFound();

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-su-text text-sm hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <PostIcon icon={post.icon} />
            <Badge variant="blue">{post.tag}</Badge>
            <span className="flex items-center gap-1.5 text-su-text text-xs">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-su-text text-xs">
              <Clock className="w-3.5 h-3.5" />
              {post.readMin} min read
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>

        <article className="card-glass rounded-2xl p-8">
          {post.sections.map((section, i) => (
            <RenderSection key={i} section={section} />
          ))}
        </article>

        <div className="flex items-center justify-between pt-4 border-t border-su-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-su-gold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>
          <Link
            href="/apply"
            className="text-sm text-su-text hover:text-white transition-colors"
          >
            Apply to StellarU →
          </Link>
        </div>
      </div>
    </main>
  );
}
