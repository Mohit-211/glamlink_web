'use client';
// pages/business-card/[slug]/page.tsx

import GlamCardDesign from "@/components/glamcard/GlamCardDesign";
import { useParams } from "next/navigation";

const BusinessCardPage = () => {
  console.log("hello test in main page ")
  const { slug } = useParams<{ slug: string }>();
console.log(slug,"business card")
  if (!slug) return <p>Invalid slug</p>;

  return <GlamCardDesign slug={slug} />;
};

export default BusinessCardPage;
