import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Keypair,
  Networks,
  BASE_FEE,
  scValToNative,
  nativeToScVal,
  xdr,
} from "@stellar/stellar-sdk";
import type { ClientConfig, AnchorTransferStatus } from "./types";

const THROWAWAY = Keypair.random();

export class AnchorClient {
  private rpc:      SorobanRpc.Server;
  private contract: Contract;
  private network:  string;

  constructor(config: ClientConfig) {
    if (!config.anchorContract) {
      throw new Error("anchorContract is required for AnchorClient");
    }
    this.rpc      = new SorobanRpc.Server(
      config.rpcUrl ?? "https://soroban-testnet.stellar.org",
      { allowHttp: true }
    );
    this.contract  = new Contract(config.anchorContract);
    this.network   = config.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
  }

  async getTransfer(txId: string): Promise<AnchorTransferStatus> {
    const idVal  = nativeToScVal(txId, { type: "string" });
    const result = await this._simulate("get_transfer", [idVal]);
    const raw    = scValToNative(result) as Record<string, unknown>;

    const statusMap: Record<string, AnchorTransferStatus["status"]> = {
      Pending:   "pending",
      Completed: "completed",
      Refunded:  "refunded",
      Expired:   "expired",
    };

    return {
      id:          raw["id"] as string,
      status:      statusMap[raw["status"] as string] ?? "pending",
      amount:      BigInt(raw["amount"] as number),
      asset:       raw["asset"] as string,
      sender:      raw["sender"] as string,
      recipient:   raw["recipient"] as string,
      initiatedAt: Number(raw["initiated_at"]),
      completedAt: raw["completed_at"] ? Number(raw["completed_at"]) : null,
      expiresAt:   Number(raw["expires_at"]),
    };
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
      throw new Error(`Anchor simulate error: ${sim.error}`);
    }
    if (!("result" in sim) || !sim.result) {
      throw new Error("No simulation result");
    }
    return sim.result.retval;
  }
}
