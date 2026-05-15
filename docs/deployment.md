# Deployment Guide

## Prerequisites

- [Stellar CLI](https://github.com/stellar/stellar-cli) v20+
- Rust with `wasm32-unknown-unknown` target: `rustup target add wasm32-unknown-unknown`
- A funded Stellar account (testnet: use `stellar account fund`)
- Node.js 20+

## 1. Build Contracts

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

Output: `contracts/target/wasm32-unknown-unknown/release/<name>.wasm`

## 2. Deploy All Contracts

```bash
# Set your admin key
export ADMIN_SECRET_KEY=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Deploy and initialise all 10 contracts
./scripts/deploy.sh
./scripts/init-contracts.sh
```

`deploy.sh` outputs contract IDs to stdout. Copy them into `.env.local`:

```bash
./scripts/deploy.sh | tee .env.deployed
source .env.deployed
```

## 3. Verify Deployment

```bash
./scripts/verify-deployment.sh
```

Runs a read-only function call on each contract and reports pass/fail.

## 4. Seed Course Registry

```bash
ADMIN_SECRET_KEY=$ADMIN_SECRET_KEY npx ts-node scripts/seed-courses.ts
```

Adds all courses from `data/courses.ts` to the course_registry contract.

## 5. Start the Portal

```bash
cp .env.deployed .env.local
# Add DATABASE_URL, JWT_SECRET, PINATA_JWT, etc.

npm install
npm run db:migrate    # run Prisma migrations
npm run build
npm start
```

## Mainnet Checklist

- [ ] All contracts deployed and initialised
- [ ] `verify-deployment.sh` passes for all 10 contracts
- [ ] JWT_SECRET is at least 32 random bytes
- [ ] ANCHOR_OPERATOR_SECRET stored in a secrets manager (not in .env)
- [ ] HTTPS only — no HTTP in production
- [ ] PINATA_JWT scoped to a dedicated API key
- [ ] Database backups configured
- [ ] Rate limiting reviewed for production traffic

## Upgrading Contracts

Soroban contracts are immutable once deployed. For upgrades:

1. Deploy the new WASM as a new contract
2. Update `.env.local` with the new contract ID
3. Migrate any persistent data if required (via admin scripts)
4. Open a governance proposal to document the change

## TTL Maintenance

Persistent storage entries expire on Stellar. Run `bump_expiry` annually on:

- `student_registry` — for each active student record
- `credential` — for each issued credential (via `fetchFromIPFS` cron)
- `enrollment` — for each active enrollment
- `identity` — for each registered DID (permissionless — any caller)
- `course_registry` — for each active course
