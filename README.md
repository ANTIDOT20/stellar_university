# StellarU — On-Chain University Protocol

> **Education Without Borders. Credentials Without Fraud. Powered by Stellar.**

StellarU is the world's first blockchain-native university protocol built on the [Stellar](https://stellar.org) network. It is both an operational science university and open infrastructure — any institution in the world can deploy their own instance using the same battle-tested Soroban smart contracts.

---

## Architecture

| Layer | What it does |
|---|---|
| **University Protocol** | A fully operational science university — 8 faculties, 44 departments, Nigerian NUC-aligned curriculum. Students apply, register courses, pay tuition, sit exams, and graduate entirely on-chain. |
| **Identity Layer** | A public-good `did:stellar` primitive. Every wallet can register a W3C-standard DID document and attach verifiable academic credentials. Any dApp can resolve them. |
| **Anchor Rails** | SEP-31 compliant cross-border payment infrastructure. Families pay tuition in local fiat; USDC settles on-chain via the anchor escrow contract. |

---

## Smart Contracts

```
contracts/
├── student_registry/   # Admission, wallet → student mapping, matric index
├── course_registry/    # Course catalogue, faculty metadata, lecturer assignment
├── enrollment/         # Session-scoped course registration, 24-unit cap
├── tuition/            # USDC fee collection via Stellar token interface
├── grading/            # Score submission, grade calculation, GPA records
├── credential/         # Degree issuance, batch verify, revocation
├── scholarship/        # Grant pools, GPA-gated disbursement
├── governance/         # Council voting, proposal execution
├── identity/           # did:stellar DID registration and resolution
└── anchor/             # SEP-31 USDC escrow for cross-border payments
```

All contracts are written in Rust with `#![no_std]` and compile to `wasm32-unknown-unknown`.

---

## Faculties

1. Faculty of Physical Sciences
2. Faculty of Biological Sciences
3. Faculty of Engineering
4. Faculty of Agricultural Sciences
5. Faculty of Medical Sciences
6. Faculty of Food Science & Technology
7. Faculty of Environmental Sciences
8. **Faculty of Stellar Blockchain Science** ← flagship

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Smart Contracts | Soroban (Rust), Stellar |
| Wallets | Freighter, Albedo |
| Payments | USDC on Stellar, SEP-31 anchor |
| Database | PostgreSQL via Prisma |
| Storage | IPFS via Pinata (credentials, transcripts) |
| SDK | `@stellaru/credential-sdk` (CJS + ESM) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template
cp .env.example .env.local
# Fill in contract IDs from your deployment

# Run dev server
npm run dev
```

---

## Building Contracts

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

Or use the deploy script:

```bash
./scripts/deploy.sh          # builds and deploys all 10 contracts
./scripts/init-contracts.sh  # initialises contracts post-deployment
./scripts/verify-deployment.sh  # smoke-tests all contracts
```

---

## SDK

```bash
npm install @stellaru/credential-sdk @stellar/stellar-sdk
```

```typescript
import { CredentialVerifier, DidResolver } from "@stellaru/credential-sdk";

const verifier = new CredentialVerifier(client);
const result   = await verifier.verify(credentialIdHex);
```

See [`packages/sdk/README.md`](packages/sdk/README.md) for full API docs.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Licence

MIT — free to fork, deploy, and build on.
