import { SITE_URL } from "@/lib/config";
import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

import { getAllBlogs, getAllTopics } from "@/api/Api";
import { getSitemapFeed } from "@/lib/api/public";
import type { SitemapEntry } from "@/lib/api/types";
import { ALLOW_INDEXING } from "@/lib/indexing";
import { getMagazineIssues } from "@/lib/magazine";
import { articleHref, issueHref, productHref, profileHref, topicHref, videoHref } from "@/lib/routes";

type Entry = MetadataRoute.Sitemap[number];

/** Pages for signed-in people, one-off flows and search results: not for search engines. */
const UNLISTED = new Set([
  "/ad-test",
  "/dashboard",
  "/delete-account",
  "/forgot-password",
  "/login",
  "/register",
  "/reset-password",
  "/search",
  "/verify-email",
]);

function staticRoutes(): Entry[] {
  const appDir = path.join(process.cwd(), "src/app");

  function getRoutes(dir: string, basePath = ""): string[] {
    let routes: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith("_") || entry.name.startsWith("(") || entry.name.startsWith("[")) continue;
      if (entry.name === "api") continue;
      if (entry.isDirectory()) routes = routes.concat(getRoutes(path.join(dir, entry.name), `${basePath}/${entry.name}`));
      if (entry.name === "page.tsx") routes.push(basePath || "");
    }
    return routes;
  }

  return getRoutes(appDir)
    .filter((route) => !UNLISTED.has(route))
    .map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.7,
    }));
}

const lastModified = (entry: SitemapEntry) => (entry.updated_at ? new Date(entry.updated_at) : undefined);

/** Every public page from the API's sitemap feed (backend handoff, 10.16). */
async function fromFeed(): Promise<Entry[] | null> {
  const feed = await getSitemapFeed();
  if (!feed) return null;

  const withSlug = (entries: SitemapEntry[] | undefined) => (entries ?? []).filter((e) => e.slug);
  const page = (url: string, entry: SitemapEntry, priority: number): Entry => ({
    url: `${SITE_URL}${url}`,
    lastModified: lastModified(entry),
    changeFrequency: "weekly",
    priority,
  });

  return [
    ...withSlug(feed.articles).map((e) => page(articleHref({ id: e.id, slug: e.slug }), e, 0.6)),
    ...withSlug(feed.topics).map((e) => page(topicHref({ id: e.id, slug: e.slug }), e, 0.6)),
    ...withSlug(feed.profiles).map((e) => page(profileHref(e.slug as string), e, 0.6)),
    ...withSlug(feed.products).map((e) => page(productHref({ id: e.id, slug: e.slug }), e, 0.5)),
    ...withSlug(feed.videos).map((e) => page(videoHref(e.slug as string), e, 0.5)),
    ...withSlug(feed.issues).flatMap((e) => [
      page(issueHref(e.slug as string), e, 0.6),
      page(`${issueHref(e.slug as string)}/digital`, e, 0.5),
    ]),
  ];
}

/** Before the feed: articles and topics from their lists, issues from the magazine. */
async function fromLists(): Promise<Entry[]> {
  const entries: Entry[] = [];

  try {
    const res = await getAllBlogs();
    const articles: { id: number; slug?: string | null; title?: string; updated_at?: string; created_at?: string }[] =
      res?.data?.rows || res?.data || [];
    articles.forEach((article) =>
      entries.push({
        url: `${SITE_URL}${articleHref(article)}`,
        lastModified: new Date(article.updated_at || article.created_at || Date.now()),
        changeFrequency: "weekly",
        priority: 0.6,
      })
    );
  } catch (error) {
    console.error("Journal sitemap error:", error instanceof Error ? error.message : error);
  }

  try {
    const res = await getAllTopics();
    const topics: { id: number; slug?: string; is_active?: boolean; updated_at?: string }[] = Array.isArray(res?.data)
      ? res.data
      : [];
    topics
      .filter((topic) => topic.is_active !== false)
      .forEach((topic) =>
        entries.push({
          url: `${SITE_URL}${topicHref(topic)}`,
          lastModified: topic.updated_at ? new Date(topic.updated_at) : undefined,
          changeFrequency: "weekly",
          priority: 0.6,
        })
      );
  } catch (error) {
    console.error("Topics sitemap error:", error instanceof Error ? error.message : error);
  }

  (await getMagazineIssues()).forEach((issue) => {
    entries.push({ url: `${SITE_URL}${issueHref(issue.slug)}`, changeFrequency: "monthly", priority: 0.6 });
    entries.push({ url: `${SITE_URL}${issueHref(issue.slug)}/digital`, changeFrequency: "monthly", priority: 0.5 });
  });

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Test and staging builds list nothing.
  if (!ALLOW_INDEXING) return [];
  const dynamic = (await fromFeed()) ?? (await fromLists());
  return [...staticRoutes(), ...dynamic];
}
