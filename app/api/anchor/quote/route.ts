import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RATES: Record<string, number> = {
  NGN: 1580, GHS: 14.2, KES: 128, ZAR: 18.7, USD: 1,
  EUR: 0.92,  GBP: 0.79, CAD: 1.36,
};

const ANCHOR_FEE_BPS = 50; // 0.5%

const schema = z.object({
  sourceCurrency: z.string().min(2).max(4),
  sourceAmount:   z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceCurrency, sourceAmount } = schema.parse(body);

    const rate = RATES[sourceCurrency.toUpperCase()];
    if (!rate) {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    }

    const usdAmount    = sourceAmount / rate;
    const fee          = usdAmount * (ANCHOR_FEE_BPS / 10_000);
    const usdcReceived = usdAmount - fee;

    return NextResponse.json({
      sourceCurrency: sourceCurrency.toUpperCase(),
      sourceAmount,
      rate,
      feeUsd:       +fee.toFixed(4),
      usdcAmount:   +usdcReceived.toFixed(4),
      quoteExpires: Date.now() + 5 * 60 * 1000,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
