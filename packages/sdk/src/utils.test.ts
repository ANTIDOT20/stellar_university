import { describe, it, expect } from "vitest";
import {
  isValidCredentialId,
  parseDid,
  formatDid,
  usdcToHuman,
  humanToUsdc,
  truncateAddress,
} from "./utils";

describe("isValidCredentialId", () => {
  it("accepts 64-char hex", () => {
    expect(isValidCredentialId("a".repeat(64))).toBe(true);
  });
  it("rejects short strings", () => {
    expect(isValidCredentialId("deadbeef")).toBe(false);
  });
  it("rejects uppercase", () => {
    expect(isValidCredentialId("A".repeat(64))).toBe(false);
  });
});

describe("parseDid", () => {
  it("parses a valid did:stellar", () => {
    const key = "G" + "A".repeat(55);
    const res = parseDid(`did:stellar:${key}`);
    expect(res?.publicKey).toBe(key);
  });
  it("returns null for invalid format", () => {
    expect(parseDid("did:key:abc")).toBeNull();
  });
});

describe("usdcToHuman / humanToUsdc", () => {
  it("round-trips 150 USDC", () => {
    const raw  = humanToUsdc(150);
    const back = usdcToHuman(raw);
    expect(parseFloat(back)).toBeCloseTo(150, 4);
  });
  it("handles fractional", () => {
    const raw = humanToUsdc(0.5);
    expect(usdcToHuman(raw)).toBe("0.5");
  });
});

describe("truncateAddress", () => {
  it("truncates long addresses", () => {
    const addr = "GABCDEF" + "X".repeat(49);
    const out  = truncateAddress(addr);
    expect(out).toContain("…");
    expect(out.length).toBeLessThan(addr.length);
  });
  it("returns short addresses unchanged", () => {
    expect(truncateAddress("GABC")).toBe("GABC");
  });
});
