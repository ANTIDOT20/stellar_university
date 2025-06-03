"use client";

import Link from "next/link";
import { Users, BookOpen, Award, CreditCard, TrendingUp, Shield, Settings } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const STATS = [
  { label: "Total Students",   value: "1,240",   icon: Users,      color: "text-blue-400",   bg: "bg-blue-500/10" },
  { label: "Active Courses",   value: "86",       icon: BookOpen,   color: "text-su-gold",    bg: "bg-su-gold/10"  },
  { label: "Creds Issued",     value: "238",      icon: Award,      color: "text-su-green",   bg: "bg-su-green/10" },
  { label: "Total Fees (USDC)",value: "$312,500", icon: CreditCard, color: "text-purple-400", bg: "bg-purple-500/10" },
];

const ADMIN_LINKS = [
  { href: "/portal/admin/students",    label: "Student Registry",    icon: Users,      desc: "Manage student records and statuses" },
  { href: "/portal/admin/courses",     label: "Course Registry",     icon: BookOpen,   desc: "Add, edit, and assign lecturers to courses" },
  { href: "/portal/admin/scholarships",label: "Scholarships",        icon: Award,      desc: "Create and distribute merit-based awards" },
  { href: "/portal/admin/governance",  label: "Governance",          icon: Shield,     desc: "Review and vote on protocol proposals" },
  { href: "/portal/admin/settings",    label: "Settings",            icon: Settings,   desc: "Protocol parameters and contract addresses" },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-su-text text-sm mb-1">Admin Portal</p>
          <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
        </div>
        <Badge variant="gold">Admin</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="card-glass rounded-xl p-5 space-y-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-su-text text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-white font-semibold mb-4">Administration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="card-glass rounded-xl p-5 flex items-start gap-4 hover:border-su-gold/30 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-su-slate flex items-center justify-center shrink-0">
                <link.icon className="w-4 h-4 text-su-text group-hover:text-su-gold transition-colors" />
              </div>
              <div>
                <p className="text-white font-medium text-sm group-hover:text-su-gold transition-colors">
                  {link.label}
                </p>
                <p className="text-su-text text-xs mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
