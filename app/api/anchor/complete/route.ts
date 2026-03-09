import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySessionToken } from "@/lib/auth";
import { logger } from "@/lib/logger";

const BodySchema = z.object({
  txId: z.string().min(4),
});

export async function POST(req: NextRequest) {
  const token = req.cookies.get("su_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifySessionToken(token).catch(() => null);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { txId } = parsed.data;

  logger.info("anchor.complete", { txId, operator: session.publicKey.slice(0, 8) });

  // In production: call complete_transfer on the anchor Soroban contract
  // via simulateAndSend with the operator keypair.
  return NextResponse.json({ txId, status: "completed" });
}
