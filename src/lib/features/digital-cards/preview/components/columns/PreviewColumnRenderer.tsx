'use client';

import React, { useMemo } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import type { CondensedCardConfig, WebsiteSectionInfo } from '@/lib/features/digital-cards/types';

import { groupSectionsIntoSegments } from './layoutUtils';
import type { LayoutSegment } from './types';

// Section components
import SignatureWorkSection    from '../../sections/SignatureWorkSection';
import MapSection              from '../../sections/MapSection';
import SpecialtiesSection      from '../../sections/SpecialtiesSection';
import ImportantInfoSection    from '../../sections/ImportantInfoSection';
import PromotionsSection       from '../../sections/PromotionsSection';
import BusinessHoursSection    from '../../sections/BusinessHoursSection';

// ────────────────────────────────────────────────
//  Registry
// ────────────────────────────────────────────────
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'signature-work':           SignatureWorkSection,
  'signature-work-actions':   SignatureWorkSection,
  'video-display':            SignatureWorkSection,
  'map':                      MapSection,
  'map-section':              MapSection,
  'mapWithHours':             MapSection,
  'specialties':              SpecialtiesSection,
  'specialties-section':      SpecialtiesSection,
  'importantInfo':            ImportantInfoSection,
  'important-info':           ImportantInfoSection,
  'current-promotions':       PromotionsSection,
  'current-promotions-detailed': PromotionsSection,
  'business-hours':           BusinessHoursSection,
  'overview-stats':           () => null,
};

const DEFAULT_QR_URL = 'https://apps.apple.com/us/app/glamlink/id6502334118';

// ────────────────────────────────────────────────
//  Render one section — no redux
// ────────────────────────────────────────────────
function RenderSection({
  section,
  professional,
  signatureWorkSettings,
  showPromo = false,
  promotionDetails,
  importantInfo,
}: {
  section: WebsiteSectionInfo;
  professional: Partial<Professional>;
  signatureWorkSettings?: any;
  showPromo?: boolean;
  promotionDetails?: string;
  importantInfo?: string[];
}) {
  const type = section.innerSectionType || section.sectionType;
  const propsFromConfig = section.innerSectionProps || section.props || {};

  const qrEnabled = propsFromConfig.showQrCode ?? propsFromConfig.displayQrCode ?? false;
  const qrUrl    = propsFromConfig.qrCodeUrl ?? DEFAULT_QR_URL;

  // Special case: map + hours wrapper
  if (section.sectionType === 'mapAndContentContainer') {
    return (
      <MapSection
        key={section.id}
        professional={professional}
        sectionId="mapWithHours"
        sectionProps={propsFromConfig}
      />
    );
  }

  const Component = SECTION_COMPONENTS[type];
  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing component for section: ${type}`);
    }
    return null;
  }

  const isVideo = type.includes('signature') || type.includes('video');
  const needsQr = type.includes('specialties') || type.includes('importantInfo');

  return (
    <Component
      key={section.id}
      professional={professional}
      sectionId={type}
      sectionProps={propsFromConfig}
      {...(isVideo ? { settings: signatureWorkSettings } : {})}
      {...(needsQr ? { qrCodeEnabled: qrEnabled, qrCodeUrl: qrUrl } : {})}
      {...(type.includes('promotion') ? { showPromo, promotionDetails } : {})}
      {...(type.includes('important') ? { importantInfo } : {})}
    />
  );
}

// ────────────────────────────────────────────────
//  Main layout – no Redux
// ────────────────────────────────────────────────
interface PreviewLayoutProps {
  professional: Partial<Professional>;
  condensedCardConfig?: CondensedCardConfig;
  signatureWorkSettings?: any;
  showPromo?: boolean;
  promotionDetails?: string;
  importantInfo?: string[];
  className?: string;
  forceMobileLayout?: boolean;
}

export function PreviewSegmentedLayout({
  professional,
  condensedCardConfig,
  signatureWorkSettings,
  showPromo = false,
  promotionDetails,
  importantInfo,
  className = '',
  forceMobileLayout = false,
}: PreviewLayoutProps) {
  const effectiveConfig = condensedCardConfig || (professional as any)?.condensedCardConfig;

  const segments = useMemo(
    () => groupSectionsIntoSegments(effectiveConfig),
    [effectiveConfig]
  );

  if (!effectiveConfig || !segments?.segments?.length) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {segments.segments.map((segment: LayoutSegment, idx: number) => (
        <div key={idx}>
          {segment.type === 'full-width' ? (
            <div className="w-full">
              <RenderSection
                section={segment.section}
                professional={professional}
                signatureWorkSettings={signatureWorkSettings}
                showPromo={showPromo}
                promotionDetails={promotionDetails}
                importantInfo={importantInfo}
              />
            </div>
          ) : (
            <div
              className={`
                grid grid-cols-1 gap-6
                ${forceMobileLayout ? '' : 'lg:grid-cols-2'}
                items-start
              `}
            >
              <div className="space-y-6">
                {segment.left.map(sec => (
                  <RenderSection
                    key={sec.id}
                    section={sec}
                    professional={professional}
                    signatureWorkSettings={signatureWorkSettings}
                    showPromo={showPromo}
                    promotionDetails={promotionDetails}
                    importantInfo={importantInfo}
                  />
                ))}
              </div>

              <div className="space-y-6">
                {segment.right.map(sec => (
                  <RenderSection
                    key={sec.id}
                    section={sec}
                    professional={professional}
                    signatureWorkSettings={signatureWorkSettings}
                    showPromo={showPromo}
                    promotionDetails={promotionDetails}
                    importantInfo={importantInfo}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export const PreviewRowBasedLayout = PreviewSegmentedLayout;
export default PreviewSegmentedLayout;