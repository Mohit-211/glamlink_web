"use client";

import GlamCardDesign from "@/components/glamcard/GlamCardDesign";

const BusinessCardPageClient = ({ slug }: { slug: string }) => {
  if (!slug) return <p>Invalid slug</p>;

  return <GlamCardDesign slug={slug} />;
};

export default BusinessCardPageClient;
