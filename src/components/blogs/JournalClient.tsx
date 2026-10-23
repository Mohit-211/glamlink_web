"use client";

import { Fragment, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApiImage from "@/components/common/ApiImage";
import ArticleTile from "@/components/content/ArticleTile";
import PageLinks from "@/components/content/PageLinks";
import EmptyState from "@/components/content/EmptyState";
import NewsletterPopup from "../NewsletterPopup/NewsletterPopup";
import JournalSearchBar from "./JournalSearchBar";
import { useDeviceType } from "@/ads/Usedevicetype";
import { useAds } from "@/ads/Useads";
import AdSlot from "@/ads/Adslot";
import { formatDate } from "@/lib/format";
import { flipbookEmbedUrl, issueNumber } from "@/lib/magazineFormat";
import { articleHref, issueHref } from "@/lib/routes";
import { listHref } from "@/lib/searchParams";
import type { ArticleCard, JournalCategory, MagazineIssue, Paged } from "@/lib/api/types";

/*
 * The Journal (/journal). The page reads one page of articles on the server
 * (category, search and page come from the URL); this view lays them out with
 * the category nav, the magazine sidebar, the flipbook drawer and the ad slots.
 * Choosing a category or a page is a link; typing a search updates the URL.
 */

const MOBILE_ISSUES_PER_PAGE = 4;
const SIDEBAR_ISSUES_PER_PAGE = 3;
const SEARCH_DEBOUNCE_MS = 400;

/* ── Pagination for the small magazine lists ─────────────────── */

const PaginationControls = ({
  page,
  totalPages,
  onPrev,
  onNext,
  compact = false,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  compact?: boolean;
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className={`flex items-center justify-between gap-2 ${compact ? "pt-2" : "pt-3"}`}>
      <button
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Previous issues"
        className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors duration-150 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {!compact && "Prev"}
      </button>
      <span className="text-[11px] text-muted-foreground">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        aria-label="Next issues"
        className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors duration-150 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
      >
        {!compact && "Next"}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

function usePagedIssues(issues: MagazineIssue[], perPage: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(issues.length / perPage));
  const visible = useMemo(() => issues.slice((page - 1) * perPage, page * perPage), [issues, page, perPage]);
  return {
    page,
    totalPages,
    visible,
    prev: () => setPage((p) => Math.max(1, p - 1)),
    next: () => setPage((p) => Math.min(totalPages, p + 1)),
  };
}

/* ── Magazine: mobile carousel, desktop sidebar, flipbook drawer ── */

const MobileMagazineCarousel = ({
  issues,
  onIssueClick,
}: {
  issues: MagazineIssue[];
  onIssueClick: (issue: MagazineIssue) => void;
}) => {
  const { page, totalPages, visible, prev, next } = usePagedIssues(issues, MOBILE_ISSUES_PER_PAGE);
  if (issues.length === 0) return null;
  return (
    <div className="mt-2 px-0.5 lg:hidden">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="eyebrow">Latest Issues</h2>
        <span className="text-[10px] text-muted-foreground">{issues.length} issues</span>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {visible.map((issue) => (
          <button
            key={issue.slug}
            type="button"
            onClick={() => onIssueClick(issue)}
            className="group min-w-25 shrink-0 text-left"
          >
            <span className="relative block h-33.5 w-full overflow-hidden rounded-lg border border-border/30 bg-muted/30 transition-colors group-hover:border-secondary/50">
              <ApiImage
                src={issue.cover_image}
                alt=""
                fill
                sizes="100px"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </span>
            <span className="mt-1.5 line-clamp-1 block text-center text-[11px] font-medium text-foreground transition-colors group-hover:text-secondary">
              Issue {issueNumber(issue)}
            </span>
          </button>
        ))}
      </div>
      <PaginationControls page={page} totalPages={totalPages} onPrev={prev} onNext={next} compact />
    </div>
  );
};

const FlipbookPanel = ({ issue, onClose }: { issue: MagazineIssue | null; onClose: () => void }) => {
  const isOpen = !!issue;
  const embed = issue ? flipbookEmbedUrl(issue) : null;
  return (
    <>
      <div
        className={`scrim fixed inset-0 z-30 transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={issue ? issue.title : "Magazine issue"}
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 z-40 flex w-full flex-col border-l border-border/40 bg-background shadow-2xl transition-transform duration-300 ease-out sm:w-120 lg:w-115 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border/30 bg-muted/20 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <button onClick={onClose} aria-label="Back" className="shrink-0 rounded-lg p-1.5 hover:bg-muted/60">
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            {issue && (
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-secondary">Issue {issueNumber(issue)}</span>
                <p className="truncate text-sm font-semibold text-foreground">{issue.title}</p>
              </div>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" className="shrink-0 rounded-lg p-1.5 hover:bg-muted/60">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="relative mt-6 flex-1 overflow-hidden bg-overlay/5">
          {embed && isOpen ? (
            <iframe src={embed} title={issue?.title} className="h-full w-full" allowFullScreen />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-12 w-12 opacity-20" />
            </div>
          )}
        </div>
        <div className="border-t border-border/30 px-4 py-3">
          {issue && (
            <Button asChild size="sm" className="w-full rounded-full text-xs">
              <Link href={`${issueHref(issue.slug)}/digital`}>
                <Download className="mr-2 h-3.5 w-3.5" />
                Open Full Digital Edition
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

const MagazineSidebar = ({
  issues,
  activeIssue,
  onIssueClick,
}: {
  issues: MagazineIssue[];
  activeIssue: MagazineIssue | null;
  onIssueClick: (issue: MagazineIssue) => void;
}) => {
  const { page, totalPages, visible, prev, next } = usePagedIssues(issues, SIDEBAR_ISSUES_PER_PAGE);
  if (issues.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-border/40 bg-background shadow-sm">
      <div className="border-b border-border/30 px-4 pb-4 pt-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">The Glamlink Edit</h2>
        <p className="mt-1 text-xs font-semibold text-primary">Interactive Edition</p>
        <p className="mt-2 text-[11px] text-muted-foreground">Explore | Discover | Watch | Shop</p>
      </div>
      <div className="space-y-2 p-3">
        {visible.map((issue) => {
          const isActive = activeIssue?.slug === issue.slug;
          return (
            <button
              key={issue.slug}
              type="button"
              onClick={() => onIssueClick(issue)}
              aria-pressed={isActive}
              className={`group flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-all duration-200 ${
                isActive ? "border-secondary/40 bg-accent" : "border-transparent hover:bg-secondary/5"
              }`}
            >
              <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-muted/30">
                <ApiImage src={issue.cover_image} alt="" fill sizes="48px" className="object-cover transition group-hover:scale-105" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold text-secondary">Issue {issueNumber(issue)}</span>
                <span className="line-clamp-2 block text-xs font-medium text-foreground transition-colors group-hover:text-secondary">
                  {issue.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="px-4 pb-3">
        <PaginationControls page={page} totalPages={totalPages} onPrev={prev} onNext={next} />
      </div>
      <div className="border-t border-border/30 bg-muted/5 px-4 py-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full rounded-full border-primary/40 text-xs hover:border-secondary hover:text-secondary"
        >
          <Link href="/magazine">View All Issues</Link>
        </Button>
      </div>
    </div>
  );
};

/* ── Categories ──────────────────────────────────────────────── */

function CategoryLinks({
  categories,
  current,
  search,
  vertical = false,
}: {
  categories: JournalCategory[];
  current: string;
  search: string;
  vertical?: boolean;
}) {
  const items = [{ slug: "", title: "All" }, ...categories];

  if (vertical) {
    return (
      <nav aria-label="Categories" className="rounded-xl border border-border/40 bg-background p-4 shadow-sm">
        <h2 className="eyebrow mb-4">Categories</h2>
        <ul className="flex flex-col gap-1">
          {items.map((category) => (
            <li key={category.slug || "all"}>
              <Link
                href={listHref("/journal", { category: category.slug, search })}
                aria-current={current === category.slug ? "page" : undefined}
                scroll={false}
                className="nav-link block w-full rounded-md px-3 py-2 text-left text-sm"
              >
                {category.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Categories" className="sticky top-15 z-40 border-b border-border bg-card lg:hidden">
      <ul className="scrollbar-hide mt-5 flex items-center gap-3 overflow-x-auto whitespace-nowrap px-4 py-3">
        {items.map((category) => (
          <li key={category.slug || "all"} className="shrink-0">
            <Link
              href={listHref("/journal", { category: category.slug, search })}
              aria-current={current === category.slug ? "page" : undefined}
              scroll={false}
              className="chip inline-flex rounded-full px-4 py-2 text-sm"
            >
              {category.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Featured article ────────────────────────────────────────── */

function JournalHero({ article }: { article: ArticleCard }) {
  const date = formatDate(article.publish_date ?? article.created_at);
  return (
    <section aria-label="Featured article" className="relative rounded-2xl bg-muted px-6 py-10 md:px-10 md:py-12">
      <Link href={articleHref(article)} className="group block space-y-6">
        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-16/10 overflow-hidden rounded-xl">
            <ApiImage
              src={article.cover_image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="space-y-4">
            {article.journal_category?.title && <p className="eyebrow mb-1">{article.journal_category.title}</p>}
            <h2 className="text-xl leading-snug tracking-tight transition-colors group-hover:text-secondary md:text-2xl">
              {article.title}
            </h2>
            {article.short_description && (
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{article.short_description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-border/40 pt-4 text-xs">
          {article.journal_author?.name && <span className="font-medium">{article.journal_author.name}</span>}
          {article.journal_author?.name && date && <span className="h-1 w-1 rounded-full bg-border" />}
          {date && <span className="text-muted-foreground">{date}</span>}
        </div>
      </Link>
    </section>
  );
}

/* ── Main view ───────────────────────────────────────────────── */

export interface JournalClientProps {
  hero: ArticleCard | null;
  articles: Paged<ArticleCard>;
  categories: JournalCategory[];
  issues: MagazineIssue[];
  category: string;
  search: string;
  page: number;
  perPage: number;
}

const JournalClient = ({ hero, articles, categories, issues, category, search, page, perPage }: JournalClientProps) => {
  const router = useRouter();
  const [selectedIssue, setSelectedIssue] = useState<MagazineIssue | null>(null);
  const device = useDeviceType();
  const ads = useAds({ page: "journal-listing", device });

  // Search as you type: the URL follows the box after a pause; the server answers.
  const [searchInput, setSearchInput] = useState(search);
  const [pending, startTransition] = useTransition();
  const lastPushed = useRef(search);

  useEffect(() => {
    // Back/forward or a link changed the search: show it in the box
    if (search !== lastPushed.current) {
      lastPushed.current = search;
      setSearchInput(search);
    }
  }, [search]);

  useEffect(() => {
    const value = searchInput.trim();
    if (value === lastPushed.current) return;
    const timer = setTimeout(() => {
      lastPushed.current = value;
      startTransition(() => {
        router.replace(listHref("/journal", { category, search: value }), { scroll: false });
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput, category, router]);

  const handleIssueClick = (issue: MagazineIssue) => {
    setSelectedIssue((prev) => (prev?.slug === issue.slug ? null : issue));
  };

  const pageCount = Math.max(1, Math.ceil(articles.count / perPage));
  const categoryTitle = categories.find((c) => c.slug === category)?.title;

  const main = (
    <main className="min-w-0 space-y-6">
      {hero && <JournalHero article={hero} />}

      {search && (
        <p role="status" aria-live="polite" className="text-[11px] text-muted-foreground">
          {articles.count} {articles.count === 1 ? "result" : "results"} for &ldquo;{search}&rdquo;
          {categoryTitle && ` in ${categoryTitle}`}
        </p>
      )}

      {articles.rows.length === 0 ? (
        <EmptyState
          title={search ? `No articles match “${search}”` : "No articles here yet"}
          action={
            <div className="flex items-center gap-4">
              {search && (
                <button type="button" onClick={() => setSearchInput("")} className="link-glamlink text-sm">
                  Clear search
                </button>
              )}
              {category && (
                <Link href={listHref("/journal", { search })} className="link-glamlink text-sm">
                  View all categories
                </Link>
              )}
            </div>
          }
        >
          {search
            ? "Try a different keyword. You can search by title, category or author."
            : "There are no articles in this category yet."}
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
          {articles.rows.map((article, index) => (
            <Fragment key={article.id}>
              <ArticleTile article={article} priority={!hero && index < 2} />

              {/* In-feed ad(s) after the 1st and the 2nd row */}
              {index === 1 && !!ads["journal-listing-in-feed"]?.length && (
                <div className="flex flex-wrap justify-center gap-4 md:col-span-2">
                  {ads["journal-listing-in-feed"].map((ad) => (
                    <AdSlot key={ad.id} slotId="journal-listing-in-feed" ad={ad} />
                  ))}
                </div>
              )}
              {index === 3 && !!ads["journal-listing-in-feed-2"]?.length && (
                <div className="flex flex-wrap justify-center gap-4 md:col-span-2">
                  {ads["journal-listing-in-feed-2"].map((ad) => (
                    <AdSlot key={ad.id} slotId="journal-listing-in-feed-2" ad={ad} />
                  ))}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}

      <PageLinks
        className="pt-6"
        page={page}
        pageCount={pageCount}
        hrefFor={(p) => listHref("/journal", { category, search, page: p })}
      />
    </main>
  );

  return (
    <>
      <NewsletterPopup openDelay={3000} />
      <div className="min-h-screen bg-background">
        <div className="mx-auto mt-30 max-w-[1700px] px-4 pb-8 sm:px-6 lg:pb-14 xl:px-14">
          <header className="mb-6 text-center lg:mb-8">
            <h1 className="text-3xl tracking-tight md:text-4xl">The Glamlink Journal</h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Beauty industry insights, trends, tips and expert articles.
            </p>
          </header>

          <div className="flex flex-wrap justify-center gap-4 py-4">
            {(ads["journal-top-banner"] ?? []).map((ad) => (
              <AdSlot key={ad.id} slotId="journal-top-banner" ad={ad} />
            ))}
          </div>

          <div className="mx-auto mb-6 w-full max-w-2xl lg:mb-8">
            <JournalSearchBar
              value={searchInput}
              onChange={setSearchInput}
              isSearching={pending || searchInput.trim() !== search}
            />
          </div>

          {/* Mobile */}
          <div className="space-y-4 lg:hidden">
            <CategoryLinks categories={categories} current={category} search={search} />
            <MobileMagazineCarousel issues={issues} onIssueClick={handleIssueClick} />
            {main}
          </div>

          {/* Desktop: categories, articles, magazine */}
          <div className="hidden grid-cols-[200px_1fr_300px] gap-10 lg:grid xl:grid-cols-[220px_1fr_300px] xl:gap-14 2xl:grid-cols-[240px_1fr_320px]">
            <aside>
              <div className="sticky top-28 space-y-6 pr-4">
                <CategoryLinks categories={categories} current={category} search={search} vertical />
                {(ads["journal-sidebar-left"] ?? []).map((ad) => (
                  <AdSlot key={ad.id} slotId="journal-sidebar-left" ad={ad} />
                ))}
              </div>
            </aside>

            {main}

            <aside>
              <div className="sticky top-28 space-y-10 pl-4">
                <MagazineSidebar issues={issues} activeIssue={selectedIssue} onIssueClick={handleIssueClick} />
                {(ads["journal-sidebar-right"] ?? []).map((ad) => (
                  <AdSlot key={ad.id} slotId="journal-sidebar-right" ad={ad} />
                ))}
              </div>
            </aside>
          </div>

          <div className="lg:hidden">
            {(ads["journal-mobile-bottom"] ?? []).map((ad) => (
              <AdSlot key={ad.id} slotId="journal-mobile-bottom" ad={ad} />
            ))}
          </div>

          <FlipbookPanel issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {(ads["journal-bottom"] ?? []).map((ad) => (
            <AdSlot key={ad.id} slotId="journal-bottom" ad={ad} />
          ))}
        </div>
      </div>
    </>
  );
};

export default JournalClient;
