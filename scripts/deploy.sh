#!/usr/bin/env bash
# Deploy all StellarU Soroban contracts to Testnet
# Usage: ./scripts/deploy.sh

set -euo pipefail

NETWORK=${STELLAR_NETWORK:-testnet}
SOURCE_KEY=${STELLAR_SECRET:-}
RPC_URL=${SOROBAN_RPC_URL:-https://soroban-testnet.stellar.org}
HORIZON_URL=${HORIZON_URL:-https://horizon-testnet.stellar.org}

if [[ -z "$SOURCE_KEY" ]]; then
  echo "ERROR: STELLAR_SECRET env var is required"
  exit 1
fi

CONTRACTS=(
  student_registry
  course_registry
  enrollment
  tuition
  grading
  credential
  scholarship
  governance
  identity
  anchor
)

echo "Building contracts..."
cd contracts
cargo build --release --target wasm32-unknown-unknown 2>&1 | tail -5

declare -A CONTRACT_IDS

for contract in "${CONTRACTS[@]}"; do
  WASM="target/wasm32-unknown-unknown/release/${contract//-/_}.wasm"
  if [[ ! -f "$WASM" ]]; then
    WASM="target/wasm32-unknown-unknown/release/${contract}.wasm"
  fi

  echo "Deploying $contract..."
  ID=$(stellar contract deploy \
    --wasm "$WASM" \
    --source "$SOURCE_KEY" \
    --network "$NETWORK" \
    --rpc-url "$RPC_URL" 2>&1 | grep -E '^[A-Z0-9]{56}$' | head -1)

  if [[ -z "$ID" ]]; then
    echo "  WARNING: could not parse contract ID for $contract"
  else
    echo "  $contract => $ID"
    CONTRACT_IDS[$contract]=$ID
  fi
done

cd ..

echo ""
echo "Add these to your .env:"
for contract in "${CONTRACTS[@]}"; do
  KEY="NEXT_PUBLIC_CONTRACT_$(echo $contract | tr '[:lower:]' '[:upper:]' | tr '-' '_')"
  echo "$KEY=${CONTRACT_IDS[$contract]:-REPLACE_ME}"
done
