import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Keypair,
  Networks,
  BASE_FEE,
  Address,
  nativeToScVal,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import { getRpcClient, NETWORK_PASSPHRASE, simulateAndSend } from "./stellar";
import { CONTRACTS_MAP } from "./stellar";

// ─── Student Registry ────────────────────────────────────────────────────────

export async function getStudent(studentPublicKey: string) {
  const rpc      = getRpcClient();
  const contract = new Contract(CONTRACTS_MAP.studentRegistry);
  const addrVal  = new Address(studentPublicKey).toScVal();

  const source   = Keypair.random();
  const account  = await rpc.getAccount(source.publicKey()).catch(() => null);
  if (!account) return null;

  const tx = new TransactionBuilder(account, {
    fee:               BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("get_student", addrVal))
    .setTimeout(30)
    .build();

  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim) || !("result" in sim) || !sim.result) {
    return null;
  }
  return scValToNative(sim.result.retval);
}

// ─── Tuition ─────────────────────────────────────────────────────────────────

export async function isTuitionPaid(
  studentPublicKey: string,
  session:          string,
  semester:         number
): Promise<boolean> {
  const rpc      = getRpcClient();
  const contract = new Contract(CONTRACTS_MAP.tuition);

  const addrVal     = new Address(studentPublicKey).toScVal();
  const sessionVal  = nativeToScVal(session,  { type: "string" });
  const semesterVal = nativeToScVal(semester, { type: "u32" });

  const source  = Keypair.random();
  const account = await rpc.getAccount(source.publicKey()).catch(() => null);
  if (!account) return false;

  const tx = new TransactionBuilder(account, {
    fee:               BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("is_paid", addrVal, sessionVal, semesterVal))
    .setTimeout(30)
    .build();

  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim) || !("result" in sim) || !sim.result) {
    return false;
  }
  return Boolean(scValToNative(sim.result.retval));
}

export async function getTuitionFee(level: number): Promise<bigint> {
  const rpc      = getRpcClient();
  const contract = new Contract(CONTRACTS_MAP.tuition);
  const levelVal = nativeToScVal(level, { type: "u32" });

  const source  = Keypair.random();
  const account = await rpc.getAccount(source.publicKey()).catch(() => null);
  if (!account) return BigInt(0);

  const tx = new TransactionBuilder(account, {
    fee:               BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("get_fee", levelVal))
    .setTimeout(30)
    .build();

  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim) || !("result" in sim) || !sim.result) {
    return BigInt(0);
  }
  return BigInt(scValToNative(sim.result.retval) as number);
}

// ─── Credential ───────────────────────────────────────────────────────────────

export async function verifyCredential(credentialIdHex: string): Promise<boolean | null> {
  const rpc      = getRpcClient();
  const contract = new Contract(CONTRACTS_MAP.credential);
  const idBytes  = Buffer.from(credentialIdHex, "hex");
  const idVal    = xdr.ScVal.scvBytes(idBytes);

  const source  = Keypair.random();
  const account = await rpc.getAccount(source.publicKey()).catch(() => null);
  if (!account) return null;

  const tx = new TransactionBuilder(account, {
    fee:               BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("verify", idVal))
    .setTimeout(30)
    .build();

  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim) || !("result" in sim) || !sim.result) {
    return null;
  }
  return Boolean(scValToNative(sim.result.retval));
}

// ─── Identity ─────────────────────────────────────────────────────────────────

export async function resolveDid(publicKey: string) {
  const rpc      = getRpcClient();
  const contract = new Contract(CONTRACTS_MAP.identity);
  const addrVal  = new Address(publicKey).toScVal();

  const source  = Keypair.random();
  const account = await rpc.getAccount(source.publicKey()).catch(() => null);
  if (!account) return null;

  const tx = new TransactionBuilder(account, {
    fee:               BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("resolve", addrVal))
    .setTimeout(30)
    .build();

  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim) || !("result" in sim) || !sim.result) {
    return null;
  }
  return scValToNative(sim.result.retval);
}
