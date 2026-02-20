import { useState } from "react";
import { Professional } from "@/lib/pages/for-professionals/types/professional";

interface BioPreviewProps {
  professional: Professional;
  maxLength?: number;
}

export default function BioPreview({ professional, maxLength = 300 }: BioPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullBio = professional.bio || professional.description ||
    `${professional.name} is a certified ${professional.specialty} professional with over ${professional.yearsExperience || 5} years of experience. ` +
    `Specializing in ${professional.specialty?.toLowerCase() || 'beauty'} services, ${professional.name.split(' ')[0]} is dedicated to providing exceptional beauty and wellness services.`;

  const shouldTruncate = fullBio.length > maxLength;
  const displayBio = isExpanded || !shouldTruncate ? fullBio : fullBio.substring(0, maxLength) + "...";

  return (
    <div className="prose max-w-none">
      <h2 className="text-xl font-semibold mb-3">About {professional.name}</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        {displayBio}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-glamlink-teal hover:text-glamlink-teal-dark font-medium text-sm"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}

      {/* Specialty Tags */}
      {professional.specialty && (
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 bg-glamlink-teal bg-opacity-10 text-glamlink-teal rounded-full text-sm">
            {professional.specialty}
          </span>
          {professional.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}