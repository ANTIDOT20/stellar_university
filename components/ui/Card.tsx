import { cn } from "@/lib/utils";

interface CardProps {
  children:  React.ReactNode;
  className?: string;
  noPad?:    boolean;
}

export function Card({ children, className, noPad }: CardProps) {
  return (
    <div
      className={cn(
        "card-glass rounded-xl",
        !noPad && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title:       React.ReactNode;
  description?: React.ReactNode;
  action?:     React.ReactNode;
  className?:  string;
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-5", className)}>
      <div>
        {typeof title === "string" ? (
          <h3 className="text-white font-semibold">{title}</h3>
        ) : title}
        {description && (
          typeof description === "string"
            ? <p className="text-su-text text-sm mt-0.5">{description}</p>
            : description
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
