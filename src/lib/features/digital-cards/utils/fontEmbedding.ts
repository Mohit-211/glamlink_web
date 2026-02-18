/**
 * Font Embedding Utility for html-to-image
 *
 * Handles fetching Google Fonts CSS and converting font-face rules to Base64
 * to avoid CORS issues when using html-to-image library.
 *
 * The html-to-image library tries to access cssRules from stylesheets,
 * but cross-origin stylesheets (like Google Fonts) block this access.
 * This utility pre-fetches the font CSS and embeds fonts as Base64.
 */

// Google Fonts used in the digital card system
const GOOGLE_FONTS = [
  'Playfair+Display:wght@400;500;600;700',
  'Merriweather:wght@400;700',
  'Montserrat:wght@400;500;600;700',
  'Lato:wght@400;700',
  'Red+Hat+Display:wght@400;500;600;700',
  'Roboto:wght@400;500;700',
];

// Cache for fetched font CSS
let cachedFontCSS: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Build the Google Fonts CSS URL
 */
function buildGoogleFontsUrl(): string {
  const families = GOOGLE_FONTS.map(f => `family=${f}`).join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Fetch a font file and convert to Base64 data URL
 */
async function fetchFontAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.status}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Failed to fetch font from ${url}:`, error);
    return url; // Return original URL as fallback
  }
}

/**
 * Extract font URLs from CSS and convert them to Base64
 */
async function embedFontsInCSS(css: string): Promise<string> {
  // Find all url() references in the CSS
  const urlRegex = /url\(([^)]+)\)/g;
  const urls: string[] = [];
  let match;

  while ((match = urlRegex.exec(css)) !== null) {
    let url = match[1].replace(/['"]/g, '').trim();
    // Only process font URLs (woff2, woff, ttf)
    if (url.match(/\.(woff2?|ttf|otf)(\?|$)/i)) {
      urls.push(url);
    }
  }

  // Fetch unique URLs
  const uniqueUrls = [...new Set(urls)];
  const urlMap = new Map<string, string>();

  // Fetch fonts in parallel (batch of 3 to avoid overwhelming)
  for (let i = 0; i < uniqueUrls.length; i += 3) {
    const batch = uniqueUrls.slice(i, i + 3);
    const results = await Promise.all(
      batch.map(async (url) => {
        const base64 = await fetchFontAsBase64(url);
        return { url, base64 };
      })
    );
    results.forEach(({ url, base64 }) => urlMap.set(url, base64));
  }

  // Replace URLs with Base64
  let embeddedCSS = css;
  urlMap.forEach((base64, url) => {
    // Escape special regex characters in URL
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    embeddedCSS = embeddedCSS.replace(
      new RegExp(`url\\(['"]?${escapedUrl}['"]?\\)`, 'g'),
      `url(${base64})`
    );
  });

  return embeddedCSS;
}

/**
 * Fetch Google Fonts CSS with embedded Base64 fonts
 * Results are cached for 5 minutes to improve performance
 */
export async function fetchGoogleFontsCSS(): Promise<string> {
  // Check cache
  if (cachedFontCSS && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('Using cached Google Fonts CSS');
    return cachedFontCSS;
  }

  try {
    console.log('Fetching Google Fonts CSS...');
    const url = buildGoogleFontsUrl();

    const response = await fetch(url, {
      headers: {
        // Request woff2 format (modern browsers)
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Fonts: ${response.status}`);
    }

    const css = await response.text();
    console.log('Google Fonts CSS fetched, embedding fonts...');

    // Embed fonts as Base64
    const embeddedCSS = await embedFontsInCSS(css);

    // Cache the result
    cachedFontCSS = embeddedCSS;
    cacheTimestamp = Date.now();

    console.log('Google Fonts embedded successfully');
    return embeddedCSS;
  } catch (error) {
    console.error('Error fetching Google Fonts:', error);
    // Return empty string on error - fonts will use fallbacks
    return '';
  }
}

/**
 * Inject font CSS into a cloned element for image export
 * Call this before passing element to html-to-image
 */
export function injectFontStyles(element: HTMLElement, fontCSS: string): void {
  if (!fontCSS) return;

  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-font-embed', 'true');
  styleElement.textContent = fontCSS;

  // Insert at the beginning of the element
  element.insertBefore(styleElement, element.firstChild);
}

/**
 * Clear the font CSS cache
 */
export function clearFontCache(): void {
  cachedFontCSS = null;
  cacheTimestamp = 0;
}
