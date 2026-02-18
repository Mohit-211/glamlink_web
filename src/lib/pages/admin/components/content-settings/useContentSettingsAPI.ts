import { useState, useEffect, useCallback } from 'react';
import { PageConfig } from '@/lib/config/pageVisibility';
import { CTAAlertConfig } from '@/lib/pages/admin/types/ctaAlert';
import { PromoItem } from '@/lib/features/promos/config';
import { ProfileTabConfig } from '@/lib/config/profileTabs';

export interface UseContentSettingsAPIReturn {
  // Visibility
  visibilitySettings: PageConfig[];
  updateVisibility: (settings: PageConfig[]) => Promise<void>;

  // Content
  pageContent: Record<string, any>;
  lastUpdated: number | null;
  selectedPage: string;
  setSelectedPage: (page: string) => void;
  loadPageContent: (page: string) => Promise<void>;
  updateContent: (page: string, content: any) => Promise<void>;

  // CTA Alert
  ctaAlertConfig: CTAAlertConfig | null;
  promos: PromoItem[];
  updateCTAAlert: (config: Partial<CTAAlertConfig>) => Promise<void>;

  // Profile Tabs
  profileTabs: ProfileTabConfig[];
  updateProfileTabs: (tabs: ProfileTabConfig[]) => Promise<void>;

  // State
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isRefreshing: boolean;
}

export function useContentSettingsAPI(): UseContentSettingsAPIReturn {
  const [visibilitySettings, setVisibilitySettings] = useState<PageConfig[]>([]);
  const [pageContent, setPageContent] = useState<Record<string, any>>({});
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>('for-clients');

  // CTA Alert state
  const [ctaAlertConfig, setCTAAlertConfig] = useState<CTAAlertConfig | null>(null);
  const [promos, setPromos] = useState<PromoItem[]>([]);

  // Profile Tabs state
  const [profileTabs, setProfileTabs] = useState<ProfileTabConfig[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch visibility settings
  const fetchVisibilitySettings = useCallback(async () => {
    try {
      const response = await fetch('/api/content-settings/visibility', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch visibility settings: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setVisibilitySettings(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch visibility settings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch visibility settings");
      console.error("Error fetching visibility settings:", err);
    }
  }, []);

  // Update visibility settings
  const updateVisibility = async (settings: PageConfig[]) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/content-settings/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) throw new Error("Failed to update visibility settings");

      const result = await response.json();
      if (result.success) {
        setVisibilitySettings(settings);
      } else {
        throw new Error(result.error || "Failed to update visibility settings");
      }
    } catch (err) {
      console.error("Error updating visibility settings:", err);
      setError("Failed to update visibility settings");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Load page content
  const loadPageContent = async (page: string) => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/content-settings/pages/${page}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page content: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Wrap the page data in a key so ContentSection can access it via content[page]
        setPageContent({ [page]: data.data });
        setLastUpdated(Date.now());
      } else {
        throw new Error(data.error || "Failed to fetch page content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch page content");
      console.error("Error fetching page content:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update page content
  const updateContent = async (page: string, content: any) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/content-settings/pages/${page}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Failed to update page content");

      const result = await response.json();
      if (result.success) {
        // Refetch the page content to ensure state is in sync with database
        await loadPageContent(page);
      } else {
        throw new Error(result.error || "Failed to update page content");
      }
    } catch (err) {
      console.error("Error updating page content:", err);
      setError("Failed to update page content");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch CTA Alert config
  const fetchCTAAlertConfig = useCallback(async () => {
    try {
      const response = await fetch('/api/content-settings/cta-alert', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CTA Alert config: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCTAAlertConfig(data.data);
      }
    } catch (err) {
      console.error("Error fetching CTA Alert config:", err);
      // Don't set error - CTA Alert config is optional
    }
  }, []);

  // Fetch promos for linking
  const fetchPromos = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/promos', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch promos: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setPromos(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching promos:", err);
      // Don't set error - promos are optional
    }
  }, []);

  // Fetch profile tabs settings
  const fetchProfileTabs = useCallback(async () => {
    try {
      const response = await fetch('/api/content-settings/profile-tabs', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile tabs: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setProfileTabs(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch profile tabs");
      }
    } catch (err) {
      console.error("Error fetching profile tabs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch profile tabs");
    }
  }, []);

  // Update CTA Alert config
  const updateCTAAlert = async (config: Partial<CTAAlertConfig>) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/content-settings/cta-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update CTA Alert config");
      }

      const result = await response.json();
      if (result.success) {
        setCTAAlertConfig(result.data);
      } else {
        throw new Error(result.error || "Failed to update CTA Alert config");
      }
    } catch (err) {
      console.error("Error updating CTA Alert config:", err);
      setError("Failed to update CTA Alert config");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Update profile tabs settings
  const updateProfileTabs = async (tabs: ProfileTabConfig[]) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/content-settings/profile-tabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tabs }),
      });

      if (!response.ok) throw new Error("Failed to update profile tabs");

      const result = await response.json();
      if (result.success) {
        setProfileTabs(tabs);
      } else {
        throw new Error(result.error || "Failed to update profile tabs");
      }
    } catch (err) {
      console.error("Error updating profile tabs:", err);
      setError("Failed to update profile tabs");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchVisibilitySettings(),
          loadPageContent(selectedPage),
          fetchCTAAlertConfig(),
          fetchPromos(),
          fetchProfileTabs()
        ]);
      } catch (err) {
        console.error("Error loading content settings data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [fetchVisibilitySettings, fetchCTAAlertConfig, fetchPromos, fetchProfileTabs, selectedPage]);

  return {
    // Visibility
    visibilitySettings,
    updateVisibility,

    // Content
    pageContent,
    lastUpdated,
    selectedPage,
    setSelectedPage,
    loadPageContent,
    updateContent,

    // CTA Alert
    ctaAlertConfig,
    promos,
    updateCTAAlert,

    // Profile Tabs
    profileTabs,
    updateProfileTabs,

    // State
    isLoading,
    error,
    isSaving,
    isRefreshing
  };
}
