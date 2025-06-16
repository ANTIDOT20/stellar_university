export interface ClientConfig {
  network:             "testnet" | "mainnet";
  rpcUrl?:             string;
  credentialContract:  string;
  identityContract:    string;
  anchorContract?:     string;
}

export interface VerifyResult {
  valid:      boolean;
  revoked:    boolean;
  issuer:     string;
  holder:     string;
  issuedAt:   number;
  type:       string;
  ipfsCid?:   string;
  degreeClass?: string;
}

export interface DidDocument {
  subject:     string;
  controller:  string;
  serviceUrls: string[];
  active:      boolean;
  createdAt:   number;
  updatedAt:   number;
}

export interface CredentialRecord {
  id:          string;
  holder:      string;
  type:        string;
  issuer:      string;
  ipfsCid:     string;
  degreeClass: string;
  session:     string;
  issuedAt:    number;
  revoked:     boolean;
}

export interface AnchorTransferStatus {
  id:          string;
  status:      "pending" | "completed" | "refunded" | "expired";
  amount:      bigint;
  asset:       string;
  sender:      string;
  recipient:   string;
  initiatedAt: number;
  completedAt: number | null;
  expiresAt:   number;
}
