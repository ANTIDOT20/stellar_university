import { Contract, SorobanRpc, TransactionBuilder, BASE_FEE, Networks, nativeToScVal, scValToNative, Keypair } from "@stellar/stellar-sdk";
import { getRpcClient, CONTRACTS_MAP } from "./stellar";
import { withCache } from "./cache";

export interface OnChainCredential {
  holder:       string;
  credType:     string;
  issuer:       string;
  ipfsCid:      string;
  degreeClass:  string;
  session:      string;
  issuedAt:     number;
  revoked:      boolean;
}

export async function verifyCredentialOnChain(credentialIdHex: string): Promise<{ valid: boolean; record?: OnChainCredential }> {
  return withCache(`credential:${credentialIdHex}`, async () => {
    const rpc        = getRpcClient();
    const contractId = CONTRACTS_MAP.credential;
    if (!contractId) return { valid: false };

    const idBytes = Buffer.from(credentialIdHex, "hex");
    if (idBytes.length !== 32) return { valid: false };

    const contract = new Contract(contractId);
    const source   = Keypair.random();

    const account = await rpc.getAccount(source.publicKey()).catch(() => null);
    if (!account) return { valid: false };

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE, networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call("get", nativeToScVal(idBytes, { type: "bytes" })))
      .setTimeout(30)
      .build();

    const sim = await rpc.simulateTransaction(tx);
    if (SorobanRpc.Api.isSimulationError(sim)) return { valid: false };

    const result = (sim as SorobanRpc.Api.SimulateTransactionSuccessResponse).result?.retval;
    if (!result) return { valid: false };

    const raw = scValToNative(result) as Record<string, unknown>;
    const record: OnChainCredential = {
      holder:      raw.holder      as string,
      credType:    String(raw.credential_type),
      issuer:      raw.issuer      as string,
      ipfsCid:     raw.ipfs_cid   as string,
      degreeClass: raw.degree_class as string,
      session:     raw.session     as string,
      issuedAt:    Number(raw.issued_at),
      revoked:     raw.revoked     as boolean,
    };

    return { valid: !record.revoked, record };
  }, 60_000);
}
