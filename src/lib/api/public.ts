import { apiUrl } from "@/lib/config";
import type {
  ArticleCard,
  ArticleMention,
  BrandFilters,
  EducationCard,
  EducationDetail,
  GoogleListing,
  HomeSettings,
  JournalCategory,
  MagazineIssue,
  MagazineIssueDetail,
  MapPin,
  Paged,
  ProductCard,
  ProductDetail,
  ProfessionalFilters,
  ProfileCard,
  ProfileDetail,
  ProfileIssue,
  ProfileMedia,
  ProfileSort,
  ProfileType,
  ShopSort,
  SearchGroup,
  SearchResults,
  ShopFilters,
  SitemapFeed,
  Topic,
  VideoCard,
  VideoDetail,
  VideoSeries,
} from "./types";

/*
 * Public reads for Server Components.
 *
 * Answers are kept in Next's data cache for an hour and tagged with the data
 * they show. The backend calls app/api/revalidate with those tags after every
 * edit, so a cached page changes within seconds; the hour is the fallback when
 * a call is lost. A failed or missing answer resolves to null or an empty page
 * (never throws), so a page shows its empty state or calls notFound().
 */

/** The backend's cache tags (its docs/handoff/website-frontend.md, section 10.18). */
export const CACHE_TAGS = [
  "journal",
  "topics",
  "shop",
  "discover",
  "profiles",
  "cards",
  "directory",
  "videos",
  "magazine",
  "ads",
  "home",
  "podcasts",
  "blog",
] as const;

export type CacheTag = (typeof CACHE_TAGS)[number];

const REVALIDATE_SECONDS = 3600;

/**
 * `next dev` reads the API afresh on every request: the backend's refresh hook
 * can't reach a laptop, so cached answers would hide changes made through the
 * API (an admin's edit, an episode import) for up to the hour above.
 */
const ALWAYS_FRESH = process.env.NODE_ENV === "development";

/** What a profile page shows: the page itself plus its products, articles, videos and issues. */
const PROFILE_TAGS: CacheTag[] = ["profiles", "cards", "shop", "journal", "videos", "magazine"];

type Query = Record<string, string | number | boolean | null | undefined>;

interface FetchOptions {
  tags: CacheTag[];
  query?: Query;
  /** Skip the cache: answers that vary by every keystroke, like search. */
  noStore?: boolean;
}

