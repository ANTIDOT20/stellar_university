import Link from "next/link";
import { BookOpen, Users, ArrowRight, Star } from "lucide-react";
import { FACULTIES } from "@/data/faculties";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faculties",
  description: "Explore all 8 faculties and 44 departments at StellarU — from Stellar Blockchain Science to Medical Sciences.",
};

const FACULTY_COLORS = [
  "from-yellow-500/20 to-orange-500/10 border-yellow-500/20",
  "from-blue-500/20 to-cyan-500/10 border-blue-500/20",
  "from-green-500/20 to-emerald-500/10 border-green-500/20",
  "from-purple-500/20 to-violet-500/10 border-purple-500/20",
  "from-red-500/20 to-rose-500/10 border-red-500/20",
  "from-teal-500/20 to-green-500/10 border-teal-500/20",
  "from-orange-500/20 to-amber-500/10 border-orange-500/20",
  "from-su-gold/20 to-yellow-500/10 border-su-gold/30",
];

export default function FacultiesPage() {
  const total = FACULTIES.reduce((acc, f) => acc + f.departments.length, 0);

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <Badge variant="gold">Academic Faculties</Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            {FACULTIES.length} Faculties,{" "}
            <span className="gradient-text">{total} Departments</span>
          </h1>
          <p className="text-su-text text-lg max-w-2xl mx-auto">
            NUC-accredited programmes spanning sciences, engineering, health, and
            the emerging field of Stellar Blockchain Science.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {FACULTIES.map((faculty, idx) => (
            <Link
              key={faculty.id}
              href={`/faculties/${faculty.slug}`}
              className={`group relative bg-gradient-to-br ${FACULTY_COLORS[idx % FACULTY_COLORS.length]} border rounded-2xl p-6 hover:scale-[1.01] transition-all duration-200 ${faculty.isFlagship ? "xl:col-span-2" : ""}`}
            >
              {faculty.isFlagship && (
                <div className="absolute top-4 right-4">
                  <Badge variant="gold">
                    <Star className="w-3 h-3 mr-1" />
                    Flagship
                  </Badge>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-mono text-su-text uppercase tracking-widest mb-1">
                    {faculty.code}
                  </p>
                  <h2 className="text-white font-display font-bold text-xl group-hover:text-su-gold transition-colors leading-tight">
                    {faculty.name}
                  </h2>
                </div>

                <p className="text-su-text text-sm leading-relaxed line-clamp-2">
                  {faculty.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-su-text">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {faculty.departments.length} dept{faculty.departments.length !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {faculty.isFlagship ? "New intake open" : "Accepting students"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {faculty.departments.slice(0, faculty.isFlagship ? 6 : 3).map((dept) => (
                    <span
                      key={dept.id}
                      className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-su-text"
                    >
                      {dept.code}
                    </span>
                  ))}
                  {faculty.departments.length > (faculty.isFlagship ? 6 : 3) && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-su-text">
                      +{faculty.departments.length - (faculty.isFlagship ? 6 : 3)} more
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-su-gold text-sm font-medium group-hover:gap-2 transition-all">
                  Explore faculty <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
