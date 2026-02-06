'use client';
// pages/business-card/[slug]/page.tsx

import GlamCardDesign from "@/components/glamcard/GlamCardDesign";
import { useParams } from "next/navigation";

const BusinessCardPage = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return <p>Invalid slug</p>;

  return <GlamCardDesign slug={slug} />;
};

export default BusinessCardPage;
