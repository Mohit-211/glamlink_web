import { cache } from "react";
import slugify from "slugify";
import { getAllTopics, getTopicById, getTopicParagraphs, getBlogsById } from "@/api/Api";

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
  email?: string;
  business_name?: string;
  professional_title?: string | null;
  profile_image?: string | null;
  primary_specialty?: string | null;
  specialties?: string;
  locations?: TopicExpertLocation[];
  business_card_link?: string;
  business_card_qr?: string | null;
}

/**
 * The raw row `journal/topic/:id`'s `professionals` relation actually
 * returns is a full internal user account record — password hash, Stripe/
 * Square customer ids, FCM/remember tokens, and more. None of that should
 * ever reach a Server/Client boundary, get logged, or get spread into a
 * component prop. This allowlists only what the UI is meant to show.
 */
interface RawTopicProfessional {
  id: number;
  name?: string;
  user_name?: string;
  email?: string;
  business_card?: {
    name?: string;
    business_name?: string;
    professional_title?: string;
    profile_image?: string;
    specialties?: string;
    locations?: TopicExpertLocation[];
    business_card_link?: string;
    business_card_qr?: string;
  } | null;
}

function toSafeTopicExpert(raw: RawTopicProfessional): TopicExpert {
  const card = raw.business_card;
  return {
    id: raw.id,
    name: card?.name || raw.name || raw.user_name || "Glamlink Professional",
    email: raw.email,
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

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  cover_image?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // Only populated when fetched via getTopicById (topic detail), not the list endpoint.
  journals?: TopicJournal[];
  // Raw rows from the API — see toSafeTopicExpert for why these must never
  // be used directly; always go through getTopicExperts() instead.
  professionals?: RawTopicProfessional[];
  shops?: unknown[];
  podcasts?: unknown[];
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
  return image.startsWith("http") ? image : `https://glamlink.net${image}`;
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
  try {
    const res = await getAllTopics();
    const rows: Topic[] = Array.isArray(res?.data) ? res.data : [];
    return rows.filter((topic) => topic?.is_active !== false);
  } catch (error) {
    console.error("Failed to load topics:", error);
    return [];
  }
});

/**
 * Resolves a route param (numeric id or slug) to the full topic detail,
 * including its real `journals` / `professionals` / `shops` / `podcasts`
 * relations — those are only present on the single-topic endpoint, not
 * the list endpoint, so this always fetches the detail once an id is known.
 */
export const resolveTopic = cache(
  async (idParam: string): Promise<Topic | null> => {
    let topicId: number | null = /^\d+$/.test(idParam) ? Number(idParam) : null;

    if (topicId == null) {
      const topics = await getTopicsList();
      const found = topics.find(
        (topic) => topic.slug === idParam || String(topic.id) === idParam
      );
      if (!found) return null;
      topicId = found.id;
    }

    try {
      const res = await getTopicById(topicId);
      console.log(res,"res===>")
      if (res?.data?.id) return res.data as Topic;
    } catch (error) {
      console.error("Failed to load topic detail:", error);
    }

    // Detail call failed for some reason — fall back to the lightweight list entry.
    const topics = await getTopicsList();
    return topics.find((topic) => topic.id === topicId) ?? null;
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

/** The topic's own `professionals` relation is the source of truth for Expert Insights — mapped through toSafeTopicExpert so raw account fields (password hash, Stripe ids, tokens, ...) never leave this function. */
export function getTopicExperts(topic: Topic): TopicExpert[] {
  if (!Array.isArray(topic.professionals)) return [];
  return topic.professionals.slice(0, 6).map(toSafeTopicExpert);
}

/** Author-written paragraphs for a topic, from `GET journal/topic/:id/paragraphs`. */
export const getTopicParagraphsList = cache(
  async (topicId: number): Promise<TopicParagraph[]> => {
    try {
      const res = await getTopicParagraphs(topicId);
      const rows: TopicParagraph[] = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.rows)
          ? res.data.rows
          : [];

      // eslint-disable-next-line no-console
      console.log(`[getTopicParagraphsList] topic ${topicId} — raw rows:`, rows);

      const withText = rows.filter((p) => !!getParagraphText(p));

      // eslint-disable-next-line no-console
      console.log(
        `[getTopicParagraphsList] topic ${topicId} — ${withText.length}/${rows.length} rows had extractable text`,
        withText
      );

      return withText;
    } catch (error) {
      console.error("Failed to load topic paragraphs:", error);
      return [];
    }
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
