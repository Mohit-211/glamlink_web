"use client";

import type { MouseEvent } from "react";
import { ArrowDown } from "lucide-react";

import { INQUIRY_SECTION_ID } from "./partnerContent";

export default function PartnerHero() {
  const scrollToInquiry = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(INQUIRY_SECTION_ID);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-background relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28">
      <div className="container-glamlink grid lg:grid-cols-12 gap-14 lg:gap-10 items-center">
        <div className="lg:col-span-7 animate-fade-up">
          <span className="badge-soft text-xs sm:text-sm">Partnerships</span>

          <h1 className="font-display mt-6 text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl font-semibold text-foreground">
            Partner With Glamlink
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-xl">
            Connect your brand or business with the beauty + wellness community.
          </p>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl">
            Glamlink works with brands, professionals, educators and industry partners through
            editorial, podcast, digital and custom partnerships.
          </p>

          <a
            href={`#${INQUIRY_SECTION_ID}`}
            onClick={scrollToInquiry}
            className="btn-primary mt-10 px-8 py-4 uppercase tracking-wider"
          >
            Let&apos;s Work Together
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Editorial cover stack */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto h-[360px] w-full max-w-[420px] sm:h-[460px] lg:h-[520px]">
            <img
              src="/magazine/issue117.png"
              alt="The Glamlink Edit, Issue 117"
              className="absolute right-0 top-0 w-[62%] rounded-2xl object-cover shadow-large rotate-[4deg]"
            />
            <img
              src="/magazine/issue115.png"
              alt="The Glamlink Edit, Issue 115"
              className="absolute left-0 top-[10%] w-[62%] rounded-2xl object-cover shadow-large -rotate-[3deg]"
              fetchPriority="high"
            />
            <img
              src="/podcastcover.png"
              alt="The Beauty Vault podcast"
              className="absolute bottom-0 right-[8%] w-[38%] rounded-2xl border-4 border-white object-cover shadow-large"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
