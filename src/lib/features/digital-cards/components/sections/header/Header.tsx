"use client";

import { Star, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CardActionButtons } from "../actions";

interface HeaderFieldConfig {
  field: keyof Professional | string;
  className?: string;
  format?: 'text' | 'link' | 'rating' | 'instagram' | 'tiktok' | 'firstSocialHandle' | 'businessHours' | 'tags';
  showLabel?: boolean;
  hide?: boolean; // Hide this field from header display
  limit?: number; // Limit the number of items displayed (for arrays)
}

interface HeaderProps {
  professional: Professional;
  fields?: HeaderFieldConfig[];
  onClose?: () => void;
  // Action button props
  showActionButtons?: boolean;
  onCopyUrl?: () => void;
  isCopied?: boolean;
  onSaveImage?: () => void;
  isSaving?: boolean;
}

export default function Header({
  professional,
  fields = [],
  onClose,
  showActionButtons = false,
  onCopyUrl,
  isCopied = false,
  onSaveImage,
  isSaving = false,
}: HeaderProps) {
  // Default field configuration
  // Social links priority: Instagram first, Website second, then enhanced links
  const defaultFields: HeaderFieldConfig[] = [
    {
      field: 'name',
      className: 'text-xl md:text-2xl font-bold text-gray-900 mb-1',
      format: 'text'
    },
    {
      field: 'title',  // This serves as "occupation"
      className: 'text-base md:text-lg text-gray-700 mb-1',
      format: 'text'
    },
    {
      field: 'business_name',
      className: 'text-sm md:text-base text-gray-600 mb-1',
      format: 'text'
    },
    {
      field: 'instagram',
      className: 'text-glamlink-teal hover:text-glamlink-teal-dark transition-colors text-xs md:text-sm',
      format: 'instagram'
    },
    {
      field: 'tiktok',
      className: 'text-glamlink-teal hover:text-glamlink-teal-dark transition-colors text-xs md:text-sm',
      format: 'tiktok'
    },
    {
      field: 'website',
      className: 'text-glamlink-teal hover:text-glamlink-teal-dark transition-colors text-xs md:text-sm',
      format: 'link'
    },
    {
      field: 'enhancedSocialLinks',
      className: 'text-glamlink-teal hover:text-glamlink-teal-dark transition-colors text-xs md:text-sm',
      format: 'firstSocialHandle',
      limit: 3
    },
    {
      field: 'businessHours',
      className: 'text-sm text-gray-600',
      format: 'businessHours',
      hide: true
    },
    {
      field: 'tags',
      className: 'text-sm text-gray-600',
      format: 'tags'
    }
  ];

  // Use provided fields or default to defaultFields
  const headerFields = fields.length > 0 ? fields : defaultFields;

  // Get field value from professional object
  const getFieldValue = (field: keyof Professional | string): any => {
    return professional[field as keyof Professional];
  };

  // Format field value based on format type
  const formatFieldValue = (field: HeaderFieldConfig, value: any): React.ReactNode => {
    const { format, className } = field;

    switch (format) {
      case 'rating':
        if (typeof value === 'number') {
          const hasReviews = value > 0;
          const formattedRating = value.toFixed(1);

          return (
            <div className={className}>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{hasReviews ? formattedRating : 'No Reviews'}</span>
                {hasReviews && professional.reviewCount && (
                  <span className="text-gray-500">({professional.reviewCount} reviews)</span>
                )}
              </div>
            </div>
          );
        }
        return <div className={className}>{value}</div>;

      case 'instagram':
        if (value) {
          const instagramHandle = value.startsWith('@') ? value : `@${value}`;
          const instagramUrl = `https://instagram.com/${instagramHandle.replace('@', '')}`;

          return (
            <div className={className}>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                {instagramHandle}
              </a>
            </div>
          );
        }
        return null;

      case 'tiktok':
        if (value) {
          const tiktokHandle = value.startsWith('@') ? value : `@${value}`;
          const tiktokUrl = `https://www.tiktok.com/${tiktokHandle}`;

          return (
            <div className={className}>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                {tiktokHandle}
              </a>
            </div>
          );
        }
        return null;

      case 'link':
        if (value && typeof value === 'string') {
          return (
            <div className={className}>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-glamlink-teal"
              >
                <ExternalLink className="w-3 h-3" />
                {value.replace(/^https?:\/\//, '')}
              </a>
            </div>
          );
        }
        return <div className={className}>{value}</div>;

      case 'firstSocialHandle':
        if (Array.isArray(value) && value.length > 0) {
          // Apply limit if specified
          const limitedValue = field.limit ? value.slice(0, field.limit) : value;

          return (
            <div className={className}>
              <div className="flex flex-col gap-1">
                {limitedValue.map((link, index) => {
                  const handle = link.handle || link.url;
                  if (link.url) {
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline text-glamlink-teal"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {handle}
                      </a>
                    );
                  }
                  return (
                    <span key={index} className="text-glamlink-teal">
                      {handle}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        }
        return null;

      case 'businessHours':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className={className}>
              <div className="flex flex-wrap gap-2">
                {value.map((hour, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {hour}
                  </span>
                ))}
              </div>
            </div>
          );
        }
        return null;

      case 'tags':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className={className}>
              <div className="flex flex-wrap gap-2">
                {value.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-glamlink-teal bg-opacity-10 text-glamlink-teal text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        }
        return null;

      case 'text':
      default:
        return <div className={className}>{value}</div>;
    }
  };

  
  // Fallback image for profile picture
  const profileImage = professional.profileImage || professional.image ||
    `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="#E5E7EB"/>
        <circle cx="100" cy="80" r="30" fill="#9CA3AF"/>
        <ellipse cx="100" cy="150" rx="50" ry="30" fill="#9CA3AF"/>
      </svg>
    `)}`;

  
  // Extract first name for alt text
  const firstName = professional.name?.split(' ')[0] || 'Professional';

  return (
    <div className="relative w-full p-4 md:p-8 pr-12 md:pr-16">
      {/* Action Buttons - Top Right */}
      {showActionButtons && onCopyUrl && onSaveImage && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
          <CardActionButtons
            onCopyUrl={onCopyUrl}
            isCopied={isCopied}
            onSaveImage={onSaveImage}
            isSaving={isSaving}
            onClose={onClose}
          />
        </div>
      )}

      {/* Header Content */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
        {/* Circular Profile Image */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 flex-shrink-0">
          <div className="relative w-full h-full rounded-full border-4 border-glamlink-teal overflow-hidden">
            <Image
              src={profileImage}
              alt={`${firstName} profile picture`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 208px"
              priority
              onError={(e) => {
                // Fallback to a colored circle if image fails to load
                e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="100" fill="#22B8C8"/>
                    <circle cx="100" cy="80" r="30" fill="white"/>
                    <ellipse cx="100" cy="150" rx="50" ry="30" fill="white"/>
                  </svg>
                `)}`;
              }}
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="flex-1 space-y-1">
          {headerFields
            .filter(fieldConfig => !fieldConfig.hide) // Filter out hidden fields
            .map((fieldConfig, index) => {
              const value = getFieldValue(fieldConfig.field);

              // Skip rendering if value is null/undefined/empty for non-rating fields
              if (value === null || value === undefined ||
                  (value === '' && fieldConfig.format !== 'rating')) {
                return null;
              }

              return (
                <div key={index}>
                  {formatFieldValue(fieldConfig, value)}
                </div>
              );
            })}

          {/* Show placeholder if no fields rendered */}
          {headerFields
            .filter(fieldConfig => !fieldConfig.hide) // Only check visible fields
            .every(field => {
              const value = getFieldValue(field.field);
              return value === null || value === undefined ||
                     (value === '' && field.format !== 'rating');
            }) && (
            <div className="text-gray-500">
              <p className="text-lg font-medium">{professional.name}</p>
              <p className="text-sm">Professional information not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}