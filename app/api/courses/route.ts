import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getTokenFromHeader } from "@/lib/auth";

async function requireAuth(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"))
    ?? req.cookies.get("su_session")?.value ?? null;
  if (!token) return null;
  try { return await verifySessionToken(token); }
  catch { return null; }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const level    = searchParams.get("level");
  const semester = searchParams.get("semester");
  const dept     = searchParams.get("department");

  // Stub response — production would query course_registry contract or Prisma
  return NextResponse.json({
    courses: [],
    filters: { level, semester, department: dept },
  });
}
