import { PageConfig, defaultPageVisibility } from '@/lib/config/pageVisibility';

const STORAGE_KEY = 'glamlink_page_visibility';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedSettings {
  settings: PageConfig[];
  timestamp: number;
}

class ContentSettingsService {
  private cache: CachedSettings | null = null;

  // Get current page visibility settings
  async getPageVisibility(): Promise<PageConfig[]> {
    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < CACHE_DURATION) {
      return this.cache.settings;
    }

    try {
      const response = await fetch('/api/settings/page-visibility');
      const data = await response.json();
      
      if (data.success && data.settings) {
        // Cache the result
        this.cache = {
          settings: data.settings,
          timestamp: Date.now()
        };
        
        // Also store in localStorage as a fallback
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.settings));
        }
        
        return data.settings;
      }
    } catch (error) {
      // Error fetching page visibility settings from API
      
      // Fall back to localStorage
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            return defaultPageVisibility.map(defaultPage => {
              const storedPage = parsed.find((p: PageConfig) => p.path === defaultPage.path);
              return storedPage || defaultPage;
            });
          }
        } catch (e) {
          // Error loading from localStorage
        }
      }
    }

    return defaultPageVisibility;
  }

  // Save page visibility settings
  async savePageVisibility(settings: PageConfig[]): Promise<boolean> {
    try {
      const response = await fetch('/api/settings/page-visibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Clear cache to force refresh
        this.cache = null;
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
          // Dispatch custom event for any listeners
          window.dispatchEvent(new Event('glamlink:settings-updated'));
        }
        
        return true;
      } else {
        // Failed to save settings
        return false;
      }
    } catch (error) {
      // Error saving page visibility settings
      return false;
    }
  }

  // Check if a specific page is visible
  async isPageVisible(path: string): Promise<boolean> {
    const settings = await this.getPageVisibility();
    const page = settings.find(p => p.path === path);
    return page?.isVisible ?? true; // Default to visible if not found
  }

  // Toggle visibility for a specific page
  async togglePageVisibility(path: string): Promise<boolean> {
    const settings = await this.getPageVisibility();
    const pageIndex = settings.findIndex(p => p.path === path);
    
    if (pageIndex !== -1) {
      settings[pageIndex].isVisible = !settings[pageIndex].isVisible;
      return await this.savePageVisibility(settings);
    }
    return false;
  }

  // Synchronous version for middleware (uses cached data or defaults)
  isPageVisibleSync(path: string): boolean {
    // Use cached settings if available
    if (this.cache && Date.now() - this.cache.timestamp < CACHE_DURATION) {
      const page = this.cache.settings.find(p => p.path === path);
      return page?.isVisible ?? true;
    }
    
    // Fall back to localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const settings = JSON.parse(stored);
          const page = settings.find((p: PageConfig) => p.path === path);
          return page?.isVisible ?? true;
        }
      } catch (e) {
        // Ignore errors
      }
    }
    
    // Default to checking default settings
    const page = defaultPageVisibility.find(p => p.path === path);
    return page?.isVisible ?? true;
  }

  // Reset all settings to default
  resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  // Export settings as JSON
  async exportSettings(): Promise<string> {
    const settings = await this.getPageVisibility();
    return JSON.stringify(settings, null, 2);
  }

  // Import settings from JSON
  async importSettings(jsonString: string): Promise<boolean> {
    try {
      const settings = JSON.parse(jsonString);
      if (Array.isArray(settings)) {
        return await this.savePageVisibility(settings);
      }
    } catch (error) {
      // Error importing settings
    }
    return false;
  }
}

// Export singleton instance
const contentSettings = new ContentSettingsService();
export default contentSettings;