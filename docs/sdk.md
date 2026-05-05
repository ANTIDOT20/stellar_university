# @stellaru/credential-sdk — Developer Guide

The StellarU SDK provides read-only access to all on-chain protocol data via Soroban simulation calls. No signing key is required for reads.

## Installation

```bash
npm install @stellaru/credential-sdk @stellar/stellar-sdk
```

## Setup

```typescript
import { StellarUClient } from "@stellaru/credential-sdk";

const client = new StellarUClient({
  rpcUrl:     "https://soroban-testnet.stellar.org",
  network:    "testnet",
  contractId: CREDENTIAL_CONTRACT_ID,
});
```

## Credential Verification

```typescript
import { CredentialVerifier } from "@stellaru/credential-sdk";

const verifier = new CredentialVerifier(client);

// Verify a single credential
const result = await verifier.verify("a1b2c3d4..."); // 64-char hex ID
// result: { valid: boolean, revoked: boolean }

// Get full credential record
const record = await verifier.get("a1b2c3d4...");
// record: { holder, issuer, credType, issuedAt, metaCid, revoked }
```

## Batch Verification

```typescript
const results = await verifier.batchVerify(["id1", "id2", "id3"]);
// results: boolean[] — true = valid, false = revoked/not found
```

## DID Resolution

```typescript
import { DidResolver } from "@stellaru/credential-sdk";

const resolver = new DidResolver(client, IDENTITY_CONTRACT_ID);

// Resolve by full DID
const doc = await resolver.resolve("did:stellar:GABC...");

// Or resolve by public key directly
const doc2 = await resolver.resolve("GABC...");
// doc: { subject, controller, serviceUrls, active, createdAt, updatedAt }

// Check trusted issuer
const trusted = await resolver.isTrustedIssuer("GABC...");
```

## Enrollment Queries

```typescript
import { EnrollmentClient } from "@stellaru/credential-sdk";

const enroll = new EnrollmentClient(client, ENROLLMENT_CONTRACT_ID);

const record = await enroll.getEnrollment(
  studentPublicKey,
  "SBC301",
  "2025/2026",
  1,
);
// record: { student, course, session, semester, status, enrolledAt }

const count = await enroll.getEnrollmentCount();
```

## Anchor Transfer Status

```typescript
import { AnchorClient } from "@stellaru/credential-sdk";

const anchor = new AnchorClient(client, ANCHOR_CONTRACT_ID);
const transfer = await anchor.getTransfer("TX001");
// transfer: { txId, sender, recipient, amount, status }
```

## Utilities

```typescript
import {
  isValidStellarAddress,
  isValidCredentialId,
  parseDid,
  formatDid,
  usdcToHuman,
  humanToUsdc,
  truncateAddress,
} from "@stellaru/credential-sdk";

isValidStellarAddress("GABC...");       // boolean
isValidCredentialId("a1b2...");         // boolean — 64-char hex
parseDid("did:stellar:GABC...");        // { network: "stellar", publicKey: "..." }
formatDid("GABC...");                   // "did:stellar:GABC..."
usdcToHuman(1_500_000_000n);           // "150"
humanToUsdc(150);                       // 1500000000n
truncateAddress("GABC...XYZ", 6, 4);   // "GABC……XYZ"
```

## Error Handling

All async methods return `null` (or throw) when the underlying Soroban simulation fails. Always check for null before accessing properties:

```typescript
const doc = await resolver.resolve(publicKey);
if (!doc) {
  console.warn("DID not registered");
  return;
}
```

## Building from Source

```bash
cd packages/sdk
npm install
npm run build    # produces dist/ with CJS, ESM, and .d.ts
npm test         # vitest
```
