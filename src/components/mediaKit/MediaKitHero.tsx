"use client";

import { useRouter } from "next/navigation";
import { issues2026 } from "@/data/issues";
import { unsplash } from "@/lib/directory/mockData";
import CommonHero from "@/components/common/CommonHero";

export default function MediaKitHero() {
  const router = useRouter();

  const handleDigitalEdition = (slug: string) => {
    router.push(`/magazine/${slug}/digital`);
  };

  return (
    <CommonHero
      eyebrow="Partner With Glamlink 2025–2026"
      title="The Glamlink"
      titleHighlight="Edit"
      description={
        <>
          <p className="text-sm uppercase tracking-[0.3em] mb-6">
            Powered by Glamlink • Beauty &amp; Wellness Redefined
          </p>
          <p>
            Glamlink offers opportunities across editorial, podcast, social, digital content, sponsorships and brand partnerships.
          </p>
        </>
      }
      primaryAction={{ label: "Get Featured", onClick: () => router.push("/get-featured") }}
      secondaryAction={{ label: "Explore All Editions", onClick: () => router.push("/magazine") }}
      collage={{
        main: { src: unsplash("1522337360788-8b13dee7a37e", 700), alt: "Editorial hair shoot", label: "Editorial", priority: true },
        top: {
          src: issues2026[1].cover ?? "",
          alt: `${issues2026[1].title} - Digital Edition Cover`,
          fit: "contain",
          onClick: () => handleDigitalEdition(issues2026[1].slug),
        },
        bottom: {
          src: issues2026[0].cover ?? "",
          alt: `${issues2026[0].title} - Digital Edition Cover`,
          fit: "contain",
          onClick: () => handleDigitalEdition(issues2026[0].slug),
        },
        accent: { src: unsplash("1478737270239-2f02b77fc618", 300), alt: "Podcast microphone" },
      }}
    />
  );
}
