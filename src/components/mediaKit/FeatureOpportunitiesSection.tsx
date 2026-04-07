"use client";

import SectionLabel from "./shared/SectionLabel";
import SectionHeading from "./shared/SectionHeading";
import FeatureCard from "./shared/FeatureCard";

export default function FeatureOpportunitiesSection() {
  const cards = [
    {
      price: "$100",
      title: "Pro Spotlight",
      description: "Highlight your expertise",
      items: ["1-page feature", "Web editorial inclusion", "Client exposure"],
    },
    {
      price: "$250",
      title: "Interview + Feature",
      description: "Authority positioning",
      items: ["Podcast interview", "Web article", "Brand storytelling"],
      featured: true,
      badge: "Popular",
    },
    {
      price: "$550+",
      title: "Cover Feature",
      description: "Premium placement",
      items: ["Cover placement", "Full editorial", "Social amplification"],
    },
    {
      price: "$1500",
      title: "Business Feature",
      description: "Full brand spotlight",
      items: ["Multi-page feature", "Visual showcase", "Trust positioning"],
    },
  ];

  return (
    <section className="section-glamlink container-glamlink">
      <div className="text-center mb-6">
        <SectionLabel>Opportunities</SectionLabel>
        <SectionHeading>Get your story told</SectionHeading>
      </div>

      <p className="text-center text-sm text-muted-foreground mb-8">
        Limited placements. Built for real positioning.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map((c) => (
          <FeatureCard key={c.title} {...c} />
        ))}
      </div>
    </section>
  );
}
