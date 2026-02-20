import { PageContentId, PageContentMap, defaultPageContent } from '@/lib/config/pageContent';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CONTENT_STORAGE_KEY = 'glamlink_page_content';

interface CachedContent {
  content: Partial<PageContentMap>;
  timestamp: number;
}

class PageContentService {
  private cache: Map<PageContentId, CachedContent> = new Map();
  private allContentCache: CachedContent | null = null;

  // Get content for a specific page
  async getPageContent<T extends PageContentId>(pageId: T): Promise<PageContentMap[T]> {
    // Check cache first
    const cached = this.cache.get(pageId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.content[pageId] as PageContentMap[T];
    }

    try {
      const response = await fetch(`/api/content/${pageId}`);
      const data = await response.json();
      
      if (data.success && data.content) {
        // Cache the result
        this.cache.set(pageId, {
          content: { [pageId]: data.content },
          timestamp: Date.now()
        });
        
        // Also store in localStorage as a fallback
        this.saveToLocalStorage(pageId, data.content);
        
        return data.content;
      }
    } catch (error) {
      // Error fetching content
      
      // Try to load from localStorage
      const localContent = this.loadFromLocalStorage(pageId);
      if (localContent) {
        return localContent;
      }
    }

    // Fall back to defaults
    return defaultPageContent[pageId];
  }

  // Get all page content (for admin)
  async getAllPageContent(): Promise<PageContentMap> {
    // Check cache first
    if (this.allContentCache && Date.now() - this.allContentCache.timestamp < CACHE_DURATION) {
      return this.allContentCache.content as PageContentMap;
    }

    try {
      const response = await fetch('/api/content/all');
      const data = await response.json();
      
      if (data.success && data.content) {
        // Cache the result
        this.allContentCache = {
          content: data.content,
          timestamp: Date.now()
        };
        
        return data.content;
      }
    } catch (error) {
      // Error fetching all content
    }

    // Fall back to defaults
    return defaultPageContent;
  }

  // Save content for a specific page
  async savePageContent<T extends PageContentId>(
    pageId: T, 
    content: PageContentMap[T]
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/content/${pageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Clear cache to force refresh
        this.cache.delete(pageId);
        this.allContentCache = null;
        
        // Update localStorage
        this.saveToLocalStorage(pageId, content);
        
        // Dispatch custom event for any listeners
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('glamlink:content-updated', {
            detail: { pageId, content }
          }));
        }
        
        return true;
      } else {
        // Failed to save content
        return false;
      }
    } catch (error) {
      // Error saving page content
      return false;
    }
  }

  // Clear all caches
  clearCache(): void {
    this.cache.clear();
    this.allContentCache = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CONTENT_STORAGE_KEY);
    }
  }

  // Private helper methods
  private saveToLocalStorage<T extends PageContentId>(pageId: T, content: PageContentMap[T]): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
      const allContent = stored ? JSON.parse(stored) : {};
      allContent[pageId] = content;
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(allContent));
    } catch (error) {
      // Error saving to localStorage
    }
  }

  private loadFromLocalStorage<T extends PageContentId>(pageId: T): PageContentMap[T] | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (stored) {
        const allContent = JSON.parse(stored);
        return allContent[pageId] || null;
      }
    } catch (error) {
      // Error loading from localStorage
    }
    
    return null;
  }

  // Export content as JSON
  async exportContent(): Promise<string> {
    const content = await this.getAllPageContent();
    return JSON.stringify(content, null, 2);
  }

  // Import content from JSON
  async importContent(jsonString: string): Promise<boolean> {
    try {
      const content = JSON.parse(jsonString);
      
      // Validate that it has the expected structure
      if (typeof content !== 'object') {
        throw new Error('Invalid content structure');
      }
      
      // Save each page's content
      for (const pageId of Object.keys(content)) {
        if (defaultPageContent[pageId as PageContentId]) {
          await this.savePageContent(
            pageId as PageContentId, 
            content[pageId]
          );
        }
      }
      
      return true;
    } catch (error) {
      // Error importing content
      return false;
    }
  }
}

// Export singleton instance
const pageContentService = new PageContentService();
export default pageContentService;