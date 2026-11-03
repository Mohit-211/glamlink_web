import { BRAND_CATEGORIES, PODCAST_SERIES, SHIPPING_OPTIONS } from "@/lib/api/profileContent";
import type { Paged, ProfileDetail, VideoCard } from "@/lib/api/types";
import { formatPlace } from "@/lib/format";
import { htmlToText } from "@/lib/safeHtml";

/*
 * What a profile page shows, read from the API's answer in one place. The fields
 * added on Nov 3 (intro, category, shipping, about image, quick info, media,
 * education, podcast) are missing from an API deployed before then: each falls
 * back to what the older answer holds, or to nothing, and the page hides it.
 */

/** A list as `{ count, rows }`, whatever the API sent (missing, null, or rows without a count). */
export function listOf<T>(value: Paged<T> | null | undefined): Paged<T> {
  const rows = Array.isArray(value?.rows) ? value.rows : [];
  const count = Number(value?.count);
  return { count: Number.isFinite(count) ? Math.max(count, rows.length) : rows.length, rows };
}

export const isPodcastEpisode = (video: VideoCard) => video.series?.slug === PODCAST_SERIES;

/** "Skincare Brand", or a professional's specialty. */
function categoryOf(profile: ProfileDetail) {
  if (profile.category_label) return profile.category_label;
  if (!profile.category) return profile.type === "brand" ? null : profile.specialty || null;
  if (profile.type !== "brand") return profile.category;
  const known = BRAND_CATEGORIES.find((category) => category.key === profile.category);
  return known ? `${known.label} Brand` : null;
}

/** A web link to open in a new tab: as given, with https:// before a bare address, or null. */
function webLink(value: string | null | undefined) {
  const link = value?.trim();
  if (!link) return null;
  if (/^https?:\/\//i.test(link)) return link;
  return /^[\w-]+(\.[\w-]+)+([/?#]\S*)?$/.test(link) ? `https://${link}` : null;
}

const sameWords = (a: string, b: string) =>
  a.replace(/\s+/g, " ").trim().toLowerCase() === b.replace(/\s+/g, " ").trim().toLowerCase();

export function profileView(profile: ProfileDetail) {
  const brand = profile.type === "brand";
  const specialties = (profile.specialties ?? []).filter(Boolean);

  const videos = listOf(profile.videos);
  // The API's podcast list, else the episodes among the first videos (an API from before Nov 3)
  const podcast = profile.podcast
    ? listOf(profile.podcast)
    : listOf({ count: 0, rows: videos.rows.filter(isPodcastEpisode) });
  const journal = listOf(profile.journal);
  const education = listOf(profile.education);
  const media = listOf(profile.media);
  const products = listOf(profile.products);
  const magazine = listOf(profile.magazine);

  const category = categoryOf(profile);
  const shipping =
    profile.shipping_label || SHIPPING_OPTIONS.find((option) => option.value === profile.shipping)?.label || null;

  // "<category> | <first specialty or tagline>", without saying the same thing twice
  const kind = category || (brand ? "Brand" : "Professional");
  const detail = [specialties[0], profile.tagline].find((text) => text?.trim() && !sameWords(text, kind));
  const subtitle = [kind, detail].filter((text): text is string => Boolean(text));

  const quick = profile.quick_info ?? {
    has_education: education.count > 0,
    on_podcast: podcast.count > 0,
    in_journal: journal.count > 0,
  };

  // The intro falls back to the card bio, as the about does: the About section skips words the hero already shows
  const intro = profile.intro?.trim() || null;
  const aboutText = htmlToText(profile.about);
  const aboutRepeatsIntro = Boolean(intro && aboutText && sameWords(intro, aboutText));

  return {
    brand,
    website: webLink(profile.website),
    bookingLink: webLink(profile.booking_link),
    place: formatPlace(profile.location?.city ?? profile.city, profile.location?.state ?? profile.state),
    intro,
    /** The About's rich text; null when it holds no words. */
    about: aboutText ? (profile.about ?? null) : null,
    aboutText,
    aboutRepeatsIntro,
    aboutImage: profile.about_image || null,
    category,
    shipping,
    subtitle,
    specialties,
    topics: profile.topics ?? [],
    social: profile.social ?? [],
    quick,
    media,
    products,
    education,
    podcast,
    journal,
    magazine,
    /** The videos that are not podcast episodes ("Watch"). */
    otherVideos: videos.rows.filter((video) => !isPodcastEpisode(video)),
    videos,
  };
}

export type ProfileView = ReturnType<typeof profileView>;

/** The Access card on this site's own address (the API's link names the live host). */
export const accessCardHref = (profile: ProfileDetail) =>
  profile.access_card?.slug ? `/access/${encodeURIComponent(profile.access_card.slug)}` : null;

/** A phone number as a tel: link. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Text cut at a word, for meta descriptions and structured data. */
export function clip(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 30)).trimEnd()}…`;
}
