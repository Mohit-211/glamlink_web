'use client';

import { useState } from 'react';
import { useContentSettingsAPI } from './useContentSettingsAPI';
import { VisibilitySection } from './visibility';
import { ContentSection } from './content';
import { CTAAlertSection } from './cta-alerts';
import { ProfileTabsSection } from './profile-tabs';
import { Loading, ErrorComponent, TabsNavigation, TabItem } from '../shared/common';

type SectionType = 'visibility' | 'content' | 'cta-alerts' | 'profile-tabs';

const TABS: TabItem<SectionType>[] = [
  { id: 'visibility', label: 'Page Visibility' },
  { id: 'content', label: 'Page Content' },
  { id: 'cta-alerts', label: 'CTA Alerts' },
  { id: 'profile-tabs', label: 'Profile Tabs' }
];

export default function ContentSettingsTab() {
  // Get data from API hook
  const {
    visibilitySettings,
    pageContent,
    lastUpdated,
    selectedPage,
    setSelectedPage,
    loadPageContent,
    isLoading,
    error,
    isSaving,
    isRefreshing,
    updateVisibility,
    updateContent,
    ctaAlertConfig,
    promos,
    updateCTAAlert,
    profileTabs,
    updateProfileTabs
  } = useContentSettingsAPI();

  // UI state for active section
  const [activeSection, setActiveSection] = useState<SectionType>('visibility');

  // Show loading state
  if (isLoading) {
    return <Loading message="Loading content settings..." height="p-12" />;
  }

  // Show error state
  if (error) {
    return <ErrorComponent message={error} title="Error Loading Content Settings" />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Settings</h1>
        <p className="mt-2 text-gray-600">Manage page visibility and content</p>
      </div>

      {/* Tab Navigation */}
      <TabsNavigation
        tabs={TABS}
        activeTab={activeSection}
        onTabChange={setActiveSection}
        ariaLabel="Content Settings Tabs"
        className="mb-6"
      />

      {/* Active Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeSection === 'visibility' && (
          <VisibilitySection
            settings={visibilitySettings}
            onUpdate={updateVisibility}
            isSaving={isSaving}
          />
        )}
        {activeSection === 'content' && (
          <ContentSection
            content={pageContent}
            lastUpdated={lastUpdated}
            selectedPage={selectedPage}
            onPageChange={(page) => {
              setSelectedPage(page);
              loadPageContent(page);
            }}
            onRefresh={() => loadPageContent(selectedPage)}
            onUpdate={updateContent}
            isSaving={isSaving}
            isRefreshing={isRefreshing}
          />
        )}
        {activeSection === 'cta-alerts' && (
          <CTAAlertSection
            config={ctaAlertConfig}
            promos={promos}
            onUpdate={updateCTAAlert}
            isSaving={isSaving}
          />
        )}
        {activeSection === 'profile-tabs' && (
          <ProfileTabsSection
            tabs={profileTabs}
            onUpdate={updateProfileTabs}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
