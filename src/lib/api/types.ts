/**
 * Shapes of the backend's public answers, as listed in the backend's
 * docs/handoff/website-frontend.md (section 10). Only the fields the website
 * reads are typed; the API may send more.
 */

import type { EducationCard, ProfileMedia, ProfileQuickInfo, ShippingOption } from "./profileContent";

export type { EducationCard, EducationDetail, EducationVideo, ProfileMedia, ProfileQuickInfo } from "./profileContent";

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
  /** Since Nov 3: the lowest and highest price in the shop; null when no product has one. */
  price?: { min: number; max: number } | null;
}

/** How `GET /discover/shop` orders its rows (Nov 3); without one, the admins' order (or the saved ids' order). */
export type ShopSort = "featured" | "newest" | "price_asc" | "price_desc" | "name";

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
  /** Since Nov 3: a brand's category key or a professional's specialty, set on the page. */
  category?: string | null;
  /** "Skincare Brand", or the professional's specialty as they named it. */
  category_label?: string | null;
  /** A brand's shipping key (`BRAND_SHIPPING`). */
  shipping?: string | null;
  /** Miles from the visitor, when the list was asked with their point; null without coordinates. */
  distance_miles?: number | null;
}

/** How `GET /profiles` orders its rows (`nearest` needs the visitor's point). */
export type ProfileSort = "recommended" | "newest" | "name" | "nearest";

export interface FilterCount {
  name: string;
  count: number;
}

export interface KeyedFilterCount {
  key: string;
  label: string;
  count: number;
}

/** `GET /directory/filters?type=individual`: what the Professionals page can be narrowed by. */
export interface ProfessionalFilters {
  type: "individual";
  count: number;
  specialties: FilterCount[];
  /** `code` is null for a place outside the U.S. states, named as written. */
  states: { code: string | null; name: string; count: number; cities: FilterCount[] }[];
}

/** `GET /directory/filters?type=brand`: every category and shipping choice, with how many brands have it. */
export interface BrandFilters {
  type: "brand";
  count: number;
  categories: KeyedFilterCount[];
  shipping: KeyedFilterCount[];
}

/** A pin of `GET /directory/map`: a professional's page, at their main location (rounded to about 100 m). */
export interface MapPin {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  specialty: string | null;
  city: string | null;
  state: string | null;
  latitude: number;
  longitude: number;
}

/** A Google listing of `GET /directory/google`. */
export interface GoogleListing {
  place_id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  rating?: number | null;
  review_count?: number | null;
  photo_url?: string | null;
  maps_url?: string | null;
  website?: string | null;
  type?: string | null;
  distance_miles?: number | null;
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
  /** Every video the account is in, of any series (the podcast's episodes too). */
  videos: Paged<VideoCard>;

  /*
   * Added on Nov 3 (profile pages for brands and professionals). An API deployed
   * before then leaves them out, so each is optional and the page hides what is
   * missing.
   */
  /** The hero's short intro: the page's, else the card bio as plain text (at most 300 characters). */
  intro?: string | null;
  /** A brand's category key, or a professional's specialty name. */
  category?: string | null;
  /** "Skincare Brand", or the professional's specialty. */
  category_label?: string | null;
  shipping?: ShippingOption | null;
  shipping_label?: string | null;
  /** The About section's picture (the page's, else the first gallery image, else the card's cover photo). */
  about_image?: string | null;
  /** The automatic Quick Info lines. */
  quick_info?: ProfileQuickInfo | null;
  /** The first 5 of the gallery (the Access card's gallery until the owner adds their own). */
  media?: Paged<ProfileMedia> | null;
  /** The first 3 published education posts. */
  education?: Paged<EducationCard> | null;
  /** The newest episode of The Beauty Vault the account is in. */
  podcast?: Paged<VideoCard> | null;
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
