'use client';

import { useState, useEffect } from 'react';

interface SettingsVisibility {
  isLoading: boolean;
  isSubsectionVisible: (subsectionId: string) => boolean;
  visibleSubsections: Set<string>;
}

/**
 * Hook to fetch and check settings subsection visibility
 * from the profile tabs configuration
 */
export function useSettingsVisibility(): SettingsVisibility {
  const [visibleSubsections, setVisibleSubsections] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const response = await fetch('/api/content-settings/profile-tabs', {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
          // Find the settings tab and extract subsection visibility
          const settingsTab = data.data.find((tab: { id: string }) => tab.id === 'settings');

          if (settingsTab?.subsections) {
            const visible = new Set<string>();
            settingsTab.subsections.forEach((subsection: { id: string; isVisible: boolean }) => {
              if (subsection.isVisible) {
                visible.add(subsection.id);
              }
            });
            setVisibleSubsections(visible);
          } else {
            // If no subsections configured, show all by default
            setVisibleSubsections(new Set([
              'profile', 'account', 'security', 'preferences', 'verification',
              'privacy', 'brand-settings', 'professional', 'notifications',
              'communication', 'account-management', 'session'
            ]));
          }
        }
      } catch (error) {
        console.error('Error fetching settings visibility:', error);
        // On error, show all by default
        setVisibleSubsections(new Set([
          'profile', 'account', 'security', 'preferences', 'verification',
          'privacy', 'brand-settings', 'professional', 'notifications',
          'communication', 'account-management', 'session'
        ]));
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisibility();
  }, []);

  const isSubsectionVisible = (subsectionId: string): boolean => {
    // While loading, default to visible to prevent flash
    if (isLoading) return true;
    return visibleSubsections.has(subsectionId);
  };

  return {
    isLoading,
    isSubsectionVisible,
    visibleSubsections,
  };
}
