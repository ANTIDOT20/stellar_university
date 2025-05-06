"use client";

import { isConnected, getAddress, signTransaction } from "@stellar/freighter-api";
import type { WalletState } from "@/types";

export type WalletProvider = "freighter" | "albedo";

export async function detectWallet(): Promise<WalletProvider | null> {
  if (typeof window === "undefined") return null;
  if (await isConnected()) return "freighter";
  if ((window as any).albedo) return "albedo";
  return null;
}

export async function connectFreighter(): Promise<WalletState> {
  const connected = await isConnected();
  if (!connected) {
    throw new Error("Freighter extension not installed");
  }
  const result = await getAddress();
  if (result.error) {
    throw new Error(result.error);
  }
  return {
    connected: true,
    publicKey: result.address,
    network:   (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET") as "TESTNET" | "MAINNET",
    provider:  "freighter",
  };
}

export async function connectAlbedo(): Promise<WalletState> {
  const albedo = (window as any).albedo;
  if (!albedo) throw new Error("Albedo not available");
  const result = await albedo.publicKey({ intent_description: "StellarU sign-in" });
  return {
    connected: true,
    publicKey: result.pubkey,
    network:   (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET") as "TESTNET" | "MAINNET",
    provider:  "albedo",
  };
}

export async function signWithFreighter(xdrStr: string, networkPassphrase: string): Promise<string> {
  const result = await signTransaction(xdrStr, { networkPassphrase });
  if (result.error) throw new Error(result.error);
  return result.signedTxXdr;
}

export async function signWithAlbedo(xdrStr: string, network: string): Promise<string> {
  const albedo = (window as any).albedo;
  if (!albedo) throw new Error("Albedo not available");
  const result = await albedo.tx({ xdr: xdrStr, network, submit: false });
  return result.signed_envelope_xdr;
}

export function getSignFn(
  provider: WalletProvider,
  networkPassphrase: string
): (xdrStr: string) => Promise<string> {
  if (provider === "freighter") {
    return (xdr) => signWithFreighter(xdr, networkPassphrase);
  }
  const netStr = networkPassphrase.includes("Test") ? "testnet" : "public";
  return (xdr) => signWithAlbedo(xdr, netStr);
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function disconnectWallet(): WalletState {
  return { connected: false, publicKey: null, network: "TESTNET", provider: null };
}
