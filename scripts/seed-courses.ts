#!/usr/bin/env npx ts-node
/**
 * seed-courses.ts
 *
 * Calls add_course on the course_registry contract for all courses defined
 * in data/courses.ts. Requires ADMIN_SECRET_KEY and contract addresses in env.
 *
 * Usage:
 *   ADMIN_SECRET_KEY=S... npx ts-node scripts/seed-courses.ts
 */
import {
  Keypair,
  SorobanRpc,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  Contract,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk";
import { ALL_COURSES } from "../data/courses";

const RPC_URL   = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org";
const NETWORK   = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet";
const CONTRACT  = process.env.NEXT_PUBLIC_COURSE_REGISTRY_CONTRACT ?? "";
const ADMIN_SK  = process.env.ADMIN_SECRET_KEY ?? "";

if (!ADMIN_SK)   throw new Error("ADMIN_SECRET_KEY is required");
if (!CONTRACT)   throw new Error("NEXT_PUBLIC_COURSE_REGISTRY_CONTRACT is required");

const networkPassphrase =
  NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

async function main() {
  const rpc    = new SorobanRpc.Server(RPC_URL, { allowHttp: true });
  const admin  = Keypair.fromSecret(ADMIN_SK);
  const contract = new Contract(CONTRACT);

  const account = await rpc.getAccount(admin.publicKey());

  let sequence = BigInt(account.sequenceNumber());

  for (const course of ALL_COURSES) {
    sequence += 1n;

    const tx = new TransactionBuilder(
      { ...account, sequence: String(sequence) },
      { fee: BASE_FEE, networkPassphrase },
    )
      .addOperation(
        contract.call(
          "add_course",
          Address.fromString(admin.publicKey()).toScVal(),
          nativeToScVal(course.code,      { type: "string" }),
          nativeToScVal(course.title,     { type: "string" }),
          nativeToScVal(course.units,     { type: "u32"    }),
          nativeToScVal(course.faculty,   { type: "string" }),
          nativeToScVal(course.level,     { type: "u32"    }),
        ),
      )
      .setTimeout(30)
      .build();

    const sim = await rpc.simulateTransaction(tx);
    if (SorobanRpc.Api.isSimulationError(sim)) {
      console.error(`  SKIP ${course.code}: ${sim.error}`);
      continue;
    }

    const assembled = SorobanRpc.assembleTransaction(tx, sim).build();
    assembled.sign(admin);

    const res = await rpc.sendTransaction(assembled);
    console.log(`  OK   ${course.code}: ${res.hash}`);
  }

  console.log("Done — all courses seeded.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
