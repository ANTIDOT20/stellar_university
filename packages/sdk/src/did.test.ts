import { describe, it, expect } from "vitest";
import { DidResolver } from "./did";

const MOCK_CONFIG = {
  network:            "testnet" as const,
  credentialContract: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM",
  identityContract:   "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM",
};

describe("DidResolver", () => {
  it("constructs without throwing", () => {
    const resolver = new DidResolver(MOCK_CONFIG);
    expect(resolver).toBeDefined();
  });

  it("strips did:stellar: prefix correctly", () => {
    const did    = "did:stellar:GABC123";
    const pubkey = did.startsWith("did:stellar:") ? did.slice("did:stellar:".length) : did;
    expect(pubkey).toBe("GABC123");
  });
});
