'use client';

import { memo, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useFormContext } from '../../form/FormProvider';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type { ThumbnailConfig } from '@/lib/pages/magazine/types/magazine/core';
import { ImageCropModal } from './media';

interface SectionItem {
  id: string;
  title: string;
  tocTitle?: string;
  type: string;
}

interface ThumbnailEditorFieldProps {
  field: FieldConfig;
  error?: string;
}

interface ThumbnailItemProps {
  id: string;
  label: string;
  thumbnailUrl?: string;
  isHidden?: boolean;
  onThumbnailChange: (url: string) => void;
  onToggleHidden: () => void;
  onCropClick: () => void;
  issueId: string;
  layout: 'portrait' | 'landscape';
}

/**
 * Individual thumbnail item with image upload, crop, and visibility toggle
 */
function ThumbnailItem({
  id,
  label,
  thumbnailUrl,
  isHidden,
  onThumbnailChange,
  onToggleHidden,
  onCropClick,
  issueId,
  layout,
}: ThumbnailItemProps) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      // Dynamic import to avoid SSR issues
      const storageService = (await import('@/lib/services/firebase/storageService')).default;
      const path = `magazine/${issueId}/thumbnails/${id}`;
      const url = await storageService.uploadImage(file, path);
      onThumbnailChange(url);
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      alert('Failed to upload thumbnail');
    }

    e.target.value = '';
  };

  const handleRemove = () => {
    onThumbnailChange('');
  };

  // Aspect ratio classes based on layout
  const aspectClass = layout === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]';
  const sizeClass = layout === 'landscape' ? 'w-24' : 'w-16';

  return (
    <div className={`p-3 rounded-lg border ${isHidden ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}`}>
      <div className="flex items-start gap-3">
        {/* Thumbnail preview */}
        <div className="flex flex-col items-center gap-1">
          <label className={`
            relative ${sizeClass} ${aspectClass} rounded-md overflow-hidden cursor-pointer flex-shrink-0
            border-2 border-dashed transition-colors
            ${thumbnailUrl ? 'border-transparent' : 'border-gray-300 hover:border-gray-400'}
            ${isHidden ? 'opacity-50' : ''}
          `}>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isHidden}
            />
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, 150px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-2xl">+</span>
              </div>
            )}
          </label>
          {/* Crop button - only show if has image */}
          {thumbnailUrl && !isHidden && (
            <button
              type="button"
              onClick={onCropClick}
              className="text-xs text-glamlink-teal hover:text-glamlink-teal-dark flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Crop
            </button>
          )}
        </div>

        {/* Label and controls */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${isHidden ? 'text-gray-400' : 'text-gray-900'}`}>
            {label}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            {/* Hidden toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!isHidden}
                onChange={onToggleHidden}
                className="w-4 h-4 rounded border-gray-300 text-glamlink-teal focus:ring-glamlink-teal"
              />
              <span className="text-xs text-gray-600">Show in nav</span>
            </label>

            {/* Remove button */}
            {thumbnailUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ThumbnailEditorField - Full thumbnail configuration editor
 *
 * Shows:
 * - Layout selector (portrait/landscape)
 * - 3 fixed fields for Cover, TOC, Editor's Note
 * - Dynamic fields for each section
 * - Crop functionality for each thumbnail
 * - Visibility toggles for all
 *
 * Note: Sections are stored separately from issues in Firebase,
 * so we fetch them via API when the component mounts.
 */
function ThumbnailEditorFieldComponent({ field, error }: ThumbnailEditorFieldProps) {
  const { getFieldValue, updateField } = useFormContext();

  // Get form data
  const issueId = getFieldValue('id') || 'new-issue';
  const hasEditorNote = !!getFieldValue('editorNote');
  const thumbnailConfig: ThumbnailConfig = getFieldValue('thumbnailConfig') || {};

  // Get layout (default to portrait)
  const layout = thumbnailConfig.thumbnailLayout || 'portrait';

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState('');
  const [cropFieldId, setCropFieldId] = useState<string>('');

  // State for sections loaded from API
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [sectionsError, setSectionsError] = useState<string | null>(null);

  // Fetch sections from API when issueId changes
  useEffect(() => {
    if (!issueId || issueId === 'new-issue') {
      setSections([]);
      return;
    }

    const fetchSections = async () => {
      setIsLoadingSections(true);
      setSectionsError(null);
      try {
        const response = await fetch(`/api/magazine/sections?issueId=${issueId}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch sections');
        }
        const data = await response.json();
        // API returns { sections: [...] }
        const sectionsList = data.sections || [];
        setSections(sectionsList.map((s: any) => ({
          id: s.id,
          title: s.title || '',
          tocTitle: s.tocTitle,
          type: s.type || 'unknown'
        })));
      } catch (err) {
        console.error('Error fetching sections:', err);
        setSectionsError('Failed to load sections');
        setSections([]);
      } finally {
        setIsLoadingSections(false);
      }
    };

    fetchSections();
  }, [issueId]);

  // Helper to update thumbnail config
  const updateConfig = (updates: Partial<ThumbnailConfig>) => {
    updateField('thumbnailConfig', {
      ...thumbnailConfig,
      ...updates,
    });
  };

  // Update layout
  const handleLayoutChange = (newLayout: 'portrait' | 'landscape') => {
    updateConfig({ thumbnailLayout: newLayout });
  };

  // Update hidden pages
  const updateHiddenPages = (pageType: 'cover' | 'toc' | 'editorNote', isHidden: boolean) => {
    const hiddenPages = { ...thumbnailConfig.hiddenPages };
    hiddenPages[pageType] = isHidden;
    updateConfig({ hiddenPages });
  };

  // Update hidden sections
  const toggleSectionHidden = (sectionId: string) => {
    const hiddenSections = [...(thumbnailConfig.hiddenPages?.sections || [])];
    const idx = hiddenSections.indexOf(sectionId);
    if (idx >= 0) {
      hiddenSections.splice(idx, 1);
    } else {
      hiddenSections.push(sectionId);
    }
    updateConfig({
      hiddenPages: {
        ...thumbnailConfig.hiddenPages,
        sections: hiddenSections,
      },
    });
  };

  // Update section thumbnail
  const updateSectionThumbnail = (sectionId: string, url: string) => {
    const sectionThumbnails = { ...thumbnailConfig.sectionThumbnails };
    if (url) {
      sectionThumbnails[sectionId] = url;
    } else {
      delete sectionThumbnails[sectionId];
    }
    updateConfig({ sectionThumbnails });
  };

  // Open crop modal for a specific thumbnail
  const openCropModal = (fieldId: string, imageUrl: string) => {
    setCropFieldId(fieldId);
    setCropImageUrl(imageUrl);
    setCropModalOpen(true);
  };

  // Handle crop complete
  const handleCropComplete = (croppedUrl: string, _originalUrl: string, _cropData: any) => {
    // Update the appropriate thumbnail based on fieldId
    if (cropFieldId === 'cover') {
      updateConfig({ coverThumbnail: croppedUrl });
    } else if (cropFieldId === 'toc') {
      updateConfig({ tocThumbnail: croppedUrl });
    } else if (cropFieldId === 'editor-note') {
      updateConfig({ editorNoteThumbnail: croppedUrl });
    } else if (cropFieldId.startsWith('section-')) {
      const sectionId = cropFieldId.replace('section-', '');
      updateSectionThumbnail(sectionId, croppedUrl);
    }
    setCropModalOpen(false);
  };

  // Build section items from fetched sections
  const sectionItems = useMemo(() => {
    return sections.map((section) => ({
      id: section.id,
      label: section.tocTitle || section.title || `Section ${section.id}`,
      type: section.type,
    }));
  }, [sections]);

  // Aspect ratio for crop modal: portrait = 3:4 (0.75), landscape = 4:3 (1.33)
  const cropAspectRatio = layout === 'landscape'
    ? { ratio: 4 / 3, label: 'Landscape (4:3)' }
    : { ratio: 3 / 4, label: 'Portrait (3:4)' };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Thumbnail Navigation:</strong> Configure which pages appear in the thumbnail navigation strip.
          Upload custom images, crop them to the correct aspect ratio, and uncheck "Show in nav" to hide a page.
        </p>
      </div>

      {/* Layout Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Thumbnail Layout</h4>
        <div className="flex gap-4">
          <label className={`
            flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
            ${layout === 'portrait'
              ? 'border-glamlink-teal bg-glamlink-teal/5'
              : 'border-gray-200 hover:border-gray-300'}
          `}>
            <input
              type="radio"
              name="thumbnailLayout"
              value="portrait"
              checked={layout === 'portrait'}
              onChange={() => handleLayoutChange('portrait')}
              className="w-4 h-4 text-glamlink-teal focus:ring-glamlink-teal"
            />
            <div className="flex items-center gap-2">
              <div className="w-6 h-8 bg-gray-300 rounded-sm" />
              <div>
                <p className="text-sm font-medium text-gray-900">Portrait</p>
                <p className="text-xs text-gray-500">3:4 ratio (taller)</p>
              </div>
            </div>
          </label>

          <label className={`
            flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
            ${layout === 'landscape'
              ? 'border-glamlink-teal bg-glamlink-teal/5'
              : 'border-gray-200 hover:border-gray-300'}
          `}>
            <input
              type="radio"
              name="thumbnailLayout"
              value="landscape"
              checked={layout === 'landscape'}
              onChange={() => handleLayoutChange('landscape')}
              className="w-4 h-4 text-glamlink-teal focus:ring-glamlink-teal"
            />
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 bg-gray-300 rounded-sm" />
              <div>
                <p className="text-sm font-medium text-gray-900">Landscape</p>
                <p className="text-xs text-gray-500">4:3 ratio (wider)</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Standard Pages */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Standard Pages</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Cover */}
          <ThumbnailItem
            id="cover"
            label="Cover"
            thumbnailUrl={thumbnailConfig.coverThumbnail}
            isHidden={thumbnailConfig.hiddenPages?.cover}
            onThumbnailChange={(url) => updateConfig({ coverThumbnail: url })}
            onToggleHidden={() => updateHiddenPages('cover', !thumbnailConfig.hiddenPages?.cover)}
            onCropClick={() => thumbnailConfig.coverThumbnail && openCropModal('cover', thumbnailConfig.coverThumbnail)}
            issueId={issueId}
            layout={layout}
          />

          {/* Table of Contents */}
          <ThumbnailItem
            id="toc"
            label="Table of Contents"
            thumbnailUrl={thumbnailConfig.tocThumbnail}
            isHidden={thumbnailConfig.hiddenPages?.toc}
            onThumbnailChange={(url) => updateConfig({ tocThumbnail: url })}
            onToggleHidden={() => updateHiddenPages('toc', !thumbnailConfig.hiddenPages?.toc)}
            onCropClick={() => thumbnailConfig.tocThumbnail && openCropModal('toc', thumbnailConfig.tocThumbnail)}
            issueId={issueId}
            layout={layout}
          />

          {/* Editor's Note (only if exists) */}
          {hasEditorNote && (
            <ThumbnailItem
              id="editor-note"
              label="Editor's Note"
              thumbnailUrl={thumbnailConfig.editorNoteThumbnail}
              isHidden={thumbnailConfig.hiddenPages?.editorNote}
              onThumbnailChange={(url) => updateConfig({ editorNoteThumbnail: url })}
              onToggleHidden={() => updateHiddenPages('editorNote', !thumbnailConfig.hiddenPages?.editorNote)}
              onCropClick={() => thumbnailConfig.editorNoteThumbnail && openCropModal('editor-note', thumbnailConfig.editorNoteThumbnail)}
              issueId={issueId}
              layout={layout}
            />
          )}
        </div>
      </div>

      {/* Section Thumbnails */}
      {!isLoadingSections && sectionItems.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Section Thumbnails ({sectionItems.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sectionItems.map((section, idx: number) => (
              <ThumbnailItem
                key={section.id}
                id={`section-${section.id}`}
                label={`${idx + 1}. ${section.label}`}
                thumbnailUrl={thumbnailConfig.sectionThumbnails?.[section.id]}
                isHidden={thumbnailConfig.hiddenPages?.sections?.includes(section.id)}
                onThumbnailChange={(url) => updateSectionThumbnail(section.id, url)}
                onToggleHidden={() => toggleSectionHidden(section.id)}
                onCropClick={() => {
                  const url = thumbnailConfig.sectionThumbnails?.[section.id];
                  if (url) openCropModal(`section-${section.id}`, url);
                }}
                issueId={issueId}
                layout={layout}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoadingSections && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading sections...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {sectionsError && !isLoadingSections && (
        <div className="text-center py-6 text-red-600 bg-red-50 rounded-lg">
          <p>{sectionsError}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoadingSections && !sectionsError && sectionItems.length === 0 && issueId !== 'new-issue' && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
          <p>No sections found. Add sections to configure their thumbnails.</p>
        </div>
      )}

      {/* New issue notice */}
      {issueId === 'new-issue' && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
          <p>Save the issue first to configure section thumbnails.</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageUrl={cropImageUrl}
        onClose={() => setCropModalOpen(false)}
        onCropComplete={handleCropComplete}
        issueId={issueId}
        imageType="content"
        fieldName={cropFieldId}
        customAspectRatio={cropAspectRatio}
      />
    </div>
  );
}

export const ThumbnailEditorField = memo(ThumbnailEditorFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});

export default ThumbnailEditorField;
