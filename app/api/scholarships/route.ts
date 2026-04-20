import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const SCHOLARSHIPS = [
  { id: "sch-001", name: "Stellar Foundation Excellence Award", amount: 500,  minGpa: 4.5, awarded: 3,  maxAwards: 10, deadline: "2026-02-28", open: true  },
  { id: "sch-002", name: "NUC STEM Merit Scholarship",          amount: 300,  minGpa: 3.5, awarded: 8,  maxAwards: 20, deadline: "2026-03-15", open: true  },
  { id: "sch-003", name: "Blockchain Science Pioneer Grant",    amount: 1000, minGpa: 4.0, awarded: 2,  maxAwards: 5,  deadline: "2026-01-10", open: false },
];

export async function GET() {
  return NextResponse.json(SCHOLARSHIPS);
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

  const { scholarshipId } = body as { scholarshipId?: string };
  if (!scholarshipId) {
    return NextResponse.json({ error: "scholarshipId required" }, { status: 422 });
  }

  const sch = SCHOLARSHIPS.find((s) => s.id === scholarshipId);
  if (!sch) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!sch.open) {
    return NextResponse.json({ error: "Scholarship closed" }, { status: 409 });
  }

  return NextResponse.json({ success: true, scholarshipId, applicant: session.publicKey });
}
