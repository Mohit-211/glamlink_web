/**
 * Map Preprocessing Utilities
 *
 * Handles Google Maps screenshot capture and placeholder generation
 * for condensed card preview generation. Addresses the issue where
 * html2canvas cannot capture interactive Google Maps elements.
 *
 * Phase 3 of Condensed Card Preview Enhancement
 */

import type { LocationData } from '@/lib/pages/for-professionals/types/professional';

// =============================================================================
// TYPES
// =============================================================================

export interface MapScreenshotResult {
  dataUrl: string;
  success: boolean;
  error?: string;
  width: number;
  height: number;
}

// =============================================================================
// MAP ELEMENT DETECTION
// =============================================================================

/**
 * Find all Google Maps elements in a container
 * Searches for multiple selectors to catch all map types
 */
export function findMapElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    '[class*="google-map"]',
    '.gm-style',
    'gmp-map',
    'google-map',
    '[class*="multi-location-maps"]',
    '[class*="map-container"]',
    '[id*="google-map"]',
    '[id*="gmap"]',
  ];

  const mapElements = new Set<HTMLElement>();

  for (const selector of selectors) {
    const elements = container.querySelectorAll<HTMLElement>(selector);
    elements.forEach(el => mapElements.add(el));
  }

  // Also find elements containing gm- classes (Google Maps specific)
  const allElements = container.querySelectorAll('*');
  for (const el of allElements) {
    if (el.className && typeof el.className === 'string' && el.className.includes('gm-')) {
      mapElements.add(el as HTMLElement);
    }
  }

  // Filter out nested maps (only keep parent maps)
  const result: HTMLElement[] = [];
  for (const el of mapElements) {
    let isNested = false;
    for (const other of mapElements) {
      if (other !== el && other.contains(el)) {
        isNested = true;
        break;
      }
    }
    if (!isNested) {
      result.push(el);
    }
  }

  return result;
}

/**
 * Remove all Google Maps related elements from container
 * This is extremely aggressive - removes ALL map-related elements and their children
 * Call this AFTER replaceMapsInClone to clean up any remaining map fragments
 */
export function removeAllMapElements(container: HTMLElement): number {
  let removed = 0;

  // First pass: Remove by selectors (multiple times to catch nested elements)
  const selectors = [
    '[class*="google-map"]',
    '[class*="gm-"]',
    '.gm-style',
    'gmp-map',
    'google-map',
    '[class*="multi-location-maps"]',
    '[class*="map-container"]',
    '[id*="google-map"]',
    '[id*="gmap"]',
    '[id*="gm-"]',
    // Google Maps specific classes
    '.gm-style-iw',
    '.gm-style-mtc',
    'gmp-internal-map',
    'gmp-map-marker',
    '[class*="AdvancedMarker"]',
  ];

  // Run selector removal 3 times to catch nested elements
  for (let pass = 0; pass < 3; pass++) {
    for (const selector of selectors) {
      try {
        const elements = container.querySelectorAll(selector);
        elements.forEach(el => {
          // CRITICAL: Don't remove our replaced maps (they have data-replaced-map attribute)
          if (el.getAttribute('data-replaced-map') === 'true') {
            return; // Skip this element
          }
          try {
            el.remove();
            removed++;
          } catch (err) {
            // Element might already be removed
          }
        });
      } catch (err) {
        // Selector might be invalid
      }
    }
  }

  // Second pass: Remove any elements with gm- in class or id
  const allElements = Array.from(container.querySelectorAll('*'));
  for (const el of allElements) {
    try {
      // CRITICAL: Don't remove our replaced maps
      if (el.getAttribute('data-replaced-map') === 'true') {
        continue; // Skip this element
      }

      const hasMapClass =
        (el.className && typeof el.className === 'string' && (
          el.className.includes('gm-') ||
          el.className.includes('google-map') ||
          el.className.includes('gmp-')
        ));

      const hasMapId =
        (el.id && (
          el.id.includes('gm-') ||
          el.id.includes('google-map') ||
          el.id.includes('gmap')
        ));

      const hasMapTag =
        el.tagName &&
        (el.tagName.toLowerCase().includes('gmp-') ||
         el.tagName.toLowerCase().includes('google-map'));

      if (hasMapClass || hasMapId || hasMapTag) {
        el.remove();
        removed++;
      }
    } catch (err) {
      // Element might already be removed
    }
  }

  // Third pass: Remove any remaining script tags related to Google Maps
  try {
    const scripts = container.querySelectorAll('script[src*="maps.googleapis.com"]');
    scripts.forEach(script => {
      script.remove();
      removed++;
    });
  } catch (err) {
    // Ignore
  }

  console.log(`🧹 removeAllMapElements: Removed ${removed} elements`);
  return removed;
}

