import { permanentRedirect } from "next/navigation";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";
import PodcastMain from "@/components/Podcast/PodcastPage";
import { getVideo, getVideos } from "@/lib/api/public";
import { videoHref } from "@/lib/routes";
import { PODCAST_SERIES } from "@/components/Podcast/podcastSeries";

interface PodcastSlugPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Episode links from before episodes had pages. When the API knows the episode,
 * it moves to its own page (/watch/<slug>); otherwise the podcast page opens it.
 */
export default async function PodcastSlugPage({ params }: PodcastSlugPageProps) {
  const { slug } = await params;

  const video = await getVideo(slug);
  if (video) permanentRedirect(videoHref(video.slug));

  const episodes = await getVideos({ series: PODCAST_SERIES, limit: 50 });

  return (
    <div>
      <PodcastMain initialSlug={slug} episodes={episodes.rows} episodeTotal={episodes.count} />
      <ConditionalGetFeatured />
    </div>
  );
}
