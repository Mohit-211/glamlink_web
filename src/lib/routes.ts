import slugify from "slugify";
import { encodeId } from "@/lib/idCodec";
import type { SearchGroup } from "@/lib/api/types";

/* Links to the site's own pages, built in one place so every card agrees. */

const urlSlug = (text: string) => slugify(text || "", { lower: true, strict: true });

/**
 * /journal/<id>/<slug>, the article URL the site has always used. The API's slug
 * (made from the title when the article was added) keeps the link stable when
 * the title changes; articles without one use their title.
 */
export const articleHref = (article: { id: number | string; slug?: string | null; title?: string | null }) =>
  `/journal/${article.id}/${article.slug ? urlSlug(article.slug) : urlSlug(article.title || "") || "article"}`;

/** /shop/<slug>; products added before slugs existed keep their encoded-id link. */
export const productHref = (product: { id: number | string; slug?: string | null }) =>
  `/shop/${product.slug ? encodeURIComponent(product.slug) : encodeId(product.id)}`;

/** A professional's or a brand's page. */
export const profileHref = (slug: string) => `/profiles/${encodeURIComponent(slug)}`;

export const topicHref = (topic: { id: number | string; slug?: string | null }) =>
  `/topics/${topic.slug ? encodeURIComponent(topic.slug) : topic.id}`;

export const videoHref = (slug: string) => `/watch/${encodeURIComponent(slug)}`;

export const issueHref = (slug: string) => `/magazine/${encodeURIComponent(slug)}`;

export const journalCategoryHref = (slug: string) => `/journal?category=${encodeURIComponent(slug)}`;

export const searchHref = (q: string, type?: SearchGroup) => {
  const params = new URLSearchParams({ q });
  if (type) params.set("type", type);
  return `/search?${params.toString()}`;
};
