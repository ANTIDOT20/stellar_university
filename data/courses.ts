export interface CourseData {
  code:        string;
  title:       string;
  creditUnits: number;
  level:       100 | 200 | 300 | 400 | 500;
  semester:    1 | 2;
  departmentId: string;
  compulsory:  boolean;
}

export const GENERAL_COURSES: CourseData[] = [
  { code: "GST101", title: "Use of English I",                creditUnits: 2, level: 100, semester: 1, departmentId: "all", compulsory: true  },
  { code: "GST102", title: "Nigerian Peoples and Culture",     creditUnits: 2, level: 100, semester: 1, departmentId: "all", compulsory: true  },
  { code: "GST201", title: "Philosophy and Logic",             creditUnits: 2, level: 200, semester: 1, departmentId: "all", compulsory: true  },
  { code: "GST202", title: "Peace and Conflict Resolution",    creditUnits: 2, level: 200, semester: 2, departmentId: "all", compulsory: true  },
  { code: "ENT201", title: "Entrepreneurship I",               creditUnits: 2, level: 200, semester: 1, departmentId: "all", compulsory: true  },
  { code: "ENT202", title: "Entrepreneurship II",              creditUnits: 2, level: 200, semester: 2, departmentId: "all", compulsory: true  },
];

export const CSC_COURSES: CourseData[] = [
  { code: "CSC101", title: "Introduction to Computing",             creditUnits: 3, level: 100, semester: 1, departmentId: "csc", compulsory: true  },
  { code: "CSC102", title: "Introduction to Problem Solving",       creditUnits: 3, level: 100, semester: 2, departmentId: "csc", compulsory: true  },
  { code: "CSC201", title: "Data Structures",                       creditUnits: 3, level: 200, semester: 1, departmentId: "csc", compulsory: true  },
  { code: "CSC202", title: "Computer Organization",                 creditUnits: 3, level: 200, semester: 2, departmentId: "csc", compulsory: true  },
  { code: "CSC301", title: "Data Structures and Algorithms",        creditUnits: 3, level: 300, semester: 1, departmentId: "csc", compulsory: true  },
  { code: "CSC302", title: "Operating Systems",                     creditUnits: 3, level: 300, semester: 2, departmentId: "csc", compulsory: true  },
  { code: "CSC401", title: "Database Management Systems",           creditUnits: 3, level: 400, semester: 1, departmentId: "csc", compulsory: true  },
  { code: "CSC402", title: "Software Engineering",                  creditUnits: 3, level: 400, semester: 2, departmentId: "csc", compulsory: true  },
];

export const SBC_COURSES: CourseData[] = [
  { code: "SBC101", title: "Introduction to Blockchain",            creditUnits: 3, level: 100, semester: 1, departmentId: "sbc", compulsory: true  },
  { code: "SBC102", title: "Stellar Ecosystem Overview",            creditUnits: 3, level: 100, semester: 2, departmentId: "sbc", compulsory: true  },
  { code: "SBC201", title: "Stellar Protocol and SEPs",             creditUnits: 3, level: 200, semester: 1, departmentId: "sbc", compulsory: true  },
  { code: "SBC202", title: "Cryptography Fundamentals",             creditUnits: 3, level: 200, semester: 2, departmentId: "sbc", compulsory: true  },
  { code: "SBC301", title: "Soroban Smart Contract Development",    creditUnits: 3, level: 300, semester: 1, departmentId: "sbc", compulsory: true  },
  { code: "SBC302", title: "DeFi and DEX Architecture",             creditUnits: 3, level: 300, semester: 2, departmentId: "sbc", compulsory: true  },
  { code: "SBC303", title: "DID and Verifiable Credentials",        creditUnits: 2, level: 300, semester: 2, departmentId: "sbc", compulsory: false },
  { code: "SBC401", title: "Cross-border Payment Rails (SEP-31)",   creditUnits: 3, level: 400, semester: 1, departmentId: "sbc", compulsory: true  },
  { code: "SBC402", title: "Blockchain Governance and Tokenomics",  creditUnits: 3, level: 400, semester: 2, departmentId: "sbc", compulsory: true  },
  { code: "SBC403", title: "Final Year Project",                    creditUnits: 6, level: 400, semester: 2, departmentId: "sbc", compulsory: true  },
];

export const ALL_COURSES: CourseData[] = [
  ...GENERAL_COURSES,
  ...CSC_COURSES,
  ...SBC_COURSES,
];

export function getCoursesByDepartment(deptId: string, level?: number): CourseData[] {
  return ALL_COURSES.filter(
    (c) => (c.departmentId === deptId || c.departmentId === "all") &&
           (level === undefined || c.level === level)
  );
}

export function getCourseBySemester(deptId: string, level: number, semester: 1 | 2): CourseData[] {
  return getCoursesByDepartment(deptId, level).filter((c) => c.semester === semester);
}
