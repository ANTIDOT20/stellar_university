"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS, UNIVERSITY_NAME } from "@/data/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-su-border/40 bg-su-navy/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-su-gold flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-su-navy" />
            </div>
            <span className="font-display font-bold text-xl text-white group-hover:text-su-gold transition-colors">
              {UNIVERSITY_NAME}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-su-text hover:text-white rounded-lg hover:bg-su-slate/50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/portal">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link href="/apply">
              <Button size="sm">Apply Now</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-su-text hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-su-border/40 bg-su-navy/95 backdrop-blur-md px-4 py-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2.5 text-su-text hover:text-white hover:bg-su-slate/50 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/portal" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" fullWidth>Sign In</Button>
            </Link>
            <Link href="/apply" onClick={() => setMobileOpen(false)}>
              <Button fullWidth>Apply Now</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
