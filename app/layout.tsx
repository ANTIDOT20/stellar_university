import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UNIVERSITY_NAME, UNIVERSITY_DESCRIPTION } from "@/data/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${UNIVERSITY_NAME} — On-Chain University Protocol`,
    template: `%s | ${UNIVERSITY_NAME}`,
  },
  description: UNIVERSITY_DESCRIPTION,
  keywords: [
    "Stellar blockchain",
    "on-chain university",
    "Soroban",
    "decentralised education",
    "blockchain credentials",
    "Nigeria university",
    "DeFi education",
    "Web3 university",
  ],
  authors: [{ name: "StellarU Protocol" }],
  openGraph: {
    title: `${UNIVERSITY_NAME} — On-Chain University Protocol`,
    description: UNIVERSITY_DESCRIPTION,
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: `${UNIVERSITY_NAME} — On-Chain University Protocol`,
    description: UNIVERSITY_DESCRIPTION,
  },
  themeColor: "#0A0E1A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-su-navy">{children}</body>
    </html>
  );
}
