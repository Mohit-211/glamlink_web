"use client";

import { useEffect } from 'react';
import contentSettings from '@/lib/services/contentSettings';

export default function PageVisibilitySync() {
  useEffect(() => {
    // Sync localStorage settings to cookies on mount and when storage changes
    const syncToCookie = () => {
      const settings = contentSettings.getPageVisibility();
      document.cookie = `glamlink_page_visibility=${encodeURIComponent(JSON.stringify(settings))}; path=/; max-age=31536000`; // 1 year
    };

    // Initial sync
    syncToCookie();

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'glamlink_page_visibility') {
        syncToCookie();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events when settings are saved
    const handleSettingsUpdate = () => {
      syncToCookie();
    };

    window.addEventListener('glamlink:settings-updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('glamlink:settings-updated', handleSettingsUpdate);
    };
  }, []);

  return null; // This component doesn't render anything
}