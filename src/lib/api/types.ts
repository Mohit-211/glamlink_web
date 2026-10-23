/**
 * Shapes of the backend's public answers, as listed in the backend's
 * docs/handoff/website-frontend.md (section 10). Only the fields the website
 * reads are typed; the API may send more.
 */

/** Every list answer: `count` is all matching rows, `rows` one page of them. */
export interface Paged<T> {
  count: number;
  rows: T[];
}

/** A page link carried by products, mentions and search rows. */
export interface PageRef {
  id: number;
  slug: string;
  name: string;
  type?: ProfileType;
}

/* ── Journal ─────────────────────────────────────────────── */

export interface ArticleCategory {
  id: number;
  title: string;
  slug: string;
}

/** A light article row (`GET /journal?page=…`): no body, shops or downloads. */
export interface ArticleCard {
  id: number;
  slug: string | null;
  title: string;
  short_description: string | null;
  cover_image: string | null;
  publish_date: string | null;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  journal_category: ArticleCategory | null;
  journal_author: { id: number; name: string; profile_image: string | null } | null;
}

export interface JournalCategory {
  id: number;
  title: string;
  slug: string;
  /** Published articles in the category; hide categories with 0. */
  article_count?: number;
  sort_order?: number | null;
}

/** Someone an article features who has a visible page (`findJournalById`). */
export interface ArticleMention {
  /** The @handle as written; null when an editor added the person. */
  handle: string | null;
  slug: string;
  name: string;
  type: ProfileType;
}

/* ── Topics and home settings ────────────────────────────── */

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  cover_image: string | null;
  /** Square tile for the home page; null means use `cover_image`. */
  tile_image?: string | null;
  is_featured?: boolean;
  featured_order?: number | null;
}

export interface HomeSettings {
  hero_image: string | null;
  find_professional_image: string | null;
  popular_searches: string[];
  updated_at?: string;
}

/* ── Shop ────────────────────────────────────────────────── */

export interface ProductCard {
  id: number;
  slug: string | null;
  title: string;
  short_description: string | null;
  category: string | null;
  /** The brand as typed by whoever added the product. */
  brand: string | null;
  price: string | number | null;
  cover_image: string | null;
  link: string | null;
  is_featured?: boolean;
  /** The page of the account that put the product up. */
  owner?: PageRef | null;
  /** The page of the brand that makes it. */
  brand_profile?: PageRef | null;
}

export interface ProductDetail extends ProductCard {
  description: string | null;
  topics?: { id: number; name: string; slug: string }[];
  journal_topics?: { id: number; name: string; slug: string }[];
}

export interface ShopFilterValue {
  slug: string;
  name: string;
  count: number;
}

export interface ShopFilters {
  categories: ShopFilterValue[];
  brands: ShopFilterValue[];
}

/* ── Professional and brand pages ────────────────────────── */

export type ProfileType = "individual" | "brand";

/** A row of `GET /profiles` (and of the search's professionals and brands). */
export interface ProfileCard {
  id: number;
  slug: string;
  type: ProfileType;
  name: string;
  image: string | null;
  tagline: string | null;
  city: string | null;
  state: string | null;
  specialty: string | null;
  is_featured?: boolean;
}

export interface SocialLink {
  title: string | null;
  url: string;
}

/** An issue on a profile page, with the account's part in it. */
export interface ProfileIssue extends MagazineIssue {
  role?: MagazineRole;
  page_number?: number | null;
}

export interface ProfileDetail extends ProfileCard {
  cover_image: string | null;
  /** Rich text, cleaned by the API like the card bio. */
  about: string | null;
  website: string | null;
  social: SocialLink[];
  location: { city: string | null; state: string | null } | null;
  specialties: string[];
  email: string | null;
  phone: string | null;
  booking_link: string | null;
  access_card: { slug: string; url: string } | null;
  topics: { id: number; name: string; slug: string }[];
  products: Paged<ProductCard>;
  journal: Paged<ArticleCard>;
  magazine: Paged<ProfileIssue>;
  videos: Paged<VideoCard>;
}

/* ── Watch ───────────────────────────────────────────────── */

export interface VideoSeries {
  id: number;
  name: string;
  slug: string;
  sort_order?: number | null;
  video_count?: number;
}

export interface VideoCard {
  id: number;
  slug: string;
  title: string;
  youtube_id: string | null;
  thumbnail: string | null;
  published_at: string | null;
  duration_seconds: number | null;
  is_featured?: boolean;
  series: { id: number; name: string; slug: string } | null;
}

export type VideoRole = "host" | "guest" | "featured";

export interface VideoDetail extends VideoCard {
  description: string | null;
  embed_url: string | null;
  watch_url: string | null;
  people: (PageRef & { role: VideoRole })[];
  topics: { id: number; name: string; slug: string }[];
  related: VideoCard[];
}

/* ── Magazine ────────────────────────────────────────────── */

export type MagazineRole = "cover" | "featured" | "mentioned";

export interface MagazineFlipbook {
  publuu_account_id?: number | string | null;
  publuu_flipbook_id?: number | string | null;
  url?: string | null;
}

export interface MagazineIssue {
  id: number;
  slug: string;
  title: string;
  issue_number: number | null;
  cover_image: string | null;
  publish_date: string | null;
  short_description: string | null;
  is_featured?: boolean;
  flipbook: MagazineFlipbook | null;
}

export interface MagazineIssueDetail extends MagazineIssue {
  features: (PageRef & { role: MagazineRole; page_number: number | null })[];
}

/* ── Search ──────────────────────────────────────────────── */

export interface SearchTopic {
  id: number;
  name: string;
  slug: string;
  cover_image: string | null;
  tile_image?: string | null;
}

export interface SearchResults {
  topics: Paged<SearchTopic>;
  professionals: Paged<ProfileCard>;
  brands: Paged<ProfileCard>;
  products: Paged<ProductCard>;
  articles: Paged<ArticleCard>;
  videos: Paged<VideoCard>;
}

export type SearchGroup = keyof SearchResults;

/* ── Sitemap feed ────────────────────────────────────────── */

export interface SitemapEntry {
  id: number;
  slug: string | null;
  updated_at: string | null;
  type?: ProfileType;
}

export interface SitemapFeed {
  articles: SitemapEntry[];
  topics: SitemapEntry[];
  profiles: SitemapEntry[];
  products: SitemapEntry[];
  videos: SitemapEntry[];
  issues: SitemapEntry[];
}
