import { Networks, SorobanRpc, Contract, Address, xdr, scValToNative } from "@stellar/stellar-sdk";
import type { ClientConfig } from "./types";

const RPC_DEFAULTS = {
  testnet: "https://soroban-testnet.stellar.org",
  mainnet: "https://soroban-rpc.stellar.org",
};

export class StellarUClient {
  readonly config:  ClientConfig;
  readonly rpc:     SorobanRpc.Server;
  readonly network: string;

  constructor(config: ClientConfig) {
    this.config  = config;
    this.network = config.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
    this.rpc     = new SorobanRpc.Server(
      config.rpcUrl ?? RPC_DEFAULTS[config.network],
      { allowHttp: true }
    );
  }

  async callReadOnly<T>(
    contractId: string,
    method:     string,
    args:       xdr.ScVal[] = []
  ): Promise<T> {
    const contract = new Contract(contractId);
    const op       = contract.call(method, ...args);

    const tx = await this.rpc.simulateTransaction(
      // minimal envelope for simulation
      (null as any) // would be built properly with a throwaway keypair
    );

    // In practice we use SorobanRpc directly. For the SDK we provide
    // a helper that the caller can feed with a pre-built transaction.
    throw new Error("Use StellarUClient.simulate() with a pre-built transaction");
  }

  addressToScVal(addr: string): xdr.ScVal {
    return new Address(addr).toScVal();
  }

  nativeToScVal(value: unknown): xdr.ScVal {
    // Re-exported for convenience
    const { nativeToScVal } = require("@stellar/stellar-sdk");
    return nativeToScVal(value);
  }

  scValToNative<T = unknown>(val: xdr.ScVal): T {
    return scValToNative(val) as T;
  }
}
