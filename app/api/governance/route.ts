import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySessionToken } from "@/lib/auth";
import { logger } from "@/lib/logger";

const ProposeSchema = z.object({
  title:       z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  duration:    z.number().int().min(3600).max(604800).default(172800),
  quorum:      z.number().int().min(2).max(20).default(5),
});

export async function GET() {
  const proposals = [
    { id: 1, title: "Increase tuition fee for Level 500+ by 10%", status: "Active", votesFor: 4, votesAgainst: 1, quorum: 7 },
    { id: 2, title: "Add Department of Quantum Computing",         status: "Passed", votesFor: 6, votesAgainst: 0, quorum: 7 },
    { id: 3, title: "Reduce minimum scholarship GPA to 3.75",     status: "Rejected", votesFor: 2, votesAgainst: 5, quorum: 7 },
  ];
  return NextResponse.json(proposals);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("su_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifySessionToken(token).catch(() => null);
  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ProposeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  logger.info("governance.propose", {
    proposer: session.publicKey.slice(0, 8),
    title:    parsed.data.title,
  });

  return NextResponse.json(
    { id: Math.floor(Math.random() * 1000), ...parsed.data, status: "Active" },
    { status: 201 },
  );
}
