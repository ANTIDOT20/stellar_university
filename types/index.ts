// ─── University Domain Types ─────────────────────────────────────────────────

export type StudentStatus = "active" | "suspended" | "graduated" | "withdrawn";
export type DegreeClass = "first" | "second_upper" | "second_lower" | "third" | "pass";
export type UserRole = "student" | "lecturer" | "admin" | "dean";
export type SemesterType = "first" | "second";
export type Network = "testnet" | "mainnet";

export interface Department {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  description: string;
  duration: number; // years
  degreeAwarded: string;
}

export interface Faculty {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string;
  color: string;         // Tailwind color class for UI
  icon: string;          // Lucide icon name
  departments: Department[];
  isFlagship?: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  level: number;        // 100 | 200 | 300 | 400 | 500
  semester: number;     // 1 | 2
  departmentId: string;
  isCompulsory: boolean;
  description?: string;
}

export interface StudentRecord {
  wallet: string;
  matricNo: string;
  departmentId: string;
  level: number;
  admissionDate: number; // Unix timestamp
  status: StudentStatus;
}

export interface CredentialRecord {
  wallet: string;
  degreeClass: DegreeClass;
  departmentId: string;
  graduationDate: number;
  certCid: string;       // IPFS CID
  gpa: number;           // scaled ×100, e.g. 450 = 4.50
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthChallenge {
  challenge: string;
  expiresAt: number;
}

export interface AuthSession {
  wallet: string;
  role: UserRole;
  expiresAt: number;
}

// ─── Wallet ──────────────────────────────────────────────────────────────────

export type WalletProvider = "freighter" | "albedo";

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  provider: WalletProvider | null;
  network: Network;
}

// ─── Identity / DID (Phase 2) ────────────────────────────────────────────────

export type CredentialType =
  | "DEGREE"
  | "DIPLOMA"
  | "BOOTCAMP"
  | "PROFESSIONAL"
  | "KYC_TIER_1"
  | "KYC_TIER_2";

export interface WalletCredential {
  wallet: string;
  credentialType: CredentialType;
  issuer: string;        // Stellar address of issuing institution
  issuedAt: number;
  expiresAt: number | null;
  metadataCid: string;   // IPFS CID with full credential JSON
}

// ─── Anchor / Payments (Phase 3) ─────────────────────────────────────────────

export type PaymentStatus =
  | "initiated"
  | "pending_conversion"
  | "completed"
  | "failed"
  | "refunded";

export interface TuitionPayment {
  paymentId: string;
  studentWallet: string;
  semesterId: string;
  amountFiat: number;
  fiatAsset: string;    // "NGN" | "GBP" | "USD"
  amountUsdc: number;
  status: PaymentStatus;
  createdAt: number;
  completedAt: number | null;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}
