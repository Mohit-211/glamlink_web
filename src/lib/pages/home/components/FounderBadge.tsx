"use client";

import { HomePageContent } from "@/lib/config/pageContent";
import { OptimizedImage } from "@/lib/components/ui";

interface FounderBadgeProps {
  content: HomePageContent['founderBadge'];
}

export default function FounderBadge({ content }: FounderBadgeProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom text-center">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <OptimizedImage
              src={content.image}
              alt="Founder Badge"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            {content.title}
          </h2>
          
          <p className="text-lg text-gray-600 mb-6">
            {content.description}
          </p>
          
          <p className="text-lg text-gray-700 font-medium">
            {content.subtext}
          </p>
        </div>
      </div>
    </section>
  );
}