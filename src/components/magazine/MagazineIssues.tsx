import Link from "next/link";
import { BookOpen } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import { issues2025, issues2026 } from "@/data/issues";
import type { MagazineIssue } from "@/lib/api/types";
import { flipbookEmbedUrl, issueNumber } from "@/lib/magazineFormat";
import { issueHref } from "@/lib/routes";

/** The year the site first listed an issue under, for issues with no date yet. */
const BUNDLED_YEAR = new Map<string, number>([
  ...issues2026.map((issue) => [issue.slug, 2026] as const),
  ...issues2025.map((issue) => [issue.slug, 2025] as const),
]);

function yearOf(issue: MagazineIssue): number | null {
  if (issue.publish_date) {
    const year = new Date(issue.publish_date).getUTCFullYear();
    if (Number.isFinite(year)) return year;
  }
  return BUNDLED_YEAR.get(issue.slug) ?? null;
}

function IssueCard({ issue }: { issue: MagazineIssue }) {
  const number = issueNumber(issue);
  const hasFlipbook = Boolean(flipbookEmbedUrl(issue));

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/30 bg-card shadow-md transition-all duration-300 hover:border-secondary/30 hover:shadow-xl hover:shadow-primary/20">
      <Link href={issueHref(issue.slug)} className="relative block aspect-3/4 overflow-hidden">
        <ApiImage
          src={issue.cover_image}
          alt={`Cover of ${issue.title}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-overlay/55 via-overlay/15 to-transparent" />
        <span className="absolute bottom-5 left-5 inline-flex rounded-full border border-primary/40 bg-primary/85 px-2.5 py-1 text-sm font-semibold text-primary-foreground shadow-sm backdrop-blur-sm">
          {number ? `Issue ${number}` : issue.title}
        </span>
      </Link>
      {hasFlipbook && (
        <div className="p-4">
          <Link href={`${issueHref(issue.slug)}/digital`} className="btn-primary w-full">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Digital Edition
          </Link>
        </div>
      )}
    </article>
  );
}

/** Every issue, newest first, grouped by year (issues with no year last). */
export default function MagazineIssues({ issues }: { issues: MagazineIssue[] }) {
  const groups = new Map<string, MagazineIssue[]>();
  [...issues]
    .sort((a, b) => (yearOf(b) ?? 0) - (yearOf(a) ?? 0) || issueNumber(b) - issueNumber(a))
    .forEach((issue) => {
      const key = String(yearOf(issue) ?? "More issues");
      groups.set(key, [...(groups.get(key) ?? []), issue]);
    });

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container-glamlink">
        {issues.length === 0 && (
          <p className="text-center text-muted-foreground">New issues are on their way. Please check back soon.</p>
        )}
        {[...groups.entries()].map(([label, list]) => (
          <section key={label} aria-labelledby={`issues-${label}`} className="mb-16 lg:mb-20">
            <div className="mb-8 flex items-baseline justify-between gap-4 lg:mb-10">
              <h2 id={`issues-${label}`} className="section-title">
                {label}
              </h2>
              <span className="text-sm font-medium tabular-nums text-muted-foreground sm:text-base">
                {list.length} {list.length === 1 ? "issue" : "issues"}
              </span>
            </div>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {list.map((issue) => (
                <li key={issue.slug}>
                  <IssueCard issue={issue} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
