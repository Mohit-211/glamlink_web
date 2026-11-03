import type { ProfileMedia } from "@/lib/api/types";

/*
 * How a gallery item or an education video plays: an uploaded MP4 in <video>, a
 * YouTube or Vimeo link in the provider's player. Players load only from the
 * providers' own hosts, whatever link the API holds.
 */

const PLAYER_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
]);

const YOUTUBE_ID = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i;
const VIMEO_ID = /vimeo\.com\/(?:video\/|channels\/[\w-]+\/)?(\d+)/i;

function parseUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

/** Whether a link is a YouTube or Vimeo player (an iframe a post's body may keep). */
export function isPlayerLink(value: string | null | undefined) {
  const url = parseUrl(value);
  return url !== null && url.protocol === "https:" && PLAYER_HOSTS.has(url.hostname);
}

/** The provider's player link for a YouTube or Vimeo link, or null. */
function playerFromWatchLink(link: string) {
  const youtube = YOUTUBE_ID.exec(link)?.[1];
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube}`;
  const vimeo = VIMEO_ID.exec(link)?.[1];
  return vimeo ? `https://player.vimeo.com/video/${vimeo}` : null;
}

export type Player = { type: "embed"; src: string } | { type: "file"; src: string };

/**
 * The player for a video: the API's embed link (or one built from the watch
 * link) for YouTube and Vimeo, else the file itself. Null when nothing can play.
 */
export function playerFor(
  video: { source: string; url: string; embed_url: string | null },
  { autoplay = false }: { autoplay?: boolean } = {}
): Player | null {
  if (video.source === "youtube" || video.source === "vimeo" || video.embed_url) {
    const link = video.embed_url ?? playerFromWatchLink(video.url);
    const embed = isPlayerLink(link) ? parseUrl(link) : null;
    if (!embed) return null;
    if (autoplay) embed.searchParams.set("autoplay", "1");
    if (embed.hostname.includes("youtube")) embed.searchParams.set("rel", "0");
    return { type: "embed", src: embed.toString() };
  }
  const file = parseUrl(video.url);
  return file ? { type: "file", src: file.toString() } : null;
}

/** The picture a gallery tile shows: the image, or a video's poster (null when a video has none). */
export const mediaThumb = (item: ProfileMedia) => (item.kind === "image" ? item.url : item.thumbnail);

/** Words for a gallery item, for its tile and the lightbox. */
export const mediaLabel = (item: ProfileMedia, index: number, total: number) =>
  `${item.kind === "video" ? "Video" : "Photo"} ${index + 1} of ${total}${item.caption ? `: ${item.caption}` : ""}`;
