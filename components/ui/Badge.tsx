import { clsx } from "clsx";

type Variant = "gold" | "green" | "blue" | "red" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variants: Record<Variant, string> = {
  gold:    "bg-su-gold/10 text-su-gold border border-su-gold/20",
  green:   "bg-su-green/10 text-su-green border border-su-green/20",
  blue:    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  red:     "bg-red-500/10 text-red-400 border border-red-500/20",
  default: "bg-su-slate text-su-text border border-su-border",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
