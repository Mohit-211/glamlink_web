"use client";

import Image from "next/image";
import MagazineLink from "../../shared/MagazineLink";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface FeaturedStory {
  title: string;
  description: string;
  image: any;
  profileName: string;
  profileImage?: any;
  badge?: string;
  link?: any;
}

interface FeaturedThisWeekProps {
  stories?: FeaturedStory[];
  title?: string;
  className?: string;
  backgroundColor?: string;
}

export default function FeaturedThisWeek({ 
  stories,
  title = "⭐ Featured This Week",
  className = "",
  backgroundColor = "bg-white"
}: FeaturedThisWeekProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-2xl font-bold mb-6 text-center">{title}</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((featured, index) => (
          <div 
            key={index} 
            className={`rounded-xl overflow-hidden shadow-lg ${backgroundColor}`}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={getImageUrl(featured.image) || "/images/placeholder.png"}
                alt={featured.title}
                fill
                className={getImageObjectFit(featured.image) === "cover" ? "object-cover" : "object-contain"}
                style={{
                  objectPosition: getImageObjectPosition(featured.image),
                }}
              />
              {featured.badge && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1.5 bg-white text-gray-900 rounded-full text-sm font-bold shadow-lg border border-gray-100">
                  <span>{featured.badge}</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h4 className="font-bold mb-2">{featured.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{featured.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {featured.profileImage && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={getImageUrl(featured.profileImage) || "/images/placeholder.png"}
                        alt={featured.profileName}
                        fill
                        className={getImageObjectFit(featured.profileImage) === "cover" ? "object-cover" : "object-contain"}
                        style={{
                          objectPosition: getImageObjectPosition(featured.profileImage),
                        }}
                      />
                    </div>
                  )}
                  <span className="text-sm font-medium">{featured.profileName}</span>
                </div>
                
                {featured.link && (
                  <MagazineLink 
                    field={featured.link} 
                    className="text-glamlink-teal hover:text-glamlink-purple transition-colors text-sm font-medium"
                  >
                    View →
                  </MagazineLink>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}