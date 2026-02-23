"use client";

import { Search, X } from "lucide-react";

interface SearchInputProps {
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
  className?:  string;
}

export function SearchInput({ value, onChange, placeholder = "Search…", className }: SearchInputProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-su-text pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-su-navy/60 border border-su-border rounded-xl pl-10 pr-10 py-2.5 text-white text-sm placeholder:text-su-text/40 focus:outline-none focus:border-su-gold/50 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-su-text hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
