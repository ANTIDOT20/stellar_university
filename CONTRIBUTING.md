# Contributing to StellarU

Thank you for your interest in contributing. StellarU is open protocol infrastructure — improvements to contracts, the portal, SDK, and documentation are all welcome.

## Setup

```bash
git clone https://github.com/stellaru-protocol/stellar-university
cd stellar-university
npm install
cp .env.example .env.local
npm run dev
```

## Project Structure

```
app/           Next.js App Router pages
components/    Reusable React components
contracts/     Soroban smart contracts (Rust)
data/          Static typed data (faculties, courses, constants)
hooks/         React hooks
lib/           Server-side and shared utilities
packages/sdk/  @stellaru/credential-sdk npm package
prisma/        Database schema
scripts/       Deployment and maintenance scripts
```

## Contribution Guidelines

### Smart Contracts

- All contracts are `#![no_std]` Rust targeting `wasm32-unknown-unknown`
- Every new function must have a corresponding `#[test]` in the `test` module
- Use `env.storage().persistent()` for data that outlives a session; `.instance()` for protocol-level config
- New `ContractError` variants must be added to the enum before use

### Frontend

- Components live in `components/`. UI primitives go in `components/ui/`
- Use `"use client"` only when the component requires browser APIs or React state
- All wallet interactions go through `WalletContext` — never read `window.freighter` directly
- Soroban read calls must use simulation (`simulateTransaction`) not full submission

### SDK

- Source is in `packages/sdk/src/`
- Every new client class must have a corresponding `.test.ts` file using vitest
- Run tests with `npm test` inside `packages/sdk/`

## Pull Requests

- One PR per feature or fix
- Reference the related issue with `Closes #N`
- Keep commits focused — one logical change per commit
- Do not modify `prisma/schema.prisma` without a migration

## Reporting Issues

Open an issue at https://github.com/stellaru-protocol/stellar-university/issues with:
- What you expected vs. what happened
- Steps to reproduce
- Contract name / function name if applicable
