#!/usr/bin/env bash
# Initialize all StellarU contracts after deployment
# Run after deploy.sh, with contract IDs set in .env

set -euo pipefail

source .env 2>/dev/null || true

NETWORK=${STELLAR_NETWORK:-testnet}
ADMIN_KEY=${STELLAR_SECRET:-}

if [[ -z "$ADMIN_KEY" ]]; then
  echo "ERROR: STELLAR_SECRET required"
  exit 1
fi

echo "Initializing student_registry..."
stellar contract invoke \
  --id "$NEXT_PUBLIC_CONTRACT_STUDENT_REGISTRY" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- initialize --admin "$ADMIN_PUBLIC_KEY"

echo "Initializing course_registry..."
stellar contract invoke \
  --id "$NEXT_PUBLIC_CONTRACT_COURSE_REGISTRY" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- initialize --admin "$ADMIN_PUBLIC_KEY"

echo "Initializing enrollment..."
stellar contract invoke \
  --id "$NEXT_PUBLIC_CONTRACT_ENROLLMENT" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- initialize \
    --admin "$ADMIN_PUBLIC_KEY" \
    --tuition_contract "$NEXT_PUBLIC_CONTRACT_TUITION"

echo "Initializing tuition..."
stellar contract invoke \
  --id "$NEXT_PUBLIC_CONTRACT_TUITION" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- initialize \
    --admin "$ADMIN_PUBLIC_KEY" \
    --token "$USDC_CONTRACT" \
    --treasury "$TREASURY_ADDRESS"

echo "Initializing credential..."
stellar contract invoke \
  --id "$NEXT_PUBLIC_CONTRACT_CREDENTIAL" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- initialize --admin "$ADMIN_PUBLIC_KEY"

echo "Initializing identity..."
stellar contract invoke \
  --id "$NEXT_PUBLIC_CONTRACT_IDENTITY" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- initialize --admin "$ADMIN_PUBLIC_KEY"

echo "Done. All contracts initialized."
