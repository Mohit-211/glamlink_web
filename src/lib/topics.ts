import { SITE_URL } from "@/lib/config";
import { cache } from "react";
import slugify from "slugify";
import { getBlogsById } from "@/api/Api";
import { getTopic, getTopicParagraphRows, getTopics } from "@/lib/api/public";
import type { ProfileCard, VideoCard } from "@/lib/api/types";

/* --------------------------------
   Types
-------------------------------- */

export interface TopicJournal {
  id: number;
  title: string;
  slug?: string;
  short_description?: string;
  content?: string;
  cover_image?: string;
  publish_date?: string;
  created_at?: string;
  journal_category?: { id?: number; title?: string; slug?: string };
  journal_author?: { name?: string; profile_image?: string | null };
}

export interface TopicExpertLocation {
  address?: string;
  address_line_1?: string;
  city?: string;
  state?: string;
  zip?: string;
  is_primary?: boolean;
}

export interface TopicExpert {
  id: number;
  name: string;
  /** Their page, /profiles/<slug> (since Nov 24). */
  slug?: string | null;
  business_name?: string;
  professional_title?: string | null;
  profile_image?: string | null;
  primary_specialty?: string | null;
  /** A JSON list as text, or the list itself. */
  specialties?: string | string[];
  locations?: TopicExpertLocation[];
  business_card_link?: string;
  business_card_qr?: string | null;
}

/**
 * `journal/topic/:id`'s `professionals` relation: since Nov 24 only those whose
 * page shows, `{ id, name, slug, business_card }`, the card as anyone may see it.
 * This allowlists what the UI shows, so nothing else can reach a component prop.
 */
interface RawTopicProfessional {
  id: number;
  name?: string;
  user_name?: string;
  slug?: string | null;
  business_card?: {
    name?: string;
    business_name?: string;
    professional_title?: string;
    profile_image?: string;
    specialties?: string | string[];
    locations?: TopicExpertLocation[];
    business_card_link?: string;
    business_card_qr?: string;
  } | null;
}

function toSafeTopicExpert(raw: RawTopicProfessional): TopicExpert {
  const card = raw.business_card;
  return {
    id: raw.id,
    slug: raw.slug ?? null,
    name: card?.name || raw.name || raw.user_name || "Glamlink Professional",
    business_name: card?.business_name,
    professional_title: card?.professional_title,
    profile_image: card?.profile_image,
    specialties: card?.specialties,
    locations: card?.locations,
    business_card_link: card?.business_card_link,
    business_card_qr: card?.business_card_qr,
  };
}

/**
 * A snippet of text an author tagged to a topic from within a journal
 * article. `GET journal/topic/:id/paragraphs` does NOT return the
 * paragraph's own text as a field — it returns the paragraph_id plus the
 * full linked journal (including its raw HTML `content`). The actual text
 * lives inside that HTML, marked as
 * `<p class="topic-tagged-paragraph" data-paragraph-id="...">...</p>`,
 * and has to be pulled out by matching `paragraph_id` against that
 * attribute — see extractTaggedParagraphText below.
 */
export interface TopicParagraph {
  id: number;
  journal_id: number;
  topic_id?: number;
  paragraph_id: string;
  sort_order?: number;
  created_at?: string;
  journal?: {
    id: number;
    title?: string;
    slug?: string;
    content?: string;
    journal_author?: { name?: string } | null;
  } | null;
}

/** An entry of the podcast's schedule tied to a topic. */
export interface TopicPodcastGuest {
  id: number;
  name: string;
  short_description: string;
  schedule_date?: string;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  cover_image?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // Only populated when fetched via getTopic (topic detail), not the list endpoint.
  // Since Nov 24 the API answers published, visible content only (its handoff note, section 10.19).
  journals?: TopicJournal[];
  // Raw rows from the API — see toSafeTopicExpert for why these must never
  // be used directly; always go through getTopicExperts() instead.
  professionals?: RawTopicProfessional[];
  /** Products, in the topic's order: JournalShopCard's rows. */
  shops?: unknown[];
  podcasts?: TopicPodcastGuest[];
  /** Since Nov 24: brands whose page shows, as GET /profiles lists them. */
  brands?: ProfileCard[];
  /** Since Nov 24: published videos, newest first (podcast episodes are the `beauty-vault-podcast` series). */
  videos?: VideoCard[];
}

/* --------------------------------
   Fallback imagery — used only when a topic has no cover_image of its
   own, so cards never render broken/missing images.
-------------------------------- */

const FALLBACK_IMAGES = [
  "/assets/blog-1.jpg",
  "/assets/blog-2.jpg",
  "/assets/blog-3.jpg",
  "/assets/blog-4.jpg",
  "/assets/blog-5.jpg",
  "/assets/blog-6.jpg",
];

export function getTopicImage(topic: Pick<Topic, "id" | "cover_image">): string {
  if (topic.cover_image) return topic.cover_image;
  const index = Math.abs(topic.id) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
}

/** Absolute URL for OG/Twitter meta images, regardless of whether the image is a real CMS asset or a local fallback. */
export function getTopicImageUrl(topic: Pick<Topic, "id" | "cover_image">): string {
  const image = getTopicImage(topic);
  return image.startsWith("http") ? image : `${SITE_URL}${image}`;
}

