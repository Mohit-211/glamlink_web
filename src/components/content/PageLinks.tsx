import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLinksProps {
  page: number;
  pageCount: number;
  /** The link for a page number, keeping the list's other parameters. */
  hrefFor: (page: number) => string;
  className?: string;
}

/** First, last, the current page and its neighbours; gaps become an ellipsis. */
function visiblePages(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

const ITEM = "chip inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm";

/** Numbered page links for server-rendered lists: plain links, so each page has a URL. */
export default function PageLinks({ page, pageCount, hrefFor, className }: PageLinksProps) {
  if (pageCount <= 1) return null;
  const hasPrev = page > 1;
  const hasNext = page < pageCount;

  return (
    <nav aria-label="Pages" className={cn("flex justify-center", className)}>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {hasPrev ? (
            <Link href={hrefFor(page - 1)} className={cn(ITEM, "gap-1")} rel="prev">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sr-only sm:hidden">Previous page</span>
            </Link>
          ) : (
            <span className={cn(ITEM, "gap-1 opacity-40")} aria-hidden="true">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </span>
          )}
        </li>
        {visiblePages(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefFor(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                className={ITEM}
              >
                {p}
              </Link>
            </li>
          )
        )}
        <li>
          {hasNext ? (
            <Link href={hrefFor(page + 1)} className={cn(ITEM, "gap-1")} rel="next">
              <span className="hidden sm:inline">Next</span>
              <span className="sr-only sm:hidden">Next page</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className={cn(ITEM, "gap-1 opacity-40")} aria-hidden="true">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
