import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Keypair,
  Networks,
  BASE_FEE,
  Address,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import type { ClientConfig, DidDocument } from "./types";

const THROWAWAY = Keypair.random();

export class DidResolver {
  private rpc:       SorobanRpc.Server;
  private contract:  Contract;
  private network:   string;

  constructor(config: ClientConfig) {
    this.rpc     = new SorobanRpc.Server(
      config.rpcUrl ?? "https://soroban-testnet.stellar.org",
      { allowHttp: true }
    );
    this.contract = new Contract(config.identityContract);
    this.network  = config.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
  }

  /** Resolve a did:stellar:<publicKey> to its DID document */
  async resolve(didOrPublicKey: string): Promise<DidDocument> {
    const pubkey = didOrPublicKey.startsWith("did:stellar:")
      ? didOrPublicKey.slice("did:stellar:".length)
      : didOrPublicKey;

    const addrVal = new Address(pubkey).toScVal();
    const result  = await this._simulate("resolve", [addrVal]);
    const raw     = scValToNative(result) as Record<string, unknown>;

    return {
      subject:     raw["subject"] as string,
      controller:  raw["controller"] as string,
      serviceUrls: raw["service_urls"] as string[],
      active:      raw["active"] as boolean,
      createdAt:   Number(raw["created_at"]),
      updatedAt:   Number(raw["updated_at"]),
    };
  }

  /** Check if an address is a trusted credential issuer */
  async isTrustedIssuer(publicKey: string): Promise<boolean> {
    const addrVal = new Address(publicKey).toScVal();
    const result  = await this._simulate("is_trusted_issuer", [addrVal]);
    return scValToNative(result) as boolean;
  }

  private async _simulate(method: string, args: xdr.ScVal[]): Promise<xdr.ScVal> {
    const account = await this.rpc.getAccount(THROWAWAY.publicKey());
    const tx = new TransactionBuilder(account, {
      fee:               BASE_FEE,
      networkPassphrase: this.network,
    })
      .addOperation(this.contract.call(method, ...args))
      .setTimeout(30)
      .build();

    const sim = await this.rpc.simulateTransaction(tx);
    if (SorobanRpc.Api.isSimulationError(sim)) {
      throw new Error(`DID resolve error: ${sim.error}`);
    }
    if (!("result" in sim) || !sim.result) {
      throw new Error("No simulation result");
    }
    return sim.result.retval;
  }
}
