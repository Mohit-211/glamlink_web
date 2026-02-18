"use client";

import { useMemo } from 'react';
import SignatureWork from './SignatureWork';
import { SimpleSpecialtiesDisplay } from '../../items/lists';
import QuickActions from '../QuickActions';
import { BusinessHours } from '../contact';
import { Professional, SubSectionConfig } from "@/lib/pages/for-professionals/types/professional";
import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";

// Default sub-sections configuration
const DEFAULT_SUB_SECTIONS: SubSectionConfig[] = [
  { id: 'video', visible: true, order: 0 },
  { id: 'specialties', visible: true, order: 1 },
  { id: 'business-hours', visible: true, order: 2 },
  { id: 'quick-actions', visible: true, order: 3 }
];

interface SignatureWorkAndActionsProps {
  professional: Professional;
  video?: GalleryItem | null;
  gallery?: GalleryItem[];
  className?: string;
  subSectionsConfig?: SubSectionConfig[];
}

export default function SignatureWorkAndActions({
  professional,
  video,
  gallery,
  className = "",
  subSectionsConfig
}: SignatureWorkAndActionsProps) {
  // Get effective sub-sections config (use provided or defaults)
  const config = useMemo(() => {
    if (!subSectionsConfig || subSectionsConfig.length === 0) {
      return DEFAULT_SUB_SECTIONS;
    }
    return subSectionsConfig;
  }, [subSectionsConfig]);

  // Get sorted visible sub-sections for sidebar
  const sidebarSubSections = useMemo(() => {
    return config
      .filter(s => s.visible && s.id !== 'video') // Video is always in main area
      .sort((a, b) => a.order - b.order);
  }, [config]);

  // Check if video is visible
  const showVideo = useMemo(() => {
    const videoConfig = config.find(s => s.id === 'video');
    return videoConfig?.visible !== false;
  }, [config]);

  // Check if sidebar has any visible items
  const hasSidebar = sidebarSubSections.length > 0;

  // Render a sidebar sub-section by ID
  const renderSidebarSection = (subSection: SubSectionConfig) => {
    switch (subSection.id) {
      case 'specialties':
        return (
          <div key={subSection.id}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
            <SimpleSpecialtiesDisplay specialties={professional.specialties} />
          </div>
        );
      case 'business-hours':
        return (
          <div key={subSection.id}>
            <BusinessHours professional={professional} />
          </div>
        );
      case 'quick-actions':
        return (
          <div key={subSection.id}>
            <QuickActions professional={professional} layout="list" />
          </div>
        );
      default:
        return null;
    }
  };

  // If neither video nor sidebar is visible, return nothing
  if (!showVideo && !hasSidebar) {
    return null;
  }

  return (
    <div className={`signature-work-and-actions ${className}`}>
      <div className={`grid grid-cols-1 ${hasSidebar ? 'md:grid-cols-12' : ''} gap-6`}>
        {/* Left: SignatureWork with Gallery */}
        {showVideo && (
          <div className={hasSidebar ? 'md:col-span-8' : ''}>
            <SignatureWork professional={professional} gallery={gallery} video={video} />
          </div>
        )}

        {/* Right: Sidebar sections - Only visible on desktop (hidden below md breakpoint) */}
        {hasSidebar && (
          <div className={`hidden md:block ${showVideo ? 'md:col-span-4' : 'md:col-span-12'} space-y-6`}>
            {sidebarSubSections.map(subSection => renderSidebarSection(subSection))}
          </div>
        )}
      </div>
    </div>
  );
}
