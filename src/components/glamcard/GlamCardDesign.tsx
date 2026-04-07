'use client';

import React from "react";
import BusinessCardPage from "../BusinessCardPage";

interface Props {
  slug: string;
}

const GlamCardDesign: React.FC<Props> = ({ slug }) => {
  console.log(slug, "slug === in design card");

  if (!slug) {
    return <p className="mt-20 text-center">Invalid slug</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <BusinessCardPage slug={slug} mode="view" />
    </div>
  );
};

export default GlamCardDesign;