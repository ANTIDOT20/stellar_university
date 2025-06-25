import { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string;
  hint?:     string;
  leading?:  React.ReactNode;
  trailing?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leading, trailing, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs uppercase tracking-wider text-su-text">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leading && (
          <div className="absolute left-3 text-su-text pointer-events-none">{leading}</div>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              "w-full bg-su-navy/60 border rounded-xl text-white text-sm",
              "placeholder:text-su-text/40 focus:outline-none transition-colors",
              error
                ? "border-red-500/50 focus:border-red-500"
                : "border-su-border focus:border-su-gold/50",
              leading  && "pl-9",
              trailing && "pr-9",
              !leading  && "pl-4",
              !trailing && "pr-4",
              "py-2.5",
              className
            )
          )}
          {...props}
        />
        {trailing && (
          <div className="absolute right-3 text-su-text pointer-events-none">{trailing}</div>
        )}
      </div>
      {error  && <p className="text-red-400 text-xs">{error}</p>}
      {hint && !error && <p className="text-su-text text-xs">{hint}</p>}
    </div>
  )
);

Input.displayName = "Input";
export { Input };
