#!/usr/bin/env bash
# verify-deployment.sh — Smoke-test all 10 deployed Soroban contracts by calling
# a read-only function on each and confirming a non-error response.
#
# Usage:
#   source .env.deployed   # or export each NEXT_PUBLIC_*_CONTRACT manually
#   ./scripts/verify-deployment.sh

set -euo pipefail

RPC="${NEXT_PUBLIC_SOROBAN_RPC_URL:-https://soroban-testnet.stellar.org}"
NETWORK="${NEXT_PUBLIC_STELLAR_NETWORK:-testnet}"

PASS=""
if [[ "$NETWORK" == "mainnet" ]]; then
  PASS="Public Global Stellar Network ; September 2015"
else
  PASS="Test SDF Network ; September 2015"
fi

OK=0
FAIL=0

check() {
  local name="$1"
  local contract_id="$2"
  local fn="$3"

  if [[ -z "$contract_id" ]]; then
    echo "  SKIP $name — contract ID not set"
    return
  fi

  if stellar contract invoke \
    --id "$contract_id" \
    --rpc-url "$RPC" \
    --network-passphrase "$PASS" \
    --source-account "$(stellar keys address default 2>/dev/null || echo GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN)" \
    -- "$fn" 2>/dev/null | grep -qv "error"; then
    echo "  OK   $name"
    OK=$((OK + 1))
  else
    echo "  FAIL $name"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== StellarU Contract Deployment Verification ==="
echo "    RPC: $RPC"
echo "    Network: $NETWORK"
echo ""

check "student_registry" "${NEXT_PUBLIC_STUDENT_REGISTRY_CONTRACT:-}" "count"
check "course_registry"  "${NEXT_PUBLIC_COURSE_REGISTRY_CONTRACT:-}"  "count"
check "enrollment"       "${NEXT_PUBLIC_ENROLLMENT_CONTRACT:-}"        "count"
check "tuition"          "${NEXT_PUBLIC_TUITION_CONTRACT:-}"           "get_fee" -- --level 200
check "grading"          "${NEXT_PUBLIC_GRADING_CONTRACT:-}"           "count"
check "credential"       "${NEXT_PUBLIC_CREDENTIAL_CONTRACT:-}"        "initialized"
check "scholarship"      "${NEXT_PUBLIC_SCHOLARSHIP_CONTRACT:-}"       "count"
check "governance"       "${NEXT_PUBLIC_GOVERNANCE_CONTRACT:-}"        "initialized"
check "identity"         "${NEXT_PUBLIC_IDENTITY_CONTRACT:-}"          "initialized"
check "anchor"           "${NEXT_PUBLIC_ANCHOR_CONTRACT:-}"            "transfer_count"

echo ""
echo "=== Results: $OK passed, $FAIL failed ==="
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
