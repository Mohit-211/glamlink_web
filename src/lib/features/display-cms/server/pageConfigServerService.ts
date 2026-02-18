import { Firestore, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import type { PageType, PageConfig } from '../types';

/**
 * Generic Page Config Server Service
 *
 * Handles CRUD operations for any page configuration in the CMS system.
 * Stores page configs in Firestore under the collection 'page_configs'.
 *
 * Examples:
 * - for-clients page config: page_configs/for-clients
 * - for-professionals page config: page_configs/for-professionals
 * - homepage page config: page_configs/homepage
 */
class PageConfigServerService {
  private readonly COLLECTION_NAME = 'page_configs';

  /**
   * Get page configuration by page type
   */
  async getPageConfig(db: Firestore, pageType: PageType): Promise<PageConfig | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, pageType);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        return null;
      }

      const data = docSnapshot.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
      } as PageConfig;
    } catch (error) {
      console.error(`Error fetching page config for ${pageType}:`, error);
      throw error;
    }
  }

  /**
   * Save page configuration
   */
  async savePageConfig(db: Firestore, pageType: PageType, config: Partial<PageConfig>): Promise<PageConfig> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, pageType);

      // Prepare data for Firestore
      const dataToSave = {
        ...config,
        id: pageType,
        pageType,
        updatedAt: Timestamp.now(),
      };

      // Save to Firestore
      await setDoc(docRef, dataToSave, { merge: true });

      // Fetch and return saved config
      const saved = await this.getPageConfig(db, pageType);
      if (!saved) {
        throw new Error('Page config saved but could not be retrieved');
      }

      return saved;
    } catch (error) {
      console.error(`Error saving page config for ${pageType}:`, error);
      throw error;
    }
  }

  /**
   * Update specific sections in page config
   */
  async updatePageSections(
    db: Firestore,
    pageType: PageType,
    sections: any[]
  ): Promise<PageConfig> {
    try {
      const existing = await this.getPageConfig(db, pageType);

      if (!existing) {
        // Create new config if doesn't exist
        return await this.savePageConfig(db, pageType, {
          sections,
          banner: undefined,
        });
      }

      // Update sections only
      return await this.savePageConfig(db, pageType, {
        ...existing,
        sections,
      });
    } catch (error) {
      console.error(`Error updating sections for ${pageType}:`, error);
      throw error;
    }
  }

  /**
   * Update banner config for a page
   */
  async updatePageBanner(
    db: Firestore,
    pageType: PageType,
    banner: any
  ): Promise<PageConfig> {
    try {
      const existing = await this.getPageConfig(db, pageType);

      if (!existing) {
        // Create new config if doesn't exist
        return await this.savePageConfig(db, pageType, {
          sections: [],
          banner,
        });
      }

      // Update banner only
      return await this.savePageConfig(db, pageType, {
        ...existing,
        banner,
      });
    } catch (error) {
      console.error(`Error updating banner for ${pageType}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const pageConfigServerService = new PageConfigServerService();