function buildUrl(path: string, query?: Query) {
  const url = new URL(apiUrl(path));
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "" || value === false) continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function getData<T>(path: string, { tags, query, noStore }: FetchOptions): Promise<T | null> {
  let url: string;
  try {
    url = buildUrl(path, query);
  } catch {
    return null; // NEXT_PUBLIC_API_URL is not set
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      ...(noStore || ALWAYS_FRESH ? { cache: "no-store" as const } : { next: { revalidate: REVALIDATE_SECONDS, tags } }),
    });
    if (!res.ok) {
      if (res.status !== 404) console.error(`API ${res.status} for ${path}`);
      return null;
    }
    const body = await res.json();
    if (body?.success === false) return null;
    // Older calls answer a miss with 200 and a message as the data ("No Record Found")
    if (typeof body?.data === "string") return null;
    return (body?.data ?? null) as T | null;
  } catch (error) {
    console.error(`API request failed for ${path}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * A list answer as `{ count, rows }`. An API that ignores the paging parameters
 * (an older deploy) answers every row: those are paged here, so page 2 still
 * shows the next rows rather than the first ones again.
 */
async function getPage<T>(path: string, options: FetchOptions): Promise<Paged<T>> {
  const data = await getData<Paged<T> | T[]>(path, options);
  const rows: T[] = Array.isArray(data) ? data : Array.isArray(data?.rows) ? data.rows : [];
  const count = Array.isArray(data) ? data.length : Number(data?.count ?? rows.length);

  const limit = Number(options.query?.limit ?? 0);
  if (limit > 0 && rows.length > limit) {
    const page = Math.max(1, Number(options.query?.page ?? 1));
    return { count: rows.length, rows: rows.slice((page - 1) * limit, page * limit) };
  }
  return { count, rows };
}

async function getList<T>(path: string, options: FetchOptions): Promise<T[]> {
  const data = await getData<T[] | Paged<T>>(path, options);
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.rows) ? data.rows : [];
}

export interface PageQuery {
  page?: number;
  limit?: number;
}

/* ── Home ────────────────────────────────────────────────── */

export const getHomeSettings = () => getData<HomeSettings>("settings/home", { tags: ["home"] });

/** The topic tiles admins marked for the home page, in their order. */
export const getFeaturedTopics = () =>
  getList<Topic>("journal/topic", { tags: ["topics"], query: { featured: true } });

/** Every active topic. */
export const getTopics = () => getList<Topic>("journal/topic", { tags: ["topics"] });

/* ── Journal ─────────────────────────────────────────────── */

export interface ArticleQuery extends PageQuery {
  category?: string;
  search?: string;
  /** Ids to leave out: the hero's, or the article being read. */
  exclude?: number | string;
  featured?: boolean;
}

export const getArticles = (query: ArticleQuery) =>
  getPage<ArticleCard>("journal", { tags: ["journal"], query: { ...query } });

export const getJournalCategories = () =>
  getList<JournalCategory>("journalCategory", { tags: ["journal"] });

export interface ArticleDetail extends ArticleCard {
  content?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  mentions?: ArticleMention[];
}

export const getArticle = <T = ArticleDetail>(id: string | number) =>
  getData<T>(`journal/findJournalById/${encodeURIComponent(String(id))}`, { tags: ["journal", "topics", "shop"] });

/* ── Shop ────────────────────────────────────────────────── */

export interface ProductQuery extends PageQuery {
  category?: string;
  brand?: string;
  owner?: string;
  search?: string;
  featured?: boolean;
  /** Since Nov 3 (the Shop's filters and Saved list); an older API ignores them. */
  sort?: ShopSort;
  /** Inclusive. */
  min_price?: number;
  /** Exclusive, so price bands don't overlap. */
  max_price?: number;
  /** Comma-separated product ids (at most 100): the visitor's saved products. */
  ids?: string;
}

export const getProducts = (query: ProductQuery) =>
  getPage<ProductCard>("discover/shop", { tags: ["shop"], query: { limit: 12, ...query } });

export const getShopFilters = () => getData<ShopFilters>("discover/shop/filters", { tags: ["shop"] });

export const getProductBySlug = (slug: string) =>
  getData<ProductDetail>(`discover/shop/slug/${encodeURIComponent(slug)}`, { tags: ["shop", "topics"] });

export const getProductById = (id: string | number) =>
  getData<ProductDetail>(`discover/shop/findById/${encodeURIComponent(String(id))}`, { tags: ["shop", "topics"] });

/* ── Professional and brand pages ────────────────────────── */

export interface ProfileQuery extends PageQuery {
  type?: ProfileType;
  featured?: boolean;
  search?: string;
  /** Since Nov 3 (the Professionals and Brands pages); an older API ignores them. */
  sort?: ProfileSort;
  specialty?: string;
  category?: string;
  shipping?: string;
  state?: string;
  city?: string;
  lat?: number;
  lng?: number;
}

export const getProfiles = (query: ProfileQuery) =>
  getPage<ProfileCard>("profiles", { tags: ["profiles", "cards"], query: { limit: 12, ...query } });

/* ── The directory ───────────────────────────────────────── */

const DIRECTORY_TAGS: CacheTag[] = ["profiles", "cards", "directory"];

/** What the Professionals or the Brands page can be narrowed by, with counts. */
export function getDirectoryFilters(type: "individual"): Promise<ProfessionalFilters | null>;
export function getDirectoryFilters(type: "brand"): Promise<BrandFilters | null>;
export function getDirectoryFilters(type: ProfileType) {
  return getData<ProfessionalFilters | BrandFilters>("directory/filters", { tags: DIRECTORY_TAGS, query: { type } });
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/** The professionals with a location inside the box, for the directory's map. */
export const getMapPins = (bounds: MapBounds, limit = 100) =>
  getPage<MapPin>("directory/map", { tags: DIRECTORY_TAGS, query: { ...bounds, limit } });

/**
 * Google's listings near a point, the way the directory shows them before a search. The API keeps Google's answer
 * six hours and this cache an hour, so a busy page costs a few Google calls a day.
 */
export const getGoogleListings = (query: { lat: number; lng: number; limit?: number }) =>
  getList<GoogleListing>("directory/google", { tags: ["directory"], query: { ...query } });

export const getProfile = (slug: string) =>
  getData<ProfileDetail>(`profiles/${encodeURIComponent(slug)}`, { tags: PROFILE_TAGS });

export const getProfileProducts = (slug: string, query: PageQuery) =>
  getPage<ProductCard>(`profiles/${encodeURIComponent(slug)}/products`, { tags: PROFILE_TAGS, query: { ...query } });

export const getProfileArticles = (slug: string, query: PageQuery) =>
  getPage<ArticleCard>(`profiles/${encodeURIComponent(slug)}/articles`, { tags: PROFILE_TAGS, query: { ...query } });

export interface ProfileVideoQuery extends PageQuery {
  /** One series only, by slug (the podcast is "beauty-vault-podcast"). An API from before Nov 3 ignores it. */
  series?: string;
}

export const getProfileVideos = (slug: string, query: ProfileVideoQuery) =>
  getPage<VideoCard>(`profiles/${encodeURIComponent(slug)}/videos`, { tags: PROFILE_TAGS, query: { ...query } });

export const getProfileIssues = (slug: string, query: PageQuery) =>
  getPage<ProfileIssue>(`profiles/${encodeURIComponent(slug)}/magazine`, { tags: PROFILE_TAGS, query: { ...query } });

/*
 * A page's own gallery and education posts (Nov 3). An API from before then
 * answers these paths with 404, which reads as an empty list or null.
 */

export interface ProfileMediaQuery extends PageQuery {
  kind?: ProfileMedia["kind"];
}

/** The gallery in the owner's order (the Access card's gallery until the owner adds their own). */
export const getProfileMedia = (slug: string, query: ProfileMediaQuery) =>
  getPage<ProfileMedia>(`profiles/${encodeURIComponent(slug)}/media`, { tags: PROFILE_TAGS, query: { ...query } });

export interface ProfileEducationQuery extends PageQuery {
  kind?: EducationCard["kind"];
}

/** Published education posts, in the owner's order. */
export const getProfileEducation = (slug: string, query: ProfileEducationQuery) =>
  getPage<EducationCard>(`profiles/${encodeURIComponent(slug)}/education`, { tags: PROFILE_TAGS, query: { ...query } });

/** One published post; null when it is missing or a draft. */
export const getEducationItem = (slug: string, itemSlug: string) =>
  getData<EducationDetail>(
    `profiles/${encodeURIComponent(slug)}/education/${encodeURIComponent(itemSlug)}`,
    { tags: PROFILE_TAGS }
  );

/* ── Watch ───────────────────────────────────────────────── */

export interface VideoQuery extends PageQuery {
  series?: string;
  featured?: boolean;
  search?: string;
}

export const getVideoSeries = () => getList<VideoSeries>("video-series", { tags: ["videos"] });

export const getVideos = (query: VideoQuery) =>
  getPage<VideoCard>("videos", { tags: ["videos"], query: { limit: 12, ...query } });

export const getVideo = (slug: string) =>
  getData<VideoDetail>(`videos/${encodeURIComponent(slug)}`, { tags: ["videos", "profiles", "topics"] });

/* ── Magazine ────────────────────────────────────────────── */

export const getIssues = (query: PageQuery & { featured?: boolean }) =>
  getPage<MagazineIssue>("magazine", { tags: ["magazine"], query: { limit: 50, ...query } });

export const getIssue = (slug: string) =>
  getData<MagazineIssueDetail>(`magazine/${encodeURIComponent(slug)}`, { tags: ["magazine", "profiles"] });

/* ── Search ──────────────────────────────────────────────── */

const SEARCH_TAGS: CacheTag[] = ["topics", "profiles", "shop", "journal", "videos"];

/** Every group's first rows and its count. */
export const searchAll = (q: string, limit = 5) =>
  getData<SearchResults>("search", { tags: SEARCH_TAGS, query: { q, limit }, noStore: true });

/** One group, paged, for "See all". */
export const searchGroup = <G extends SearchGroup>(q: string, type: G, query: PageQuery) =>
  getPage<SearchResults[G]["rows"][number]>("search", {
    tags: SEARCH_TAGS,
    query: { q, type, page: query.page, limit: query.limit ?? 12 },
    noStore: true,
  });

/* ── Sitemap ─────────────────────────────────────────────── */

export const getSitemapFeed = () =>
  getData<SitemapFeed>("sitemap", {
    tags: ["journal", "topics", "profiles", "cards", "shop", "videos", "magazine"],
  });
