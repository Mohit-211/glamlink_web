import React from "react";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";
import PodcastMain from "@/components/Podcast/PodcastPage";


const PodcastPage = () => {
  return (
    <div>
    <PodcastMain/>
      <ConditionalGetFeatured />
    </div>
  );
};

export default PodcastPage;