/** Plain-text summary derived from the topic's real rich-text description (for cards/meta), falling back to a generated line only when no description exists. */
export function getTopicSummary(topic: Pick<Topic, "name" | "description">): string {
  if (topic.description) {
    const text = topic.description
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&mdash;/gi, "—")
      .replace(/&rsquo;/gi, "’")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim();
    if (text) return text.length > 200 ? `${text.slice(0, 197).trim()}…` : text;
  }
  return `Expert insights, articles, and trusted professionals for ${topic.name}.`;
}

/* --------------------------------
   Data loaders (request-deduped via React cache)
-------------------------------- */

export const getTopicsList = cache(async (): Promise<Topic[]> => {
  const rows = (await getTopics()) as Topic[];
  return rows.filter((topic) => topic?.is_active !== false);
});

/**
 * Resolves a route param (numeric id or slug) to the full topic detail,
 * including what it gathers (articles, videos, professionals, brands,
 * products, podcast guests): only the single-topic endpoint has those. The API
 * takes a slug since Nov 24; an older one only an id, so a slug it misses is
 * looked up in the list.
 */
export const resolveTopic = cache(
  async (idParam: string): Promise<Topic | null> => {
    const direct = await getTopic<Topic>(idParam);
    if (direct?.id) return direct;
    if (/^\d+$/.test(idParam)) return null;

    const found = (await getTopicsList()).find((topic) => topic.slug === idParam);
    if (!found) return null;
    // Detail call failed for some reason — fall back to the lightweight list entry.
    return (await getTopic<Topic>(found.id)) ?? found;
  }
);

/**
 * The topic's own `journals` relation is the source of truth for related
 * content. Individual entries can be lightweight (id/title/slug only), so
 * any entry missing rich fields is enriched with a single per-article
 * detail fetch — bounded by how many articles are actually tagged with
 * this topic, not the whole journal catalog.
 */
export async function getEnrichedJournals(topic: Topic): Promise<TopicJournal[]> {
  const rows = Array.isArray(topic.journals) ? topic.journals : [];
  if (rows.length === 0) return [];

  const enriched = await Promise.all(
    rows.map(async (row) => {
      if (row.cover_image || row.short_description) return row;
      try {
        const res = await getBlogsById(row.id);
        return res?.data ? { ...row, ...res.data } : row;
      } catch {
        return row;
      }
    })
  );

  return enriched.sort((a, b) => {
    const dateA = a.publish_date ? new Date(a.publish_date).getTime() : 0;
    const dateB = b.publish_date ? new Date(b.publish_date).getTime() : 0;
    return dateB - dateA;
  });
}

/** The topic's own `professionals` relation, in the topic's order — mapped through toSafeTopicExpert so no other card field reaches a component. */
export function getTopicExperts(topic: Topic): TopicExpert[] {
  if (!Array.isArray(topic.professionals)) return [];
  return topic.professionals.map(toSafeTopicExpert);
}

/** The topic's brands (an older API sends none). */
export const getTopicBrands = (topic: Topic): ProfileCard[] => (Array.isArray(topic.brands) ? topic.brands : []);

/** The topic's videos, the podcast's episodes among them (an older API sends none). */
export const getTopicVideos = (topic: Topic): VideoCard[] => (Array.isArray(topic.videos) ? topic.videos : []);

/** The topic's products, in its order. */
export const getTopicProducts = (topic: Topic): unknown[] => (Array.isArray(topic.shops) ? topic.shops : []);

/** The podcast schedule's entries tied to the topic. */
export const getTopicPodcastGuests = (topic: Topic): TopicPodcastGuest[] =>
  Array.isArray(topic.podcasts) ? topic.podcasts : [];

/** Author-written paragraphs for a topic, from `GET journal/topic/:id/paragraphs`. */
export const getTopicParagraphsList = cache(
  async (topicId: number): Promise<TopicParagraph[]> => {
    const data = await getTopicParagraphRows<TopicParagraph[] | { rows?: TopicParagraph[] }>(topicId);
    const rows: TopicParagraph[] = Array.isArray(data) ? data : Array.isArray(data?.rows) ? data.rows : [];
    return rows.filter((p) => !!getParagraphText(p));
  }
);

/**
 * Pulls the plain text out of the `<p data-paragraph-id="...">` block a
 * journal's HTML content tags for this specific paragraph. Falls back to ""
 * (never throws) if the tag can't be found, e.g. the content changed shape.
 */
function extractTaggedParagraphText(content: string, paragraphId: string): string {
  if (!content || !paragraphId) return "";
  const escapedId = paragraphId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `<p[^>]*data-paragraph-id=["']${escapedId}["'][^>]*>([\\s\\S]*?)<\\/p>`,
    "i"
  );
  const match = content.match(regex);
  if (!match) return "";
  return match[1]
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getParagraphText(paragraph: TopicParagraph): string {
  if (!paragraph.journal?.content) return "";
  return extractTaggedParagraphText(paragraph.journal.content, paragraph.paragraph_id);
}

export function getParagraphAuthorName(paragraph: TopicParagraph): string | null {
  return paragraph.journal?.journal_author?.name || null;
}

/** Where clicking this paragraph should redirect to — the same journal article it was written for. */
export function getParagraphJournalHref(paragraph: TopicParagraph): string | null {
  const journalId = paragraph.journal?.id ?? paragraph.journal_id;
  if (!journalId) return null;
  const slug =
    paragraph.journal?.slug ||
    slugify(paragraph.journal?.title || "", { lower: true, strict: true });
  return `/journal/${journalId}/${slug}`;
}
