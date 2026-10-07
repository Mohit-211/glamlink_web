// ─── Podcast data layer ───────────────────────────────────────────────────────
// Episodes come from the YouTube playlist. New uploads appear automatically;
// categories are inferred from the title, and can be pinned per-episode via
// EPISODE_OVERRIDES without touching any layout code.

export const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";
export const YOUTUBE_PLAYLIST_ID = "PLJPmuOJKw5YbrNAxnyi7SuQx9gNisadgY";
export const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`;
export const SPOTIFY_URL = "https://open.spotify.com/show/0GEWcvRT3PFalAaN2faX4z?si=OWqOPcyZSZqNn7ATTnGJng";
export const APPLE_PODCASTS_URL = "https://podcasts.apple.com/us/podcast/the-beauty-vault/id1885669168";

export const SHOW_NAME = "The Beauty Vault";
export const HOST_NAME = "Marie Matteucci";

export const CATEGORIES = [
  "Beauty",
  "Wellness",
  "Business",
  "Entrepreneurship",
  "Industry Trends",
  "Interviews",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  category: Category;
  guest?: string;
  number: number;
  /** Placeholder episodes shown when the YouTube API is unavailable. */
  isPlaceholder?: boolean;
}

/** Manual per-episode corrections, keyed by YouTube video ID. */
const EPISODE_OVERRIDES: Record<string, { category?: Category; guest?: string }> = {};

// Checked in order — the first matching category wins.
const CATEGORY_KEYWORDS: [Category, RegExp][] = [
  ["Entrepreneurship", /\b(founder|entrepreneur|built|building|launch|start(ed|ing)? (a|her|his|their)|multi-location|brand owner)\b/i],
  ["Business", /\b(business|marketing|pricing|clients?|revenue|growth|salon owner|retention|social media|booking)\b/i],
  ["Industry Trends", /\b(trends?|innovation|science|future|technology|tech|research|what'?s next)\b/i],
  ["Wellness", /\b(wellness|holistic|health|non-toxic|mental|nutrition|longevity|mindset|self-care|hormone)/i],
  ["Beauty", /\b(beauty|skin|skincare|makeup|hair|lash(es)?|brows?|wax(ing)?|glam|nails?|aesthetic|injectables?|facials?)\b/i],
];

function inferCategory(title: string, description: string): Category {
  for (const [category, pattern] of CATEGORY_KEYWORDS) {
    if (pattern.test(title)) return category;
  }
  const intro = description.slice(0, 280);
  for (const [category, pattern] of CATEGORY_KEYWORDS) {
    if (pattern.test(intro)) return category;
  }
  return "Interviews";
}

/** Picks up an explicit "Guest: Name" / "Featuring: Name" line in the description. */
function inferGuest(description: string): string | undefined {
  const match = description.match(/^\s*(?:guest|featuring|feat\.)\s*[:\-–]\s*(.{2,60})$/im);
  return match?.[1]?.trim();
}

/** First paragraph of the YouTube description, minus links and hashtags. */
function toExcerpt(description: string): string {
  const firstBlock = description.split(/\n\s*\n/)[0] ?? "";
  return firstBlock
    .replace(/https?:\/\/\S+/g, "")
    .replace(/#\w+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** "PT1H4M12S" → "1 hr 4 min", "PT48M3S" → "48 min". */
function formatIsoDuration(iso: string): string | undefined {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return undefined;
  const h = Number(m[1] || 0);
  const min = Number(m[2] || 0) + (Number(m[3] || 0) >= 30 ? 1 : 0);
  if (h) return min ? `${h} hr ${min} min` : `${h} hr`;
  return min ? `${min} min` : undefined;
}

export function formatEpisodeDate(publishedAt: string): string {
  const date = new Date(publishedAt);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatEpisodeNumber(n: number): string {
  return `EP. ${String(Math.max(1, n)).padStart(2, "0")}`;
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getEpisodeSlug(episode: Pick<Episode, "id" | "title">): string {
  return slugify(episode.title) || episode.id;
}

/** Pulls the trailing YouTube video ID (11 chars) back out of a slug, as a fallback. */
export function extractIdFromSlug(slug: string): string {
  const match = slug.match(/([a-zA-Z0-9_-]{11})$/);
  return match ? match[1] : slug;
}

// ─── Fetching ─────────────────────────────────────────────────────────────────
interface RawVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

function toEpisodes(raw: RawVideo[], durations: Record<string, string> = {}): Episode[] {
  return raw.map((v, i) => {
    const override = EPISODE_OVERRIDES[v.id] ?? {};
    return {
      ...v,
      description: toExcerpt(v.description),
      duration: durations[v.id],
      category: override.category ?? inferCategory(v.title, v.description),
      guest: override.guest ?? inferGuest(v.description),
      // Playlist is newest-first, so the first item carries the highest number.
      number: raw.length - i,
    };
  });
}

export const PLACEHOLDER_EPISODES: Episode[] = toEpisodes([
  { id: "placeholder-1", title: "Behind the Glam: A Raiderettes Makeup Artist's Journey", description: "", thumbnail: "", publishedAt: "" },
  { id: "placeholder-2", title: "Holistic + Non-Toxic Skincare: The Truth About Your Skincare", description: "", thumbnail: "", publishedAt: "" },
  { id: "placeholder-3", title: "Innovation, Retinol and the Science Behind Results-Driven Skincare", description: "", thumbnail: "", publishedAt: "" },
  { id: "placeholder-4", title: "Inside the Pretty Kitty: How Tricia Evans Built a Multi-Location Waxing Brand", description: "", thumbnail: "", publishedAt: "" },
]).map((e) => ({ ...e, isPlaceholder: true }));

async function fetchDurations(ids: string[]): Promise<Record<string, string>> {
  const durations: Record<string, string> = {};
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50).join(",");
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batch}&key=${YOUTUBE_API_KEY}`
    );
    if (!res.ok) break;
    const data = await res.json();
    for (const item of data.items || []) {
      const formatted = formatIsoDuration(item.contentDetails?.duration || "");
      if (formatted) durations[item.id] = formatted;
    }
  }
  return durations;
}

export async function fetchEpisodes(): Promise<Episode[]> {
  if (!YOUTUBE_API_KEY) return [];
  const raw: RawVideo[] = [];
  let pageToken = "";
  do {
    const pageParam = pageToken ? `&pageToken=${pageToken}` : "";
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}${pageParam}`
    );
    if (!res.ok) break;
    const data = await res.json();
    for (const item of data.items || []) {
      const s = item.snippet;
      if (!s?.resourceId?.videoId || s.title === "Deleted video" || s.title === "Private video") continue;
      raw.push({
        id: s.resourceId.videoId,
        title: s.title,
        description: s.description || "",
        thumbnail: s.thumbnails?.maxres?.url || s.thumbnails?.high?.url || s.thumbnails?.medium?.url || "",
        publishedAt: s.publishedAt,
      });
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  // Durations are a nice-to-have — never let them block the listing.
  const durations = await fetchDurations(raw.map((v) => v.id)).catch(() => ({}));
  return toEpisodes(raw, durations);
}
