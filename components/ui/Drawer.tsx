"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open:     boolean;
  onClose:  () => void;
  children: React.ReactNode;
  side?:    "left" | "right";
}

export function Drawer({ open, onClose, children, side = "left" }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-0 ${side === "left" ? "left-0" : "right-0"} z-50 h-full w-72
          bg-su-dark border-r border-su-border
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-su-text hover:text-white transition-colors p-1"
          aria-label="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </>
  );
}
