import { StrKey } from "@stellar/stellar-sdk";

export function isValidStellarAddress(address: string): boolean {
  try {
    return StrKey.isValidEd25519PublicKey(address);
  } catch {
    return false;
  }
}

export function isValidCredentialId(id: string): boolean {
  return /^[0-9a-f]{64}$/.test(id);
}

export function parseDid(did: string): { network: "stellar"; publicKey: string } | null {
  const match = did.match(/^did:stellar:([A-Z0-9]{56})$/);
  if (!match) return null;
  return { network: "stellar", publicKey: match[1] };
}

export function formatDid(publicKey: string): string {
  return `did:stellar:${publicKey}`;
}

export function usdcToHuman(raw: bigint, decimals = 7): string {
  const divisor = BigInt(10 ** decimals);
  const whole   = raw / divisor;
  const frac    = raw % divisor;
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : `${whole}`;
}

export function humanToUsdc(amount: number, decimals = 7): bigint {
  return BigInt(Math.round(amount * 10 ** decimals));
}

export function truncateAddress(addr: string, head = 6, tail = 4): string {
  if (addr.length <= head + tail) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}
