import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Award, BookOpen, ChevronRight } from "lucide-react";
import { getFacultyBySlug, FACULTIES } from "@/data/faculties";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return FACULTIES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const faculty = getFacultyBySlug(params.slug);
  if (!faculty) return { title: "Not Found" };
  return {
    title: faculty.name,
    description: faculty.description,
  };
}

export default function FacultyDetailPage({ params }: Props) {
  const faculty = getFacultyBySlug(params.slug);
  if (!faculty) notFound();

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-su-text mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/faculties" className="hover:text-white transition-colors">Faculties</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{faculty.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <Link
            href="/faculties"
            className="inline-flex items-center gap-2 text-su-text hover:text-white text-sm mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Faculties
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-su-gold uppercase tracking-widest">
                  {faculty.code}
                </span>
                {faculty.isFlagship && <Badge variant="gold">Flagship Faculty</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                {faculty.name}
              </h1>
              <p className="text-su-text text-lg max-w-2xl leading-relaxed">
                {faculty.description}
              </p>
            </div>

            <Link href="/apply">
              <Button size="lg">Apply to this Faculty</Button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: "Departments", value: faculty.departments.length },
            { label: "Min. Duration", value: `${Math.min(...faculty.departments.map((d) => d.duration))} yrs` },
            { label: "Max. Duration", value: `${Math.max(...faculty.departments.map((d) => d.duration))} yrs` },
          ].map((stat) => (
            <div key={stat.label} className="card-glass p-5 text-center rounded-xl">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-su-text text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Departments grid */}
        <div>
          <h2 className="text-xl font-display font-semibold text-white mb-6">
            Departments ({faculty.departments.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {faculty.departments.map((dept) => (
              <div
                key={dept.id}
                className="card-glass rounded-xl p-5 space-y-3 hover:border-su-gold/30 transition-colors group"
              >
                <div>
                  <p className="text-xs font-mono text-su-gold uppercase tracking-wider mb-1">
                    {dept.code}
                  </p>
                  <h3 className="text-white font-medium text-sm leading-snug group-hover:text-su-gold transition-colors">
                    {dept.name}
                  </h3>
                </div>

                <p className="text-su-text text-xs leading-relaxed line-clamp-2">
                  {dept.description}
                </p>

                <div className="flex items-center justify-between text-xs text-su-text pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {dept.duration} years
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {dept.degreeAwarded}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center card-glass rounded-2xl p-10 space-y-4">
          <h2 className="text-2xl font-display font-bold text-white">
            Ready to join {faculty.name}?
          </h2>
          <p className="text-su-text max-w-xl mx-auto">
            Applications are open. Connect your Stellar wallet and submit your
            application — all credentials will be minted on-chain.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/apply">
              <Button size="lg">Start Application</Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
