import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";
import PodcastMain from "@/components/Podcast/PodcastPage";
import { PODCAST_SERIES } from "@/components/Podcast/podcastSeries";
import { getVideos } from "@/lib/api/public";

export default async function PodcastPage() {
  const episodes = await getVideos({ series: PODCAST_SERIES, limit: 50 });

  return (
    <div>
      <PodcastMain episodes={episodes.rows} episodeTotal={episodes.count} />
      <ConditionalGetFeatured />
    </div>
  );
}
