'use client';

import { ProfileTabConfig } from '@/lib/config/profileTabs';
import { Success } from '@/lib/pages/admin/components/shared/common/state';
import { ChevronDownIcon, ChevronRightIcon } from '@/lib/pages/admin/components/shared/common';
import BatchModal from '@/lib/pages/admin/components/shared/editing/modal/batch/BatchModal';
import { useProfileTabsSection } from './useProfileTabsSection';

interface ProfileTabsSectionProps {
  tabs: ProfileTabConfig[];
  onUpdate: (tabs: ProfileTabConfig[]) => Promise<void>;
  isSaving: boolean;
}

export default function ProfileTabsSection({ tabs, onUpdate, isSaving }: ProfileTabsSectionProps) {
  const {
    localTabs,
    hasChanges,
    showSuccess,
    expandedTabs,
    showBatchModal,
    setShowBatchModal,
    handleToggleTab,
    handleToggleSubsection,
    toggleExpanded,
    handleSave,
    handleReset,
    handleBatchUpload,
    tabsWithId
  } = useProfileTabsSection({ tabs, onUpdate, isSaving });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Profile Tabs Visibility</h2>
          <p className="mt-1 text-sm text-gray-600">
            Control which tabs and subsections are visible in the profile sidebar. Hidden items will not appear in the navigation.
          </p>
        </div>
        <button
          onClick={() => setShowBatchModal(true)}
          className="px-4 py-2 text-sm font-medium text-glamlink-teal border border-glamlink-teal rounded-md hover:bg-glamlink-teal/10 transition-colors"
        >
          Manage Batch
        </button>
      </div>

      {/* Success Message */}
      <Success
        show={showSuccess}
        message="Profile tabs settings updated successfully!"
      />

      {/* Tabs List */}
      <div className="space-y-3 mb-6">
        {localTabs.map((tab) => {
          const isExpanded = expandedTabs.has(tab.id);
          const hasSubsections = tab.subsections && tab.subsections.length > 0;

          return (
            <div
              key={tab.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
            >
              {/* Tab Header */}
              <div className="flex items-center p-4">
                {/* Expand/Collapse Button */}
                {hasSubsections && (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(tab.id)}
                    className="mr-3 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                )}
                {!hasSubsections && <div className="mr-3 w-7" />}

                {/* Tab Info */}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{tab.name}</h3>
                  <p className="text-sm text-gray-600">{tab.description}</p>
                  {hasSubsections && (
                    <p className="text-xs text-gray-500 mt-1">
                      {tab.subsections.filter(s => s.isVisible).length} of {tab.subsections.length} subsections visible
                    </p>
                  )}
                </div>

                {/* Tab Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleTab(tab.id)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2 ${
                    tab.isVisible ? 'bg-glamlink-teal' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      tab.isVisible ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Subsections (Expanded) */}
              {hasSubsections && isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="space-y-2">
                    {tab.subsections.map((subsection) => (
                      <div
                        key={subsection.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-md hover:border-gray-200 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">{subsection.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleSubsection(tab.id, subsection.id)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2 ${
                            subsection.isVisible ? 'bg-glamlink-teal' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              subsection.isVisible ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal rounded-md hover:bg-glamlink-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Batch Modal */}
      <BatchModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        title="Manage Profile Tabs Batch"
        itemTypeName="Profile Tabs Settings"
        currentData={tabsWithId}
        onUpload={handleBatchUpload}
      />
    </div>
  );
}
