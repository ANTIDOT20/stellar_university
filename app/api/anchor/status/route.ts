import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txId = searchParams.get("txId");

  if (!txId) {
    return NextResponse.json({ error: "txId required" }, { status: 400 });
  }

  // Stub — would query anchor contract via Soroban RPC
  return NextResponse.json({
    txId,
    status:      "pending",
    amount:      null,
    completedAt: null,
  });
}
