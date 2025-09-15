"use client";

import { useEffect, useState } from "react";
import { STATS } from "@/data/constants";

interface StatItem {
  value:  string;
  label:  string;
  suffix?: string;
}

function AnimatedNumber({ target }: { target: string }) {
  const [display, setDisplay] = useState("0");
  const isNumeric = /^\d+/.test(target);

  useEffect(() => {
    if (!isNumeric) { setDisplay(target); return; }
    const end = parseInt(target.replace(/[^0-9]/g, ""), 10);
    let current = 0;
    const step  = Math.ceil(end / 40);
    const id    = setInterval(() => {
      current = Math.min(current + step, end);
      setDisplay(target.replace(/\d+/, current.toLocaleString()));
      if (current >= end) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [target, isNumeric]);

  return <>{display}</>;
}

export function StatsBar() {
  return (
    <div className="w-full border-y border-su-border/40 bg-su-navy-2/60 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-display font-bold text-white">
              <AnimatedNumber target={s.value} />
            </p>
            <p className="text-su-text text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
