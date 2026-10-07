"use client";

import type { MouseEvent } from "react";
import { ArrowDown } from "lucide-react";

import CommonHero from "@/components/common/CommonHero";
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
      media={
        /* Editorial cover stack */
        <div className="relative h-full w-full">
          <img
            src="/magazine/issue117.png"
            alt="The Glamlink Edit, Issue 117"
            className="absolute right-0 top-0 w-[62%] rounded-2xl object-cover shadow-large rotate-[4deg]"
          />
          <img
            src="/magazine/issue115.png"
            alt="The Glamlink Edit, Issue 115"
            className="absolute left-0 top-[10%] w-[62%] rounded-2xl object-cover shadow-large -rotate-3"
            fetchPriority="high"
          />
          <img
            src="/podcastcover.png"
            alt="The Beauty Vault podcast"
            className="absolute bottom-0 right-[8%] w-[38%] rounded-2xl border-4 border-white object-cover shadow-large"
          />
        </div>
      }
    />
  );
}
