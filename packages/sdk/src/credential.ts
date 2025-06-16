import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Keypair,
  Networks,
  BASE_FEE,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import type { ClientConfig, CredentialRecord, VerifyResult } from "./types";

const THROWAWAY = Keypair.random();

export class CredentialVerifier {
  private rpc:        SorobanRpc.Server;
  private contract:   Contract;
  private network:    string;
  private sourceKey:  Keypair;

  constructor(config: ClientConfig) {
    this.rpc      = new SorobanRpc.Server(
      config.rpcUrl ?? "https://soroban-testnet.stellar.org",
      { allowHttp: true }
    );
    this.contract  = new Contract(config.credentialContract);
    this.network   = config.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
    this.sourceKey = THROWAWAY;
  }

  async verify(credentialId: Uint8Array): Promise<VerifyResult> {
    const idVal = xdr.ScVal.scvBytes(Buffer.from(credentialId));
    const result = await this._simulate("verify", [idVal]);
    const valid  = scValToNative(result) as boolean;

    const record = await this.get(credentialId);

    return {
      valid,
      revoked:    record.revoked,
      issuer:     record.issuer,
      holder:     record.holder,
      issuedAt:   record.issuedAt,
      type:       record.type,
      ipfsCid:    record.ipfsCid,
      degreeClass: record.degreeClass,
    };
  }

  async get(credentialId: Uint8Array): Promise<CredentialRecord> {
    const idVal  = xdr.ScVal.scvBytes(Buffer.from(credentialId));
    const result = await this._simulate("get", [idVal]);
    const raw    = scValToNative(result) as Record<string, unknown>;

    return {
      id:          Buffer.from(credentialId).toString("hex"),
      holder:      raw["holder"] as string,
      type:        raw["credential_type"] as string,
      issuer:      raw["issuer"] as string,
      ipfsCid:     raw["ipfs_cid"] as string,
      degreeClass: raw["degree_class"] as string,
      session:     raw["session"] as string,
      issuedAt:    Number(raw["issued_at"]),
      revoked:     raw["revoked"] as boolean,
    };
  }

  private async _simulate(method: string, args: xdr.ScVal[]): Promise<xdr.ScVal> {
    const account = await this.rpc.getAccount(this.sourceKey.publicKey());
    const tx = new TransactionBuilder(account, {
      fee:            BASE_FEE,
      networkPassphrase: this.network,
    })
      .addOperation(this.contract.call(method, ...args))
      .setTimeout(30)
      .build();

    const sim = await this.rpc.simulateTransaction(tx);
    if (SorobanRpc.Api.isSimulationError(sim)) {
      throw new Error(`Simulation error: ${sim.error}`);
    }
    if (!("result" in sim) || !sim.result) {
      throw new Error("No result from simulation");
    }
    return sim.result.retval;
  }
}
