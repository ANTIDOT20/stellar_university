const PINATA_JWT = process.env.PINATA_JWT || "";
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud";

interface PinataResponse {
  IpfsHash:    string;
  PinSize:     number;
  Timestamp:   string;
}

export async function uploadToIPFS(blob: Blob, filename: string): Promise<string> {
  const form = new FormData();
  form.append("file", blob, filename);
  form.append("pinataMetadata", JSON.stringify({ name: filename }));
  form.append("pinataOptions",  JSON.stringify({ cidVersion: 1 }));

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method:  "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body:    form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`IPFS upload failed: ${err}`);
  }

  const data: PinataResponse = await res.json();
  return data.IpfsHash;
}

export async function uploadJSONToIPFS(payload: object, name: string): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent:  payload,
      pinataMetadata: { name },
      pinataOptions:  { cidVersion: 1 },
    }),
  });

  if (!res.ok) {
    throw new Error(`IPFS JSON upload failed: ${res.statusText}`);
  }

  const data: PinataResponse = await res.json();
  return data.IpfsHash;
}

const IPFS_GATEWAYS = [
  PINATA_GATEWAY,
  "https://ipfs.io",
  "https://cloudflare-ipfs.com",
];

export function ipfsUrl(cid: string, gatewayIndex = 0): string {
  const gw = IPFS_GATEWAYS[gatewayIndex] ?? IPFS_GATEWAYS[0];
  return `${gw}/ipfs/${cid}`;
}

export async function fetchFromIPFS<T = unknown>(cid: string): Promise<T> {
  let lastErr: Error | null = null;

  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    try {
      const res = await fetch(ipfsUrl(cid, i), { signal: AbortSignal.timeout(8_000) });
      if (res.ok) return res.json() as Promise<T>;
    } catch (err) {
      lastErr = err as Error;
    }
  }

  throw lastErr ?? new Error(`IPFS fetch failed for CID ${cid}`);
}

export interface CredentialMetadata {
  "@context":     string[];
  type:           string[];
  issuer:         string;
  issuanceDate:   string;
  credentialSubject: {
    id:          string;
    name:        string;
    degree:      string;
    department:  string;
    session:     string;
    gpa:         number;
    degreeClass: string;
  };
}

export function buildCredentialMetadata(params: {
  holderPublicKey: string;
  holderName:      string;
  degree:          string;
  department:      string;
  session:         string;
  gpa:             number;
  degreeClass:     string;
  issuerPublicKey: string;
}): CredentialMetadata {
  return {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type:       ["VerifiableCredential", "UniversityDegreeCredential"],
    issuer:     `did:stellar:${params.issuerPublicKey}`,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id:          `did:stellar:${params.holderPublicKey}`,
      name:        params.holderName,
      degree:      params.degree,
      department:  params.department,
      session:     params.session,
      gpa:         params.gpa,
      degreeClass: params.degreeClass,
    },
  };
}
