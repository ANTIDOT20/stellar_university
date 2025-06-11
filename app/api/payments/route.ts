import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getTokenFromHeader } from "@/lib/auth";
import { z } from "zod";

const paySchema = z.object({
  session:  z.string(),
  semester: z.number().int().min(1).max(2),
  level:    z.number().int().min(100).max(700),
});

async function requireAuth(req: NextRequest) {
  const token =
    getTokenFromHeader(req.headers.get("authorization")) ??
    req.cookies.get("su_session")?.value ??
    null;
  if (!token) return null;
  try { return await verifySessionToken(token); }
  catch { return null; }
}

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Stub — check tuition contract + Prisma
  return NextResponse.json({
    publicKey: session.sub,
    payments:  [],
    feesPaid:  false,
  });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = paySchema.parse(body);
    // Production: verify on-chain tuition.is_paid, record in Prisma
    return NextResponse.json({ success: true, ...data, student: session.sub, status: "confirmed" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
