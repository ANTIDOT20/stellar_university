import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

const BodySchema = z.object({
  senderPublicKey:    z.string().length(56),
  recipientPublicKey: z.string().length(56),
  fromCurrency:       z.enum(["NGN", "GHS", "KES", "ZAR", "USD"]),
  fromAmount:         z.number().positive(),
  session:            z.string().min(7),
  semester:           z.number().int().min(1).max(2),
});

const RATES: Record<string, number> = {
  NGN: 1580, GHS: 14.2, KES: 128, ZAR: 18.7, USD: 1,
};

const ANCHOR_FEE_PCT = 0.005;

export async function POST(req: NextRequest) {
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

  const { fromCurrency, fromAmount, senderPublicKey, recipientPublicKey, session, semester } = parsed.data;

  const rate         = RATES[fromCurrency];
  const usdcAmount   = fromAmount / rate;
  const fee          = usdcAmount * ANCHOR_FEE_PCT;
  const netUsdc      = parseFloat((usdcAmount - fee).toFixed(7));

  const txId    = `ST${Date.now().toString(36).toUpperCase()}`;
  const bankRef = `STELLARU-${txId}`;

  logger.info("anchor.initiate", {
    txId,
    sender:    senderPublicKey.slice(0, 8),
    fromCurrency,
    fromAmount,
    netUsdc,
  });

  return NextResponse.json({
    txId,
    bankRef,
    fromCurrency,
    fromAmount,
    toAmount:      netUsdc,
    fee:           parseFloat(fee.toFixed(7)),
    rate,
    senderPublicKey,
    recipientPublicKey,
    session,
    semester,
    status:        "pending",
    expiresAt:     new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    instructions: {
      bank:          "StellarU Anchor NGN Collection Account",
      accountNumber: "0123456789",
      sortCode:      "044",
      reference:     bankRef,
    },
  });
}
