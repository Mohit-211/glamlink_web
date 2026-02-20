'use client';

/**
 * Contact - Contact information display (location, phone, email, website, Instagram)
 */

import React, { useMemo } from 'react';
import { MapPin, Phone, Mail, Globe, Instagram } from 'lucide-react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

export interface ContactProps {
  professional: Professional;
}

function getLocationDisplay(professional: Professional): string | undefined {
  return professional.location ||
    professional.locationData?.city ||
    professional.locationData?.address?.split(',')[0];
}

export default function Contact({ professional }: ContactProps) {
  const location = getLocationDisplay(professional);

  const instagramHandle = useMemo(() => {
    const socialLink = professional.enhancedSocialLinks?.[0];
    return socialLink?.platform === 'instagram'
      ? socialLink.handle
      : professional.instagram;
  }, [professional.enhancedSocialLinks, professional.instagram]);

  return (
    <div className="flex-1 flex flex-col justify-center" style={{ gap: '20px' }}>
      {/* Location */}
      {location && (
        <div className="flex items-center justify-center gap-3">
          <MapPin className="text-gray-400" style={{ width: '28px', height: '28px' }} />
          <span className="text-gray-600" style={{ fontSize: '26px' }}>
            {location}
          </span>
        </div>
      )}

      {/* Phone */}
      {professional.phone && (
        <div className="flex items-center justify-center gap-3">
          <Phone className="text-gray-400" style={{ width: '28px', height: '28px' }} />
          <span className="text-gray-600" style={{ fontSize: '26px' }}>
            {professional.phone}
          </span>
        </div>
      )}

      {/* Email */}
      {professional.email && (
        <div className="flex items-center justify-center gap-3">
          <Mail className="text-gray-400" style={{ width: '28px', height: '28px' }} />
          <span className="text-gray-600" style={{ fontSize: '26px' }}>
            {professional.email}
          </span>
        </div>
      )}

      {/* Website */}
      {professional.website && (
        <div className="flex items-center justify-center gap-3">
          <Globe className="text-gray-400" style={{ width: '28px', height: '28px' }} />
          <span className="text-glamlink-teal" style={{ fontSize: '26px' }}>
            {professional.website.replace(/^https?:\/\//, '')}
          </span>
        </div>
      )}

      {/* Instagram */}
      {instagramHandle && (
        <div className="flex items-center justify-center gap-3">
          <Instagram className="text-gray-400" style={{ width: '28px', height: '28px' }} />
          <span className="text-glamlink-teal" style={{ fontSize: '26px' }}>
            {instagramHandle.startsWith('@') ? instagramHandle : `@${instagramHandle}`}
          </span>
        </div>
      )}
    </div>
  );
}
