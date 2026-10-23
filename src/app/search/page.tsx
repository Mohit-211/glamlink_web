import type { Metadata } from "next";
import type { ReactNode } from "react";
import Form from "next/form";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import ArticleTile from "@/components/content/ArticleTile";
import EmptyState from "@/components/content/EmptyState";
import PageLinks from "@/components/content/PageLinks";
import ProductTile from "@/components/content/ProductTile";
import ProfileTile from "@/components/content/ProfileTile";
import SectionHeading from "@/components/content/SectionHeading";
import TopicTile from "@/components/content/TopicTile";
import VideoTile from "@/components/content/VideoTile";
import { getHomeSettings, searchAll, searchGroup } from "@/lib/api/public";
import type {
  ArticleCard,
  Paged,
  ProductCard,
  ProfileCard,
  SearchGroup,
  SearchTopic,
  VideoCard,
} from "@/lib/api/types";
import { searchHref } from "@/lib/routes";
import { pageCountFor, pageParam, param, type SearchParams } from "@/lib/searchParams";

export const metadata: Metadata = {
  title: "Search",
  description: "Search treatments, professionals, brands, products, articles and videos on Glamlink.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

const PER_PAGE = 12;

/** The groups in the order a visitor scans them, with their headings. */
const GROUPS: { key: SearchGroup; title: string }[] = [
  { key: "topics", title: "Treatments + Topics" },
  { key: "professionals", title: "Professionals" },
  { key: "brands", title: "Brands" },
  { key: "products", title: "Products" },
  { key: "articles", title: "Articles" },
  { key: "videos", title: "Videos" },
];

const isGroup = (value: string): value is SearchGroup => GROUPS.some((g) => g.key === value);

/** One group's rows in its own grid. */
function GroupGrid({ group, rows }: { group: SearchGroup; rows: unknown[] }) {
  switch (group) {
    case "topics":
      return (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(rows as SearchTopic[]).map((topic) => (
            <li key={topic.id}>
              <TopicTile topic={topic} />
            </li>
          ))}
        </ul>
      );
    case "professionals":
    case "brands":
      return (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {(rows as ProfileCard[]).map((profile) => (
            <li key={profile.id}>
              <ProfileTile profile={profile} />
            </li>
          ))}
        </ul>
      );
    case "products":
      return (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {(rows as ProductCard[]).map((product) => (
            <li key={product.id}>
              <ProductTile product={product} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />
            </li>
          ))}
        </ul>
      );
    case "articles":
      return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(rows as ArticleCard[]).map((article) => (
            <li key={article.id}>
              <ArticleTile article={article} />
            </li>
          ))}
        </ul>
      );
    case "videos":
      return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(rows as VideoCard[]).map((video) => (
            <li key={video.id}>
              <VideoTile video={video} />
            </li>
          ))}
        </ul>
      );
  }
}

function SearchBox({ q, type }: { q: string; type?: SearchGroup }) {
  return (
    <Form action="/search" role="search" className="relative mx-auto mt-8 max-w-2xl">
      {type && <input type="hidden" name="type" value={type} />}
      <label htmlFor="site-search" className="sr-only">
        Search Glamlink
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={q}
        required
        minLength={2}
        maxLength={100}
        autoFocus={!q}
        placeholder="Search treatments, professionals, products and more..."
        className="input-glamlink h-14 rounded-full pl-6 pr-16 shadow-soft"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-secondary"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>
    </Form>
  );
}

function Shell({ q, type, children }: { q: string; type?: SearchGroup; children: ReactNode }) {
  return (
    <div className="pb-20">
      <section aria-labelledby="search-heading" className="hero-glamlink pb-10 md:pb-12">
        <div className="container-glamlink text-center">
          <h1 id="search-heading" className="hero-title">
            {q ? <>Results for “{q}”</> : "Search Glamlink"}
          </h1>
          <SearchBox q={q} type={type} />
        </div>
      </section>
      <div className="container-glamlink">{children}</div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const q = param(params.q).slice(0, 100);
  const typeParam = param(params.type);
  const type = isGroup(typeParam) ? typeParam : undefined;
  const page = pageParam(params.page);

  // No search yet: offer the popular ones
  if (q.length < 2) {
    const settings = await getHomeSettings();
    const popular = settings?.popular_searches ?? [];
    return (
      <Shell q="">
        {q.length === 1 && <p className="text-center text-muted-foreground">Type at least 2 characters.</p>}
        {popular.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-sm font-semibold">Popular Searches:</span>
            {popular.map((term) => (
              <Link key={term} href={searchHref(term)} className="chip rounded-full px-3.5 py-1.5 text-xs">
                {term}
              </Link>
            ))}
          </div>
        )}
      </Shell>
    );
  }

  // One group, paged ("See all")
  if (type) {
    const results = (await searchGroup(q, type, { page, limit: PER_PAGE })) as Paged<unknown>;
    const title = GROUPS.find((g) => g.key === type)?.title ?? "Results";
    return (
      <Shell q={q} type={type}>
        <Link
          href={searchHref(q)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-secondary"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          All results
        </Link>
        <SectionHeading
          id="search-group-heading"
          title={title}
          subtitle={results.count === 1 ? "1 result" : `${results.count} results`}
        />
        {results.rows.length === 0 ? (
          <EmptyState title="Nothing found">Try a shorter or different search.</EmptyState>
        ) : (
          <GroupGrid group={type} rows={results.rows} />
        )}
        <PageLinks
          className="mt-12"
          page={page}
          pageCount={pageCountFor(results.count, PER_PAGE)}
          hrefFor={(p) => `${searchHref(q, type)}${p > 1 ? `&page=${p}` : ""}`}
        />
      </Shell>
    );
  }

  // Every group's first rows
  const results = await searchAll(q);
  const groups = GROUPS.filter((g) => (results?.[g.key]?.rows?.length ?? 0) > 0);

  return (
    <Shell q={q}>
      {!results ? (
        <EmptyState
          title="Search is resting"
          action={
            <Link href={`/journal?search=${encodeURIComponent(q)}`} className="btn-outline">
              Search the Journal instead
            </Link>
          }
        >
          Site-wide search is not available right now.
        </EmptyState>
      ) : groups.length === 0 ? (
        <EmptyState title={`Nothing found for “${q}”`}>
          Check the spelling, or try a broader word like a treatment or a city.
        </EmptyState>
      ) : (
        <div className="space-y-14 md:space-y-16">
          {groups.map(({ key, title }) => {
            const group = results[key];
            return (
              <section key={key} aria-labelledby={`search-${key}-heading`}>
                <SectionHeading
                  id={`search-${key}-heading`}
                  title={title}
                  action={
                    group.count > group.rows.length
                      ? { label: `See all ${group.count}`, href: searchHref(q, key) }
                      : undefined
                  }
                />
                <GroupGrid group={key} rows={group.rows} />
              </section>
            );
          })}
        </div>
      )}
    </Shell>
  );
}
