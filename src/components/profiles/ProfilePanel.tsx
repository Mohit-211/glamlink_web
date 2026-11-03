import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PanelAction = { label: string; href: string };

/** A block's title row on a profile page: a small-caps heading and, on the right, "View all". */
export function BlockHeading({
  id,
  title,
  action,
  className,
}: {
  id: string;
  title: string;
  action?: PanelAction | null;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-4", className)}>
      <h2 id={id} className="text-sm font-bold uppercase tracking-widest text-foreground">
        {title}
      </h2>
      {action && (
        <Link href={action.href} className="link-glamlink inline-flex shrink-0 items-center gap-1 text-sm">
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/**
 * One section of a profile's main column: a white panel from sm up; on phones
 * the sections run on the page itself, to keep the width for their content.
 */
export default function ProfilePanel({
  id,
  title,
  action,
  className,
  children,
}: {
  id: string;
  title: string;
  action?: PanelAction | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-28 sm:rounded-3xl sm:border sm:border-border sm:bg-card sm:p-6 sm:shadow-soft", className)}
    >
      <BlockHeading id={`${id}-heading`} title={title} action={action} />
      {children}
    </section>
  );
}

/** "View all" when a list has more than it shows. */
export const viewAll = (count: number, shown: number, href: string): PanelAction | null =>
  count > shown ? { label: "View all", href } : null;
