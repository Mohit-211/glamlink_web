'use client';

import { PageConfig } from '@/lib/config/pageVisibility';
import BatchModal from '@/lib/pages/admin/components/shared/editing/modal/batch/BatchModal';
import { Success } from '@/lib/pages/admin/components/shared/common/state';
import { SectionHeader, SettingsGroups, ActionButtons } from './';
import { useVisibilitySection } from './useVisibilitySection';

interface VisibilitySectionProps {
  settings: PageConfig[];
  onUpdate: (settings: PageConfig[]) => Promise<void>;
  isSaving: boolean;
}

interface PageGroup {
  title: string;
  pages: string[];
}

const PAGE_GROUPS: PageGroup[] = [
  {
    title: 'Pages',
    pages: ['/for-clients', '/for-professionals', '/for-professionals/[id]', '/magazine', '/magazine/[id]', '/promos']
  },
  {
    title: 'Services',
    pages: ['/services', '/services/[treatment]', '/services/[treatment]/[location]']
  },
  {
    title: 'Forms',
    pages: ['/apply/featured', '/apply/digital-card']
  },
  {
    title: 'Legal',
    pages: ['/faqs', '/terms', '/privacy']
  }
];

export default function VisibilitySection({ settings, onUpdate, isSaving }: VisibilitySectionProps) {
  const {
    localSettings,
    hasChanges,
    showSuccess,
    showBatchModal,
    expandedGroups,
    setShowBatchModal,
    toggleGroup,
    handleToggle,
    handleSave,
    handleReset,
    handleBatchUpload,
    settingsWithId
  } = useVisibilitySection({ settings, onUpdate, isSaving });

  return (
    <div>
      <SectionHeader
        title="Page Visibility Settings"
        description="Control which pages are visible to users. Hidden pages will show a 404 error."
        buttonText="Manage Batch"
        onButtonClick={() => setShowBatchModal(true)}
      />

      <Success
        show={showSuccess}
        message="Visibility settings updated successfully!"
      />

      <SettingsGroups
        pageGroups={PAGE_GROUPS}
        localSettings={localSettings}
        expandedGroups={expandedGroups}
        onToggleGroup={toggleGroup}
        onTogglePage={handleToggle}
      />

      <ActionButtons
        hasChanges={hasChanges}
        isSaving={isSaving}
        onReset={handleReset}
        onSave={handleSave}
      />

      {/* Batch Modal */}
      <BatchModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        title="Manage Page Visibility Batch"
        itemTypeName="Page Visibility Settings"
        currentData={settingsWithId}
        onUpload={handleBatchUpload}
      />
    </div>
  );
}
