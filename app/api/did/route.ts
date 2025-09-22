import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveDid } from "@/lib/contracts";

const resolveSchema = z.object({
  publicKey: z.string().min(56).max(56),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicKey } = resolveSchema.parse(body);
    const doc = await resolveDid(publicKey);
    if (!doc) {
      return NextResponse.json({ error: "DID not found" }, { status: 404 });
    }
    return NextResponse.json({ did: `did:stellar:${publicKey}`, document: doc });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const publicKey = searchParams.get("pubkey");
  if (!publicKey) {
    return NextResponse.json({ error: "pubkey query param required" }, { status: 400 });
  }
  const doc = await resolveDid(publicKey);
  if (!doc) {
    return NextResponse.json({ error: "DID not found" }, { status: 404 });
  }
  return NextResponse.json({ did: `did:stellar:${publicKey}`, document: doc });
}
