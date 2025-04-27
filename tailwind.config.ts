import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "su-navy":   "#0A0E1A",
        "su-navy-2": "#111827",
        "su-gold":   "#FFB800",
        "su-gold-2": "#FFA500",
        "su-green":  "#00C896",
        "su-green-2":"#00A87A",
        "su-slate":  "#1E2535",
        "su-border": "#2A3347",
        "su-text":   "#94A3B8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(ellipse at top, #1a2235 0%, #0A0E1A 70%)",
        "card-gradient": "linear-gradient(135deg, #111827 0%, #1E2535 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFB800 0%, #FFA500 100%)",
        "green-gradient":"linear-gradient(135deg, #00C896 0%, #00A87A 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
