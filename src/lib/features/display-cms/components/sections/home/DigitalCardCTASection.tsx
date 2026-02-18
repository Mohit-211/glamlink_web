"use client";

import Link from "next/link";
import type { HomeSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import { isDigitalCardCTASection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import HoverGif from "@/lib/components/HoverGif";
import { useVideoInteractions } from "@/lib/pages/apply/featured/hooks/useVideoInteractions";

interface DigitalCardCTASectionProps {
  section: HomeSection;
}

export function DigitalCardCTASection({ section }: DigitalCardCTASectionProps) {
  if (!isDigitalCardCTASection(section)) return null;
  const { content } = section;

  const {
    videoRef,
    sectionRef,
  } = useVideoInteractions({
    videoSrc: content.gifData.gifSrc,
    sectionId: 'digital-card-cta',
    enableScrollPlay: true,
    playDelay: content.gifData.playDelay,
  });

  return (
    <section
      ref={sectionRef}
      data-section-id="digital-card-cta"
      className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left side - Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {content.title}
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content.description}
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-glamlink-teal mb-4">
              {content.subheading}
            </h3>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {content.subDescription}
            </p>

            <Link
              href={content.ctaLink}
              className="inline-block bg-glamlink-teal text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-glamlink-teal/90 transition-colors shadow-lg hover:shadow-xl"
            >
              {content.ctaText}
            </Link>
          </div>

          {/* Right side - Phone Mockup with Gif */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-[280px] md:w-[320px] lg:w-[360px]">
              <HoverGif
                ref={videoRef}
                stillSrc={content.gifData.stillSrc}
                gifSrc={content.gifData.gifSrc}
                alt={content.gifData.alt}
                responsive={true}
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
