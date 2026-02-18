"use client";

import { useState } from "react";
import HoverGif from "@/lib/components/HoverGif";
import { User, Crown, Star, Maximize2 } from "lucide-react";
import VideoPreviewContent from "@/lib/pages/apply/featured/VideoPreviewContent";

export default function ContentPreview2() {
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);

  const features = [
    {
      id: "professional-profile",
      title: "Create Professional Profile",
      subtitle: "Showcase your expertise and attract ideal clients",
      color: "bg-glamlink-teal",
      gifData: {
        stillSrc: "/images/CoverFeatureProPreview.png",
        gifSrc: "/videos/CoverFeatureProPreview.mp4",
        alt: "Professional profile creation demonstration"
      }
    },
    {
      id: "cover-feature",
      title: "Have a Cover Feature",
      subtitle: "Get featured in our premium magazine content",
      color: "bg-glamlink-pink",
      gifData: {
        stillSrc: "/images/CoverFeatureProPreview.png",
        gifSrc: "/videos/CoverFeatureProPreview.mp4",
        alt: "Magazine cover feature demonstration"
      }
    },
    {
      id: "rising-star",
      title: "Been Seen as a Rising Star",
      subtitle: "Gain recognition as an emerging talent in beauty",
      color: "bg-glamlink-purple",
      gifData: {
        stillSrc: "/images/RisingStarPreview.png",
        gifSrc: "/videos/RisingStarPreview.mp4",
        alt: "Rising Star feature demonstration"
      }
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Transform Your Beauty Career
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            When you get featured in Glamlink, your professional information becomes
            a powerful tool for attracting clients and growing your business.
          </p>
              <button
                onClick={() => {
                  const formElement = document.getElementById("get-featured-form");
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors shadow-md hover:shadow-lg"
              >
                Apply Now
              </button>
        </div>

        {/* Single Container with All Features */}
        <div className="bg-gradient-to-br from-glamlink-teal/5 via-white to-glamlink-pink/5 rounded-3xl shadow-lg p-8 md:p-12">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {features.map((feature) => (
              <div key={feature.id} className="text-center space-y-4">
                {/* Title and Subtitle */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.subtitle}
                  </p>
                </div>

                {/* HoverGif Preview */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/20 to-glamlink-pink/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <div className="relative bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <HoverGif
                          stillSrc={feature.gifData.stillSrc}
                          gifSrc={feature.gifData.gifSrc}
                          alt={feature.gifData.alt}
                          width={280}
                          height={200}
                          className="rounded-lg max-lg:w-full max-lg:h-auto"
                          responsive={true}
                        />
                        {/* Fullscreen Icon */}
                        <button
                          onClick={() => setFullscreenVideo(feature.gifData.gifSrc)}
                          className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-md"
                          aria-label="View fullscreen"
                        >
                          <Maximize2 className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                      <div className="mt-2 flex justify-center">
                        <div className="px-2 py-1 bg-glamlink-teal/10 text-glamlink-teal text-xs rounded-full">
                          Hover to preview
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Video Dialog */}
      <VideoPreviewContent
        fullscreenVideo={fullscreenVideo}
        setFullscreenVideo={setFullscreenVideo}
        contentSections={features}
      />
    </section>
  );
}