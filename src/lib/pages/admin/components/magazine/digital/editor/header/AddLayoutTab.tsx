'use client';

/**
 * AddLayoutTab Component
 *
 * Form for saving current page configuration as a layout template.
 * Supports creating new layouts or replacing existing ones.
 * Fields: Layout Name, Description, Preview Image, Replace Layout (optional)
 */

import { useState, useEffect, useMemo } from 'react';
import type {
  CurrentPageData,
  CreateDigitalLayoutRequest,
  DigitalLayout
} from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// TYPES
// =============================================================================

interface AddLayoutTabProps {
  issueId: string;
  currentPageData?: CurrentPageData;
  onClose: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AddLayoutTab({
  issueId,
  currentPageData,
  onClose
}: AddLayoutTabProps) {
  const [layoutName, setLayoutName] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    currentPageData?.canvasDataUrl
  );
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Replace layout state
  const [existingLayouts, setExistingLayouts] = useState<DigitalLayout[]>([]);
  const [replaceLayoutId, setReplaceLayoutId] = useState<string>('');
  const [isLoadingLayouts, setIsLoadingLayouts] = useState(true);

  // Category state
  const [layoutCategory, setLayoutCategory] = useState('');

  // Extract unique categories from existing layouts for combobox suggestions
  const existingCategories = useMemo(() => {
    const categories = existingLayouts
      .map(l => l.layoutCategory)
      .filter((c): c is string => !!c && c.trim() !== '');
    return [...new Set(categories)].sort();
  }, [existingLayouts]);

