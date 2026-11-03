import { AlertCircle, MapPin, Pencil, RotateCcw, Store, X } from "lucide-react";
import type { DirectoryBusiness } from "@/lib/directory";
import type { DirectoryResultsStatus } from "@/hooks/useDirectorySearch";
import DirectoryBusinessCard from "./DirectoryBusinessCard";
import DirectoryEmptyState from "./DirectoryEmptyState";
import GoogleAttribution from "./GoogleAttribution";

interface DirectoryResultsProps {
  status: DirectoryResultsStatus;
  /** "popular": the listings around the default place, before a search. */
  mode: "popular" | "search";
  businesses: DirectoryBusiness[];
  /** "Popular in Las Vegas, NV", or "Estheticians near Miami, FL" */
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

/**
 * Google's listings, the second part of the directory's Explore Professionals: around the default place before a
 * search (fetched with the page), then around the visitor's. Their owners can claim them.
 */
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
  // Without the default listings (Google not set up, or no answer), invite a search
  const isIdle = !isSearch && businesses.length === 0;

  const countLabel = isLoading
    ? "Searching…"
    : status === "success" && businesses.length
      ? `${businesses.length} result${businesses.length === 1 ? "" : "s"}`
      : "";

  return (
    <div
      id="directory-results"
      role="group"
      aria-labelledby="directory-results-heading"
      className="scroll-mt-24"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 max-w-2xl">
          <span className="badge-soft text-xs">
            <Store className="h-3.5 w-3.5" aria-hidden="true" />
            From Google
          </span>
          <h3 id="directory-results-heading" className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            {isIdle ? "Businesses near you" : criteriaLabel}
          </h3>
          <p className="mt-2 text-muted-foreground" aria-live="polite">
            Beauty and wellness businesses listed on Google
            {countLabel && <span className="text-foreground/80"> · {countLabel}</span>}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onModifySearch}
            className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-secondary/50 hover:text-secondary"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            {isSearch ? "Modify" : "Search near you"}
          </button>
          {isSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
          <GoogleAttribution className="md:ml-2" />
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
            <AlertCircle className="w-8 h-8 text-destructive" aria-hidden="true" />
            <h4 className="mt-4 text-xl font-semibold">Something went wrong</h4>
            <p className="mt-2 text-muted-foreground">We couldn&apos;t load results right now.</p>
            <button type="button" onClick={onRetry} className="btn-outline mt-6">
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {isIdle && (
          <div className="flex flex-col items-center rounded-3xl border border-dashed bg-background px-6 py-14 text-center sm:py-20">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-primary shadow-medium">
              <MapPin className="h-7 w-7" aria-hidden="true" />
            </span>
            <h4 className="mt-6 text-2xl font-semibold sm:text-3xl">Find businesses near you</h4>
            <p className="mt-3 max-w-md text-muted-foreground">
              Search a city, state or ZIP, or use your location, to see beauty and wellness businesses nearby.
            </p>
            <button type="button" onClick={onModifySearch} className="btn-primary mt-8">
              Search near you
            </button>
          </div>
        )}

        {isSearch && status === "success" && businesses.length === 0 && (
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
  );
}
