import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  id: string;
  title: string;
  /** A line under the title. */
  subtitle?: ReactNode;
  /** "See all"-style link on the right. */
  action?: { label: string; href: string };
  /** Heading level; sections under a page's h1 are h2. */
  as?: "h2" | "h3";
}

/** A section's title row: heading (with its id for aria-labelledby) and an optional link. */
export default function SectionHeading({ id, title, subtitle, action, as: Heading = "h2" }: SectionHeadingProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 md:mb-8">
      <div className="min-w-0">
        <Heading id={id} className={Heading === "h2" ? "section-title" : "text-xl md:text-2xl"}>
          {title}
        </Heading>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className="link-glamlink inline-flex shrink-0 items-center gap-1 text-sm">
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
