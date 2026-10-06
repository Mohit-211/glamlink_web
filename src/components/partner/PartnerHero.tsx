"use client";

import type { MouseEvent } from "react";
import { ArrowDown } from "lucide-react";

import CommonHero from "@/components/common/CommonHero";
import { unsplash } from "@/lib/directory/mockData";
import { INQUIRY_SECTION_ID } from "./partnerContent";

export default function PartnerHero() {
  const scrollToInquiry = (event: MouseEvent<HTMLElement>) => {
    const target = document.getElementById(INQUIRY_SECTION_ID);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <CommonHero
      eyebrow="Partnerships"
      title="Partner With"
      titleHighlight="Glamlink"
      description={
        <>
          <p>Connect your brand or business with the beauty + wellness community.</p>
          <p className="mt-4 text-base">
            Glamlink works with brands, professionals, educators and industry partners through
            editorial, podcast, digital and custom partnerships.
          </p>
        </>
      }
      primaryAction={{
        label: (
          <>
            Let&apos;s Work Together
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </>
        ),
        href: `#${INQUIRY_SECTION_ID}`,
        onClick: scrollToInquiry,
      }}
      collage={{
        main: { src: unsplash("1596704017254-9b121068fb31", 700), alt: "Makeup artist holding an eyeshadow palette", label: "Brand Partnerships", priority: true },
        top: { src: "/magazine/issue117.png", alt: "The Glamlink Edit, Issue 117", fit: "contain" },
        bottom: { src: "/magazine/issue115.png", alt: "The Glamlink Edit, Issue 115", fit: "contain" },
        accent: { src: "/podcastcover.png", alt: "The Beauty Vault podcast" },
      }}
    />
  );
}
