import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { PlayCircle, Search } from "lucide-react";
import EmptyState from "@/components/content/EmptyState";
import PageLinks from "@/components/content/PageLinks";
import SectionHeading from "@/components/content/SectionHeading";
import VideoTile from "@/components/content/VideoTile";
import { getVideoSeries, getVideos } from "@/lib/api/public";
import type { VideoSeries } from "@/lib/api/types";
import { SITE_URL } from "@/lib/config";
import { listHref, pageCountFor, pageParam, param, type SearchParams } from "@/lib/searchParams";

const PER_PAGE = 12;

const description =
  "Watch + Learn: podcasts, expert takes, treatment spotlights and industry voices from Glamlink.";

export const metadata: Metadata = {
  title: "Watch + Learn",
  description,
  alternates: { canonical: "/watch" },
  openGraph: { title: "Watch + Learn | Glamlink", description, url: `${SITE_URL}/watch` },
};

function SeriesNav({ series, current }: { series: VideoSeries[]; current: string }) {
  if (series.length === 0) return null;
  return (
    <nav aria-label="Series" className="no-scrollbar -mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 pb-1 sm:flex-wrap sm:justify-center">
        <li className="shrink-0">
          <Link href="/watch" aria-current={!current ? "page" : undefined} className="chip inline-flex rounded-full px-4 py-2 text-sm">
            All
          </Link>
        </li>
        {series.map((s) => (
          <li key={s.id} className="shrink-0">
            <Link
              href={listHref("/watch", { series: s.slug })}
              aria-current={current === s.slug ? "page" : undefined}
              className="chip inline-flex rounded-full px-4 py-2 text-sm"
            >
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The landing view: featured videos, then the newest four of each series. */
async function ByShelf({ series }: { series: VideoSeries[] }) {
  const [featured, ...shelves] = await Promise.all([
    getVideos({ featured: true, limit: 4 }),
    ...series.map((s) => getVideos({ series: s.slug, limit: 4 })),
  ]);
  const anything = featured.rows.length > 0 || shelves.some((shelf) => shelf.rows.length > 0);

  if (!anything) {
    return (
      <EmptyState
        icon={PlayCircle}
        title="Videos are on their way"
        action={
          <Link href="/podcast" className="btn-outline">
            Listen to The Beauty Vault
          </Link>
        }
      >
        New episodes and expert videos land here soon.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-14 md:space-y-20">
      {featured.rows.length > 0 && (
        <section aria-labelledby="watch-featured-heading">
          <SectionHeading id="watch-featured-heading" title="Featured" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.rows.map((video) => (
              <li key={video.id}>
                <VideoTile video={video} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {series.map((s, i) =>
        shelves[i].rows.length > 0 ? (
          <section key={s.id} aria-labelledby={`watch-${s.slug}-heading`}>
            <SectionHeading
              id={`watch-${s.slug}-heading`}
              title={s.name}
              action={
                shelves[i].count > shelves[i].rows.length
                  ? { label: `See all ${shelves[i].count}`, href: listHref("/watch", { series: s.slug }) }
                  : undefined
              }
            />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {shelves[i].rows.map((video) => (
                <li key={video.id}>
                  <VideoTile video={video} showSeries={false} />
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}
    </div>
  );
}

export default async function WatchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const seriesSlug = param(params.series);
  const search = param(params.search);
  const page = pageParam(params.page);

  const series = await getVideoSeries();
  const current = series.find((s) => s.slug === seriesSlug);
  const listing = seriesSlug || search;
  const videos = listing ? await getVideos({ series: seriesSlug, search, page, limit: PER_PAGE }) : null;

  return (
    <div className="pb-20">
      <section aria-labelledby="watch-heading" className="hero-glamlink pb-10 md:pb-14">
        <div className="container-glamlink text-center">
          <p className="eyebrow">Podcasts, Expert Takes, Educational content</p>
          <h1 id="watch-heading" className="hero-title mt-4">
            {current ? current.name : "Watch + Learn"}
          </h1>

          <Form action="/watch" role="search" className="relative mx-auto mt-8 max-w-xl">
            {seriesSlug && <input type="hidden" name="series" value={seriesSlug} />}
            <label htmlFor="watch-search" className="sr-only">
              Search videos
            </label>
            <input
              id="watch-search"
              name="search"
              type="search"
              defaultValue={search}
              maxLength={100}
              placeholder="Search episodes and videos"
              className="input-glamlink h-14 rounded-full pl-6 pr-16 shadow-soft"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-secondary"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </Form>

          <SeriesNav series={series} current={seriesSlug} />
        </div>
      </section>

      <div className="container-glamlink">
        {videos ? (
          <section aria-labelledby="watch-results-heading">
            <SectionHeading
              id="watch-results-heading"
              title={search ? `Videos matching “${search}”` : "All episodes"}
              subtitle={videos.count === 1 ? "1 video" : `${videos.count} videos`}
            />
            {videos.rows.length === 0 ? (
              <EmptyState
                icon={PlayCircle}
                title="No videos match"
                action={
                  <Link href="/watch" className="btn-outline">
                    See all videos
                  </Link>
                }
              >
                Try another search or series.
              </EmptyState>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {videos.rows.map((video) => (
                  <li key={video.id}>
                    <VideoTile video={video} showSeries={!seriesSlug} />
                  </li>
                ))}
              </ul>
            )}
            <PageLinks
              className="mt-12"
              page={page}
              pageCount={pageCountFor(videos.count, PER_PAGE)}
              hrefFor={(p) => listHref("/watch", { series: seriesSlug, search, page: p })}
            />
          </section>
        ) : (
          <ByShelf series={series} />
        )}
      </div>
    </div>
  );
}
