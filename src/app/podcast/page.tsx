import PodcastMain from "@/components/Podcast/PodcastPage";
import React from "react";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";

const PodcastPage = () => {
  return (
    <div>
      <PodcastMain />
      <ConditionalGetFeatured />
    </div>
  );
};

export default PodcastPage;
