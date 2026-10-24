import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import JsonLd from "@/components/content/JsonLd";
import VideoTile from "@/components/content/VideoTile";
import type { VideoDetail, VideoRole } from "@/lib/api/types";
import { SITE_URL } from "@/lib/config";
import { formatDate, formatDuration } from "@/lib/format";
import { profileHref, topicHref, videoHref } from "@/lib/routes";

/*
 * One video's page: player, who is in it, description, topics and more from its
 * series. A podcast episode shows it under /podcast, any other video under /watch;
 * each route passes the breadcrumb back to its own listing.
 */

const ROLE_LABEL: Record<VideoRole, string> = { host: "Host", guest: "Guest", featured: "Featured" };

/** The player link: the API's embed link, else one built from the YouTube id. */
function embedSrc(video: VideoDetail) {
  const base = video.embed_url || (video.youtube_id ? `https://www.youtube-nocookie.com/embed/${video.youtube_id}` : "");
  if (!base) return "";
  const url = new URL(base);
  url.searchParams.set("rel", "0");
  return url.toString();
}

/** ISO 8601 duration for structured data: PT1H2M3S. */
function isoDuration(seconds: number | null) {
  if (!seconds) return undefined;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}

export function videoMetadata(video: VideoDetail): Metadata {
  const url = `${SITE_URL}${videoHref(video)}`;
  const description = video.description?.slice(0, 160) || `${video.title} on Glamlink.`;
  return {
    title: video.series?.name ? `${video.title} | ${video.series.name}` : video.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: video.title,
      description,
      url,
      type: "video.episode",
      images: video.thumbnail ? [{ url: video.thumbnail }] : undefined,
    },
  };
}

export default function VideoPage({
  video,
  crumbs,
}: {
  video: VideoDetail;
  /** The listings above this video, outermost first. */
  crumbs: { label: string; href: string }[];
}) {
  const src = embedSrc(video);
  const date = formatDate(video.published_at);
  const duration = formatDuration(video.duration_seconds);
  const paragraphs = (video.description ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="container-glamlink pb-20 pt-24 md:pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: video.title,
          description: video.description || video.title,
          thumbnailUrl: video.thumbnail ? [video.thumbnail] : undefined,
          uploadDate: video.published_at ?? undefined,
          duration: isoDuration(video.duration_seconds),
          embedUrl: src || undefined,
          contentUrl: video.watch_url ?? undefined,
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              <Link href={crumb.href} className="transition-colors hover:text-secondary">
                {crumb.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
        <article className="min-w-0">
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-overlay shadow-large">
            {src ? (
              <iframe
                src={src}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-overlay-foreground/80">
                This video can&apos;t play here.
              </p>
            )}
          </div>

          {video.series && <p className="eyebrow mt-6">{video.series.name}</p>}
          <h1 className="mt-2 text-2xl leading-tight md:text-3xl">{video.title}</h1>
          {(date || duration) && (
            <p className="mt-2 text-sm text-muted-foreground">{[date, duration].filter(Boolean).join(" · ")}</p>
          )}

          {video.people.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="In this video">
              {video.people.map((person) => (
                <li key={`${person.id}-${person.role}`}>
                  <Link
                    href={profileHref(person.slug)}
                    className="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                  >
                    <span className="font-semibold">{person.name}</span>
                    <span className="text-xs opacity-70">{ROLE_LABEL[person.role]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {paragraphs.length > 0 && (
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              {paragraphs.map((text, i) => (
                <p key={i} className="whitespace-pre-line">
                  {text}
                </p>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {video.topics.map((topic) => (
              <Link key={topic.id} href={topicHref(topic)} className="chip inline-flex rounded-full px-3.5 py-1.5 text-sm">
                {topic.name}
              </Link>
            ))}
            {video.watch_url && (
              <a
                href={video.watch_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-glamlink inline-flex items-center gap-1.5 text-sm"
              >
                Watch on YouTube
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </article>

        {video.related.length > 0 && (
          <aside aria-labelledby="related-videos-heading">
            <h2 id="related-videos-heading" className="text-lg">
              More from {video.series?.name ?? "Glamlink"}
            </h2>
            <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {video.related.map((item) => (
                <li key={item.id}>
                  <VideoTile video={item} showSeries={false} sizes="(min-width: 1024px) 320px, 45vw" />
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
