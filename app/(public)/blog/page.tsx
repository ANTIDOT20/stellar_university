import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Updates from StellarU — protocol releases, ecosystem news, and academic announcements.",
};

const POSTS = [
  {
    slug:    "soroban-contracts-testnet",
    title:   "All 10 StellarU Soroban contracts are live on Testnet",
    excerpt: "We deployed the full contract suite — student_registry, credential, identity, anchor, and six more — to the Stellar Testnet. Here's what each contract does and how to interact with them.",
    date:    "October 10, 2025",
    readMin: 6,
    tag:     "Protocol",
  },
  {
    slug:    "did-stellar-primer",
    title:   "did:stellar — a DID primitive built for the ecosystem",
    excerpt: "Decentralized Identity is not just for universities. Any dApp on Stellar can use the identity contract to resolve a public key to a DID document without trusting a central server.",
    date:    "September 22, 2025",
    readMin: 8,
    tag:     "Identity",
  },
  {
    slug:    "sep31-anchor-rails",
    title:   "Paying tuition with NGN via SEP-31: a walkthrough",
    excerpt: "A Nigerian student pays their semester fees in naira. Within minutes, USDC settles on-chain and the tuition contract marks their semester paid. We trace every step.",
    date:    "September 5, 2025",
    readMin: 5,
    tag:     "Anchor",
  },
  {
    slug:    "faculty-blockchain-science",
    title:   "Introducing the Faculty of Stellar Blockchain Science",
    excerpt: "StellarU's flagship faculty is the first NUC-aligned academic programme focused entirely on the Stellar ecosystem. Four-year BSc, research MPhil, and professional tracks.",
    date:    "August 18, 2025",
    readMin: 4,
    tag:     "Academics",
  },
];

export default function BlogPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="space-y-3">
          <Badge variant="gold">Blog</Badge>
          <h1 className="text-3xl font-display font-bold text-white">Latest Updates</h1>
          <p className="text-su-text">Protocol releases, ecosystem news, and academic announcements.</p>
        </div>

        <div className="space-y-6">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block card-glass rounded-2xl p-6 hover:border-su-gold/30 transition-colors group space-y-3"
            >
              <div className="flex items-center gap-3">
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
              <h2 className="text-white font-semibold text-lg group-hover:text-su-gold transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-su-text text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-1 text-su-gold text-sm font-medium group-hover:gap-2 transition-all">
                Read more <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
