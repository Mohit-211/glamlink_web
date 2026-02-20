"use client";

/**
 * MapAndContentContainer - Map with styled content container below
 *
 * Combines:
 * 1. Google Maps display at the top (within the outer container)
 * 2. ContentContainer-style layout below (title + inner section)
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────┐
 * │ OUTER CONTAINER (containerBackground - e.g., gradient) │
 * │ ┌─────────────────────────────────────────────────────┐ │
 * │ │                    MAP                              │ │
 * │ └─────────────────────────────────────────────────────┘ │
 * │                                                         │
 * │                     "Title"                            │
 * │                                                         │
 * │ ┌─────────────────────────────────────────────────────┐ │
 * │ │ INNER SECTION (sectionBackground - typically white) │ │
 * │ │                                                     │ │
 * │ │  • Content items...                                 │ │
 * │ │                                                     │ │
 * │ └─────────────────────────────────────────────────────┘ │
 * └─────────────────────────────────────────────────────────┘
 */

import React from "react";
import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { getSectionById } from "@/lib/features/digital-cards/config/sectionRegistry";
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';
import {
  getBackgroundStyle,
  buildTypographyStyles,
  getTailwindFontClass,
  type TitleTypography,
} from '../utils/helpers';
import { normalizeLocations, getPrimaryLocation } from "@/lib/utils/migrations/locationMigration";
import { useAppSelector } from "../../../../../../../../store/hooks";

// =============================================================================
// TYPES
// =============================================================================

interface MapAndContentContainerProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
}

// =============================================================================
// MAP DISPLAY COMPONENT
// =============================================================================

interface MapDisplayProps {
  professional: Professional;
  mapHeight: number;
  mapBorderRadius: number;
  showAddressOverlay?: boolean;
}

