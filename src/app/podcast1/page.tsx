import React from "react";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";
import PodcastMain1 from "@/components/Podcast/PodcastPage1";

const PodcastPage = () => {
  return (
    <div>
      <PodcastMain1 />
      <ConditionalGetFeatured />
    </div>
  );
};

export default PodcastPage;
