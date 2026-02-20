'use client';

import StyledDigitalBusinessCard from './StyledDigitalBusinessCard';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

interface DigitalBusinessCardPageProps {
  professional: Professional;
  className?: string;
}

export default function DigitalBusinessCardPage({
  professional,
  className
}: DigitalBusinessCardPageProps) {
  // Render styled digital business card matching apply page preview design
  return (
    <div className="min-h-screen py-8">
      <div className="w-full lg:container lg:mx-auto px-4">
        <StyledDigitalBusinessCard
          professional={professional}
          className={className}
        />
      </div>
    </div>
  );
}