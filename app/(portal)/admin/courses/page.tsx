"use client";

import { useState } from "react";
import { BookOpen, Plus, Search, Edit2, Power } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Course {
  code:        string;
  title:       string;
  department:  string;
  units:       number;
  level:       number;
  semester:    number;
  lecturer:    string | null;
  active:      boolean;
}

const MOCK: Course[] = [
  { code: "GST101", title: "Use of English",              department: "General Studies",  units: 2, level: 100, semester: 1, lecturer: "Dr. Adeola", active: true  },
  { code: "CSC101", title: "Introduction to Computing",    department: "Computer Science", units: 3, level: 100, semester: 1, lecturer: "Prof. Amadi",active: true  },
  { code: "MTH101", title: "Elementary Mathematics I",     department: "Mathematics",      units: 3, level: 100, semester: 1, lecturer: null,          active: true  },
  { code: "SBC201", title: "Stellar Protocol Basics",      department: "Blockchain Sci",   units: 3, level: 200, semester: 1, lecturer: "Prof. Okafor", active: true  },
  { code: "SBC301", title: "Soroban Smart Contracts",      department: "Blockchain Sci",   units: 3, level: 300, semester: 1, lecturer: "Prof. Okafor", active: true  },
  { code: "PHY101", title: "General Physics I",            department: "Physics",          units: 3, level: 100, semester: 1, lecturer: "Dr. Eze",      active: false },
];

export default function AdminCoursesPage() {
  const [query, setQuery] = useState("");
  const courses = MOCK.filter(
    (c) =>
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">Course Registry</h1>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-su-text" />
        <input
          type="text"
          placeholder="Search courses…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-su-navy/60 border border-su-border rounded-xl text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50"
        />
      </div>

      <div className="card-glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-su-border/40">
              {["Code", "Title", "Dept", "Units", "Level", "Lecturer", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-su-text text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-su-border/20">
            {courses.map((c) => (
              <tr key={c.code} className="hover:bg-su-slate/20 transition-colors">
                <td className="px-4 py-3 font-mono text-su-gold text-xs">{c.code}</td>
                <td className="px-4 py-3 text-white">{c.title}</td>
                <td className="px-4 py-3 text-su-text text-xs">{c.department}</td>
                <td className="px-4 py-3 text-su-text">{c.units}</td>
                <td className="px-4 py-3 text-su-text">{c.level}L/S{c.semester}</td>
                <td className="px-4 py-3 text-su-text text-xs">
                  {c.lecturer ?? <span className="text-red-400">Unassigned</span>}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={c.active ? "green" : "default"}>
                    {c.active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 flex items-center gap-1">
                  <button className="p-1 text-su-text hover:text-white rounded">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 text-su-text hover:text-white rounded">
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
