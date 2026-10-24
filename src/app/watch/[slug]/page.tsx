import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PODCAST_SERIES } from "@/components/Podcast/podcastSeries";
import VideoPage, { videoMetadata } from "@/components/content/VideoPage";
import { getVideo } from "@/lib/api/public";
import { videoHref } from "@/lib/routes";
import { listHref } from "@/lib/searchParams";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);
  return video ? videoMetadata(video) : { title: "Video not found" };
}

export default async function WatchVideoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) notFound();

  // The podcast's episodes have their pages on the podcast.
  if (video.series?.slug === PODCAST_SERIES) permanentRedirect(videoHref(video));

  return (
    <VideoPage
      video={video}
      crumbs={[
        { label: "Watch", href: "/watch" },
        ...(video.series ? [{ label: video.series.name, href: listHref("/watch", { series: video.series.slug }) }] : []),
      ]}
    />
  );
}
