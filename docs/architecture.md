# StellarU Architecture

## Overview

StellarU is a three-layer protocol:

```
┌──────────────────────────────────────────────────────────┐
│  Next.js Portal (App Router)                             │
│  ┌───────────┐ ┌───────────┐ ┌──────────┐              │
│  │  Student  │ │ Lecturer  │ │  Admin   │               │
│  └───────────┘ └───────────┘ └──────────┘              │
└────────────────────────────┬─────────────────────────────┘
                             │ API Routes (Next.js)
                             │ lib/stellar.ts (SorobanRpc)
┌────────────────────────────▼─────────────────────────────┐
│  Soroban Smart Contracts                                  │
│                                                           │
│  University Protocol                                      │
│  ┌────────────────┐ ┌──────────────────┐                │
│  │student_registry│ │ course_registry  │                │
│  └────────────────┘ └──────────────────┘                │
│  ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌────────────┐  │
│  │enrollment│ │ tuition │ │ grading  │ │ credential │  │
│  └──────────┘ └─────────┘ └──────────┘ └────────────┘  │
│  ┌────────────┐ ┌──────────────┐                        │
│  │scholarship │ │  governance  │                        │
│  └────────────┘ └──────────────┘                        │
│                                                           │
│  Identity Layer          Anchor Layer                     │
│  ┌──────────┐            ┌──────────┐                    │
│  │ identity │            │  anchor  │                    │
│  └──────────┘            └──────────┘                    │
└────────────────────────────┬─────────────────────────────┘
                             │
                     Stellar Network
```

## Data Flow

### Student Registration

1. Student connects Freighter/Albedo wallet
2. Portal calls `auth/challenge` → returns nonce
3. Student signs nonce with wallet
4. Portal calls `auth/verify` → JWT session cookie
5. Student submits registration form
6. API calls `student_registry::register` via `simulateAndSend`
7. Matric number indexed on-chain; Student record stored in persistent storage

### Course Enrollment

1. Student selects courses (max 24 credit units)
2. Portal checks `tuition::is_paid` — enrollment blocked if unpaid
3. For each selected course: `enrollment::enroll` is called
4. `enrollment.count` incremented; event emitted

### Tuition Payment

1. Student chooses USDC (direct) or fiat (anchor)
2. USDC path: wallet calls `tuition::pay` via Freighter
3. Fiat path: anchor quote → bank transfer → operator calls `anchor::initiate_transfer` → `anchor::complete_transfer` → USDC released → student calls `tuition::pay`

### Credential Issuance

1. Admin calls `credential::issue` with holder, type, session
2. Credential metadata uploaded to IPFS via Pinata first
3. IPFS CID stored in credential record
4. Deterministic SHA-256 ID returned

### DID Resolution

1. Any caller constructs `did:stellar:<pubkey>`
2. `identity::resolve` is called (read-only simulation)
3. DID document returned: subject, controller, service URLs, active flag

## Off-Chain Components

- **PostgreSQL (Prisma)**: Student metadata, course descriptions, payment records, lecturer profiles — indexed for fast search, not truth-of-record
- **IPFS (Pinata)**: Certificate PDFs, transcript JSONs, W3C Verifiable Credential metadata
- **JWT (jose)**: Session tokens — HS256 signed, 24h TTL, stored in httpOnly cookie
- **In-memory rate limiter**: API protection without external Redis dependency

## Authentication

```
wallet.publicKey → challenge nonce → sign with keypair → verify signature
                                                         → JWT session
```

Role is embedded in the JWT payload: `student | lecturer | admin`. Middleware checks role before routing to admin/lecturer sections.

## Ledger Expiry Management

Soroban persistent storage entries expire. Long-lived records (student, credential, enrollment) should have their TTL extended annually via `bump_expiry` functions on each contract. A keeper script or protocol governance can trigger these.
