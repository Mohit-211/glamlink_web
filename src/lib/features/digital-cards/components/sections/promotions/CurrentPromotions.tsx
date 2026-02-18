"use client";

import React from "react";
import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { SimplePromoCard } from "../../items/promotions";
import { QrCodeDisplay, isValidUrl } from "../../items/QrCodeDisplay";
import type { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';
import { useAppSelector } from "../../../../../../../store/hooks";

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface CurrentPromotionsProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
  className?: string;
}

export default function CurrentPromotions({
  professional,
  section,
  className = ""
}: CurrentPromotionsProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('current-promotions'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract props from section or use defaults
  const hideTitle = mergedProps?.hideTitle ?? false;
  const onlyDisplayTitle = mergedProps?.onlyDisplayTitle ?? false;
  const listFormat = mergedProps?.listFormat ?? false;
  const maxItems = mergedProps?.maxItems ?? undefined;
  const showExpired = mergedProps?.showExpired ?? false;
  const displayQrCode = mergedProps?.displayQrCode ?? false;
  const qrCodeUrl = mergedProps?.qrCodeUrl ?? '';

  // Determine if QR code should be shown (displayQrCode enabled AND valid URL)
  const showQrCode = displayQrCode && isValidUrl(qrCodeUrl);

  const promotions = professional.promotions || [];

  // If no promotions but QR code should be shown, render just the QR code
  if (promotions.length === 0) {
    if (showQrCode) {
      return (
        <div className={`current-promotions ${className}`}>
          {!hideTitle && (
            <h3 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '12px' }}>Scan to Book</h3>
          )}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <QrCodeDisplay url={qrCodeUrl} size={100} />
          </div>
        </div>
      );
    }
    return null;
  }

  // Filter based on showExpired setting
  let filteredPromotions = showExpired
    ? promotions
    : promotions.filter(promotion => promotion.isActive !== false);

  if (filteredPromotions.length === 0) {
    return null;
  }

  // Apply maxItems limit if specified
  if (maxItems !== undefined && maxItems > 0) {
    filteredPromotions = filteredPromotions.slice(0, maxItems);
  }

  // List format with only titles (with optional QR code)
  if (listFormat && onlyDisplayTitle) {
    return (
      <div className={`current-promotions ${className}`}>
        {!hideTitle && (
          <h3 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '12px' }}>Current Promotions</h3>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
            {filteredPromotions.map((promotion, index) => (
              <li
                key={promotion.id}
                className="flex items-start text-gray-700"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginTop: index === 0 ? 0 : '4px',
                  lineHeight: '1.5',
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
                <span>{promotion.title}</span>
              </li>
            ))}
          </ul>
          {showQrCode && <QrCodeDisplay url={qrCodeUrl} size={80} />}
        </div>
      </div>
    );
  }

  // List format with full details (with optional QR code)
  if (listFormat) {
    return (
      <div className={`current-promotions ${className}`}>
        {!hideTitle && (
          <h3 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '12px' }}>Current Promotions</h3>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
            {filteredPromotions.map((promotion, index) => (
              <li
                key={promotion.id}
                className="flex items-start text-gray-700"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginTop: index === 0 ? 0 : '8px',
                  lineHeight: '1.5',
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
                <span>
                  <span style={{ fontWeight: 500 }}>{promotion.title}</span>
                  {promotion.description && (
                    <span style={{ color: '#6B7280' }}> - {promotion.description}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          {showQrCode && <QrCodeDisplay url={qrCodeUrl} size={80} />}
        </div>
      </div>
    );
  }

  // Only display title (card format but minimal, with optional QR code)
  if (onlyDisplayTitle) {
    return (
      <div className={`current-promotions ${className}`}>
        {!hideTitle && (
          <h3 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '12px' }}>Current Promotions</h3>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            {filteredPromotions.map((promotion, index) => (
              <div
                key={promotion.id}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: index === 0 ? 0 : '8px',
                }}
              >
                <p style={{ fontWeight: 500, color: '#111827', margin: 0, lineHeight: '1.5' }}>{promotion.title}</p>
              </div>
            ))}
          </div>
          {showQrCode && <QrCodeDisplay url={qrCodeUrl} size={80} />}
        </div>
      </div>
    );
  }

  // Default: Full card display (with optional QR code)
  return (
    <div className={`current-promotions ${className}`}>
      {!hideTitle && (
        <h3 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '24px' }}>Current Promotions</h3>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          {filteredPromotions.map((promotion, index) => (
            <div
              key={promotion.id}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                overflow: 'hidden',
                marginTop: index === 0 ? 0 : '16px',
              }}
            >
              {/* HTML content takes precedence */}
              {promotion.html ? (
                <div
                  style={{ padding: '24px' }}
                  dangerouslySetInnerHTML={{ __html: promotion.html }}
                />
              ) : (
                // Fallback to simple card when no HTML
                <div style={{ padding: '24px' }}>
                  <SimplePromoCard promotion={promotion} />
                </div>
              )}
            </div>
          ))}
        </div>
        {showQrCode && <QrCodeDisplay url={qrCodeUrl} size={100} />}
      </div>
    </div>
  );
}