"use client";

import { useState } from "react";
import PreviewBlockIntro from "@/lib/pages/apply/featured/PreviewBlockIntro";
import PreviewBlockVideo from "@/lib/pages/apply/featured/PreviewBlockVideo";
import PreviewBlockContent from "@/lib/pages/apply/featured/PreviewBlockContent";
import VideoPreviewContent from "@/lib/pages/apply/featured/VideoPreviewContent";
import { contentSections } from "@/lib/pages/apply/featured/config/contentPreviews";

export default function ContentPreview() {
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <PreviewBlockIntro />
        <PreviewBlockContent
          setFullscreenVideo={setFullscreenVideo}
        />

        {/* Bottom CTA */}
        <div className="mt-16 text-center mb-8">
          <div className="bg-gradient-to-r from-glamlink-teal/10 to-glamlink-pink/10 rounded-3xl p-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Claim My Profile (Free) • Build It For Me (Free)</h3>
              <p className="text-gray-700 mb-6">Free for a limited time. Features publish by editorial approval. Booking/shop are optional.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    const formElement = document.getElementById("get-featured-form");
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-8 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
                >
                  Apply to Get Featured
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Video Dialog */}
        <PreviewBlockVideo
          setFullscreenVideo={setFullscreenVideo}
        />
        <VideoPreviewContent
          fullscreenVideo={fullscreenVideo}
          setFullscreenVideo={setFullscreenVideo}
          contentSections={contentSections}
        />
      </div>
    </section>
  );
}
