"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NewsletterBanner() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section className="bg-su-gold/5 border-y border-su-gold/20 py-14">
      <div className="max-w-xl mx-auto px-4 text-center space-y-4">
        <div className="w-10 h-10 rounded-xl bg-su-gold/10 flex items-center justify-center mx-auto">
          <Mail className="w-5 h-5 text-su-gold" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white">
          Stay updated
        </h2>
        <p className="text-su-text text-sm">
          Protocol updates, new faculty announcements, and Stellar ecosystem news.
        </p>
        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-su-green">
            <CheckCircle2 className="w-5 h-5" />
            <span>You're subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
            />
            <Button type="submit" size="sm" loading={loading}>
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
