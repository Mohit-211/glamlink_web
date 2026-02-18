'use client';

/**
 * ImageObjectForm - Form fields for editing Image layout objects
 *
 * Fields:
 * - Image upload with crop and gallery
 * - Border radius
 */

import React, { useCallback } from 'react';
import type { ImageCustomObject } from '../../types';
import ImageUploadField from '@/lib/pages/admin/components/shared/editing/fields/custom/media/imageUpload';
import type { ImageObject } from '@/lib/pages/admin/components/magazine/digital/editor/types';

// =============================================================================
// TYPES
// =============================================================================

interface ImageObjectFormProps {
  object: ImageCustomObject;
  onUpdate: (updates: Partial<ImageCustomObject>) => void;
  issueId?: string;
  pdfSettings?: any;  // PagePdfSettings type
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ImageObjectForm({ object, onUpdate, issueId, pdfSettings }: ImageObjectFormProps) {
  // Extract URL from string or ImageObject
  const imageValue = typeof object.image === 'string'
    ? object.image
    : object.image?.url || '';

  // Adapter: Convert ImageUploadField onChange to ObjectForm onUpdate
  const handleImageChange = useCallback((fieldName: string, value: string | ImageObject) => {
    onUpdate({ image: value });
  }, [onUpdate]);

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-700">Image Settings</h4>

      {/* ImageUploadField with full upload/crop capabilities */}
      <div>
        <ImageUploadField
          label="Image"
          value={imageValue}
          onChange={handleImageChange}
          issueId={issueId}
          imageType="content"
          showObjectFitControls={true}
          fieldName="image"
          objectDimensions={object}
          pdfSettings={pdfSettings}
        />
        <p className="text-xs text-gray-500 mt-2">
          Upload an image, crop it, or select from gallery. Use object-fit controls to fine-tune display.
        </p>
      </div>

      {/* Border Radius */}
      <div className="w-40">
        <label className="block text-xs font-medium text-gray-600 mb-1">Border Radius (px)</label>
        <input
          type="number"
          value={object.borderRadius ?? ''}
          onChange={(e) => onUpdate({ borderRadius: e.target.value ? parseInt(e.target.value, 10) : undefined })}
          placeholder="0"
          min={0}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
