import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getTokenFromHeader } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  firstName:    z.string().min(1).max(100),
  lastName:     z.string().min(1).max(100),
  email:        z.string().email(),
  departmentId: z.string().min(1),
  level:        z.number().int().min(100).max(700),
});

async function requireAuth(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"))
    ?? req.cookies.get("su_session")?.value
    ?? null;

  if (!token) return null;
  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Stub — would query Soroban contract + Prisma in production
  return NextResponse.json({
    publicKey:   session.sub,
    role:        session.role,
    studentData: null,
  });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    // Stub — would invoke student_registry Soroban contract + write to Prisma
    return NextResponse.json({
      success: true,
      studentId: `STU-${Date.now()}`,
      ...data,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
