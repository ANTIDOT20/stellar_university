"use client";

import { useState } from "react";
import { Search, Filter, UserCheck, UserX, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Student {
  matric:     string;
  name:       string;
  department: string;
  level:      number;
  status:     "Active" | "Suspended" | "Graduated" | "Withdrawn";
  gpa:        number;
}

const MOCK: Student[] = [
  { matric: "SU/2025/001", name: "Ada Okafor",       department: "Computer Science",       level: 100, status: "Active",    gpa: 4.12 },
  { matric: "SU/2025/002", name: "Emeka Nwosu",       department: "Physics",                level: 100, status: "Active",    gpa: 3.87 },
  { matric: "SU/2025/003", name: "Chioma Adeyemi",    department: "Blockchain Science",     level: 100, status: "Active",    gpa: 4.50 },
  { matric: "SU/2025/004", name: "Tunde Fashola",     department: "Biochemistry",           level: 200, status: "Active",    gpa: 3.22 },
  { matric: "SU/2024/089", name: "Ngozi Obi",         department: "Electrical Engineering", level: 300, status: "Active",    gpa: 3.60 },
  { matric: "SU/2024/072", name: "Seun Ajayi",        department: "Medicine",               level: 400, status: "Suspended", gpa: 1.80 },
];

const STATUS_VARIANT: Record<string, "green" | "red" | "gold" | "default"> = {
  Active:    "green",
  Suspended: "red",
  Graduated: "gold",
  Withdrawn: "default",
};

export default function AdminStudentsPage() {
  const [query, setQuery]   = useState("");
  const [students]          = useState(MOCK);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.matric.toLowerCase().includes(query.toLowerCase()) ||
      s.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">Student Registry</h1>
        <Button size="sm">
          <UserCheck className="w-4 h-4" />
          Register Student
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-su-text" />
        <input
          type="text"
          placeholder="Search by name, matric, or department…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-su-navy/60 border border-su-border rounded-xl text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
        />
      </div>

      {/* Table */}
      <div className="card-glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-su-border/40">
              {["Matric", "Name", "Department", "Level", "GPA", "Status", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-su-text text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-su-border/20">
            {filtered.map((s) => (
              <tr key={s.matric} className="hover:bg-su-slate/20 transition-colors">
                <td className="px-5 py-3 font-mono text-su-gold text-xs">{s.matric}</td>
                <td className="px-5 py-3 text-white font-medium">{s.name}</td>
                <td className="px-5 py-3 text-su-text">{s.department}</td>
                <td className="px-5 py-3 text-su-text">{s.level}L</td>
                <td className="px-5 py-3 text-white">{s.gpa.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <Badge variant={STATUS_VARIANT[s.status]}>{s.status}</Badge>
                </td>
                <td className="px-5 py-3">
                  <button className="text-su-text hover:text-white p-1 rounded">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-su-border/40 text-su-text text-xs">
          Showing {filtered.length} of {students.length} students
        </div>
      </div>
    </div>
  );
}