  // Fetch existing layouts on mount
  useEffect(() => {
    async function fetchLayouts() {
      try {
        const response = await fetch(`/api/digital-layouts?issueId=${issueId}`, {
          credentials: 'include'
        });
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setExistingLayouts(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch existing layouts:', err);
      } finally {
        setIsLoadingLayouts(false);
      }
    }
    fetchLayouts();
  }, [issueId]);

  // Auto-fill layout name, description, and category when selecting an existing layout
  useEffect(() => {
    if (replaceLayoutId) {
      const selectedLayout = existingLayouts.find(l => l.id === replaceLayoutId);
      if (selectedLayout) {
        setLayoutName(selectedLayout.layoutName);
        setDescription(selectedLayout.layoutDescription || '');
        setLayoutCategory(selectedLayout.layoutCategory || '');
      }
    }
  }, [replaceLayoutId, existingLayouts]);

  // Check if we have page data to save
  const hasPageData = currentPageData?.pageType && currentPageData?.pdfSettings && currentPageData?.pageData;

  // Helper: Upload preview image to Firebase Storage
  const uploadPreviewImage = async (dataUrl: string | undefined): Promise<string | undefined> => {
    if (!dataUrl) return undefined;

    // If it's already a Firebase URL, return it as-is
    if (dataUrl.includes('firebasestorage.googleapis.com')) {
      return dataUrl;
    }

    // If it's a base64 data URL, upload to Firebase Storage
    if (dataUrl.startsWith('data:image/')) {
      setUploadProgress('Uploading preview image...');

      try {
        const response = await fetch('/api/digital-layouts/upload-preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            previewDataUrl: dataUrl,
            issueId,
            layoutId: replaceLayoutId || undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload preview image');
        }

        const result = await response.json();
        if (result.success && result.data?.previewUrl) {
          setUploadProgress('');
          return result.data.previewUrl;
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (err) {
        setUploadProgress('');
        throw new Error('Failed to upload preview image to storage');
      }
    }

    // Return original if not a data URL
    return dataUrl;
  };

  const handleSave = async () => {
    // Validate
    if (!layoutName.trim()) {
      setError('Layout name is required');
      return;
    }

    if (!hasPageData) {
      setError('No page data available to save');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // STEP 1: Upload preview image to Firebase Storage if it's a base64 data URL
      let uploadedPreviewUrl: string | undefined;
      try {
        uploadedPreviewUrl = await uploadPreviewImage(previewImage);
      } catch (uploadErr) {
        throw new Error('Failed to upload preview image. Please try again.');
      }

      // STEP 2: Save layout with Firebase Storage URL (not base64)
      setUploadProgress('Saving layout...');

      const layoutDataPayload = {
        pageType: currentPageData.pageType,
        pdfSettings: currentPageData.pdfSettings,
        pageData: currentPageData.pageData
      };

      let response: Response;

      if (replaceLayoutId) {
        // UPDATE existing layout
        response = await fetch(`/api/digital-layouts/${replaceLayoutId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            layoutName: layoutName.trim(),
            layoutDescription: description.trim() || undefined,
            layoutCategory: layoutCategory.trim() || undefined,
            previewImage: uploadedPreviewUrl,  // Use Firebase URL instead of base64
            layoutData: layoutDataPayload
          })
        });
      } else {
        // CREATE new layout
        const layoutData: CreateDigitalLayoutRequest = {
          issueId,
          layoutName: layoutName.trim(),
          layoutDescription: description.trim() || undefined,
          layoutCategory: layoutCategory.trim() || undefined,
          previewImage: uploadedPreviewUrl,  // Use Firebase URL instead of base64
          layoutData: layoutDataPayload
        };

        response = await fetch('/api/digital-layouts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(layoutData)
        });
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save layout');
      }

      setUploadProgress('');
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setUploadProgress('');
      setError(err instanceof Error ? err.message : 'Failed to save layout');
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (success) {
    const isUpdate = !!replaceLayoutId;
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          {isUpdate ? 'Layout Updated!' : 'Layout Saved!'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {isUpdate
            ? 'The existing layout has been updated with your changes.'
            : 'You can now load this layout on any page.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      {!hasPageData && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            ⚠️ No page data available. Make sure you're editing a page before saving a layout.
          </p>
        </div>
      )}

      {hasPageData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📑 Current page type: <strong>{currentPageData.pageType}</strong>
          </p>
        </div>
      )}

      {/* Replace Layout dropdown */}
      {existingLayouts.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Replace Existing Layout (Optional)
          </label>
          <select
            value={replaceLayoutId}
            onChange={(e) => setReplaceLayoutId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isSaving || isLoadingLayouts}
          >
            <option value="">Create new layout</option>
            {existingLayouts.map((layout) => (
              <option key={layout.id} value={layout.id}>
                {layout.layoutName}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select an existing layout to update it, or leave empty to create a new one
          </p>
        </div>
      )}

      {isLoadingLayouts && (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading existing layouts...
        </div>
      )}

      {/* Form fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Layout Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={layoutName}
          onChange={(e) => setLayoutName(e.target.value)}
          placeholder="e.g., Hero Article Layout"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isSaving}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this layout template..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isSaving}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category (Optional)
        </label>
        <input
          type="text"
          list="layout-categories"
          value={layoutCategory}
          onChange={(e) => setLayoutCategory(e.target.value)}
          placeholder="Select or type a category..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isSaving}
        />
        <datalist id="layout-categories">
          {existingCategories.map(cat => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        <p className="text-xs text-gray-500 mt-1">
          Select from existing categories or type a new one
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preview Image
        </label>
        {previewImage ? (
          <div className="space-y-2">
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-48 object-contain bg-gray-50"
              />
            </div>
            <button
              type="button"
              onClick={() => setPreviewImage(undefined)}
              className="text-sm text-red-600 hover:text-red-800"
              disabled={isSaving}
            >
              Remove Preview
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="preview-upload"
              disabled={isSaving}
            />
            <label
              htmlFor="preview-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600">Click to upload preview image</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>
            </label>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {currentPageData?.canvasDataUrl
            ? 'Auto-populated from current page preview'
            : 'Upload a preview image for this layout template'}
        </p>
      </div>

      {/* Upload progress message */}
      {uploadProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-blue-800">{uploadProgress}</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !hasPageData || !layoutName.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {replaceLayoutId ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {replaceLayoutId ? 'Update Layout' : 'Save Layout'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
