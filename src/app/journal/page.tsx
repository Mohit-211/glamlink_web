import type { Metadata } from "next";
import slugify from "slugify";
import { SITE_URL } from "@/lib/config";
import JournalLandingPage from "@/components/blogs/JournalLandingPage";
import { getArticles, getJournalCategories } from "@/lib/api/public";
import { getMagazineIssues } from "@/lib/magazine";
import { pageParam, param, type SearchParams } from "@/lib/searchParams";

const ARTICLES_PER_PAGE = 6;

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

export default async function JournalPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const category = param(params.category);
  const search = param(params.search);
  const page = pageParam(params.page);

  // The featured article leads the first page of the unfiltered journal
  const showHero = !category && !search && page === 1;
  const [featured, categoryRows, issues] = await Promise.all([
    showHero ? getArticles({ featured: true, limit: 1 }) : null,
    getJournalCategories(),
    getMagazineIssues(),
  ]);
  const hero = featured?.rows[0] ?? null;

  const articles = await getArticles({
    page,
    limit: ARTICLES_PER_PAGE,
    category,
    search,
    exclude: hero?.id,
  });
  // An API that ignores `exclude` would list the hero twice
  if (hero) articles.rows = articles.rows.filter((article) => article.id !== hero.id);

  // Categories in the admins' order; empty ones are hidden
  const categories = categoryRows
    .filter((c) => c.article_count === undefined || c.article_count > 0)
    .map((c) => ({ ...c, title: c.title.trim(), slug: c.slug || slugify(c.title, { lower: true, strict: true }) }));

  return (
    <JournalLandingPage
      hero={hero}
      articles={articles}
      categories={categories}
      issues={issues}
      category={category}
      search={search}
      page={page}
      perPage={ARTICLES_PER_PAGE}
    />
  );
}
