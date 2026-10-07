"use client";

import type { MouseEvent } from "react";
import { ArrowDown, Handshake } from "lucide-react";

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
      className="border-b border-border"
      eyebrow={
        <>
          <Handshake className="w-4 h-4" aria-hidden="true" />
          Partnerships
        </>
      }
      title="Partner With"
      titleHighlight="Glamlink"
      description={
        <>
          <p>Connect your brand or business with the beauty + wellness community.</p>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
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
        main: { src: unsplash("1573496359142-b8d87734a5a2", 700), alt: "Beauty brand founder", label: "Brand Partners", priority: true },
        top: { src: "/magazine/issue117.png", alt: "The Glamlink Edit, Issue 117", fit: "contain" },
        bottom: { src: "/podcastcover.png", alt: "The Beauty Vault podcast cover", fit: "contain" },
        accent: { src: unsplash("1516975080664-ed2fc6a32937", 300), alt: "Makeup brushes" },
      }}
    />
  );
}
