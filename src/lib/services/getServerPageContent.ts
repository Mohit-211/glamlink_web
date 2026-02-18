import { PageContentId, PageContentMap, defaultPageContent } from '@/lib/config/pageContent';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/config/firebase';

// Server-side function to fetch page content
export async function getServerPageContent<T extends PageContentId>(
  pageId: T
): Promise<PageContentMap[T]> {
  try {
    // Check if database is available
    if (!db) {
      // No database connection, returning defaults
      return defaultPageContent[pageId];
    }

    // Fetch from Firestore
    const contentDoc = await getDoc(doc(db, "settings", "pageContent"));
    
    if (!contentDoc.exists()) {
      // No content document found, returning defaults
      return defaultPageContent[pageId];
    }

    const data = contentDoc.data();
    const pageContent = data.pages?.[pageId];
    
    if (!pageContent) {
      // No content for pageId, returning defaults
      return defaultPageContent[pageId];
    }
    
    // Found content for pageId
    return pageContent;
  } catch (error) {
    // Error fetching content, fall back to defaults
    return defaultPageContent[pageId];
  }
}