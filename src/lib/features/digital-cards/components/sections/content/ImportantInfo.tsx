'use client';

/**
 * ImportantInfo - Professional important information display
 *
 * Displays key information items for clients (e.g., "By appointment only", "Cash preferred")
 * as a styled list with teal bullet points.
 *
 * Supports toggleGroup display options:
 * - showTitle: Controls whether the section title is displayed
 * - showList: Controls whether the info list is displayed
 * - showQrCode: Controls whether QR code is displayed
 * - qrCodeLocation: Position of QR code ('right' or 'middle')
 *
 * Also supports:
 * - displayAsList: When true, displays as a vertical list (default: true)
 * - maxItems: Maximum number of items to display
 *
 * Layout examples:
 * - qrCodeLocation='right': QR code appears on the right side (80px)
 * - qrCodeLocation='middle': QR code centered between title and list (140px)
 */

import React, { useMemo, useState, useEffect } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import type { CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/condensedCardConfig';
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';

// =============================================================================
// QR CODE HELPERS
// =============================================================================

const DEFAULT_QR_URL = 'https://apps.apple.com/us/app/glamlink/id6502334118';

/**
 * Validate if a string is a valid URL
 */
function isValidUrl(urlString: string): boolean {
  if (!urlString || urlString.trim() === '') return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Generate QR code URL using QuickChart API with custom color
 * Uses Glamlink teal (#22B8C8) for the QR code color
 */
function getQrCodeUrl(targetUrl: string, size: number = 100): string {
  const encodedUrl = encodeURIComponent(targetUrl);
  return `https://quickchart.io/qr?text=${encodedUrl}&dark=22B8C8&size=${size}&margin=1`;
}

// =============================================================================
// QR CODE COMPONENT
// =============================================================================

interface QrCodeDisplayProps {
  url: string;
  size?: number;
}

function QrCodeDisplay({ url, size = 80 }: QrCodeDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const prevUrlRef = React.useRef<string>(url);

  // Check if image is already loaded (handles hydration case where image loads before React)
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight > 0) {
      setIsLoaded(true);
    }
  }, []);

  // Reset state only when URL actually changes (not on initial mount)
  useEffect(() => {
    if (prevUrlRef.current !== url) {
      setIsLoaded(false);
      setHasError(false);
      prevUrlRef.current = url;
    }
  }, [url]);

  if (!isValidUrl(url)) {
    return null;
  }

  const qrCodeSrc = getQrCodeUrl(url, size);

  return (
    <div className="qr-code-display flex-shrink-0">
      {!isLoaded && !hasError && (
        <div
          className="bg-gray-100 rounded animate-pulse"
          style={{ width: size, height: size }}
        />
      )}
      <img
        ref={imgRef}
        src={qrCodeSrc}
        alt="QR Code"
        width={size}
        height={size}
        className={`rounded ${isLoaded ? 'block' : 'hidden'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div
          className="bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs"
          style={{ width: size, height: size }}
        >
          QR Error
        </div>
      )}
    </div>
  );
}

// =============================================================================
// TYPES
// =============================================================================

export interface ImportantInfoProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
  maxItems?: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ImportantInfo({ professional, section, maxItems = 10 }: ImportantInfoProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('importantInfo'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract toggleGroup props (new system)
  const showTitle = mergedProps?.showTitle ?? true;
  const showList = mergedProps?.showList ?? true;
  const showQrCode = mergedProps?.showQrCode ?? false;
  const qrCodeUrl = mergedProps?.qrCodeUrl || DEFAULT_QR_URL;
  const qrCodeLocation = mergedProps?.qrCodeLocation ?? 'right';

  // Extract display format props
  const displayAsList = mergedProps?.displayAsList ?? mergedProps?.listFormat ?? true;
  const effectiveMaxItems = mergedProps?.maxItems ?? maxItems;

  // Legacy prop support: hideTitle inverts to showTitle
  const legacyHideTitle = mergedProps?.hideTitle;
  const effectiveShowTitle = legacyHideTitle !== undefined ? !legacyHideTitle : showTitle;

  // Legacy prop support: displayQrCode
  // NEW system (showQrCode) takes precedence over legacy (displayQrCode)
  const legacyDisplayQrCode = mergedProps?.displayQrCode;
  const effectiveShowQrCode = mergedProps?.showQrCode !== undefined ? showQrCode : (legacyDisplayQrCode ?? false);

  // Determine if QR code should actually be shown
  const renderQrCode = effectiveShowQrCode && isValidUrl(qrCodeUrl);

  const items = useMemo(() => {
    return (professional?.importantInfo || []).slice(0, effectiveMaxItems);
  }, [professional?.importantInfo, effectiveMaxItems]);

  // Determine QR code size based on location
  const qrCodeSize = qrCodeLocation === 'middle' ? 140 : 80;

  // Nothing to display
  if (!effectiveShowTitle && !showList && !renderQrCode) {
    return null;
  }

  // If no items but QR code should be shown
  if (items.length === 0 || !showList) {
    if (renderQrCode) {
      return (
        <div className="important-info-section">
          {effectiveShowTitle && (
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
              <h3 className="text-base font-semibold text-gray-900 whitespace-nowrap px-2">
                {qrCodeLocation === 'middle' ? 'Scan to Connect' : 'Important Info'}
              </h3>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
            </div>
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
    if (effectiveShowTitle && items.length === 0) {
      return (
        <div className="important-info-section">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
            <h3 className="text-base font-semibold text-gray-900 whitespace-nowrap px-2">
              Important Info
            </h3>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
          </div>
          <p className="text-gray-500 text-sm text-center">No important info added yet</p>
        </div>
      );
    }
    return null;
  }

  // QR code in middle position: Title → QR → List (stacked)
  if (renderQrCode && qrCodeLocation === 'middle') {
    return (
      <div className="important-info-section">
        {effectiveShowTitle && (
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
            <h3 className="text-base font-semibold text-gray-900 whitespace-nowrap px-2">
              Important Info
            </h3>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <QrCodeDisplay url={qrCodeUrl} size={qrCodeSize} />
        </div>
        {displayAsList ? (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginTop: index > 0 ? '8px' : 0,
                  lineHeight: 1.5,
                }}
              >
                <span
                  className="bg-glamlink-teal flex-shrink-0"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#22B8C8',
                    flexShrink: 0,
                    marginTop: '6px',
                  }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {items.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: 'rgba(34, 184, 200, 0.1)',
                  color: '#0d7377',
                  border: '1px solid rgba(34, 184, 200, 0.3)',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // QR code on right position (or no QR code)
  return (
    <div className="important-info-section">
      {effectiveShowTitle && (
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
          <h3 className="text-base font-semibold text-gray-900 whitespace-nowrap px-2">
            Important Info
          </h3>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
        </div>
      )}

      {displayAsList ? (
        // List format: vertical bulleted list with optional QR code
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginTop: index > 0 ? '8px' : 0,
                  lineHeight: 1.5,
                }}
              >
                <span
                  className="bg-glamlink-teal flex-shrink-0"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#22B8C8',
                    flexShrink: 0,
                    marginTop: '6px',
                  }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {renderQrCode && <QrCodeDisplay url={qrCodeUrl} size={qrCodeSize} />}
        </div>
      ) : (
        // Inline format: horizontal tags/pills with optional QR code
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div className="flex flex-wrap gap-2" style={{ flex: 1 }}>
            {items.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: 'rgba(34, 184, 200, 0.1)',
                  color: '#0d7377',
                  border: '1px solid rgba(34, 184, 200, 0.3)',
                }}
              >
                {item}
              </span>
            ))}
          </div>
          {renderQrCode && <QrCodeDisplay url={qrCodeUrl} size={qrCodeSize} />}
        </div>
      )}
    </div>
  );
}
