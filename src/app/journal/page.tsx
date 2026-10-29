import type { Metadata } from "next";
import slugify from "slugify";
import { SITE_URL } from "@/lib/config";
import JournalLandingPage from "@/components/blogs/JournalLandingPage";
import type { JournalSpotlight } from "@/components/blogs/JournalClient";
import { getArticles, getJournalCategories } from "@/lib/api/public";
import type { JournalCategory } from "@/lib/api/types";
import { getMagazineIssues } from "@/lib/magazine";
import { pageParam, param, type SearchParams } from "@/lib/searchParams";

/** Stories per page: on the front page, three Top Stories and six in The Latest; elsewhere a grid of three rows. */
const ARTICLES_PER_PAGE = 9;
/** The front page's In Focus shelves: the sections with the most stories. */
const SPOTLIGHTS = 2;
/** Stories on a shelf: a lead and three more; a shelf with fewer than three is left out. */
const SPOTLIGHT_STORIES = 4;

const description = "Explore beauty industry insights, trends, tips, and expert articles.";

export const metadata: Metadata = {
  title: "Beauty Industry Journal & Insights",
  description,
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    title: "Beauty Industry Journal & Insights | Glamlink",
    description,
    url: `${SITE_URL}/journal`,
    images: [
      {
        url: `${SITE_URL}/assets/oglayout.png`,
        width: 1200,
        height: 630,
        alt: "Glamlink Beauty & Wellness Platform",
      },
    ],
  },
};

/** The biggest sections' stories, leaving out those the page already shows. */
async function getSpotlights(categories: JournalCategory[], shown: Set<number>): Promise<JournalSpotlight[]> {
  const biggest = [...categories]
    .sort((a, b) => (b.article_count ?? 0) - (a.article_count ?? 0))
    .slice(0, SPOTLIGHTS);
  const lists = await Promise.all(
    biggest.map((category) => getArticles({ category: category.slug, limit: SPOTLIGHT_STORIES + ARTICLES_PER_PAGE }))
  );
  return biggest
    .map((category, i) => ({
      category,
      articles: lists[i].rows.filter((article) => !shown.has(article.id)).slice(0, SPOTLIGHT_STORIES),
    }))
    .filter((spotlight) => spotlight.articles.length >= 3);
}

export default async function JournalPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const category = param(params.category);
  const search = param(params.search);
  const page = pageParam(params.page);

  // The cover story leads the front page; the unfiltered pages all leave it out of
  // their lists, so page 2 starts where page 1 ended.
  const unfiltered = !category && !search;
  const front = unfiltered && page === 1;
  const [featured, categoryRows, issues] = await Promise.all([
    unfiltered ? getArticles({ featured: true, limit: 1 }) : null,
    getJournalCategories(),
    getMagazineIssues(),
  ]);
  const featuredStory = featured?.rows[0] ?? null;

  const articles = await getArticles({
    page,
    limit: ARTICLES_PER_PAGE,
    category,
    search,
    exclude: featuredStory?.id,
  });
  // An API that ignores `exclude` would list the cover story twice
  if (featuredStory) articles.rows = articles.rows.filter((article) => article.id !== featuredStory.id);
  // With no featured story, the newest one leads
  const hero = front ? (featuredStory ?? articles.rows.shift() ?? null) : null;

  // Sections in the admins' order; empty ones are hidden
  const categories = categoryRows
    .filter((c) => c.article_count === undefined || c.article_count > 0)
    .map((c) => ({ ...c, title: c.title.trim(), slug: c.slug || slugify(c.title, { lower: true, strict: true }) }));

  const shown = new Set([...(hero ? [hero.id] : []), ...articles.rows.map((article) => article.id)]);
  const spotlights = front ? await getSpotlights(categories, shown) : [];

  return (
    <JournalLandingPage
      hero={hero}
      articles={articles}
      categories={categories}
      issues={issues}
      spotlights={spotlights}
      category={category}
      search={search}
      page={page}
      perPage={ARTICLES_PER_PAGE}
    />
  );
}
