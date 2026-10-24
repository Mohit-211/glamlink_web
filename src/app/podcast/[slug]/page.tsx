import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";
import PodcastMain from "@/components/Podcast/PodcastPage";
import VideoPage, { videoMetadata } from "@/components/content/VideoPage";
import { getVideo, getVideos } from "@/lib/api/public";
import { videoHref } from "@/lib/routes";
import { PODCAST_SERIES } from "@/components/Podcast/podcastSeries";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);
  return video ? videoMetadata(video) : {};
}

/**
 * A Beauty Vault episode's page. Links from before episodes came from the API
 * carry a slug the API doesn't know: the podcast page opens those in its player.
 */
export default async function PodcastSlugPage({ params }: { params: Params }) {
  const { slug } = await params;

  const video = await getVideo(slug);
  if (video) {
    // A video from another series has its page under /watch.
    if (video.series?.slug !== PODCAST_SERIES) permanentRedirect(videoHref(video));
    return <VideoPage video={video} crumbs={[{ label: "Podcast", href: "/podcast" }]} />;
  }

  const episodes = await getVideos({ series: PODCAST_SERIES, limit: 50 });

  return (
    <div>
      <PodcastMain initialSlug={slug} episodes={episodes.rows} episodeTotal={episodes.count} />
      <ConditionalGetFeatured />
    </div>
  );
}
