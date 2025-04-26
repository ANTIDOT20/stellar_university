# StellarU — Full Architecture & Build Plan

---

## 1. Vision

StellarU is the world's first blockchain-native university protocol anchored on Stellar. It operates on three merged layers that reinforce each other:

- **Layer 1 — The University Protocol:** A deployable, multi-tenant set of Soroban contracts any institution can fork and run. StellarU is the reference implementation. Every academic event (admission, registration, tuition, grading, graduation) is settled on-chain.
- **Layer 2 — The Identity & Credential Layer:** A public-good DID primitive for Stellar. Academic and professional credentials attach to wallets. Any dApp — DeFi, DAO, employer — queries one API to verify. StellarU defines the first credential standard for Stellar.
- **Layer 3 — The Anchor Rails:** SEP-31 compliant cross-border education payment infrastructure. Diaspora parents pay in local currency; USDC settles in the university treasury instantly. No SWIFT, no delays, no 8% fees.

Each layer feeds the others: more institutions (Layer 1) → more credentialed wallets (Layer 2) → more payment volume (Layer 3). The combination is a compounding network effect.

---

## 2. Phase Roadmap

### Phase 1 — The University (Q2–Q4 2025)
Build one fully working university — StellarU — with all core Soroban contracts and a complete frontend portal. This is a shippable, standalone product.

### Phase 2 — The Credential Layer (Q4 2025–Q1 2026)
Layer the identity/DID contracts on top of the working student registry. Publish the StellarU Credential SDK so any dApp can verify wallet credentials in one line.

### Phase 3 — The Anchor Rails (Q1–Q2 2026)
Integrate SEP-31 payment rails into the tuition flow. Partner with an existing Stellar anchor for NGN→USDC conversion. Publish the payment infrastructure as a reusable open-source component for other universities.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Smart Contracts | Soroban (Rust, `#![no_std]`) on Stellar |
| Backend / API | Next.js API Routes + Prisma ORM |
| Database | PostgreSQL (off-chain metadata) |
| Wallet | Freighter browser extension + Albedo fallback |
| Payments | XLM (fees) + USDC SAC (tuition) |
| File Storage | IPFS via Pinata (certificates, transcripts) |
| Auth | Stellar keypair challenge-response (no passwords) |
| Deployment | Vercel + Railway + Stellar Testnet → Mainnet |

---

## 4. University Structure — Faculties & Departments

### 4.1 Faculty of Physical Sciences
- Physics
- Chemistry
- Mathematics
- Statistics
- Computer Science
- Geology & Mining Science

### 4.2 Faculty of Biological Sciences
- Botany & Plant Biology
- Zoology & Animal Biology
- Microbiology
- Biochemistry
- Cell Biology & Genetics

### 4.3 Faculty of Engineering
- Civil Engineering
- Electrical & Electronics Engineering
- Mechanical Engineering
- Chemical Engineering
- Computer Engineering
- Agricultural Engineering

### 4.4 Faculty of Agricultural Sciences
- Crop Science & Horticulture
- Animal Science & Production
- Soil Science & Land Management
- Agronomy
- Agricultural Economics & Extension Services
- Fisheries & Aquaculture

### 4.5 Faculty of Medical Sciences
- Medicine & Surgery (MBBS)
- Nursing Science
- Medical Laboratory Science
- Pharmacology & Pharmacy
- Physiology
- Anatomy & Neuroscience
- Radiography & Medical Imaging

### 4.6 Faculty of Food Science & Technology
- Food Science & Technology
- Nutrition & Dietetics
- Hospitality & Tourism Management
- Biotechnology (Food Track)

### 4.7 Faculty of Environmental Sciences
- Environmental Management
- Geography & Meteorology
- Forestry & Wildlife Management
- Marine Science

### 4.8 Faculty of Stellar Blockchain Science *(Flagship)*

The world's first accredited faculty dedicated entirely to blockchain science with Stellar as the primary protocol. All coursework for this faculty is conducted and assessed on-chain.

| Department | Focus Areas |
|---|---|
| Decentralised Finance (DeFi) | AMMs, liquidity, yield, stablecoins, lending protocols |
| Smart Contract Engineering | Soroban/Rust, contract architecture, Wasm optimisation, upgradability |
| Blockchain Infrastructure & Protocol Design | SCP, consensus, validator ops, network architecture |
| Tokenomics & Digital Asset Economics | Token models, supply schedules, incentive design, macro of digital assets |
| Blockchain Security & Auditing | Vulnerability classes, formal verification, audit methodology, incident response |
| Web3 Application Development | Full-stack dApps, wallet UX, on-chain/off-chain data architecture |

---

