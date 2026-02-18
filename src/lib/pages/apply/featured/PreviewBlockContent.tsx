"use client";

import { useRef, useEffect, useState } from "react";
import HoverGif, { HoverGifRef } from "@/lib/components/HoverGif";
import { Check, Award, Maximize2 } from "lucide-react";
import { getContentSectionsWithIcons, ContentSection } from "./config/contentPreviews";
import { useVideoInteractions } from "./hooks/useVideoInteractions";

interface PreviewBlockContentProps {
  setFullscreenVideo: (videoSrc: string | null) => void;
}

export default function PreviewBlockContent({
  setFullscreenVideo
}: PreviewBlockContentProps) {
  const sectionsWithIcons = getContentSectionsWithIcons();

  const { videoRefs, sectionRefs, handleMouseEnter, handleMouseLeave } = useVideoInteractions({
    enableMobileScroll: true, // Enable mobile scroll-based autoplay
    isMultiSection: true
  });

  return (
    <div className="space-y-12">
      {sectionsWithIcons.map((section: ContentSection) => (
        <div
          key={section.id}
          ref={(el) => {
            if (sectionRefs && el) {
              sectionRefs.current[section.id] = el;
            }
          }}
          data-section-id={section.id}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
          onMouseEnter={() => handleMouseEnter(section.id)}
          onMouseLeave={() => handleMouseLeave(section.id)}
        >
          {/* Section Header */}
          <div className={`${section.color} h-2`}></div>
          <div className="p-8 md:p-10">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Content */}
              <div className="space-y-6">
                <div className={`${section.icon ? 'flex items-center' : ''} gap-4`}>
                  {section.icon && (
                    <div className={`${section.color}/10 p-3 rounded-full text-white`}>{section.icon}</div>
                  )}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{section.title}</h3>
                    {section.subtitle && <p className="text-lg text-gray-600 mt-1">{section.subtitle}</p>}
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed">{section.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-glamlink-teal" />
                    <span className="font-semibold text-gray-900">Key Benefits:</span>
                  </div>
                  <div className="space-y-3">
                    {section.benefits.map((benefit: string, benefitIndex: number) => (
                      <div key={benefitIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-gray-700">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                {section.moreInfo && (
                  <div className="mt-6 p-4 bg-glamlink-teal/5 rounded-lg border border-glamlink-teal/20">
                    <div className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.moreInfo }} />
                  </div>
                )}
              </div>

              {/* Image/GIF Preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/20 to-glamlink-pink/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white rounded-2xl p-4 shadow-lg group">
                    <div className="relative">
                      <HoverGif
                        ref={(ref) => {
                          if (ref && videoRefs) {
                            videoRefs.current[section.id] = ref;
                          }
                        }}
                        stillSrc={section.gifData.stillSrc}
                        gifSrc={section.gifData.gifSrc}
                        alt={section.gifData.alt}
                        width={400}
                        height={300}
                        responsive={true}
                        className="rounded-lg"
                      />
                      {/* Black Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
                      {/* Fullscreen Icon - Always Visible */}
                      <button
                        onClick={() => setFullscreenVideo(section.gifData.gifSrc)}
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
      ))}
    </div>
  );
}