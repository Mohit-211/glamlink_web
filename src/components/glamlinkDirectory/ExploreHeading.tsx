import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ExploreHeadingProps {
  id: string;
  title: string;
  subtitle: string;
  /** The section's "Explore all" button: the full list, with its filters. */
  href: string;
  label: string;
}

/** The title row of a directory section (Explore Professionals, Explore Brands), with its "Explore all" button. */
export default function ExploreHeading({ id, title, subtitle, href, label }: ExploreHeadingProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">Explore</p>
        <h2 id={id} className="section-title mt-3">
          {title}
        </h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <Link href={href} className="btn-outline shrink-0 self-start md:self-auto">
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
