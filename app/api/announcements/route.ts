import { NextResponse } from "next/server";

const ANNOUNCEMENTS = [
  {
    id:    "ann-001",
    level: "info",
    title: "Second Semester 2025/2026 registration is open",
    body:  "Students may now register for courses for the second semester. Registration closes March 14, 2026. Ensure your tuition payment is confirmed before registering.",
    date:  "January 10, 2026",
  },
  {
    id:    "ann-002",
    level: "success",
    title: "Protocol upgrade v0.2 deployed to Testnet",
    body:  "The governance and scholarship contracts have been upgraded with multi-institution support. No action required for existing students.",
    date:  "January 6, 2026",
  },
  {
    id:    "ann-003",
    level: "warning",
    title: "Freighter wallet extension update required",
    body:  "Freighter v5.5 or later is required to sign Soroban transactions on this portal. Update your extension before the next session.",
    date:  "December 20, 2025",
  },
] as const;

export function GET() {
  return NextResponse.json(ANNOUNCEMENTS, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}
