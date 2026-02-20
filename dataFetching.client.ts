/**
 * Client-Side Data Fetching Utilities
 *
 * These functions can be used in client components for dynamic data fetching.
 */

import { PageConfig } from "@/lib/features/display-cms";


/**
 * Client-side data fetching for dynamic pages
 *
 * Fetches page content via API endpoint with authentication cookies.
 *
 * @param page - Page identifier (e.g., 'for-clients', 'home')
 * @returns Page configuration or null if not found
 * @throws Error if fetch fails
 */
export async function fetchPageContent(page: string): Promise<PageConfig | null> {
  try {
    const response = await fetch(`/api/content-settings/pages/${page}`, {
      credentials: 'include'  // Required for session cookie authentication
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page content: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch page content');
    }

    return data.data || null;
  } catch (error) {
    console.error(`Error fetching page content for ${page}:`, error);
    throw error;
  }
}

/**
 * Prefetch page content for faster client-side loading
 *
 * Uses browser's fetch API with priority hint for preloading.
 *
 * @param page - Page identifier to prefetch
 */
export function prefetchPageContent(page: string): void {
  if (typeof window === 'undefined') return;

  // Use fetch with high priority for prefetching
  fetch(`/api/content-settings/pages/${page}`, {
    credentials: 'include',
    priority: 'high'
  } as any).catch(() => {
    // Silently fail - this is just prefetching
  });
}
