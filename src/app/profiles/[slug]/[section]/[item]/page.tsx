import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, ChevronLeft } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import JsonLd from "@/components/content/JsonLd";
import RichText from "@/components/profiles/RichText";
import { playerFor } from "@/components/profiles/media";
import { clip, profileView } from "@/components/profiles/profileData";
import { educationHref, profileSectionHref } from "@/components/profiles/profileSections";
import { getEducationItem, getProfile } from "@/lib/api/public";
import type { EducationDetail, ProfileDetail } from "@/lib/api/types";
import { SITE_URL } from "@/lib/config";
import { formatDate, formatDuration } from "@/lib/format";
import { profileHref } from "@/lib/routes";
import { htmlToText } from "@/lib/safeHtml";

/*
 * One education post on a profile: /profiles/<page>/education/<post>. It sits
 * under [section] so the page's "View all" lists keep their one dynamic level;
 * any section other than "education" has no posts.
 */

type Params = Promise<{ slug: string; section: string; item: string }>;

const decode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/** The page and the post (both cached and shared by the metadata and the page), or null. */
async function load(slug: string, section: string, item: string) {
  if (section !== "education") return null;
  const [profile, post] = await Promise.all([getProfile(slug), getEducationItem(slug, item)]);
  return profile && post ? { profile, post } : null;
}

const coverOf = (post: EducationDetail) => post.cover_image || post.video?.thumbnail || null;

// Only an article's text shows: a post turned from an article into a video keeps its old text in the API (so turning
// it back restores it), but the dashboard has no text box for videos.
const bodyOf = (post: EducationDetail) => (post.kind === "article" && post.body?.trim() ? post.body : null);

const describe = (post: EducationDetail, profile: ProfileDetail) =>
  clip(post.summary?.trim() || htmlToText(bodyOf(post)) || `${post.title}, from ${profile.name} on Glamlink.`);

/** ISO 8601 duration for structured data: PT1H2M3S. */
function isoDuration(seconds: number | null | undefined) {
  if (!seconds || seconds <= 0) return undefined;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, section, item } = await params;
  const loaded = await load(slug, section, item);
  if (!loaded) return { title: "Page not found" };
  const { profile, post } = loaded;

  const url = `${SITE_URL}${educationHref(profile.slug, post.slug)}`;
  const description = describe(post, profile);
  const image = coverOf(post) || profile.cover_image || profile.image;
  const images = image ? [{ url: image }] : undefined;

  return {
    title: `${post.title} | ${profile.name}`,
    description,
    alternates: { canonical: url },
    openGraph:
      post.kind === "video"
        ? { type: "video.other", title: post.title, description, url, images }
        : { type: "article", title: post.title, description, url, images, publishedTime: post.published_at ?? undefined },
  };
}

/** The post's video: the provider's player, or the uploaded file. */
function Player({ post }: { post: EducationDetail }) {
  const video = post.video;
  const player = video ? playerFor(video) : null;
  if (!video || !player) return null;

  return (
    <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl bg-overlay shadow-large">
      {player.type === "embed" ? (
        <iframe
          src={player.src}
          title={post.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <video
          src={player.src}
          poster={coverOf(post) ?? undefined}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}

export default async function EducationPostPage({ params }: { params: Params }) {
  const { slug, section, item } = await params;
  const loaded = await load(slug, section, item);
  if (!loaded) notFound();
  const { profile, post } = loaded;

  // One address per post: the page's own slug (not a card handle) and the post's own slug
  const href = educationHref(profile.slug, post.slug);
  if (profile.slug !== decode(slug) || post.slug !== decode(item)) permanentRedirect(href);

  const view = profileView(profile);
  const url = `${SITE_URL}${href}`;
  const profileUrl = `${SITE_URL}${profileHref(profile.slug)}`;
  const listHref = profileSectionHref(profile.slug, "education");
  const video = post.kind === "video";
  const cover = coverOf(post);
  const body = bodyOf(post);
  const playable = Boolean(post.video && playerFor(post.video));
  const date = formatDate(post.published_at);
  const duration = formatDuration(post.video?.duration_seconds);
  const description = describe(post, profile);
  const owner = { "@type": view.brand ? "Organization" : "Person", name: profile.name, url: profileUrl };

  return (
    <div className="container-glamlink pb-20 pt-24 md:pt-28">
      <JsonLd
        data={
          video
            ? {
                "@context": "https://schema.org",
                "@type": "VideoObject",
                name: post.title,
                description,
                thumbnailUrl: cover ? [cover] : undefined,
                uploadDate: post.published_at ?? undefined,
                duration: isoDuration(post.video?.duration_seconds),
                embedUrl: post.video?.embed_url ?? undefined,
                contentUrl: post.video?.source === "upload" ? post.video.url : undefined,
                author: owner,
              }
            : {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.title,
                description,
                image: cover ?? undefined,
                datePublished: post.published_at ?? undefined,
                author: owner,
                publisher: { "@type": "Organization", name: "Glamlink", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` } },
                mainEntityOfPage: url,
              }
        }
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: profile.name, item: profileUrl },
            { "@type": "ListItem", position: 2, name: "Education", item: `${SITE_URL}${listHref}` },
            { "@type": "ListItem", position: 3, name: post.title, item: url },
          ],
        }}
      />

      <Link
        href={listHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {profile.name}: Education
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <article className="min-w-0">
          <header className="max-w-3xl">
            <p className="eyebrow">{video ? "Video" : "Article"}</p>
            <h1 className="mt-3 text-3xl leading-tight md:text-4xl lg:text-[2.75rem]">{post.title}</h1>
            {post.summary && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.summary}</p>}
            {(date || duration) && (
              <p className="mt-4 text-sm text-muted-foreground">
                {date && <time dateTime={post.published_at ?? undefined}>{date}</time>}
                {date && duration && " · "}
                {duration}
              </p>
            )}
          </header>

          {playable ? (
            <Player post={post} />
          ) : (
            cover && (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl bg-muted">
                <ApiImage
                  src={cover}
                  alt=""
                  fill
                  preload
                  sizes="(min-width: 1280px) 860px, (min-width: 1024px) 65vw, 100vw"
                  className="object-cover"
                />
              </div>
            )
          )}

          {body && <RichText html={body} variant="article" className="mt-10 max-w-3xl" />}
        </article>

        <aside aria-label={`About ${profile.name}`} className="lg:pt-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:sticky lg:top-28">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-card">
                <ApiImage
                  src={profile.image}
                  alt=""
                  fill
                  sizes="64px"
                  className={view.brand ? "object-contain p-2" : "object-cover"}
                />
              </div>
              <div className="min-w-0">
                <p className="eyebrow">{view.brand ? "Brand" : "Professional"}</p>
                <p className="mt-0.5 truncate text-lg font-semibold leading-snug">{profile.name}</p>
                {view.subtitle.length > 0 && (
                  <p className="truncate text-sm text-muted-foreground">{view.subtitle.join(" | ")}</p>
                )}
              </div>
            </div>
            {(view.intro || profile.tagline) && (
              <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                {view.intro || profile.tagline}
              </p>
            )}
            <Link href={profileHref(profile.slug)} className="btn-primary mt-5 w-full">
              View profile
            </Link>
            <Link href={listHref} className="link-glamlink mt-4 inline-flex items-center gap-1 text-sm">
              More education from {profile.name}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
