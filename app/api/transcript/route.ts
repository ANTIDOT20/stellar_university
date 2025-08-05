import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getTokenFromHeader } from "@/lib/auth";
import { uploadJSONToIPFS, buildCredentialMetadata } from "@/lib/ipfs";

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

  // Stub — aggregate grades from Prisma
  return NextResponse.json({
    publicKey: session.sub,
    sessions:  [],
    cumGpa:    0,
  });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "admin" && session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const meta = buildCredentialMetadata({
      holderPublicKey: body.studentPublicKey,
      holderName:      body.studentName,
      degree:          body.degree,
      department:      body.department,
      session:         body.session,
      gpa:             body.gpa,
      degreeClass:     body.degreeClass,
      issuerPublicKey: session.sub,
    });

    const cid = await uploadJSONToIPFS(meta, `transcript-${body.studentPublicKey}.json`);
    return NextResponse.json({ cid, meta });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
