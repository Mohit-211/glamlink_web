/**
 * A profile's own content (Nov 2026): its Media & Images gallery and its Education posts, as the API answers them,
 * plus the lists the page's Quick Info reads from. Shared by the public profile pages and the owner's dashboard.
 */

/** One item of a profile's gallery. A card-gallery fallback row has `source: "card"`. */
export interface ProfileMedia {
  id: number;
  kind: "image" | "video";
  source: "upload" | "youtube" | "vimeo" | "card";
  /** The image, the MP4, or the YouTube/Vimeo watch link. */
  url: string;
  /** A video's poster or the provider's thumbnail; null for images (use `url`). */
  thumbnail: string | null;
  /** The YouTube/Vimeo player link; null otherwise. */
  embed_url: string | null;
  caption: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export interface EducationVideo {
  source: "upload" | "youtube" | "vimeo";
  url: string;
  embed_url: string | null;
  thumbnail: string | null;
  duration_seconds: number | null;
}

/** An education post as lists show it. A video's cover falls back to its thumbnail. */
export interface EducationCard {
  id: number;
  slug: string;
  kind: "video" | "article";
  title: string;
  summary: string | null;
  cover_image: string | null;
  video: EducationVideo | null;
  published_at: string | null;
}

/** One post's own page. `body` is the article's HTML, cleaned by the API (render it through DOMPurify too). */
export interface EducationDetail extends EducationCard {
  body: string | null;
  page: { slug: string; name: string; type: "individual" | "brand"; image: string | null };
}

/** The owner's (and an admin's) view of a gallery item. */
export interface OwnerMedia extends ProfileMedia {
  is_hidden: boolean;
  sort_order: number;
  created_at: string;
}

/** The owner's (and an admin's) view of an education post; drafts included. */
export interface OwnerEducation extends EducationCard {
  status: "draft" | "published";
  sort_order: number;
  created_at: string;
  updated_at: string;
  body?: string | null;
}

/** The automatic Quick Info lines. */
export interface ProfileQuickInfo {
  has_education: boolean;
  on_podcast: boolean;
  in_journal: boolean;
}

/** A brand's category: the key the API stores, and its label ("Skincare" shows as "Skincare Brand"). */
export const BRAND_CATEGORIES = [
  { key: "skincare", label: "Skincare" },
  { key: "haircare", label: "Haircare" },
  { key: "makeup", label: "Makeup" },
  { key: "nails", label: "Nails" },
  { key: "body", label: "Body & Bath" },
  { key: "fragrance", label: "Fragrance" },
  { key: "wellness", label: "Wellness & Supplements" },
  { key: "devices", label: "Devices & Tools" },
] as const;

export type ShippingOption = "local" | "nationwide" | "international";

export const SHIPPING_OPTIONS: { value: ShippingOption; label: string }[] = [
  { value: "local", label: "Local pickup or delivery" },
  { value: "nationwide", label: "Ships nationwide" },
  { value: "international", label: "Ships internationally" },
];

/** The podcast's series in the API (The Beauty Vault). */
export const PODCAST_SERIES = "beauty-vault-podcast";
