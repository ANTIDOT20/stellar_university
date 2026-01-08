import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.ipfs.io" },
      { protocol: "https", hostname: "gateway.pinata.cloud" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "cloudflare-ipfs.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    NEXT_PUBLIC_STELLAR_NETWORK:      process.env.NEXT_PUBLIC_STELLAR_NETWORK      ?? "testnet",
    NEXT_PUBLIC_STELLAR_HORIZON_URL:  process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL  ?? "https://horizon-testnet.stellar.org",
    NEXT_PUBLIC_SOROBAN_RPC_URL:      process.env.NEXT_PUBLIC_SOROBAN_RPC_URL      ?? "https://soroban-testnet.stellar.org",
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@stellar/stellar-sdk"],
  },
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "X-Content-Type-Options",  value: "nosniff"       },
        { key: "X-Frame-Options",         value: "DENY"          },
        { key: "Referrer-Policy",         value: "no-referrer"   },
      ],
    },
  ],
};

export default nextConfig;
