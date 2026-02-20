"use client";

import { MagazineIssueSection } from "../../types";
import Image from "next/image";

interface FounderStoryProps {
  section: MagazineIssueSection;
}

export default function FounderStory({ section }: FounderStoryProps) {
  const content = section.content as any;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      {section.title && (
        <h2 className="text-4xl font-bold text-center mb-4">{section.title}</h2>
      )}
      {section.subtitle && (
        <p className="text-xl text-center text-gray-600 mb-12">{section.subtitle}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Founder Image */}
        {content.founderImage && (
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
            <Image
              src={content.founderImage}
              alt={content.founderName || "Founder"}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Story Content */}
        <div className="space-y-6">
          {/* Founder Info */}
          <div>
            {content.founderName && (
              <h3 className="text-3xl font-bold mb-2">{content.founderName}</h3>
            )}
            {content.founderTitle && (
              <p className="text-lg text-gray-600 mb-1">{content.founderTitle}</p>
            )}
            {content.companyName && (
              <p className="text-lg font-semibold text-glamlink-teal">
                {content.companyName}
              </p>
            )}
          </div>

          {/* Quote */}
          {content.quote && (
            <blockquote className="border-l-4 border-glamlink-teal pl-6 py-2 italic text-xl text-gray-700">
              "{content.quote}"
            </blockquote>
          )}

          {/* Story */}
          {content.story && (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.story }}
            />
          )}

          {/* Key Achievements */}
          {content.keyAchievements && content.keyAchievements.length > 0 && (
            <div>
              <h4 className="text-xl font-bold mb-4">Key Achievements</h4>
              <ul className="space-y-2">
                {content.keyAchievements.map((achievement: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-glamlink-teal mr-2">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          {content.socialLinks && (
            <div className="flex gap-4 pt-4">
              {content.socialLinks.instagram && (
                <a
                  href={content.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-glamlink-teal transition-colors"
                >
                  Instagram
                </a>
              )}
              {content.socialLinks.linkedin && (
                <a
                  href={content.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-glamlink-teal transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {content.socialLinks.website && (
                <a
                  href={content.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-glamlink-teal transition-colors"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Images */}
      {content.images && content.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
          {content.images.map((img: any, index: number) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={img.url}
                alt={img.alt || `Image ${index + 1}`}
                fill
                className="object-cover"
              />
              {img.caption && (
                <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