## 5. Smart Contract Architecture

### Contract Overview

```
contracts/
├── student_registry/   # Admission, wallet→student mapping
├── course_registry/    # Course catalogue, faculty/dept metadata
├── enrollment/         # Semester course registration
├── tuition/            # Tuition collection + payment verification
├── grading/            # Grade submission + GPA computation
├── credential/         # Degree/certificate issuance (NFT-style)
├── scholarship/        # Grant pools + milestone disbursement
├── governance/         # Admin roles, dean assignments, pausing
├── identity/           # DID layer (Phase 2)
└── anchor/             # SEP-31 payment rails (Phase 3)
```

### student_registry

```rust
pub struct StudentRecord {
    pub wallet:         Address,
    pub matric_no:      String,
    pub dept_id:        Symbol,
    pub level:          u32,
    pub admission_date: u64,
    pub status:         StudentStatus,  // Active | Suspended | Graduated
}

pub fn admit_student(env, wallet, matric_no, dept_id, level) -> Result<(), Error>
pub fn get_student(env, wallet) -> Result<StudentRecord, Error>
pub fn update_status(env, admin, wallet, status) -> Result<(), Error>
```

### course_registry

```rust
pub struct Course {
    pub course_id:    Symbol,
    pub title:        String,
    pub dept_id:      Symbol,
    pub units:        u32,
    pub level:        u32,
    pub semester:     u32,
}

pub fn add_course(env, admin, course) -> Result<(), Error>
pub fn get_course(env, course_id) -> Result<Course, Error>
pub fn list_dept_courses(env, dept_id) -> Vec<Course>
```

### enrollment

```rust
pub fn register(env, student, semester_id, courses: Vec<Symbol>) -> Result<(), Error>
pub fn get_enrollment(env, student, semester_id) -> Vec<Symbol>
// Validates: max 24 credit units, payment cleared, course prerequisites
```

### tuition

```rust
pub fn pay_tuition(env, student, semester_id, token, amount) -> Result<(), Error>
pub fn verify_payment(env, student, semester_id) -> bool
pub fn set_tuition_amount(env, admin, dept_id, level, amount) -> Result<(), Error>
```

### grading

```rust
pub fn submit_grade(env, lecturer, student, course_id, semester_id, score: u32) -> Result<(), Error>
pub fn get_grade(env, student, course_id, semester_id) -> Result<u32, Error>
pub fn compute_gpa(env, student, semester_id) -> i128  // scaled ×100
```

### credential

```rust
pub struct CredentialRecord {
    pub wallet:          Address,
    pub degree_class:    Symbol,  // First | Second_Upper | Second_Lower | Third | Pass
    pub dept_id:         Symbol,
    pub graduation_date: u64,
    pub cert_cid:        String,  // IPFS CID of the PDF certificate
}

pub fn issue_degree(env, admin, wallet, degree_class, cert_cid) -> Result<(), Error>
pub fn verify_credential(env, wallet) -> Result<CredentialRecord, Error>
```

### identity (Phase 2)

```rust
pub struct WalletCredential {
    pub wallet:          Address,
    pub credential_type: Symbol,  // DEGREE | BOOTCAMP | PROFESSIONAL | KYC_TIER
    pub issuer:          Address,
    pub issued_at:       u64,
    pub expires_at:      Option<u64>,
    pub metadata_cid:    String,
}

pub fn issue_credential(env, issuer, wallet, ctype, cid) -> Result<(), Error>
pub fn get_credentials(env, wallet) -> Vec<WalletCredential>
pub fn verify_credential_type(env, wallet, ctype) -> bool
pub fn revoke_credential(env, issuer, wallet, ctype) -> Result<(), Error>
```

### anchor (Phase 3)

```rust
// SEP-31 compliant cross-border payment for tuition
pub fn initiate_payment(env, sender, student, amount_fiat, fiat_asset, semester_id) -> Result<u64, Error>
pub fn complete_payment(env, payment_id, usdc_amount) -> Result<(), Error>
pub fn get_payment_status(env, payment_id) -> PaymentStatus
pub fn set_exchange_rate(env, oracle, fiat_asset, rate_bps) -> Result<(), Error>
```

---

## 6. Frontend Structure

