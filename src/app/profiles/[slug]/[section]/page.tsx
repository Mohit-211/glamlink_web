import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ArticleTile from "@/components/content/ArticleTile";
import EmptyState from "@/components/content/EmptyState";
import IssueTile from "@/components/content/IssueTile";
import PageLinks from "@/components/content/PageLinks";
import ProductTile from "@/components/content/ProductTile";
import VideoTile from "@/components/content/VideoTile";
import EducationTile from "@/components/profiles/EducationTile";
import MediaGallery from "@/components/profiles/MediaGallery";
import ProfileTracker from "@/components/profiles/ProfileTracker";
import { isPodcastEpisode } from "@/components/profiles/profileData";
import { trackAs } from "@/components/profiles/profileEvents";
import {
  PROFILE_SECTIONS,
  isProfileSection,
  profileSectionHref,
  type ProfileSection,
} from "@/components/profiles/profileSections";
import { PODCAST_SERIES } from "@/lib/api/profileContent";
import {
  getProfile,
  getProfileArticles,
  getProfileEducation,
  getProfileIssues,
  getProfileMedia,
  getProfileProducts,
  getProfileVideos,
  type PageQuery,
} from "@/lib/api/public";
import { SITE_URL } from "@/lib/config";
import { profileHref } from "@/lib/routes";
import { pageCountFor, pageParam, type SearchParams } from "@/lib/searchParams";

/** Rows per page: the gallery's small tiles fill 24 (6 rows of 4); the other lists 12. */
const PER_PAGE: Record<ProfileSection, number> = {
  media: 24,
  products: 12,
  education: 12,
  articles: 12,
  podcast: 12,
  videos: 12,
  magazine: 12,
};

type Params = Promise<{ slug: string; section: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, section } = await params;
  if (!isProfileSection(section)) return { title: "Page not found" };
  const profile = await getProfile(slug);
  if (!profile) return { title: "Page not found" };
  const { title } = PROFILE_SECTIONS[section];
  return {
    title: `${title}: ${profile.name}`,
    description: `${title} from ${profile.name} on Glamlink.`,
    alternates: { canonical: `${SITE_URL}${profileSectionHref(profile.slug, section)}` },
  };
}

/**
 * The Beauty Vault's episodes the account is in. An API from before Nov 3 ignores
 * the series and answers every video: its episodes are kept, on one page.
 */
async function getPodcastEpisodes(slug: string, query: PageQuery) {
  const list = await getProfileVideos(slug, { ...query, series: PODCAST_SERIES });
  if (list.rows.every(isPodcastEpisode)) return list;
  const rows = list.rows.filter(isPodcastEpisode);
  return { count: rows.length, rows };
}

async function loadSection(slug: string, section: ProfileSection, page: number) {
  const query = { page, limit: PER_PAGE[section] };
  switch (section) {
    case "media":
      return { section, list: await getProfileMedia(slug, query) } as const;
    case "products":
      return { section, list: await getProfileProducts(slug, query) } as const;
    case "education":
      return { section, list: await getProfileEducation(slug, query) } as const;
    case "articles":
      return { section, list: await getProfileArticles(slug, query) } as const;
    case "podcast":
      return { section, list: await getPodcastEpisodes(slug, query) } as const;
    case "videos":
      return { section, list: await getProfileVideos(slug, query) } as const;
    case "magazine":
      return { section, list: await getProfileIssues(slug, query) } as const;
  }
}

type Loaded = Awaited<ReturnType<typeof loadSection>>;

/** One section's rows, each linking (and counted) as on the profile itself. */
function SectionList({ loaded, slug, name }: { loaded: Loaded; slug: string; name: string }) {
  switch (loaded.section) {
    case "media":
      return <MediaGallery items={loaded.list.rows} layout="grid" label={`Photos and videos of ${name}`} />;
    case "products":
      return (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {loaded.list.rows.map((product) => (
            <li key={product.id}>
              <ProductTile product={product} linkData={trackAs("PRODUCT_CLICK", product.id)} />
            </li>
          ))}
        </ul>
      );
    case "education":
      return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loaded.list.rows.map((item) => (
            <li key={item.id}>
              <EducationTile slug={slug} item={item} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
      );
    case "articles":
      return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loaded.list.rows.map((article) => (
            <li key={article.id} {...trackAs("JOURNAL_CLICK", article.id)}>
              <ArticleTile article={article} />
            </li>
          ))}
        </ul>
      );
    case "podcast":
      return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loaded.list.rows.map((video) => (
            <li key={video.id} {...trackAs("PODCAST_CLICK", video.slug)}>
              <VideoTile video={video} showSeries={false} />
            </li>
          ))}
        </ul>
      );
    case "videos":
      return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loaded.list.rows.map((video) => (
            <li key={video.id} {...(isPodcastEpisode(video) ? trackAs("PODCAST_CLICK", video.slug) : {})}>
              <VideoTile video={video} />
            </li>
          ))}
        </ul>
      );
    case "magazine":
      return (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {loaded.list.rows.map((issue) => (
            <li key={issue.id}>
              <IssueTile issue={issue} role={issue.role} pageNumber={issue.page_number} />
            </li>
          ))}
        </ul>
      );
  }
}

export default async function ProfileSectionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<SearchParams>;
}) {
  const { slug, section } = await params;
  if (!isProfileSection(section)) notFound();
  const page = pageParam((await searchParams).page);

  const [profile, loaded] = await Promise.all([getProfile(slug), loadSection(slug, section, page)]);
  if (!profile) notFound();
  // Found by a card handle: send the visitor to the page's own address
  if (profile.slug && profile.slug !== decodeURIComponent(slug)) {
    permanentRedirect(profileSectionHref(profile.slug, section, page));
  }

  const { title, empty } = PROFILE_SECTIONS[section];
  const pageCount = pageCountFor(loaded.list.count, PER_PAGE[section]);

  return (
    <ProfileTracker slug={profile.slug} countView={false}>
      <div className="container-glamlink pb-20 pt-24 md:pt-28">
        <Link
          href={profileHref(profile.slug)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-secondary"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {profile.name}
        </Link>
        <h1 className="mt-4 text-3xl md:text-4xl">{title}</h1>
        <p className="mt-2 text-muted-foreground">
          {loaded.list.count} {loaded.list.count === 1 ? "item" : "items"} for {profile.name}
        </p>

        <div className="mt-10">
          {loaded.list.rows.length === 0 ? (
            <EmptyState title={empty} />
          ) : (
            <SectionList loaded={loaded} slug={profile.slug} name={profile.name} />
          )}
        </div>

        <PageLinks
          className="mt-12"
          page={page}
          pageCount={pageCount}
          hrefFor={(p) => profileSectionHref(profile.slug, section, p)}
        />
      </div>
    </ProfileTracker>
  );
}
