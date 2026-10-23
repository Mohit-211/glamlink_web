import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ArticleTile from "@/components/content/ArticleTile";
import EmptyState from "@/components/content/EmptyState";
import IssueTile from "@/components/content/IssueTile";
import PageLinks from "@/components/content/PageLinks";
import ProductTile from "@/components/content/ProductTile";
import VideoTile from "@/components/content/VideoTile";
import {
  PROFILE_SECTIONS,
  isProfileSection,
  profileSectionHref,
  type ProfileSection,
} from "@/components/profiles/profileSections";
import {
  getProfile,
  getProfileArticles,
  getProfileIssues,
  getProfileProducts,
  getProfileVideos,
} from "@/lib/api/public";
import { SITE_URL } from "@/lib/config";
import { profileHref } from "@/lib/routes";
import { pageCountFor, pageParam, type SearchParams } from "@/lib/searchParams";

const PER_PAGE = 12;

type Params = Promise<{ slug: string; section: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, section } = await params;
  if (!isProfileSection(section)) return { title: "Page not found" };
  const profile = await getProfile(slug);
  if (!profile) return { title: "Page not found" };
  return {
    title: `${PROFILE_SECTIONS[section].title}: ${profile.name}`,
    alternates: { canonical: `${SITE_URL}${profileSectionHref(profile.slug, section)}` },
  };
}

async function loadSection(slug: string, section: ProfileSection, page: number) {
  const query = { page, limit: PER_PAGE };
  switch (section) {
    case "products":
      return { section, list: await getProfileProducts(slug, query) } as const;
    case "articles":
      return { section, list: await getProfileArticles(slug, query) } as const;
    case "videos":
      return { section, list: await getProfileVideos(slug, query) } as const;
    case "magazine":
      return { section, list: await getProfileIssues(slug, query) } as const;
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

  const { title, empty } = PROFILE_SECTIONS[section];
  const pageCount = pageCountFor(loaded.list.count, PER_PAGE);

  return (
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
        ) : loaded.section === "products" ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {loaded.list.rows.map((product) => (
              <li key={product.id}>
                <ProductTile product={product} />
              </li>
            ))}
          </ul>
        ) : loaded.section === "articles" ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loaded.list.rows.map((article) => (
              <li key={article.id}>
                <ArticleTile article={article} />
              </li>
            ))}
          </ul>
        ) : loaded.section === "videos" ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loaded.list.rows.map((video) => (
              <li key={video.id}>
                <VideoTile video={video} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {loaded.list.rows.map((issue) => (
              <li key={issue.id}>
                <IssueTile issue={issue} role={issue.role} pageNumber={issue.page_number} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <PageLinks
        className="mt-12"
        page={page}
        pageCount={pageCount}
        hrefFor={(p) => profileSectionHref(profile.slug, section, p)}
      />
    </div>
  );
}