```
app/
├── page.tsx                           # Landing page
├── layout.tsx                         # Root layout
├── globals.css
│
├── (public)/
│   ├── about/page.tsx
│   ├── faculties/page.tsx
│   └── faculties/[slug]/page.tsx
│
├── (portal)/
│   ├── layout.tsx                     # Auth gate + sidebar
│   ├── student/
│   │   ├── dashboard/page.tsx
│   │   ├── registration/page.tsx
│   │   ├── fees/page.tsx
│   │   ├── results/page.tsx
│   │   └── certificate/page.tsx
│   ├── lecturer/
│   │   ├── dashboard/page.tsx
│   │   ├── courses/page.tsx
│   │   └── grades/page.tsx
│   └── admin/
│       ├── dashboard/page.tsx
│       ├── students/page.tsx
│       ├── courses/page.tsx
│       └── scholarships/page.tsx
│
└── api/
    ├── auth/challenge/route.ts
    ├── auth/verify/route.ts
    ├── students/route.ts
    └── courses/route.ts
```

---

## 7. Authentication Flow

1. User clicks **Connect Wallet** (Freighter / Albedo)
2. Backend issues a one-time challenge string (TTL 60s)
3. User signs challenge with Stellar private key
4. Backend verifies signature → role looked up from `governance` contract
5. JWT issued (student / lecturer / admin)
6. Session valid until wallet disconnected or JWT expires

---

## 8. Tuition Payment Flow

1. Student visits **Pay Fees** → portal fetches amount from `tuition` contract
2. Student selects XLM or USDC
3. Freighter prompts transaction approval
4. Token transferred to university treasury
5. `pay_tuition()` writes payment record on-chain
6. Enrollment lock lifted → course registration opens

---

## 9. Credential Verification Flow (Layer 2)

```typescript
import { StellarUCredential } from '@stellaru/sdk';

const sdk = new StellarUCredential({ network: 'mainnet' });
const creds = await sdk.getCredentials('GXYZ...');
// Returns: [{ type: 'DEGREE', dept: 'COMPUTER_SCIENCE', class: 'FIRST', date: ... }]

const hasDegree = await sdk.verify('GXYZ...', 'DEGREE');
```

---

## 10. Anchor Payment Flow (Layer 3)

```
Parent (Lagos) → Paystack/Flutterwave → NGN received by Anchor partner
→ Anchor converts NGN to USDC on Stellar (SEP-31)
→ USDC sent to StellarU treasury wallet
→ anchor contract records payment_id on-chain
→ tuition contract marks semester as paid
→ Student enrollment unlocked
```

---

## 11. Database Schema (Prisma)

```prisma
model Student {
  id            String       @id @default(cuid())
  walletAddress String       @unique
  matricNo      String       @unique
  firstName     String
  lastName      String
  email         String       @unique
  departmentId  String
  level         Int
  createdAt     DateTime     @default(now())
  department    Department   @relation(fields: [departmentId], references: [id])
}

model Department {
  id        String   @id
  name      String
  code      String   @unique
  facultyId String
  faculty   Faculty  @relation(fields: [facultyId], references: [id])
  students  Student[]
  courses   Course[]
}

model Faculty {
  id          String       @id
  name        String
  slug        String       @unique
  code        String       @unique
  departments Department[]
}

model Course {
  id           String  @id
  code         String  @unique
  title        String
  units        Int
  level        Int
  semester     Int
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])
}
```

---

## 12. Commit History Timeline

Backdated commits represent organic development from project inception.

| Period | Development Focus |
|---|---|
| Apr 26–30, 2025 | Project setup, README, folder structure, TypeScript types, faculty data |
| May 2025 | Landing page, components, Tailwind design system, public pages |
| Jun 2025 | Core Soroban contracts v1 (student_registry, course_registry) |
| Jul 2025 | enrollment + tuition contracts, Freighter wallet integration |
| Aug 2025 | grading + credential contracts, student portal |
| Sep 2025 | Full portal (student/lecturer/admin), API routes, Prisma |
| Oct 2025 | scholarship contract, donor portal, mobile responsiveness |
| Nov 2025 | Identity contract (Phase 2), credential SDK alpha |
| Dec 2025 | SDK beta, DID spec doc, integration examples |
| Jan 2026 | Anchor contract (Phase 3), SEP-31 payment flow |
| Feb 2026 | Anchor frontend integration, payment status UI |
| Mar 2026 | E2E tests, contract audit prep, bug fixes |
| Apr 2026 | Testnet deployment, performance optimisations |
| May 2026 | Mainnet prep, final features, deployment docs |

---

## 13. What Makes This Different

1. **Protocol not product** — multi-tenant, forkable by any institution
2. **No certificate fraud** — degrees live on-chain; employers verify in seconds
3. **Stellar DID standard** — first credential primitive for the Stellar ecosystem
4. **Real payment rails** — SEP-31 cross-border tuition; diaspora pays from anywhere
5. **Talent pipeline** — Blockchain Science graduates are credentialed on-chain; Stellar projects hire from the verified pool
6. **Nigeria-first** — NUC-aligned curriculum, built for the African academic landscape
