import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getTokenFromHeader } from "@/lib/auth";
import { z } from "zod";

const enrollSchema = z.object({
  courseCode: z.string().min(3),
  session:    z.string().min(4),
  semester:   z.number().int().min(1).max(2),
});

async function requireAuth(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"))
    ?? req.cookies.get("su_session")?.value ?? null;
  if (!token) return null;
  try { return await verifySessionToken(token); }
  catch { return null; }
}

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Stub — query enrollment contract or Prisma
  return NextResponse.json({ enrollments: [], publicKey: session.sub });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = enrollSchema.parse(body);
    // Stub — invoke enrollment contract
    return NextResponse.json({ success: true, ...data, student: session.sub });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
