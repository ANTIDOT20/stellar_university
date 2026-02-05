import { Contract, SorobanRpc, TransactionBuilder, BASE_FEE, Networks } from "@stellar/stellar-sdk";
import { getRpcClient } from "./stellar";
import { CONTRACTS_MAP } from "./stellar";

export interface ProposalRecord {
  id:          number;
  title:       string;
  description: string;
  proposer:    string;
  votesFor:    number;
  votesAgainst: number;
  quorum:      number;
  status:      "Active" | "Passed" | "Rejected" | "Executed" | "Cancelled";
  createdAt:   number;
  endsAt:      number;
}

export async function getProposal(id: number): Promise<ProposalRecord | null> {
  const rpc = getRpcClient();
  const contractId = CONTRACTS_MAP.governance;
  if (!contractId) return null;

  const contract = new Contract(contractId);
  const { Keypair, nativeToScVal } = await import("@stellar/stellar-sdk");
  const source = Keypair.random();

  const account = await rpc.getAccount(source.publicKey()).catch(() => null);
  if (!account) return null;

  const tx = new TransactionBuilder(account, {
    fee:               BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call("get_proposal", nativeToScVal(id, { type: "u32" })))
    .setTimeout(30)
    .build();

  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) return null;

  const { scValToNative } = await import("@stellar/stellar-sdk");
  const result = sim.result?.retval;
  if (!result) return null;

  const raw = scValToNative(result) as Record<string, unknown>;
  return {
    id:           raw.id as number,
    title:        raw.title as string,
    description:  raw.description as string,
    proposer:     raw.proposer as string,
    votesFor:     raw.votes_for as number,
    votesAgainst: raw.votes_against as number,
    quorum:       raw.quorum as number,
    status:       raw.status as ProposalRecord["status"],
    createdAt:    Number(raw.created_at),
    endsAt:       Number(raw.ends_at),
  };
}

export function formatProposalStatus(status: ProposalRecord["status"]): {
  label: string;
  variant: "green" | "gold" | "red" | "blue";
} {
  switch (status) {
    case "Active":    return { label: "Active",    variant: "gold"  };
    case "Passed":    return { label: "Passed",    variant: "green" };
    case "Executed":  return { label: "Executed",  variant: "green" };
    case "Rejected":  return { label: "Rejected",  variant: "red"   };
    case "Cancelled": return { label: "Cancelled", variant: "red"   };
    default:          return { label: status,      variant: "blue"  };
  }
}
