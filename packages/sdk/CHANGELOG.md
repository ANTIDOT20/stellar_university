# Changelog

All notable changes to `@stellaru/credential-sdk` are documented here.

## [0.2.0] — 2026-02-09

### Added
- `EnrollmentClient` — reads enrollment records and counts from the enrollment contract
- `EnrollmentRecord` type export
- `batch_verify` support in `CredentialVerifier` — verify up to 10 credentials in one simulation call
- `isValidStellarAddress`, `isValidCredentialId`, `parseDid`, `formatDid`, `usdcToHuman`, `humanToUsdc`, `truncateAddress` utility functions (exported from package root)

### Changed
- `index.ts` now re-exports all utility functions from `./utils`

## [0.1.0] — 2025-06-17

### Added
- `StellarUClient` — base Soroban RPC wrapper
- `CredentialVerifier` — `verify(id)` and `get(id)` via simulation
- `DidResolver` — `resolve(didOrPublicKey)` and `isTrustedIssuer(pubkey)`
- `AnchorClient` — `getTransfer(txId)`
- TypeScript types: `ClientConfig`, `CredentialRecord`, `DidDocument`, `AnchorTransferStatus`, `VerifyResult`
