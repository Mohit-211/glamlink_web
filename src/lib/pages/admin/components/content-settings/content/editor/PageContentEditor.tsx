'use client';

import { SectionList, SectionPicker } from './page-content/section-management';
import SectionEditorModal from './SectionEditorModal';
import BatchModal from '@/lib/pages/admin/components/shared/editing/modal/batch/BatchModal';
import {
  EditorHeader,
  RefreshBar,
  SuccessMessage,
  SSGNotice,
  SectionsHeader,
  EmptyStateCard,
  ActionButtons,
  BannerEditor
} from './page-content';
import { usePageContentEditor } from './usePageContentEditor';

interface PageContentEditorProps {
  pageType: string;
  pageLabel: string;
  initialConfig: any;
  defaultSections: any[];
  lastUpdated: number | null;
  onRefresh: () => void;
  onSave: (config: any) => Promise<void>;
  isSaving: boolean;
  isRefreshing: boolean;
  showBanner?: boolean;
  showSSGToggle?: boolean;
  showBatchButton?: boolean;
}

/**
 * PageContentEditor - Generic editor for page content sections
 *
 * Provides a consistent UI for editing any page's content sections.
 * Uses usePageContentEditor hook for all state management.
 */
export default function PageContentEditor({
  pageType,
  pageLabel,
  initialConfig,
  defaultSections,
  lastUpdated,
  onRefresh,
  onSave,
  isSaving,
  isRefreshing,
  showBanner = true,
  showSSGToggle = true,
  showBatchButton = true
}: PageContentEditorProps) {
  const {
    config,
    hasChanges,
    showSuccess,
    editingSection,
    showSectionPicker,
    showBatchModal,
    existingSectionTypes,
    sectionCount,
    setEditingSection,
    setShowSectionPicker,
    setShowBatchModal,
    handleLoadDefaults,
    updateBanner,
    toggleSSG,
    addSection,
    updateSection,
    deleteSection,
    toggleSectionVisibility,
    moveSection,
    handleSave,
    handleReset,
    handleBatchUpload
  } = usePageContentEditor({
    pageType,
    initialConfig,
    defaultSections,
    onSave
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <EditorHeader
          title={`${pageLabel} Content`}
          description={`Customize the content displayed on the ${pageLabel.toLowerCase()}. Add, edit, reorder, and hide sections.`}
          ssgEnabled={config.ssgEnabled}
          onToggleSSG={toggleSSG}
          onManageBatch={() => setShowBatchModal(true)}
          showSSGToggle={showSSGToggle}
          showBatchButton={showBatchButton}
        />

        {/* SSG Notice */}
        <SSGNotice show={config.ssgEnabled} />

        {/* Refresh Bar */}
        <RefreshBar
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </div>

      {/* Success Message */}
      <SuccessMessage show={showSuccess} />

      {/* Banner Configuration */}
      {showBanner && (
        <div className="mb-6">
          <BannerEditor
            banner={config.banner || { enabled: false, message: '', backgroundColor: '#24bbcb', textColor: '#ffffff', dismissible: true }}
            onUpdate={updateBanner}
          />
        </div>
      )}

      {/* Sections */}
      <div className="mb-6">
        <SectionsHeader
          sectionCount={sectionCount}
          onAddSection={() => setShowSectionPicker(true)}
          onLoadDefaults={handleLoadDefaults}
          showLoadDefaults={sectionCount === 0}
        />

        {sectionCount === 0 ? (
          <EmptyStateCard
            onLoadDefaults={handleLoadDefaults}
            onAddSection={() => setShowSectionPicker(true)}
          />
        ) : (
          <SectionList
            sections={config.sections}
            onEditSection={setEditingSection}
            onDeleteSection={deleteSection}
            onToggleVisibility={toggleSectionVisibility}
            onMoveSection={moveSection}
          />
        )}
      </div>

      {/* Action Buttons */}
      <ActionButtons
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSave}
        onReset={handleReset}
      />

      {/* Section Picker Modal */}
      <SectionPicker
        isOpen={showSectionPicker}
        pageType={pageType as any}
        existingSectionTypes={existingSectionTypes}
        onSelect={addSection}
        onClose={() => setShowSectionPicker(false)}
      />

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditorModal
          isOpen={true}
          section={editingSection}
          onSave={updateSection}
          onClose={() => setEditingSection(null)}
        />
      )}

      {/* Batch Modal */}
      <BatchModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        title={`Manage ${pageLabel} Content Batch`}
        itemTypeName="Page Configuration"
        currentData={[config]}
        onUpload={handleBatchUpload}
      />
    </div>
  );
}
