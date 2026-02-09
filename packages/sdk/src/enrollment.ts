import { Contract, SorobanRpc, TransactionBuilder, BASE_FEE, Networks, nativeToScVal, scValToNative, Keypair } from "@stellar/stellar-sdk";
import { StellarUClient } from "./client";

export interface EnrollmentRecord {
  student:    string;
  course:     string;
  session:    string;
  semester:   number;
  status:     "Registered" | "Graded" | "Withdrawn" | "Incomplete";
  enrolledAt: bigint;
}

export class EnrollmentClient {
  private client:     StellarUClient;
  private contractId: string;

  constructor(client: StellarUClient, enrollmentContractId: string) {
    this.client     = client;
    this.contractId = enrollmentContractId;
  }

  async getEnrollment(
    studentPublicKey: string,
    courseCode:       string,
    session:          string,
    semester:         number,
  ): Promise<EnrollmentRecord | null> {
    const contract = new Contract(this.contractId);
    const source   = Keypair.random();

    const { Address } = await import("@stellar/stellar-sdk");

    const account = await this.client["rpc"].getAccount(source.publicKey()).catch(() => null);
    if (!account) return null;

    const tx = new TransactionBuilder(account, {
      fee:               BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        contract.call(
          "get_enrollment",
          Address.fromString(studentPublicKey).toScVal(),
          nativeToScVal(courseCode, { type: "string" }),
          nativeToScVal(session,    { type: "string" }),
          nativeToScVal(semester,   { type: "u32"    }),
        ),
      )
      .setTimeout(30)
      .build();

    const sim = await this.client.simulate(tx);
    if (SorobanRpc.Api.isSimulationError(sim)) return null;

    const result = (sim as SorobanRpc.Api.SimulateTransactionSuccessResponse).result?.retval;
    if (!result) return null;

    const raw = scValToNative(result) as Record<string, unknown>;
    return {
      student:    raw.student    as string,
      course:     raw.course     as string,
      session:    raw.session    as string,
      semester:   raw.semester   as number,
      status:     raw.status     as EnrollmentRecord["status"],
      enrolledAt: raw.enrolled_at as bigint,
    };
  }

  async getEnrollmentCount(): Promise<number> {
    const contract = new Contract(this.contractId);
    const source   = Keypair.random();

    const account = await this.client["rpc"].getAccount(source.publicKey()).catch(() => null);
    if (!account) return 0;

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE, networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call("count"))
      .setTimeout(30)
      .build();

    const sim = await this.client.simulate(tx);
    if (SorobanRpc.Api.isSimulationError(sim)) return 0;

    const result = (sim as SorobanRpc.Api.SimulateTransactionSuccessResponse).result?.retval;
    return result ? Number(scValToNative(result)) : 0;
  }
}
