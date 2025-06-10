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

export function ipfsUrl(cid: string): string {
  return `${PINATA_GATEWAY}/ipfs/${cid}`;
}

export async function fetchFromIPFS<T = unknown>(cid: string): Promise<T> {
  const res = await fetch(ipfsUrl(cid));
  if (!res.ok) throw new Error(`IPFS fetch failed: ${res.statusText}`);
  return res.json() as Promise<T>;
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
