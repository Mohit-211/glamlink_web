'use client';

/**
 * Rating - Star rating and review count display
 */

import React from 'react';
import { Star } from 'lucide-react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

export interface RatingProps {
  professional: Professional;
}

export default function Rating({ professional }: RatingProps) {
  if (!professional.rating || professional.rating <= 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2" style={{ marginBottom: '30px' }}>
      <Star className="text-yellow-500 fill-current" style={{ width: '32px', height: '32px' }} />
      <span className="font-semibold text-gray-800" style={{ fontSize: '28px' }}>
        {professional.rating.toFixed(1)}
      </span>
      {professional.reviewCount && (
        <span className="text-gray-500" style={{ fontSize: '24px' }}>
          ({professional.reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
