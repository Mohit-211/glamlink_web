import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "@/lib/api/public";

/*
 * The backend's cache-refresh hook (its docs/handoff/website-frontend.md, 10.18).
 * After each change made through the API, it posts the tags of the data that
 * changed:
 *
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   { "tags": ["journal", "topics"] }
 *
 * Each tag expires at once, so the next visit fetches fresh data. The server's
 * WEBSITE_REFRESH_URL and WEBSITE_REFRESH_SECRET point here.
 */

const KNOWN_TAGS = new Set<string>(CACHE_TAGS);

function authorized(header: string | null, secret: string) {
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header ?? "");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "Cache refresh is not configured" }, { status: 503 });
  }
  if (!authorized(request.headers.get("authorization"), secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tags: CacheTag[] = Array.isArray(body?.tags)
    ? body.tags.filter((tag: unknown): tag is CacheTag => typeof tag === "string" && KNOWN_TAGS.has(tag))
    : [];
  if (tags.length === 0) {
    return Response.json({ error: "No known tags", known: CACHE_TAGS }, { status: 400 });
  }

  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
