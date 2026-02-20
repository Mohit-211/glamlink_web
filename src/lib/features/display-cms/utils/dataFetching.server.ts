/**
 * Server-Side Data Fetching Utilities
 *
 * These functions can ONLY be used in server components and API routes.
 * Importing this file in client components will cause build errors.
 */

import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc } from 'firebase/firestore';
import type { PageConfig } from '../types';

/**
 * Server-side data fetching for SSG/ISR pages
 *
 * Fetches page content directly from Firestore with server-side authentication.
 * Use this in server components and API routes only.
 *
 * @param page - Page identifier (e.g., 'for-clients', 'home')
 * @returns Page configuration or null if not found or unauthenticated
 */
export async function getServerPageContent(page: string): Promise<PageConfig | null> {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();
console.log(currentUser,"currentuser")
    // Return null if no authentication or database
    if (!currentUser || !db) {
      console.warn('Server page content fetch requires authentication');
      return null;
    }

    // Fetch from Firestore
    const docRef = doc(db, 'pageContent', page);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log(`No page content found for ${page}`);
      return null;
    }

    const data = docSnap.data();

    // Transform Firestore data to PageConfig
    const pageConfig: PageConfig = {
      id: page,
      pageType: data.pageType,
      sections: data.sections || [],
      banner: data.banner,
      ssgEnabled: data.ssgEnabled ?? false,  // Default to dynamic
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy
    };

    return pageConfig;
  } catch (error) {
    console.error(`Error fetching server page content for ${page}:`, error);
    // Return null on error to gracefully degrade to client-side fetching
    return null;
  }
}

/**
 * Check if page content exists (lightweight check)
 *
 * Server-side only function to check page content existence.
 *
 * @param page - Page identifier to check
 * @returns True if page content exists, false otherwise
 */
export async function hasPageContent(page: string): Promise<boolean> {
  try {
    const { db } = await getAuthenticatedAppForUser();

    if (!db) return false;

    const docRef = doc(db, 'pageContent', page);
    const docSnap = await getDoc(docRef);

    return docSnap.exists();
  } catch (error) {
    console.error(`Error checking page content existence for ${page}:`, error);
    return false;
  }
}
