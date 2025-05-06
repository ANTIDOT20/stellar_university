import {
  Networks,
  SorobanRpc,
  TransactionBuilder,
  BASE_FEE,
  Contract,
  Address,
  nativeToScVal,
  scValToNative,
  xdr,
  Transaction,
  FeeBumpTransaction,
  Memo,
} from "@stellar/stellar-sdk";
import { CONTRACTS } from "@/data/constants";

export const NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET") as
  | "TESTNET"
  | "MAINNET";

export const NETWORK_PASSPHRASE =
  NETWORK === "MAINNET" ? Networks.PUBLIC : Networks.TESTNET;

export const RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
  "https://soroban-testnet.stellar.org";

export const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ||
  "https://horizon-testnet.stellar.org";

let _rpcClient: SorobanRpc.Server | null = null;

export function getRpcClient(): SorobanRpc.Server {
  if (!_rpcClient) {
    _rpcClient = new SorobanRpc.Server(RPC_URL, { allowHttp: true });
  }
  return _rpcClient;
}

export async function simulateAndSend(
  transaction: Transaction | FeeBumpTransaction,
  signFn: (xdrStr: string) => Promise<string>
): Promise<string> {
  const rpc = getRpcClient();
  const sim = await rpc.simulateTransaction(transaction);

  if (SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error(`Simulation failed: ${sim.error}`);
  }

  const prepared = SorobanRpc.assembleTransaction(
    transaction as Transaction,
    sim
  ).build();

  const signedXdr = await signFn(prepared.toXDR());
  const signed = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

  const result = await rpc.sendTransaction(signed);
  if (result.status === "ERROR") {
    throw new Error(`Send failed: ${result.errorResult}`);
  }

  return await pollForCompletion(result.hash);
}

async function pollForCompletion(hash: string, attempts = 30): Promise<string> {
  const rpc = getRpcClient();
  for (let i = 0; i < attempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await rpc.getTransaction(hash);
    if (res.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      return hash;
    }
    if (res.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
      throw new Error(`Transaction failed: ${hash}`);
    }
  }
  throw new Error(`Transaction timeout: ${hash}`);
}

export function buildContractCall(
  contractId: string,
  method: string,
  args: xdr.ScVal[]
) {
  const contract = new Contract(contractId);
  return contract.call(method, ...args);
}

export function strToScVal(value: string): xdr.ScVal {
  return nativeToScVal(value, { type: "string" });
}

export function u32ToScVal(value: number): xdr.ScVal {
  return nativeToScVal(value, { type: "u32" });
}

export function u64ToScVal(value: bigint): xdr.ScVal {
  return nativeToScVal(value, { type: "u64" });
}

export function addressToScVal(address: string): xdr.ScVal {
  return new Address(address).toScVal();
}

export function scValToString(val: xdr.ScVal): string {
  return scValToNative(val) as string;
}

export function scValToU32(val: xdr.ScVal): number {
  return scValToNative(val) as number;
}

export const TUITION_TOKEN_CONTRACT =
  process.env.NEXT_PUBLIC_TUITION_TOKEN || "";

export const CONTRACTS_MAP = {
  studentRegistry: CONTRACTS.STUDENT_REGISTRY,
  courseRegistry:  CONTRACTS.COURSE_REGISTRY,
  enrollment:      CONTRACTS.ENROLLMENT,
  tuition:         CONTRACTS.TUITION,
  grading:         CONTRACTS.GRADING,
  credential:      CONTRACTS.CREDENTIAL,
  scholarship:     CONTRACTS.SCHOLARSHIP,
  governance:      CONTRACTS.GOVERNANCE,
  identity:        CONTRACTS.IDENTITY,
  anchor:          CONTRACTS.ANCHOR,
};
