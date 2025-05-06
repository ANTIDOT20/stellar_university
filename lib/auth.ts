import { SignJWT, jwtVerify } from "jose";
import { Keypair, hash } from "@stellar/stellar-sdk";
import type { UserRole } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "stellaru-dev-secret-change-in-production"
);

const CHALLENGE_TTL = 5 * 60 * 1000; // 5 minutes

const challenges = new Map<string, { nonce: string; expiresAt: number }>();

export function generateChallenge(publicKey: string): string {
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("hex");
  challenges.set(publicKey, { nonce, expiresAt: Date.now() + CHALLENGE_TTL });
  return nonce;
}

export function getChallengeMessage(publicKey: string, nonce: string): string {
  return `StellarU sign-in\nPublic Key: ${publicKey}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
}

export function verifyChallenge(
  publicKey: string,
  signedXdr: string,
  expectedNonce: string
): boolean {
  const stored = challenges.get(publicKey);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    challenges.delete(publicKey);
    return false;
  }
  if (stored.nonce !== expectedNonce) return false;

  try {
    const keypair = Keypair.fromPublicKey(publicKey);
    const messageHash = hash(Buffer.from(getChallengeMessage(publicKey, expectedNonce)));
    const sigBytes = Buffer.from(signedXdr, "base64");
    const valid = keypair.verify(messageHash, sigBytes);
    if (valid) challenges.delete(publicKey);
    return valid;
  } catch {
    return false;
  }
}

export async function createSessionToken(
  publicKey: string,
  role: UserRole
): Promise<string> {
  return new SignJWT({ sub: publicKey, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export interface SessionPayload {
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as SessionPayload;
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
