import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

import { issues2025, issues2026 } from "@/data/issues";
import { getAllBlogs } from "@/api/Api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://glamlink.net";
  const appDir = path.join(process.cwd(), "src/app");

  /* ----------------------------------
     STATIC ROUTES
  ----------------------------------- */

  function getRoutes(dir: string, basePath = ""): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    let routes: string[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith("_")) continue;
      if (entry.name.startsWith("(")) continue;
      if (entry.name.startsWith("[")) continue;
      if (entry.name === "api") continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        routes = routes.concat(
          getRoutes(fullPath, `${basePath}/${entry.name}`)
        );
      }

      if (entry.name === "page.tsx") {
        routes.push(basePath || "");
      }
    }

    return routes;
  }

  const staticRoutes: MetadataRoute.Sitemap = getRoutes(appDir).map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.7,
    })
  );

  /* ----------------------------------
     JOURNAL ARTICLES
  ----------------------------------- */

  let journalRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await getAllBlogs();

    const articles = res?.data?.rows || res?.data || [];

    journalRoutes = articles.map((article: any) => ({
      url: `${baseUrl}/journal/${article.id}/${article.slug}`,
      lastModified: new Date(article.created_at),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.log("Journal sitemap error:", error);
  }

  /* ----------------------------------
     MAGAZINE ISSUES
  ----------------------------------- */

  const allIssues = [...issues2026, ...issues2025];

  const magazineRoutes: MetadataRoute.Sitemap = allIssues.map((issue) => ({
    url: `${baseUrl}/magazine/${issue.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  /* ----------------------------------
     DIGITAL MAGAZINES
  ----------------------------------- */

  const digitalRoutes: MetadataRoute.Sitemap = allIssues.map((issue) => ({
    url: `${baseUrl}/magazine/${issue.slug}/digital`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...journalRoutes,
    ...magazineRoutes,
    ...digitalRoutes,
  ];
}
