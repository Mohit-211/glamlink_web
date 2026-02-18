"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import HoverGif, { HoverGifRef } from "@/lib/components/HoverGif";
import type { DigitalCardHeroSection as DigitalCardHeroSectionType } from '@/lib/pages/admin/components/content-settings/content/sections/digital-card/types';
import { isDigitalCardHeroSection } from '@/lib/pages/admin/components/content-settings/content/sections/digital-card/types';
import { useVideoInteractions } from "@/lib/pages/apply/featured/hooks/useVideoInteractions";

interface DigitalCardHeroSectionProps {
  section: DigitalCardHeroSectionType | any;
}

/**
 * Digital Card Hero Section
 *
 * Single card layout with text content on left, video preview on right
 */
export function DigitalCardHeroSection({ section }: DigitalCardHeroSectionProps) {
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);

  // Get content early for playDelay (safe because we check section type below)
  const content = isDigitalCardHeroSection(section) ? section.content : null;

  const { videoRefs, sectionRefs } = useVideoInteractions({
    enableScrollPlay: true,
    isMultiSection: true,  // Must be true to use videoRefs/sectionRefs pattern
    playDelay: content?.gifData?.playDelay,
  });

  if (!isDigitalCardHeroSection(section) || !content) {
    return null;
  }

  const handleApplyNow = () => {
    const formElement = document.getElementById('digital-card-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeFullscreen = () => {
    setFullscreenVideo(null);
  };

  return (
    <div className="bg-white">
      {/* Main Hero Section */}
      <div className="container-custom pt-12 pb-8">
        {/* Single Card with Text Left, Video Right */}
        <div
          ref={(el) => {
            if (sectionRefs && el) {
              sectionRefs.current['hero'] = el;
            }
          }}
          data-section-id="hero"
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Accent Header */}
          <div className="bg-glamlink-teal h-2"></div>
          <div className="p-8 md:p-10">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left Side - Text Content */}
              <div className="space-y-6">
                {/* Main Headline */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {content.headline}
                </h1>

                {/* Description Paragraph - renders HTML for bold formatting */}
                <div
                  className="text-gray-700 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content.description || '' }}
                />

                {/* Platform Section Title */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 pt-4">
                  {content.platformTitle}
                </h2>

                {/* Platform Description - renders HTML for bold formatting */}
                <div
                  className="text-gray-700 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content.platformDescription || '' }}
                />

                {/* CTA Button */}
                <div className="pt-4">
                  <button
                    onClick={handleApplyNow}
                    className="px-8 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {content.ctaText}
                  </button>
                </div>
              </div>

              {/* Right Side - Video Preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/20 to-glamlink-pink/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white rounded-2xl p-4 shadow-lg group">
                    <div className="relative">
                      <HoverGif
                        ref={(ref) => {
                          if (ref && videoRefs) {
                            videoRefs.current['hero'] = ref;
                          }
                        }}
                        stillSrc={content.gifData?.stillSrc || '/images/GlamlinkProfile.png'}
                        gifSrc={content.gifData?.gifSrc || '/videos/GlamlinkProfile.mp4'}
                        alt={content.gifData?.alt || 'Glam Card demonstration'}
                        width={400}
                        height={300}
                        responsive={true}
                        className="rounded-lg"
                      />
                      {/* Black Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
                      {/* Fullscreen Icon - Always Visible */}
                      <button
                        onClick={() => setFullscreenVideo(content.gifData?.gifSrc || '/videos/GlamlinkProfile.mp4')}
                        className="absolute bottom-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded-lg opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg z-10"
                        aria-label="View fullscreen"
                      >
                        <Maximize2 className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      {fullscreenVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            aria-label="Close fullscreen"
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <video
            src={fullscreenVideo}
            autoPlay
            loop
            muted
            playsInline
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
