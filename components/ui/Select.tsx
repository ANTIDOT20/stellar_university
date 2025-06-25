import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:    string;
  error?:    string;
  options:   { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs uppercase tracking-wider text-su-text">{label}</label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={twMerge(
            clsx(
              "w-full appearance-none bg-su-navy/60 border rounded-xl text-white text-sm",
              "px-4 py-2.5 pr-9 focus:outline-none transition-colors",
              error
                ? "border-red-500/50 focus:border-red-500"
                : "border-su-border focus:border-su-gold/50",
              className
            )
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-su-text pointer-events-none" />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";
export { Select };
