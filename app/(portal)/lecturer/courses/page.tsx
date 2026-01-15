"use client";

import { useState } from "react";
import { BookOpen, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface AssignedCourse {
  code:       string;
  title:      string;
  units:      number;
  level:      number;
  session:    string;
  semester:   number;
  enrolled:   number;
  graded:     number;
}

const ASSIGNED_COURSES: AssignedCourse[] = [
  { code: "SBC301", title: "Soroban Contract Development I",          units: 3, level: 300, session: "2025/2026", semester: 1, enrolled: 34, graded: 20 },
  { code: "SBC303", title: "DeFi Protocol Design on Stellar",         units: 3, level: 300, session: "2025/2026", semester: 1, enrolled: 28, graded: 12 },
  { code: "SBC201", title: "Stellar SDK in Practice",                 units: 3, level: 200, session: "2025/2026", semester: 1, enrolled: 41, graded: 41 },
];

export default function LecturerCoursesPage() {
  const [session] = useState("2025/2026");

  return (
    <div className="p-8 max-w-4xl space-y-8">
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-su-gold" />
        <h1 className="text-2xl font-display font-bold text-white">My Courses</h1>
        <Badge variant="blue">{session}</Badge>
      </div>

      <div className="space-y-4">
        {ASSIGNED_COURSES.map((course) => {
          const pct = Math.round((course.graded / course.enrolled) * 100);
          return (
            <Link
              key={course.code}
              href={`/portal/lecturer/grades?course=${course.code}`}
              className="card-glass rounded-xl p-6 flex items-center gap-5 hover:border-su-gold/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-su-gold/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-su-gold" />
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-su-gold font-mono text-sm font-semibold">{course.code}</span>
                  <Badge variant="blue">Level {course.level}</Badge>
                  <Badge variant="gold">{course.units} units</Badge>
                </div>
                <p className="text-white font-medium leading-snug">{course.title}</p>

                <div className="flex items-center gap-4 text-xs text-su-text">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {course.enrolled} enrolled
                  </span>
                  <span>{course.graded}/{course.enrolled} graded</span>
                </div>

                <div className="space-y-1">
                  <div className="h-1.5 bg-su-navy rounded-full overflow-hidden">
                    <div
                      className="h-full bg-su-gold rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-su-text">{pct}% grading complete</p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-su-text group-hover:text-su-gold transition-colors shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
