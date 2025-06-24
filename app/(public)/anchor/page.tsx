"use client";

import { useState } from "react";
import { Globe, ArrowRight, CheckCircle2, Clock, AlertCircle, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const SUPPORTED_CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira",    flag: "🇳🇬", rate: 1580 },
  { code: "GHS", name: "Ghanaian Cedi",     flag: "🇬🇭", rate: 14.2 },
  { code: "KES", name: "Kenyan Shilling",   flag: "🇰🇪", rate: 128  },
  { code: "ZAR", name: "South African Rand",flag: "🇿🇦", rate: 18.7 },
  { code: "USD", name: "US Dollar",         flag: "🇺🇸", rate: 1    },
];

const STEPS = [
  { n: "1", title: "Choose currency",   desc: "Select your local currency and enter the amount." },
  { n: "2", title: "Get a quote",       desc: "The anchor calculates the USDC equivalent at live rates." },
  { n: "3", title: "Pay locally",       desc: "Complete payment via bank transfer, mobile money, or card." },
  { n: "4", title: "USDC on-chain",     desc: "Anchor confirms and releases USDC to your Stellar address." },
  { n: "5", title: "Tuition recorded",  desc: "The tuition contract marks your semester as paid." },
];

export default function AnchorPage() {
  const [currency, setCurrency] = useState("NGN");
  const [amount,   setAmount]   = useState("");

  const selected  = SUPPORTED_CURRENCIES.find((c) => c.code === currency)!;
  const usdAmount = amount ? (parseFloat(amount) / selected.rate).toFixed(2) : "—";

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-4">
          <Badge variant="gold">SEP-31 Anchor Rails</Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            Pay tuition from{" "}
            <span className="gradient-text">anywhere</span>
          </h1>
          <p className="text-su-text text-lg max-w-2xl mx-auto">
            Use your local currency. The anchor network converts to USDC and
            settles on Stellar. No crypto wallet top-up needed.
          </p>
        </section>

        {/* Quote calculator */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="card-glass rounded-2xl p-8 space-y-5">
            <h2 className="text-white font-semibold text-lg">Quick Quote</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-su-text text-xs uppercase tracking-wider">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-su-gold/50"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-su-text text-xs uppercase tracking-wider">
                  Amount ({currency})
                </label>
                <input
                  type="number"
                  placeholder="e.g. 237000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-su-navy/60 border border-su-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-su-navy/60 border border-su-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-su-text">Exchange rate</span>
                <span className="text-white">1 USD = {selected.rate} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-su-text">Anchor fee (est.)</span>
                <span className="text-white">0.5%</span>
              </div>
              <div className="h-px bg-su-border/40 my-1" />
              <div className="flex justify-between font-semibold">
                <span className="text-su-text">You pay (USDC)</span>
                <span className="text-su-gold text-lg">${usdAmount}</span>
              </div>
            </div>

            <Button size="lg" disabled={!amount}>
              <DollarSign className="w-4 h-4" />
              Start Payment
            </Button>
          </div>

          {/* How it works */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold text-lg">How it works</h2>
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-su-gold/20 text-su-gold font-bold text-sm flex items-center justify-center shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{s.title}</p>
                  <p className="text-su-text text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supported currencies */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-white text-center">
            Supported currencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SUPPORTED_CURRENCIES.map((c) => (
              <div key={c.code} className="card-glass rounded-xl p-4 text-center space-y-1">
                <p className="text-2xl">{c.flag}</p>
                <p className="text-white font-semibold text-sm">{c.code}</p>
                <p className="text-su-text text-xs">{c.name}</p>
              </div>
            ))}
          </div>
          <p className="text-su-text text-sm text-center">
            More currencies added via governance vote.
          </p>
        </section>
      </div>
    </main>
  );
}
