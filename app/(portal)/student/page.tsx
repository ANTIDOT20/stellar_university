"use client";

import { useEffect, useState } from "react";
import { BookOpen, CreditCard, Award, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { useWallet } from "@/components/wallet/WalletContext";
import { Badge } from "@/components/ui/Badge";
import { Announcements } from "@/components/sections/Announcements";
import Link from "next/link";

interface StudentSummary {
  firstName:    string;
  lastName:     string;
  matric:       string;
  department:   string;
  level:        number;
  gpa:          number;
  credits:      number;
  feesPaid:     boolean;
  registered:   boolean;
}

const MOCK_STUDENT: StudentSummary = {
  firstName:  "Ada",
  lastName:   "Okafor",
  matric:     "SU/2025/001",
  department: "Computer Science",
  level:      100,
  gpa:        4.12,
  credits:    18,
  feesPaid:   false,
  registered: false,
};

export default function StudentDashboard() {
  const { wallet } = useWallet();
  const [student, setStudent] = useState<StudentSummary | null>(null);

  useEffect(() => {
    // In production, fetch from /api/students using wallet.publicKey
    if (wallet.connected) {
      setTimeout(() => setStudent(MOCK_STUDENT), 500);
    }
  }, [wallet.connected]);

  if (!wallet.connected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-su-text mx-auto" />
          <p className="text-white font-medium">Connect your wallet to access the portal</p>
          <Link
            href="/"
            className="text-su-gold text-sm hover:underline"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-su-text text-sm mb-1">Welcome back</p>
          <h1 className="text-2xl font-display font-bold text-white">
            {student ? `${student.firstName} ${student.lastName}` : "Loading…"}
          </h1>
          {student && (
            <p className="text-su-text text-sm mt-1">
              {student.matric} · {student.department} · Level {student.level}
            </p>
          )}
        </div>
        <Badge variant={student?.feesPaid ? "green" : "red"}>
          {student?.feesPaid ? "Fees Paid" : "Fees Due"}
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Current GPA",      value: student ? student.gpa.toFixed(2) : "—",  icon: TrendingUp, color: "text-su-gold"  },
          { label: "Credits Earned",   value: student ? `${student.credits}`,           icon: Award,      color: "text-su-green" },
          { label: "Current Level",    value: student ? `${student.level}L`,            icon: BookOpen,   color: "text-blue-400" },
          { label: "Session",          value: "2024/2025",                               icon: Clock,      color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="card-glass rounded-xl p-5 space-y-3">
            <div className={`w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-su-text text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title:       "Course Registration",
            description: "Register for first semester courses. Deadline: Oct 15.",
            href:        "/portal/student/registration",
            icon:        BookOpen,
            badge:       student?.registered ? "Completed" : "Action required",
            variant:     student?.registered ? "green" as const : "gold" as const,
          },
          {
            title:       "Pay Tuition",
            description: "Pay your semester fees via USDC on Stellar.",
            href:        "/portal/student/fees",
            icon:        CreditCard,
            badge:       student?.feesPaid ? "Paid" : "Pending",
            variant:     student?.feesPaid ? "green" as const : "red" as const,
          },
        ].map((card) => (
          <Link key={card.href} href={card.href}
            className="card-glass rounded-xl p-6 flex items-start gap-4 hover:border-su-gold/30 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-su-gold/10 flex items-center justify-center shrink-0">
              <card.icon className="w-5 h-5 text-su-gold" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium group-hover:text-su-gold transition-colors">
                  {card.title}
                </h3>
                <Badge variant={card.variant}>{card.badge}</Badge>
              </div>
              <p className="text-su-text text-sm">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom row: activity + announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: "Account created on-chain",        time: "Jan 5, 2026",  color: "bg-su-green"  },
              { action: "DID registered on identity contract", time: "Jan 5, 2026",  color: "bg-su-green"  },
              { action: "Wallet connected",                time: "Just now",     color: "bg-blue-400"  },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                <span className="text-su-text flex-1">{item.action}</span>
                <span className="text-su-text/60 text-xs">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <Announcements />
      </div>
    </div>
  );
}