/**
 * Extract location data from map element attributes
 * Supports both single location (data-lat/data-lng) and multi-location (data-locations JSON)
 *
 * @param mapElement - The map HTML element to extract location from
 * @returns LocationData object/array with lat/lng/address, or null if not found
 */
export function extractLocationFromMap(mapElement: HTMLElement): LocationData | LocationData[] | null {
  try {
    // First try multi-location data (JSON array)
    const locationsJson = mapElement.getAttribute('data-locations');
    if (locationsJson) {
      try {
        const locations = JSON.parse(locationsJson) as LocationData[];
        if (Array.isArray(locations) && locations.length > 0) {
          console.log(`Found ${locations.length} locations in data-locations attribute`);
          return locations;
        }
      } catch (parseErr) {
        console.warn('Failed to parse data-locations JSON:', parseErr);
      }
    }

    // Fall back to single location (data-lat/data-lng)
    const lat = mapElement.getAttribute('data-lat');
    const lng = mapElement.getAttribute('data-lng');

    if (lat && lng) {
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: mapElement.getAttribute('data-address') || '',
      };
    }

    // Try primary location attributes (for multi-location maps with fallback)
    const primaryLat = mapElement.getAttribute('data-primary-lat');
    const primaryLng = mapElement.getAttribute('data-primary-lng');

    if (primaryLat && primaryLng) {
      return {
        lat: parseFloat(primaryLat),
        lng: parseFloat(primaryLng),
        address: mapElement.getAttribute('data-primary-address') || '',
      };
    }

    // Try to find location in parent elements
    // Check for multi-location parent first
    const multiLocationParent = mapElement.closest('[data-locations]');

    if (multiLocationParent) {
      const locationsJson = multiLocationParent.getAttribute('data-locations');
      if (locationsJson) {
        try {
          const locations = JSON.parse(locationsJson) as LocationData[];
          if (Array.isArray(locations) && locations.length > 0) {
            console.log(`Found ${locations.length} locations in parent's data-locations attribute`);
            return locations;
          }
        } catch (parseErr) {
          console.warn('Failed to parse parent data-locations JSON:', parseErr);
        }
      }
    }

    // Check for primary location parent
    const primaryParent = mapElement.closest('[data-primary-lat]');
    if (primaryParent) {
      const parentLat = primaryParent.getAttribute('data-primary-lat');
      const parentLng = primaryParent.getAttribute('data-primary-lng');
      if (parentLat && parentLng) {
        return {
          lat: parseFloat(parentLat),
          lng: parseFloat(parentLng),
          address: primaryParent.getAttribute('data-primary-address') || '',
        };
      }
    }

    // Check for single location parent (legacy)
    const singleLocationParent = mapElement.closest('[data-lat]');
    if (singleLocationParent) {
      const parentLat = singleLocationParent.getAttribute('data-lat');
      const parentLng = singleLocationParent.getAttribute('data-lng');
      if (parentLat && parentLng) {
        return {
          lat: parseFloat(parentLat),
          lng: parseFloat(parentLng),
          address: singleLocationParent.getAttribute('data-address') || '',
        };
      }
    }

    console.warn('No location data found in map element or parents');
    return null;
  } catch (err) {
    console.error('Failed to extract location:', err);
    return null;
  }
}

// =============================================================================
// MAP SCREENSHOT CAPTURE
// =============================================================================

/**
 * Capture screenshot of a map element using Google Static Maps API
 *
 * Uses Google Static Maps API to generate an actual map image instead of a placeholder.
 * Supports both single location and multiple locations with markers.
 * Falls back to placeholder if location data is unavailable or API call fails.
 *
 * @param mapElement - The map HTML element
 * @param locationData - Optional location data (single or array) with lat/lng coordinates
 * @returns Promise resolving to map screenshot result with data URL
 */
