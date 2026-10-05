import { AlertCircle, Pencil, RotateCcw, X } from "lucide-react";
import type { DirectoryBusiness } from "@/lib/directory";
import type { DirectoryResultsStatus } from "@/hooks/useDirectorySearch";
import DirectoryBusinessCard from "./DirectoryBusinessCard";
import DirectoryEmptyState from "./DirectoryEmptyState";
import GoogleAttribution from "./GoogleAttribution";

interface DirectoryResultsProps {
  status: DirectoryResultsStatus;
  mode: "popular" | "search";
  businesses: DirectoryBusiness[];
  /** e.g. "Estheticians near Miami, FL" */
  criteriaLabel: string;
  onModifySearch: () => void;
  onClearSearch: () => void;
  onRetry: () => void;
  onClaim: (business: DirectoryBusiness) => void;
}

const GRID = "grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6";

function BusinessCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-soft" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
        <div className="h-9 w-full animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

export default function DirectoryResults({
  status,
  mode,
  businesses,
  criteriaLabel,
  onModifySearch,
  onClearSearch,
  onRetry,
  onClaim,
}: DirectoryResultsProps) {
  const isSearch = mode === "search";
  const isLoading = status === "loading";

  const countLabel = isLoading
    ? "Searching…"
    : status === "success" && businesses.length
      ? `${businesses.length} result${businesses.length === 1 ? "" : "s"}`
      : "";

  return (
    <section
      id="directory-results"
      aria-labelledby="directory-results-heading"
      className="scroll-mt-24 py-16 md:py-24"
    >
      <div className="container-glamlink">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <h2 id="directory-results-heading" className="section-title font-display">
              Directory Results
            </h2>
            <p className="section-subtitle">Discover beauty and wellness professionals near you.</p>
          </div>
          <GoogleAttribution className="self-start md:self-auto" />
        </div>

        {/* SEARCH CRITERIA */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border bg-muted/40 px-4 py-3 sm:px-5">
          <div className="min-w-0" aria-live="polite">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {isSearch ? "Showing" : "Popular across the U.S."}
            </p>
            <p className="font-semibold text-foreground truncate">
              {criteriaLabel}
              {countLabel && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">· {countLabel}</span>
              )}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onModifySearch}
              className="inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              {isSearch ? "Modify" : "Search near you"}
            </button>
            {isSearch && (
              <button
                type="button"
                onClick={onClearSearch}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="mt-8" aria-busy={isLoading}>
          {isLoading && (
            <div className={GRID}>
              {Array.from({ length: 8 }, (_, i) => (
                <BusinessCardSkeleton key={i} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center rounded-3xl border bg-card px-6 py-14 text-center">
              <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold">Something went wrong</h3>
              <p className="mt-2 text-muted-foreground">We couldn&apos;t load results right now.</p>
              <button type="button" onClick={onRetry} className="btn-outline mt-6">
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Try again
              </button>
            </div>
          )}

          {status === "success" && businesses.length === 0 && (
            <DirectoryEmptyState onModifySearch={onModifySearch} />
          )}

          {status === "success" && businesses.length > 0 && (
            <ul className={GRID}>
              {businesses.map((business) => (
                <li key={business.id} className="flex">
                  <DirectoryBusinessCard business={business} onClaim={onClaim} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-10 text-xs text-muted-foreground leading-relaxed max-w-3xl">
          Business listings, ratings and review counts are provided by Google. Glamlink is not
          affiliated with listed businesses unless the profile has been claimed.
        </p>
      </div>
    </section>
  );
}
