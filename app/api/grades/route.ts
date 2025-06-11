import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getTokenFromHeader } from "@/lib/auth";
import { z } from "zod";

const submitSchema = z.object({
  courseCode:  z.string().min(3),
  studentKey:  z.string().min(56).max(56),
  score:       z.number().int().min(0).max(100),
  creditUnits: z.number().int().min(1).max(8),
  session:     z.string(),
  semester:    z.number().int().min(1).max(2),
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

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "lecturer" && session.role !== "admin" && session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = submitSchema.parse(body);
    // Production: invoke grading Soroban contract + write to Prisma
    return NextResponse.json({ success: true, ...data, gradedBy: session.sub });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const studentKey = searchParams.get("student") ?? session.sub;
  // Stub — fetch from Prisma
  return NextResponse.json({ grades: [], student: studentKey });
}
