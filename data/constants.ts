export const UNIVERSITY_NAME = "StellarU";
export const UNIVERSITY_FULL_NAME = "Stellar University";
export const UNIVERSITY_TAGLINE = "Education Without Borders. Credentials Without Fraud.";
export const UNIVERSITY_DESCRIPTION =
  "The world's first blockchain-native university protocol on Stellar. 8 faculties, 40+ departments, Nigerian NUC-aligned curriculum — all on-chain.";

export const STELLAR_NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet") as "testnet" | "mainnet";
export const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";
export const SOROBAN_RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org";

export const CONTRACTS = {
  studentRegistry: process.env.NEXT_PUBLIC_STUDENT_REGISTRY_CONTRACT ?? "",
  courseRegistry:  process.env.NEXT_PUBLIC_COURSE_REGISTRY_CONTRACT ?? "",
  enrollment:      process.env.NEXT_PUBLIC_ENROLLMENT_CONTRACT ?? "",
  tuition:         process.env.NEXT_PUBLIC_TUITION_CONTRACT ?? "",
  grading:         process.env.NEXT_PUBLIC_GRADING_CONTRACT ?? "",
  credential:      process.env.NEXT_PUBLIC_CREDENTIAL_CONTRACT ?? "",
  scholarship:     process.env.NEXT_PUBLIC_SCHOLARSHIP_CONTRACT ?? "",
  governance:      process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT ?? "",
  identity:        process.env.NEXT_PUBLIC_IDENTITY_CONTRACT ?? "",
  anchor:          process.env.NEXT_PUBLIC_ANCHOR_CONTRACT ?? "",
} as const;

export const ACADEMIC_LEVELS = [100, 200, 300, 400, 500] as const;

export const SEMESTERS = [
  { id: "2024-2025-1", label: "First Semester 2024/2025", type: "first" as const },
  { id: "2024-2025-2", label: "Second Semester 2024/2025", type: "second" as const },
  { id: "2025-2026-1", label: "First Semester 2025/2026", type: "first" as const },
  { id: "2025-2026-2", label: "Second Semester 2025/2026", type: "second" as const },
] as const;

export const MAX_CREDIT_UNITS_PER_SEMESTER = 24;
export const MIN_CREDIT_UNITS_PER_SEMESTER = 12;

export const TUITION_USDC: Record<string, number> = {
  "100": 500,
  "200": 500,
  "300": 600,
  "400": 600,
  "500": 700,
  "medical": 900,
};

export const DEGREE_CLASS_LABELS: Record<string, string> = {
  first:        "First Class Honours",
  second_upper: "Second Class (Upper Division)",
  second_lower: "Second Class (Lower Division)",
  third:        "Third Class Honours",
  pass:         "Pass",
};

export const GPA_CLASS_BOUNDARIES = {
  first:        { min: 4.50, max: 5.00 },
  second_upper: { min: 3.50, max: 4.49 },
  second_lower: { min: 2.40, max: 3.49 },
  third:        { min: 1.50, max: 2.39 },
  pass:         { min: 1.00, max: 1.49 },
} as const;

export const NAV_LINKS = [
  { label: "Faculties", href: "/faculties" },
  { label: "About", href: "/about" },
  { label: "Protocol", href: "/#protocol" },
  { label: "Credential SDK", href: "/sdk" },
] as const;

export const STATS = [
  { label: "Faculties",    value: "8",  suffix: "" },
  { label: "Departments",  value: "40+", suffix: "" },
  { label: "Countries",    value: "50+", suffix: "" },
  { label: "On-chain",     value: "100", suffix: "%" },
] as const;