function MapDisplay({ professional, mapHeight, mapBorderRadius, showAddressOverlay = false }: MapDisplayProps) {
  // Get all locations and primary location
  const locations = normalizeLocations(professional);
  const primaryLocation = getPrimaryLocation(locations);
  const isMultiLocation = locations.length > 1;

  if (!primaryLocation?.lat || !primaryLocation?.lng) {
    return (
      <div
        className="bg-gray-100 flex items-center justify-center text-gray-400"
        style={{ height: mapHeight, borderRadius: mapBorderRadius }}
      >
        <span>No location data</span>
      </div>
    );
  }

  // Use Google Static Maps API for static preview
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Build static map URL with all markers
  let staticMapUrl: string | null = null;
  if (apiKey) {
    if (isMultiLocation) {
      // Calculate center point (average of all coordinates)
      const centerLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
      const centerLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

      // Calculate zoom level based on the spread of locations
      const latitudes = locations.map(loc => loc.lat);
      const longitudes = locations.map(loc => loc.lng);
      const latSpread = Math.max(...latitudes) - Math.min(...latitudes);
      const lngSpread = Math.max(...longitudes) - Math.min(...longitudes);
      const maxSpread = Math.max(latSpread, lngSpread);

      // Determine zoom: smaller spread = higher zoom, larger spread = lower zoom
      let zoom = 12; // default
      if (maxSpread < 0.01) zoom = 15;
      else if (maxSpread < 0.05) zoom = 13;
      else if (maxSpread < 0.1) zoom = 12;
      else if (maxSpread < 0.5) zoom = 10;
      else if (maxSpread < 1) zoom = 9;
      else zoom = 8;

      // Build markers - each location gets its own marker parameter for reliability
      const markersParams = locations
        .map(loc => `markers=color:0x22B8C8%7C${loc.lat},${loc.lng}`)
        .join('&');

      staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=${zoom}&size=600x300&scale=2&${markersParams}&key=${apiKey}`;
    } else {
      staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${primaryLocation.lat},${primaryLocation.lng}&zoom=15&size=600x300&scale=2&markers=color:0x22B8C8%7C${primaryLocation.lat},${primaryLocation.lng}&key=${apiKey}`;
    }
  }

  // Build data-locations attribute for preprocessing (multi-location support)
  const dataLocationsJson = isMultiLocation ? JSON.stringify(locations) : undefined;

  return (
    <div
      className="relative overflow-hidden google-maps-display"
      style={{ height: mapHeight, borderRadius: mapBorderRadius }}
      data-lat={primaryLocation.lat}
      data-lng={primaryLocation.lng}
      data-address={primaryLocation.address}
      data-locations={dataLocationsJson}
    >
      {staticMapUrl ? (
        <img
          src={staticMapUrl}
          alt={`Map showing ${isMultiLocation ? `${locations.length} locations` : primaryLocation.address || 'location'}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Map unavailable</span>
        </div>
      )}

      {/* Address Overlay - shows different content for multi-location */}
      {showAddressOverlay && primaryLocation.address && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-2 text-sm">
          {isMultiLocation ? (
            <div className="flex flex-col">
              <span className="font-medium">{locations.length} Locations</span>
              <span className="text-white/80 text-xs">Primary: {primaryLocation.address}</span>
            </div>
          ) : (
            primaryLocation.address
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// TITLE DISPLAY COMPONENT
// =============================================================================

interface TitleDisplayProps {
  title: string;
  alignment: string;
  typography?: TitleTypography;
}

function TitleDisplay({ title, alignment, typography = {} }: TitleDisplayProps) {
  const typographyStyles = buildTypographyStyles(typography);

  // Get Tailwind font class (if font is a Tailwind class like 'font-sans')
  const fontClassName = getTailwindFontClass(typography.fontFamily);

  const baseStyles: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#111827',
    ...typographyStyles,
  };

  if (alignment === 'center-with-lines') {
    return (
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
        <h3 style={baseStyles} className={`whitespace-nowrap px-2 ${fontClassName}`}>
          {title}
        </h3>
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
      </div>
    );
  }

  if (alignment === 'center') {
    return (
      <h3 style={{ ...baseStyles, textAlign: 'center' }} className={`my-4 ${fontClassName}`}>
        {title}
      </h3>
    );
  }

  return (
    <h3 style={baseStyles} className={`my-4 ${fontClassName}`}>
      {title}
    </h3>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MapAndContentContainer({ professional, section }: MapAndContentContainerProps) {
  // READ FROM REDUX - direct selector for live updates (for container props)
  const innerSectionType = section?.props?.innerSectionType ?? null;
  const reduxProps = useAppSelector(selectPropsByInnerSectionType(innerSectionType || 'mapAndContentContainer'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract props with defaults (now using mergedProps)

  // Map settings
  const mapHeight = mergedProps?.mapHeight ?? 150;
  const mapBorderRadius = mergedProps?.mapBorderRadius ?? 8;
  const showAddressOverlay = mergedProps?.showAddressOverlay ?? false;

  // Title settings:
  // - If showCustomTitle is FALSE: use DEFAULT title based on inner section type
  // - If showCustomTitle is TRUE: use the CUSTOM title entered by user
  const showCustomTitle = mergedProps?.showCustomTitle ?? false;
  const customTitle = mergedProps?.title ?? '';

  // Compute title - Map sections typically don't have a default title
  // but inner sections like business-hours might
  let title: string;
  if (showCustomTitle) {
    title = customTitle;
  } else if (innerSectionType === 'business-hours') {
    title = 'Business Hours';
  } else {
    title = ''; // No default title for map container
  }
  const titleAlignment = mergedProps?.titleAlignment ?? 'center-with-lines';

  // Support both nested titleTypography object AND flat individual props
  // Flat props (from sectionPropsConfig) take precedence over nested object
  const titleTypography: TitleTypography = {
    ...(mergedProps?.titleTypography ?? {}),
    // Override with flat props if they exist
    ...(mergedProps?.titleFontFamily && { fontFamily: mergedProps.titleFontFamily }),
    ...(mergedProps?.titleFontSize && { fontSize: mergedProps.titleFontSize }),
    ...(mergedProps?.titleFontWeight && { fontWeight: mergedProps.titleFontWeight }),
    ...(mergedProps?.titleColor && { color: mergedProps.titleColor }),
    ...(mergedProps?.titleTextTransform && { textTransform: mergedProps.titleTextTransform }),
    ...(mergedProps?.titleLetterSpacing && { letterSpacing: mergedProps.titleLetterSpacing }),
  };

  // Inner section settings (innerSectionType already extracted above)
  const innerSectionProps = mergedProps?.innerSectionProps ?? {};

  // Outer container styling
  const containerBackground = mergedProps?.containerBackground ?? '#ffffff';
  const borderRadius = mergedProps?.borderRadius ?? 12;
  const padding = mergedProps?.padding ?? 16;
  const fullWidthSection = mergedProps?.fullWidthSection ?? false;

  // Inner section styling
  const sectionBackground = mergedProps?.sectionBackground ?? '#ffffff';
  const sectionBorderRadius = mergedProps?.sectionBorderRadius ?? 8;
  const sectionPadding = mergedProps?.sectionPadding ?? 12;

  // Get inner section component from registry
  const innerRegistryItem = innerSectionType ? getSectionById(innerSectionType) : null;
  const InnerSectionComponent = innerRegistryItem?.component;

  // Styles
  // Uses height: 100% to fill parent wrapper when section is resized via drag
  const containerStyle: React.CSSProperties = {
    ...getBackgroundStyle(containerBackground),
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
    height: '100%', // Fill parent wrapper so backgrounds expand when section is resized
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  };

  // When fullWidthSection is true, the inner section takes full width with no padding
  // Uses flex: 1 to fill available space in the flex container
  const sectionStyle: React.CSSProperties = {
    ...getBackgroundStyle(sectionBackground),
    borderRadius: fullWidthSection ? '0px' : `${sectionBorderRadius}px`,
    padding: fullWidthSection ? '0px' : `${sectionPadding}px`,
    flex: 1, // Fill available space when parent is resized
  };

  return (
    <div style={containerStyle} className="map-and-content-container">
      {/* Map at the top */}
      <MapDisplay
        professional={professional}
        mapHeight={mapHeight}
        mapBorderRadius={mapBorderRadius}
        showAddressOverlay={showAddressOverlay}
      />

      {/* Title (sits between map and content) */}
      {title && (
        <TitleDisplay
          title={title}
          alignment={titleAlignment}
          typography={titleTypography}
        />
      )}

      {/* Inner Section Container (with its own background) */}
      <div style={sectionStyle} className="map-content-container-inner">
        {InnerSectionComponent ? (
          <InnerSectionComponent
            professional={professional}
            section={{ ...section, props: innerSectionProps }}
            // Pass gallery for signature-work inner sections
            {...(innerSectionType === 'signature-work' ? { gallery: professional.gallery || [] } : {})}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No section selected</p>
            <p className="text-xs mt-1">Select a section type in editor</p>
          </div>
        )}
      </div>
    </div>
  );
}
