import React from "react";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";
import PodcastMain from "@/components/Podcast/PodcastPage";

interface PodcastSlugPageProps {
  params: Promise<{ slug: string }>;
}

const PodcastSlugPage = async ({ params }: PodcastSlugPageProps) => {
  const { slug } = await params;
  console.log(slug,"slug")

  return (
    <div>
      <PodcastMain initialSlug={slug} />
      <ConditionalGetFeatured />
    </div>
  );
};

export default PodcastSlugPage;
