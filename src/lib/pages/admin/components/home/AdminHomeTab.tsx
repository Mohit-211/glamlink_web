"use client";

import { useState } from 'react';
import TabsNavigation, { TabItem } from '../shared/common/nav/TabsNavigation';
import OverviewContent from './OverviewContent';
import RecentProfessionals from './RecentProfessionals';
import FormSubmissionsContent from './FormSubmissionsContent';
import { useRecentProfessionals } from './useRecentProfessionals';
import { useFormSubmissions } from './useFormSubmissions';

type HomeTabId = 'overview' | 'professionals' | 'submissions';

export default function AdminHomeTab() {
  const [activeTab, setActiveTab] = useState<HomeTabId>('overview');
  const { recentCount } = useRecentProfessionals();
  const { counts: submissionCounts } = useFormSubmissions();

  const tabs: TabItem<HomeTabId>[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'professionals', label: 'Professionals', count: recentCount > 0 ? recentCount : undefined },
    { id: 'submissions', label: 'Form Submissions', count: submissionCounts.total > 0 ? submissionCounts.total : undefined },
  ];

  const handleTabChange = (tabId: HomeTabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tabs Navigation */}
      <div className="mb-6">
        <TabsNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          ariaLabel="Admin Home Navigation"
        />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewContent />}
        {activeTab === 'professionals' && <RecentProfessionals />}
        {activeTab === 'submissions' && <FormSubmissionsContent />}
      </div>
    </div>
  );
}