export async function captureMapScreenshot(
  mapElement: HTMLElement,
  locationData?: LocationData | LocationData[] | null
): Promise<MapScreenshotResult> {
  try {
    // Get dimensions
    const rect = mapElement.getBoundingClientRect();
    const width = Math.round(rect.width) || 600;
    const height = Math.round(rect.height) || 400;

    // Normalize location data to array
    const locations: LocationData[] = Array.isArray(locationData)
      ? locationData
      : locationData
      ? [locationData]
      : [];

    // If no location data, fall back to placeholder
    if (locations.length === 0 || !locations[0]?.lat || !locations[0]?.lng) {
      console.warn('No location data provided, using placeholder');
      const placeholder = createMapPlaceholder(width, height);
      return { success: true, dataUrl: placeholder, width, height };
    }

    // Generate Google Static Maps API URL
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    // Build markers string for all locations
    const markersParams = locations
      .map((loc, index) => {
        // Primary location (first or marked as primary) gets teal marker, others get red
        const color = (index === 0 || loc.isPrimary) ? '0x22B8C8' : '0xEF4444';
        const label = (index === 0 || loc.isPrimary) ? '' : `${index}`;
        return `markers=color:${color}|label:${label}|${loc.lat},${loc.lng}`;
      })
      .join('&');

    // For multi-location, don't specify center/zoom - let Google auto-fit
    // For single location, specify center and zoom
    const centerZoomParams = locations.length === 1
      ? `center=${locations[0].lat},${locations[0].lng}&zoom=15`
      : ''; // Auto-fit for multiple locations

    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?` +
      `${centerZoomParams}${centerZoomParams ? '&' : ''}` +
      `size=${width}x${height}&` +
      `scale=2&` +  // Higher DPI for better quality
      `${markersParams}&` +
      `key=${apiKey}`;

    console.log(`📍 Fetching static map: ${width}x${height}px with ${locations.length} location(s)`);

    // Fetch the static map image
    const response = await fetch(staticMapUrl);
    if (!response.ok) {
      throw new Error(`Static Maps API failed: ${response.status}`);
    }

    // Convert to data URL
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    console.log(`✓ Static map captured: ${width}x${height}px with ${locations.length} marker(s)`);

    return {
      success: true,
      dataUrl,
      width,
      height,
    };
  } catch (err) {
    console.error('Static map capture failed:', err);
    // Fall back to placeholder
    const rect = mapElement.getBoundingClientRect();
    const width = Math.round(rect.width) || 400;
    const height = Math.round(rect.height) || 400;
    const placeholder = createMapPlaceholder(width, height);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to capture map',
      dataUrl: placeholder,
      width,
      height,
    };
  }
}

// =============================================================================
// MAP PLACEHOLDER GENERATION
// =============================================================================

/**
 * Create map placeholder (gray box with pin icon)
 */
export function createMapPlaceholder(width: number, height: number): string {
  // CRITICAL: Ensure non-zero dimensions to prevent canvas errors
  const safeWidth = Math.max(width, 400);
  const safeHeight = Math.max(height, 400);

  const canvas = document.createElement('canvas');
  canvas.width = safeWidth;
  canvas.height = safeHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Gray background
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(0, 0, safeWidth, safeHeight);

  // Draw location pin icon
  const centerX = safeWidth / 2;
  const centerY = safeHeight / 2;
  const pinSize = Math.min(safeWidth, safeHeight) * 0.15;

  ctx.fillStyle = '#6b7280';

  // Pin circle (top)
  ctx.beginPath();
  ctx.arc(centerX, centerY - pinSize / 2, pinSize / 3, 0, Math.PI * 2);
  ctx.fill();

  // Pin triangle (bottom)
  ctx.beginPath();
  ctx.moveTo(centerX - pinSize / 3, centerY - pinSize / 6);
  ctx.lineTo(centerX + pinSize / 3, centerY - pinSize / 6);
  ctx.lineTo(centerX, centerY + pinSize / 2);
  ctx.closePath();
  ctx.fill();

  // Text
  ctx.fillStyle = '#6b7280';
  ctx.font = `${Math.floor(safeHeight * 0.06)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Map Location', centerX, centerY + pinSize);

  return canvas.toDataURL('image/png');
}

// =============================================================================
// MAP ELEMENT REPLACEMENT
// =============================================================================

/**
 * Replace map element with an image
 * IMPORTANT: This removes map-specific children but PRESERVES overlay elements
 * (like address overlays) to maintain the visual appearance in the preview
 *
 * @param mapElement - The map element to replace
 * @param dataUrl - The image data URL
 * @param width - Width in pixels (from LIVE element)
 * @param height - Height in pixels (from LIVE element)
 */
export function replaceMapWithImage(
  mapElement: HTMLElement,
  dataUrl: string,
  width: number,
  height: number
): void {
  if (!mapElement.parentElement) {
    console.warn('Map element has no parent, cannot replace');
    return;
  }

  // PRESERVE OVERLAYS: Find overlay elements BEFORE removing children
  // Overlays are typically absolute-positioned divs at the bottom of the map
  const overlayElements: HTMLElement[] = [];
  const children = Array.from(mapElement.children);

  console.log(`🔍 Scanning ${children.length} children of map element for overlays`);

  for (const child of children) {
    const el = child as HTMLElement;
    const classList = el.className || '';
    const style = window.getComputedStyle(el);

    console.log(`  - Child: <${el.tagName}> classes="${classList}" text="${el.textContent?.substring(0, 30)}..."`);

    // Check if this is NOT a map element
    const isNotMapElement = !classList.includes('gm-') &&
                            !classList.includes('gmp-') &&
                            el.tagName !== 'CANVAS' &&
                            el.tagName !== 'IFRAME' &&
                            el.tagName !== 'IMG'; // Skip the map image itself

    // Check for overlay characteristics
    const hasAbsoluteClass = classList.includes('absolute');
    const hasAbsoluteStyle = style.position === 'absolute';
    const isAbsolute = hasAbsoluteClass || hasAbsoluteStyle;

    // Check for any positioning (top, bottom, left, right) - Tailwind classes or computed style
    const hasBottomClass = classList.includes('bottom-0') || classList.includes('bottom-');
    const hasBottomStyle = style.bottom === '0px' || parseInt(style.bottom) === 0;
    const hasTopClass = classList.includes('top-') && !classList.includes('top-0');
    const hasTopStyle = style.top && style.top !== 'auto' && parseInt(style.top) >= 0;
    const hasLeftClass = classList.includes('left-');
    const hasRightClass = classList.includes('right-');
    const isPositioned = hasBottomClass || hasBottomStyle || hasTopClass || hasTopStyle || hasLeftClass || hasRightClass;

    // Check for overlay-specific patterns
    const hasOverlayClass = classList.includes('overlay');
    const hasTextContent = (el.textContent?.trim()?.length ?? 0) > 0;
    const hasBackgroundClass = classList.includes('bg-white') || classList.includes('bg-opacity');

    console.log(`    isNotMapElement=${isNotMapElement}, isAbsolute=${isAbsolute}, isPositioned=${isPositioned}, hasText=${hasTextContent}, hasBg=${hasBackgroundClass}`);

    // Preserve if it looks like an overlay (absolute positioned with content or background)
    if (isNotMapElement && isAbsolute && (isPositioned || hasOverlayClass || hasTextContent || hasBackgroundClass)) {
      // Clone the overlay to preserve it
      const clonedOverlay = el.cloneNode(true) as HTMLElement;

      // FORCE VISIBILITY: Remove responsive hiding classes and force display
      clonedOverlay.classList.remove('hidden');
      clonedOverlay.style.display = 'block';

      overlayElements.push(clonedOverlay);
      console.log(`    ✅ PRESERVING overlay: "${el.textContent?.substring(0, 50)}..." (classes: ${classList})`);
    } else {
      console.log(`    ❌ Skipping (not an overlay)`);
    }
  }

  console.log(`📍 Found ${overlayElements.length} overlay(s) to preserve`);

  // Create wrapper div instead of img for better compatibility
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';  // Full width of parent
  wrapper.style.height = 'auto'; // Auto height to maintain aspect ratio
  wrapper.style.display = 'block';
  wrapper.style.position = 'relative';
  wrapper.style.overflow = 'hidden';

  // Create img inside wrapper
  const img = document.createElement('img');
  img.src = dataUrl;
  img.style.width = '100%';
  img.style.height = 'auto';  // Auto height to maintain aspect ratio
  img.style.objectFit = 'contain';  // Contain to show full image
  img.style.display = 'block';

  wrapper.appendChild(img);

  // RE-ADD PRESERVED OVERLAYS on top of the static map image
  for (const overlay of overlayElements) {
    wrapper.appendChild(overlay);
  }

  // Copy classes but remove ALL Google Maps specific classes
  const cleanClasses = (mapElement.className || '')
    .split(' ')
    .filter(cls =>
      cls &&
      !cls.includes('gm-') &&
      !cls.includes('google-map') &&
      !cls.includes('gmp-')
    )
    .join(' ');

  if (cleanClasses) {
    wrapper.className = cleanClasses;
  }

  // Add identifier for debugging
  wrapper.setAttribute('data-replaced-map', 'true');

  // CRITICAL: Remove ALL children from map element first
  // This ensures no nested Google Maps elements remain
  while (mapElement.firstChild) {
    mapElement.removeChild(mapElement.firstChild);
  }

  // Replace in DOM
  try {
    mapElement.parentElement.replaceChild(wrapper, mapElement);
  } catch (err) {
    console.error('Failed to replace map element:', err);
  }
}

// =============================================================================
// BATCH MAP PROCESSING
// =============================================================================

/**
 * Process all maps in a container and return map data with dimensions
 * Captures from LIVE preview before cloning using Google Static Maps API
 *
 * @param liveContainer - The live preview container element
 * @param onProgress - Optional callback for progress tracking
 * @returns Map of map IDs to screenshot results (data URLs + dimensions)
 */
export async function processAllMaps(
  liveContainer: HTMLElement,
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, MapScreenshotResult>> {
  const mapDataMap = new Map<string, MapScreenshotResult>();
  const mapElements = findMapElements(liveContainer);

  console.log(`Found ${mapElements.length} map elements to process`);

  for (let i = 0; i < mapElements.length; i++) {
    const mapEl = mapElements[i];
    const mapId = `map-${i}`;

    if (onProgress) {
      onProgress(i + 1, mapElements.length);
    }

    // Extract location data from map element
    const locationData = extractLocationFromMap(mapEl);

    // Capture with location data (will use Static Maps API if available)
    const result = await captureMapScreenshot(mapEl, locationData);

    // Store the full result (includes width/height)
    mapDataMap.set(mapId, result);

    if (result.success && result.dataUrl) {
      if (locationData) {
        console.log(`✓ Map ${i + 1}/${mapElements.length} captured (static map) ${result.width}x${result.height}px`);
      } else {
        console.log(`✓ Map ${i + 1}/${mapElements.length} captured (placeholder) ${result.width}x${result.height}px`);
      }
    } else {
      console.warn(`⚠ Map ${i + 1}/${mapElements.length} using placeholder`);
    }
  }

  return mapDataMap;
}

/**
 * Replace maps in cloned element with captured screenshots
 */
export function replaceMapsInClone(
  clonedContainer: HTMLElement,
  mapDataMap: Map<string, MapScreenshotResult>
): void {
  const clonedMaps = findMapElements(clonedContainer);

  console.log(`Replacing ${clonedMaps.length} maps in cloned element`);

  for (let i = 0; i < clonedMaps.length; i++) {
    const mapEl = clonedMaps[i];
    const mapId = `map-${i}`;
    const result = mapDataMap.get(mapId);

    if (result && result.dataUrl) {
      // Use dimensions from the LIVE element (not the clone)
      replaceMapWithImage(mapEl, result.dataUrl, result.width, result.height);
      console.log(`✓ Replaced map ${i + 1} with image (${result.width}x${result.height}px)`);
    } else {
      // Fallback placeholder if no data found
      const width = 400;
      const height = 400;
      const placeholder = createMapPlaceholder(width, height);
      replaceMapWithImage(mapEl, placeholder, width, height);
      console.log(`⚠ Replaced map ${i + 1} with fallback placeholder`);
    }
  }

  console.log(`✓ Map replacement complete`);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if element is a map element
 */
export function isMapElement(element: HTMLElement): boolean {
  const mapClasses = ['google-map', 'gm-style', 'multi-location-maps', 'map-container'];
  const tagName = element.tagName.toLowerCase();
  const className = element.className.toLowerCase();

  // Check tag name
  if (tagName === 'gmp-map' || tagName === 'google-map') {
    return true;
  }

  // Check class names
  for (const mapClass of mapClasses) {
    if (className.includes(mapClass)) {
      return true;
    }
  }

  return false;
}

/**
 * Generate unique ID for map element
 */
export function generateMapId(element: HTMLElement, index: number): string {
  // Try to get unique identifier from element
  if (element.id) {
    return `map-${element.id}-${index}`;
  }

  // Use data attributes if available
  const lat = element.getAttribute('data-lat');
  const lng = element.getAttribute('data-lng');
  if (lat && lng) {
    return `map-${lat}-${lng}-${index}`;
  }

  // Fallback to index
  return `map-${index}`;
}
