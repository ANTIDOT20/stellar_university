# StellarU — On-Chain University Protocol

> **Education Without Borders. Credentials Without Fraud. Powered by Stellar.**

StellarU is the world's first blockchain-native university protocol built on the [Stellar](https://stellar.org) network. It is both an operational science university and open infrastructure — any institution in the world can deploy their own instance using the same battle-tested Soroban smart contracts.

---

## What StellarU Is

| Layer | What it does |
|---|---|
| **The University** | A fully operational science university — 8 faculties, 40+ departments, Nigerian NUC-aligned curriculum. Students apply, register courses, pay tuition, sit exams, and graduate entirely on-chain. |
| **The Protocol** | Open-source, multi-tenant Soroban contracts any institution can fork and deploy. One protocol, unlimited universities. |
| **The Identity Layer** | A public-good decentralised identity primitive for Stellar. Every wallet can attach verifiable academic and professional credentials. Any dApp can query them. |
| **The Anchor Rails** | SEP-31 compliant cross-border payment infrastructure. Parents in the diaspora pay tuition in local currency; USDC lands in the treasury instantly. |

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

- **Frontend:** Next.js 14 (App Router) · TypeScript · Tailwind CSS
- **Smart Contracts:** Soroban (Rust) on Stellar
- **Wallet:** Freighter · Albedo
- **Payments:** XLM + USDC (Stellar Asset Contract)
- **Database:** PostgreSQL via Prisma (off-chain metadata)
- **Storage:** IPFS via Pinata (certificates, transcripts)

---

## Smart Contracts

```
contracts/
├── student_registry/   # Admission, wallet → student mapping
├── course_registry/    # Course catalogue, faculty metadata
├── enrollment/         # Semester course registration
├── tuition/            # Tuition collection + verification
├── grading/            # Grade submission + GPA
├── credential/         # Degree issuance (on-chain certificate)
├── scholarship/        # Grant pools + disbursement
├── governance/         # Admin roles, dean assignments
├── identity/           # DID layer — Phase 2
└── anchor/             # SEP-31 payment rails — Phase 3
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template
cp .env.example .env.local

# Run dev server
npm run dev

# Build contracts
cd contracts && cargo build --target wasm32-unknown-unknown --release
```

---

## Protocol Deployment

Any institution can deploy StellarU contracts to their own Stellar account:

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/student_registry.wasm \
  --network testnet --source YOUR_ADMIN_KEY
```

See `docs/protocol-deployment.md` for the full multi-contract deployment guide.

---

## Licence

MIT — free to fork, deploy, and build on.
