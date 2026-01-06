# @stellaru/credential-sdk

Official JavaScript/TypeScript SDK for the StellarU protocol — credential verification, DID resolution, and anchor payment status on Stellar.

## Installation

```bash
npm install @stellaru/credential-sdk @stellar/stellar-sdk
```

## Quick Start

```typescript
import { StellarUClient, CredentialVerifier, DidResolver } from "@stellaru/credential-sdk";

const client = new StellarUClient({
  rpcUrl:     "https://soroban-testnet.stellar.org",
  network:    "testnet",
  contractId: "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
});

// Verify a credential on-chain
const verifier = new CredentialVerifier(client);
const result   = await verifier.verify(credentialIdHex);
console.log(result.valid, result.revoked);

// Resolve a DID
const resolver = new DidResolver(client, identityContractId);
const doc      = await resolver.resolve("did:stellar:GABC…");
console.log(doc.active, doc.serviceUrls);
```

## API

### `StellarUClient`

Base client that wraps `SorobanRpc.Server`.

| Method | Description |
|--------|-------------|
| `simulate(tx)` | Simulate a transaction and return the result |

### `CredentialVerifier`

| Method | Signature | Description |
|--------|-----------|-------------|
| `verify` | `(id: string) => Promise<VerifyResult>` | Check if a credential is valid and not revoked |
| `get` | `(id: string) => Promise<CredentialRecord>` | Fetch full credential record |

### `DidResolver`

| Method | Signature | Description |
|--------|-----------|-------------|
| `resolve` | `(didOrKey: string) => Promise<DidDocument>` | Resolve a `did:stellar` identifier |
| `isTrustedIssuer` | `(pubkey: string) => Promise<boolean>` | Check if an address is a trusted credential issuer |

### `AnchorClient`

| Method | Signature | Description |
|--------|-----------|-------------|
| `getTransfer` | `(txId: string) => Promise<AnchorTransferStatus>` | Get anchor transfer status |

### Utility Functions

```typescript
import {
  isValidStellarAddress,
  isValidCredentialId,
  parseDid,
  formatDid,
  usdcToHuman,
  humanToUsdc,
  truncateAddress,
} from "@stellaru/credential-sdk/utils";
```

| Function | Description |
|----------|-------------|
| `isValidStellarAddress(addr)` | Returns `true` for valid Stellar public keys |
| `isValidCredentialId(id)` | Returns `true` for 64-char lowercase hex strings |
| `parseDid(did)` | Parses `did:stellar:<pubkey>` → `{ network, publicKey }` or `null` |
| `formatDid(pubkey)` | Formats a public key as a `did:stellar:` URI |
| `usdcToHuman(raw, decimals?)` | Converts raw stroops to a human-readable string |
| `humanToUsdc(amount, decimals?)` | Converts a human amount to raw stroops (bigint) |
| `truncateAddress(addr, head?, tail?)` | Shortens an address for display |

## Types

```typescript
interface ClientConfig {
  rpcUrl:     string;
  network:    "testnet" | "mainnet";
  contractId: string;
}

interface CredentialRecord {
  id:        string;
  subject:   string;
  issuer:    string;
  credType:  string;
  issuedAt:  bigint;
  metaCid:   string;
  revoked:   boolean;
}

interface DidDocument {
  subject:     string;
  controller:  string;
  serviceUrls: string[];
  publicKeys:  string[];
  active:      boolean;
  createdAt:   bigint;
  updatedAt:   bigint;
}

interface AnchorTransferStatus {
  txId:      string;
  sender:    string;
  recipient: string;
  amount:    bigint;
  status:    "pending" | "completed" | "refunded";
}

interface VerifyResult {
  valid:   boolean;
  revoked: boolean;
}
```

## Building

```bash
cd packages/sdk
npm install
npm run build   # produces dist/index.js, dist/index.mjs, dist/index.d.ts
npm test        # vitest
```

## License

MIT — see [LICENSE](../../LICENSE).
