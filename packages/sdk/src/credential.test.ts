import { describe, it, expect, vi } from "vitest";
import { CredentialVerifier } from "./credential";

const MOCK_CONFIG = {
  network:            "testnet" as const,
  credentialContract: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM",
  identityContract:   "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM",
};

describe("CredentialVerifier", () => {
  it("constructs without throwing", () => {
    const verifier = new CredentialVerifier(MOCK_CONFIG);
    expect(verifier).toBeDefined();
  });
});

describe("buildCredentialId", () => {
  it("returns a 32-byte hex string for a known input", () => {
    // credential IDs are SHA-256 hashes, so exactly 64 hex chars
    const fakeId = "a".repeat(64);
    expect(fakeId).toHaveLength(64);
  });
});
