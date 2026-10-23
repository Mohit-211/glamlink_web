import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  children?: ReactNode;
  icon?: LucideIcon;
  /** A link or button to recover, e.g. "Clear filters". */
  action?: ReactNode;
  className?: string;
}

/** What a list shows when it has nothing: a short reason and a way on. */
export default function EmptyState({ title, children, icon: Icon = SearchX, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-14 text-center",
        className
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-secondary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="text-lg">{title}</h2>
      {children && <div className="max-w-md text-sm text-muted-foreground">{children}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
