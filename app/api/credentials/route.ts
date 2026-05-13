import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getTokenFromHeader } from "@/lib/auth";
import { verifyCredentialOnChain } from "@/lib/credential";
import { z } from "zod";

const verifySchema = z.object({
  credentialId: z.string().min(1),
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

  // Stub — fetch credentials from credential contract for session.sub
  return NextResponse.json({ credentials: [], holder: session.sub });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credentialId } = verifySchema.parse(body);

    const result = await verifyCredentialOnChain(credentialId);
    return NextResponse.json({
      credentialId,
      valid:   result.valid,
      ...result.record,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
