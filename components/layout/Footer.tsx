import Link from "next/link";
import { GraduationCap, Github, Twitter, Globe } from "lucide-react";
import { UNIVERSITY_NAME, UNIVERSITY_TAGLINE } from "@/data/constants";

const FOOTER_LINKS = {
  University: [
    { label: "About StellarU", href: "/about" },
    { label: "Faculties", href: "/faculties" },
    { label: "Admissions", href: "/apply" },
    { label: "Academic Calendar", href: "/calendar" },
  ],
  Protocol: [
    { label: "Documentation", href: "/docs" },
    { label: "Credential SDK", href: "/sdk" },
    { label: "GitHub", href: "https://github.com/stellaru-protocol" },
    { label: "Deploy Your University", href: "/docs/deploy" },
  ],
  Resources: [
    { label: "Whitepaper", href: "/whitepaper.pdf" },
    { label: "Smart Contracts", href: "/contracts" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Changelog", href: "/changelog" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-su-border/40 bg-su-navy-2/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-su-gold flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-su-navy" />
              </div>
              <span className="font-display font-bold text-xl text-white">{UNIVERSITY_NAME}</span>
            </Link>
            <p className="text-su-text text-sm leading-relaxed max-w-xs">
              {UNIVERSITY_TAGLINE}
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/stellaru-protocol" target="_blank" rel="noopener noreferrer"
                className="text-su-text hover:text-white transition-colors p-2 rounded-lg hover:bg-su-slate/50">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/stellaru_" target="_blank" rel="noopener noreferrer"
                className="text-su-text hover:text-white transition-colors p-2 rounded-lg hover:bg-su-slate/50">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://stellaru.xyz" target="_blank" rel="noopener noreferrer"
                className="text-su-text hover:text-white transition-colors p-2 rounded-lg hover:bg-su-slate/50">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
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
        </div>

        <div className="mt-12 pt-8 border-t border-su-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-su-text text-sm">
            © {new Date().getFullYear()} StellarU Protocol. MIT Licensed — free to fork and deploy.
          </p>
          <p className="text-su-text text-sm">
            Built on{" "}
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer"
              className="text-su-gold hover:underline">
              Stellar
            </a>{" "}
            with Soroban
          </p>
        </div>
      </div>
    </footer>
  );
}
