"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Award,
  FileText,
  GraduationCap,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { WalletProvider, useWallet } from "@/components/wallet/WalletContext";
import { truncateAddress } from "@/lib/wallet";
import { cn } from "@/lib/utils";

const STUDENT_LINKS = [
  { href: "/portal/student",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/portal/student/registration", label: "Registration", icon: BookOpen        },
  { href: "/portal/student/fees",         label: "Fees",         icon: CreditCard      },
  { href: "/portal/student/results",      label: "Results",      icon: FileText        },
  { href: "/portal/student/certificate",  label: "Certificate",  icon: Award           },
];

function Sidebar() {
  const pathname    = usePathname();
  const { wallet, disconnect } = useWallet();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full z-40 flex flex-col border-r border-su-border bg-su-navy-2/90 backdrop-blur-md transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-su-border/40 shrink-0">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-su-gold flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-su-navy" />
            </div>
            <span className="font-display font-bold text-white text-sm">StellarU</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-su-text hover:text-white p-1 rounded-lg hover:bg-su-slate/50 transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {STUDENT_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                active
                  ? "bg-su-gold/10 text-su-gold border border-su-gold/20"
                  : "text-su-text hover:text-white hover:bg-su-slate/50"
              )}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-su-border/40 shrink-0">
        {wallet.connected && (
          <div className={cn("mb-2", collapsed && "hidden")}>
            <p className="text-xs text-su-text px-3 mb-1">Wallet</p>
            <p className="text-xs text-white font-mono px-3">
              {truncateAddress(wallet.publicKey ?? "")}
            </p>
          </div>
        )}
        <button
          onClick={disconnect}
          title={collapsed ? "Sign out" : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-su-navy">
        <Sidebar />
        <main className="ml-60 min-h-screen transition-all duration-300">
          {children}
        </main>
      </div>
    </WalletProvider>
  );
}
