'use client';

/**
 * Specialties - Professional specialties/tags display
 *
 * Supports toggleGroup display options:
 * - showTitle: Controls whether the section title is displayed
 * - showList: Controls whether the specialties list/tags are displayed
 * - showQrCode: Controls whether QR code is displayed
 * - qrCodeLocation: Position of QR code ('right' or 'middle')
 *
 * Also supports:
 * - displayAsList: When true, displays as a vertical list instead of tags
 * - maxItems: Maximum number of specialties to show
 *
 * Layout examples:
 * - qrCodeLocation='right': QR code appears on the right side (80px)
 * - qrCodeLocation='middle': QR code centered between title and list (140px)
 */

import React, { useMemo } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import type { CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/condensedCardConfig';
import { QrCodeDisplay, isValidUrl } from '../../items/QrCodeDisplay';
import { BulletListDisplay } from '../../items/lists';
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_QR_URL = 'https://apps.apple.com/us/app/glamlink/id6502334118';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export interface SpecialtiesProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
  maxItems?: number;
}

export default function Specialties({ professional, section, maxItems = 4 }: SpecialtiesProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('specialties'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract toggleGroup props (new system)
  const showTitle = mergedProps?.showTitle ?? true;
  const showList = mergedProps?.showList ?? true;
  const showQrCode = mergedProps?.showQrCode ?? false;
  const qrCodeUrl = mergedProps?.qrCodeUrl || DEFAULT_QR_URL;
  const qrCodeLocation = mergedProps?.qrCodeLocation ?? 'right';

  // Extract display format props
  const displayAsList = mergedProps?.displayAsList ?? mergedProps?.listFormat ?? false;
  const effectiveMaxItems = mergedProps?.maxItems ?? maxItems;

  // Legacy prop support: hideTitle inverts to showTitle
  const legacyHideTitle = mergedProps?.hideTitle;
  const effectiveShowTitle = legacyHideTitle !== undefined ? !legacyHideTitle : showTitle;

  // Legacy prop support: displayQrCode
  const legacyDisplayQrCode = mergedProps?.displayQrCode;
  const effectiveShowQrCode = legacyDisplayQrCode !== undefined ? legacyDisplayQrCode : showQrCode;

  // Determine if QR code should actually be shown
  const renderQrCode = effectiveShowQrCode && isValidUrl(qrCodeUrl);

  const specialties = useMemo(() => {
    return (professional.specialties || professional.tags || []).slice(0, effectiveMaxItems);
  }, [professional.specialties, professional.tags, effectiveMaxItems]);

  // Determine QR code size based on location
  const qrCodeSize = qrCodeLocation === 'middle' ? 140 : 80;

  // Nothing to display
  if (!effectiveShowTitle && !showList && !renderQrCode) {
    return null;
  }

  // If no specialties but QR code should be shown in middle position
  if (specialties.length === 0 || !showList) {
    if (renderQrCode) {
      return (
        <div className="specialties-section">
          {effectiveShowTitle && (
            <h3 className="text-lg font-semibold text-gray-900 text-center" style={{ marginBottom: '12px' }}>
              {qrCodeLocation === 'middle' ? 'Scan to Connect' : 'Specialties'}
            </h3>
          )}
          {qrCodeLocation === 'middle' ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <QrCodeDisplay url={qrCodeUrl} size={qrCodeSize} />
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <QrCodeDisplay url={qrCodeUrl} size={qrCodeSize} />
            </div>
          )}
        </div>
      );
    }
    // Only title, no list or QR
    if (effectiveShowTitle && specialties.length === 0) {
      return (
        <div className="specialties-section">
          <h3 className="text-lg font-semibold text-gray-900 text-center">Specialties</h3>
          <p className="text-gray-500 text-sm text-center">No specialties added yet</p>
        </div>
      );
    }
    return null;
  }

  // QR code in middle position: Title → QR → List (stacked)
  if (renderQrCode && qrCodeLocation === 'middle') {
    return (
      <div className="specialties-section">
        {effectiveShowTitle && (
          <h3 className="text-lg font-semibold text-gray-900 text-center" style={{ marginBottom: '12px' }}>
            Specialties
          </h3>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <QrCodeDisplay url={qrCodeUrl} size={qrCodeSize} />
        </div>
        {displayAsList ? (
          <BulletListDisplay items={specialties} />
        ) : (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {specialties.map((specialty, index) => (
              <span
                key={index}
                className="bg-glamlink-teal/10 text-glamlink-teal rounded-full font-medium"
                style={{
                  padding: '12px 24px',
                  fontSize: '24px',
                  backgroundColor: 'rgba(34, 184, 200, 0.1)',
                  color: '#22B8C8',
                  borderRadius: '9999px',
                  fontWeight: 500,
                  lineHeight: '1.5',
                }}
              >
                {specialty}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // QR code on right position (or no QR code)
  if (displayAsList) {
    return (
      <div className="specialties-list">
        {effectiveShowTitle && (
          <h3 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '12px' }}>Specialties</h3>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <BulletListDisplay items={specialties} />
          </div>
          {renderQrCode && <QrCodeDisplay url={qrCodeUrl} size={qrCodeSize} />}
        </div>
      </div>
    );
  }

  // Default tags format (with optional QR code on right)
  return (
    <div className="specialties-tags">
      {effectiveShowTitle && (
        <h3 className="text-lg font-semibold text-gray-900 text-center" style={{ marginBottom: '12px' }}>Specialties</h3>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div
          className="flex flex-wrap justify-center"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: renderQrCode ? 'flex-start' : 'center',
            gap: '12px',
            marginBottom: effectiveShowTitle ? '0' : '40px',
            flex: 1,
          }}
        >
          {specialties.map((specialty, index) => (
            <span
              key={index}
              className="bg-glamlink-teal/10 text-glamlink-teal rounded-full font-medium"
              style={{
                padding: '12px 24px',
                fontSize: '24px',
                backgroundColor: 'rgba(34, 184, 200, 0.1)',
                color: '#22B8C8',
                borderRadius: '9999px',
                fontWeight: 500,
                lineHeight: '1.5',
              }}
            >
              {specialty}
            </span>
          ))}
        </div>
        {renderQrCode && <QrCodeDisplay url={qrCodeUrl} size={qrCodeSize} />}
      </div>
    </div>
  );
}
