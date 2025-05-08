import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyChallenge, createSessionToken } from "@/lib/auth";
import type { UserRole } from "@/types";

const schema = z.object({
  publicKey:  z.string().min(56).max(56),
  nonce:      z.string().min(64).max(64),
  signature:  z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicKey, nonce, signature } = schema.parse(body);

    const valid = verifyChallenge(publicKey, signature, nonce);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Role lookup would query DB/contract in production; default to student
    const role: UserRole = "student";

    const token = await createSessionToken(publicKey, role);

    const response = NextResponse.json({ token, role, publicKey });
    response.cookies.set("su_session", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   60 * 60 * 24,
      path:     "/",
    });

    return response;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("su_session");
  return response;
}
