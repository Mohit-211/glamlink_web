"use client";

import { Fragment, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApiImage from "@/components/common/ApiImage";
import PageHero from "@/components/common/PageHero";
import PageLinks from "@/components/content/PageLinks";
import EmptyState from "@/components/content/EmptyState";
import NewsletterPopup from "../NewsletterPopup/NewsletterPopup";
import JournalSearchBar from "./JournalSearchBar";
import StoryCard, { Byline, Kicker } from "./StoryCard";
import { useDeviceType } from "@/ads/Usedevicetype";
import { useAds } from "@/ads/Useads";
import AdSlot from "@/ads/Adslot";
import { formatDate } from "@/lib/format";
import { flipbookEmbedUrl, issueNumber } from "@/lib/magazineFormat";
import { articleHref, issueHref, journalCategoryHref } from "@/lib/routes";
import { listHref } from "@/lib/searchParams";
import { cn } from "@/lib/utils";
import type { ArticleCard, JournalCategory, MagazineIssue, Paged } from "@/lib/api/types";

/*
 * The Journal (/journal), laid out like a magazine's front page. The page reads
 * one page of articles on the server (section, search and page come from the
 * URL). On the front page (no section, no search, page 1) the hero carries the
 * cover story, then come Top Stories, The Latest beside the magazine, and an In
 * Focus shelf for the biggest sections; a section, a search or a later page is a grid.
 * Choosing a section or a page is a link; typing a search updates the URL.
 */

const PAST_ISSUES_PER_PAGE = 3;
const SEARCH_DEBOUNCE_MS = 400;
/** Stories in the Top Stories row; the rest of the front page's stories are The Latest. */
const TOP_STORIES = 3;

/** A section of the front page: one of the biggest sections, with stories not already shown. */
export interface JournalSpotlight {
  category: JournalCategory;
  articles: ArticleCard[];
}

type Ads = ReturnType<typeof useAds>;

/** The ads of one slot, side by side; nothing when the slot has none. */
function AdRow({ ads, slot, className }: { ads: Ads; slot: string; className?: string }) {
  const list = ads[slot] ?? [];
  if (list.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap justify-center gap-4", className)}>
      {list.map((ad) => (
        <AdSlot key={ad.id} slotId={slot} ad={ad} />
      ))}
    </div>
  );
}

/** A small label over a section, with a hairline to its right: "TOP STORIES ———". */
function SectionLabel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 id={id} className="shrink-0 text-xs font-semibold uppercase tracking-widest text-foreground">
        {children}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ── Pagination for the small magazine list ──────────────────── */

const PaginationControls = ({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 pt-3">
      <button
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Previous issues"
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Prev
      </button>
      <span className="text-xs text-muted-foreground">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        aria-label="Next issues"
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next
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

/* ── The magazine: the sidebar module and the flipbook drawer ─── */

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
        // Hidden once it has slid away, so its shadow doesn't show at the page's edge and its buttons leave the tab order
        className={`fixed inset-y-0 right-0 z-40 flex w-full flex-col border-l border-border/40 bg-background shadow-large transition-[translate,visibility] duration-300 ease-out sm:w-120 lg:w-115 ${
          isOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border/30 bg-muted/20 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <button onClick={onClose} aria-label="Back" className="shrink-0 rounded-lg p-1.5 hover:bg-muted/60">
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            {issue && (
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-secondary">Issue {issueNumber(issue)}</span>
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

/** An issue's own title, or "Issue 117" when it has none beyond its number. */
const issueTitle = (issue: MagazineIssue) => issue.title.trim() || `Issue ${issueNumber(issue)}`;

/** Under the title: the number (when the title doesn't say it) and the date. */
const issueMeta = (issue: MagazineIssue) => {
  const label = `Issue ${issueNumber(issue)}`;
  const saysNumber = issue.title.trim().toLowerCase() === label.toLowerCase();
  return [saysNumber ? null : label, formatDate(issue.publish_date)].filter(Boolean).join(" · ");
};

/** In the Magazine: the latest issue large, then the past ones; each opens in the flipbook drawer. */
function TheEdit({
  issues,
  activeIssue,
  onIssueClick,
}: {
  issues: MagazineIssue[];
  activeIssue: MagazineIssue | null;
  onIssueClick: (issue: MagazineIssue) => void;
}) {
  const [latest, ...past] = issues;
  const { page, totalPages, visible, prev, next } = usePagedIssues(past, PAST_ISSUES_PER_PAGE);
  if (!latest) return null;

  return (
    <section aria-labelledby="the-edit-heading" className="rounded-3xl bg-muted/60 p-6">
      <p className="eyebrow">The Glamlink Edit</p>
      <h2 id="the-edit-heading" className="mt-1 text-xl font-semibold tracking-tight">
        In the Magazine
      </h2>

      <button
        type="button"
        onClick={() => onIssueClick(latest)}
        aria-pressed={activeIssue?.slug === latest.slug}
        className="group mt-5 grid w-full grid-cols-[7rem_minmax(0,1fr)] items-center gap-5 text-left lg:block"
      >
        <span className="relative block aspect-3/4 overflow-hidden rounded-xl bg-muted shadow-medium">
          <ApiImage
            src={latest.cover_image}
            alt=""
            fill
            sizes="(min-width: 1024px) 272px, 112px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </span>
        <span className="block lg:mt-4">
          <span className="block eyebrow text-secondary">Latest Issue</span>
          <span className="mt-1 block font-semibold leading-snug transition-colors group-hover:text-secondary">
            {issueTitle(latest)}
          </span>
          {issueMeta(latest) && <span className="mt-0.5 block text-xs text-muted-foreground">{issueMeta(latest)}</span>}
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Read this issue
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </span>
      </button>

      {past.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="eyebrow text-muted-foreground">Past Issues</h3>
          <ul className="mt-3 space-y-1">
            {visible.map((issue) => (
              <li key={issue.slug}>
                <button
                  type="button"
                  onClick={() => onIssueClick(issue)}
                  aria-pressed={activeIssue?.slug === issue.slug}
                  className="group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-card aria-pressed:bg-card"
                >
                  <span className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                    <ApiImage src={issue.cover_image} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-sm font-medium text-foreground transition-colors group-hover:text-secondary">
                      {issueTitle(issue)}
                    </span>
                    {issueMeta(issue) && (
                      <span className="block text-xs text-muted-foreground">{issueMeta(issue)}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <PaginationControls page={page} totalPages={totalPages} onPrev={prev} onNext={next} />
        </div>
      )}

      <Link href="/magazine" className="btn-outline mt-5 w-full">
        View All Issues
      </Link>
    </section>
  );
}

/* ── The section bar ─────────────────────────────────────────── */

/** The sections, under the hero and pinned below the site header while reading. */
function SectionNav({ categories, current, search }: { categories: JournalCategory[]; current: string; search: string }) {
  const items = [{ slug: "", title: "All Stories" }, ...categories];
  const listRef = useRef<HTMLUListElement>(null);

  // The current section in view, however far along the row it is
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active) return;
    list.scrollLeft = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
  }, [current]);

  return (
    <nav
      aria-label="Journal sections"
      className="sticky top-16 z-30 border-y border-border bg-background/95 backdrop-blur md:top-20"
    >
      {/* The right edge fades, so a row longer than the screen reads as one that scrolls */}
      <ul
        ref={listRef}
        className="no-scrollbar container-glamlink relative flex justify-center-safe gap-x-7 overflow-x-auto mask-r-from-85% pr-20 sm:pr-24 lg:pr-28"
      >
        {items.map((item) => (
          <li key={item.slug || "all"} className="shrink-0">
            <Link
              href={listHref("/journal", { category: item.slug, search })}
              aria-current={current === item.slug ? "page" : undefined}
              className="block border-b-2 border-transparent py-3.5 eyebrow text-muted-foreground transition-colors hover:text-secondary aria-[current=page]:border-secondary aria-[current=page]:text-secondary"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── The front page ──────────────────────────────────────────── */

/** The featured story (else the newest), in the hero beside the title: the photo over the headline and byline. */
function CoverStory({ article }: { article: ArticleCard }) {
  const href = articleHref(article);
  return (
    <article
      aria-labelledby="cover-story-heading"
      className="group w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-large"
    >
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-video overflow-hidden bg-muted">
        <ApiImage
          src={article.cover_image}
          alt=""
          fill
          preload
          sizes="(min-width: 1280px) 576px, (min-width: 1024px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="p-6 md:p-8">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="eyebrow text-foreground">The Cover Story</span>
          {article.journal_category?.title && (
            <>
              <span aria-hidden="true" className="h-px w-8 bg-border" />
              <Kicker article={article} />
            </>
          )}
        </p>
        <h2
          id="cover-story-heading"
          className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-balance md:text-[1.75rem]"
        >
          <Link href={href} className="transition-colors hover:text-secondary">
            {article.title.trim()}
          </Link>
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <Byline article={article} />
          <Link href={href} className="eyebrow inline-flex items-center gap-1.5 transition-colors hover:text-secondary">
            Read the Story
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** In Focus: one of the biggest sections, its lead story large and three more beside it. */
function Spotlight({ category, articles }: JournalSpotlight) {
  const [lead, ...more] = articles;
  const id = `in-focus-${category.slug}`;
  return (
    <section aria-labelledby={id} className="container-glamlink mt-20 md:mt-24">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t-2 border-foreground pt-6">
        <div>
          <p className="eyebrow">In Focus</p>
          <h2 id={id} className="section-title mt-2">
            {category.title}
          </h2>
        </div>
        <Link
          href={journalCategoryHref(category.slug)}
          className="eyebrow inline-flex items-center gap-1.5 transition-colors hover:text-secondary"
        >
          More {category.title}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
        <StoryCard article={lead} layout="lead" showKicker={false} />
        <div className="divide-y divide-border">
          {more.map((article) => (
            <div key={article.id} className="py-6 first:pt-0 last:pb-0">
              <StoryCard article={article} layout="compact" showKicker={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Main view ───────────────────────────────────────────────── */

export interface JournalClientProps {
  hero: ArticleCard | null;
  articles: Paged<ArticleCard>;
  categories: JournalCategory[];
  issues: MagazineIssue[];
  /** The front page's In Focus shelves; empty elsewhere. */
  spotlights: JournalSpotlight[];
  category: string;
  search: string;
  page: number;
  perPage: number;
}

const JournalClient = ({
  hero,
  articles,
  categories,
  issues,
  spotlights,
  category,
  search,
  page,
  perPage,
}: JournalClientProps) => {
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

  const front = !category && !search && page === 1;
  const pageCount = Math.max(1, Math.ceil(articles.count / perPage));
  const categoryTitle = categories.find((c) => c.slug === category)?.title;

  const pageLinks = (
    <PageLinks
      className="mt-14"
      page={page}
      pageCount={pageCount}
      hrefFor={(p) => listHref("/journal", { category, search, page: p })}
    />
  );

  /** The stories beside the magazine (and, from lg, the sidebar ads). */
  const withSidebar = (content: ReactNode, className?: string) => (
    <div
      className={cn(
        "container-glamlink grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-16",
        className
      )}
    >
      <div className="min-w-0">{content}</div>
      <aside aria-label="The magazine" className="space-y-10">
        <TheEdit issues={issues} activeIssue={selectedIssue} onIssueClick={handleIssueClick} />
        <div className="hidden space-y-6 lg:sticky lg:top-36 lg:block">
          <AdRow ads={ads} slot="journal-sidebar-right" />
          <AdRow ads={ads} slot="journal-sidebar-left" />
        </div>
      </aside>
    </div>
  );

  const topStories = front ? articles.rows.slice(0, TOP_STORIES) : [];
  const latest = front ? articles.rows.slice(TOP_STORIES) : [];

  return (
    <>
      <NewsletterPopup openDelay={3000} />

      <PageHero
        id="journal"
        eyebrow="Beauty + Wellness, In Depth"
        title={
          <>
            The Glamlink Journal
          </>
        }
        subtitle="Expert insights. Real stories. The latest in beauty + wellness."
        media={front && hero ? <CoverStory article={hero} /> : undefined}
      >
        <div className="max-w-xl">
          <JournalSearchBar
            value={searchInput}
            onChange={setSearchInput}
            isSearching={pending || searchInput.trim() !== search}
          />
        </div>
      </PageHero>

      <SectionNav categories={categories} current={category} search={search} />

      <AdRow ads={ads} slot="journal-top-banner" className="container-glamlink pt-8" />

      {front ? (
        <>
          {topStories.length > 0 && (
            <section aria-labelledby="top-stories-heading" className="container-glamlink mt-12 md:mt-16">
              <SectionLabel id="top-stories-heading">Top Stories</SectionLabel>
              <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {topStories.map((article, index) => (
                  <li key={article.id} className={cn(index === 2 && "sm:col-span-2 lg:col-span-1")}>
                    <StoryCard article={article} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {withSidebar(
            latest.length > 0 && (
              <section aria-labelledby="latest-heading">
                <SectionLabel id="latest-heading">The Latest</SectionLabel>
                <div className="mt-8 divide-y divide-border">
                  {latest.map((article, index) => (
                    <Fragment key={article.id}>
                      <div className="py-8 first:pt-0">
                        <StoryCard article={article} layout="row" />
                      </div>
                      {/* In-feed ads after the 2nd and the 4th story */}
                      {index === 1 && <AdRow ads={ads} slot="journal-listing-in-feed" className="py-8" />}
                      {index === 3 && <AdRow ads={ads} slot="journal-listing-in-feed-2" className="py-8" />}
                    </Fragment>
                  ))}
                </div>
                {pageLinks}
              </section>
            ),
            "mt-16 md:mt-24"
          )}

          {spotlights.map((spotlight) => (
            <Spotlight key={spotlight.category.slug} {...spotlight} />
          ))}
        </>
      ) : (
        <>
          <div className="container-glamlink pt-12 md:pt-16">
            <p className="eyebrow">{search ? "Search" : category ? "Section" : "All Stories"}</p>
            <h2 className="section-title mt-2 text-balance">
              {search ? <>Results for &ldquo;{search}&rdquo;</> : (categoryTitle ?? "The Latest")}
            </h2>
            <p role="status" aria-live="polite" className="mt-2 text-sm text-muted-foreground">
              {articles.count} {articles.count === 1 ? "story" : "stories"}
              {search && categoryTitle && ` in ${categoryTitle}`}
              {pageCount > 1 && ` · Page ${page} of ${pageCount}`}
            </p>
          </div>

          {withSidebar(
            articles.rows.length === 0 ? (
              <EmptyState
                title={search ? `No stories match “${search}”` : "No stories here yet"}
                action={
                  <div className="flex items-center gap-4">
                    {search && (
                      <button type="button" onClick={() => setSearchInput("")} className="link-glamlink text-sm">
                        Clear search
                      </button>
                    )}
                    {category && (
                      <Link href={listHref("/journal", { search })} className="link-glamlink text-sm">
                        View all sections
                      </Link>
                    )}
                  </div>
                }
              >
                {search
                  ? "Try a different keyword. You can search by title, section or author."
                  : "There are no stories in this section yet."}
              </EmptyState>
            ) : (
              <>
                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                  {articles.rows.map((article, index) => (
                    <Fragment key={article.id}>
                      <StoryCard article={article} showKicker={!category} preload={index < 2} />
                      {/* After six stories: whole rows in both the two- and the three-column grid */}
                      {index === 5 && (
                        <AdRow ads={ads} slot="journal-listing-in-feed" className="sm:col-span-2 xl:col-span-3" />
                      )}
                    </Fragment>
                  ))}
                </div>
                <AdRow ads={ads} slot="journal-listing-in-feed-2" className="mt-12" />
                {pageLinks}
              </>
            ),
            "mt-10"
          )}
        </>
      )}

      <AdRow ads={ads} slot="journal-mobile-bottom" className="container-glamlink mt-16 lg:hidden" />
      <AdRow ads={ads} slot="journal-bottom" className="container-glamlink mt-16" />
      <div className="pb-20 md:pb-28" />

      <FlipbookPanel issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
    </>
  );
};

export default JournalClient;
