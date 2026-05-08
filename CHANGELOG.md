# Changelog

All notable changes to the StellarU protocol are documented here.

## [1.0.0] — 2026-05-15

### Protocol
- All 10 Soroban contracts stable on Stellar Testnet
- `bump_expiry` functions on `student_registry`, `enrollment`, and `course_registry` for persistent TTL management
- `governance::execute` and `governance::cancel` for proposal lifecycle management
- `credential::batch_verify` for multi-credential verification in one simulation call
- Anchor contract tests: invalid amount, unauthorized operator, transfer initiation

### Frontend Portal
- Student: schedule, scholarship, DID/identity, transcript, certificate (wired to useCredentials)
- Admin: credentials page with IPFS issue modal, analytics dashboard with enrollment/fee charts
- Lecturer: course list with grading progress bars
- Announcements panel on student dashboard
- Portal sidebar expanded with all student sections

### SDK (`@stellaru/credential-sdk`)
- v0.2.0: `EnrollmentClient`, utility functions, utils sub-export
- Multi-gateway IPFS fallback in `fetchFromIPFS`
- `CredentialCard` component for portal and third-party integrations

### API Routes
- `/api/anchor/initiate` — currency conversion and bank reference generation
- `/api/anchor/complete` — admin-gated transfer completion
- `/api/governance` — proposal list and creation
- `/api/scholarships` — scholarship list and application
- `/api/announcements` — cached announcement feed

### Documentation
- `docs/architecture.md` — full system diagram and data flow
- `docs/contracts.md` — contract function reference for all 10 contracts
- `docs/sdk.md` — SDK developer guide with examples
- `CONTRIBUTING.md` — contribution guidelines
- `README.md` — rewritten with architecture table, contract list, SDK quickstart

### Infrastructure
- `scripts/verify-deployment.sh` — smoke-test all 10 contracts post-deployment
- `scripts/seed-courses.ts` — seed course_registry from data/courses.ts
- `next.config.ts` — image optimizations, security headers, package import optimization
- `.env.example` — expanded with all contract IDs, USDC config, anchor config

## [0.1.0] — 2025-06-17

### Protocol
- Initial deployment of all 10 Soroban contracts to Testnet
- student_registry, course_registry, enrollment, tuition, grading, credential, scholarship, governance, identity, anchor

### Frontend
- Landing page, faculties directory, about, apply wizard
- Student portal: dashboard, fees, registration, results, certificate
- Lecturer portal: grade submission
- Admin portal: student management, scholarships, governance, courses, settings
- Public: verify, anchor, docs, blog, whitepaper

### SDK
- `@stellaru/credential-sdk` v0.1.0
- `CredentialVerifier`, `DidResolver`, `AnchorClient`
