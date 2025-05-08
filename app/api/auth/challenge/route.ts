import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateChallenge, getChallengeMessage } from "@/lib/auth";

const schema = z.object({
  publicKey: z.string().min(56).max(56),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicKey } = schema.parse(body);

    const nonce   = generateChallenge(publicKey);
    const message = getChallengeMessage(publicKey, nonce);

    return NextResponse.json({ nonce, message });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid public key" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
