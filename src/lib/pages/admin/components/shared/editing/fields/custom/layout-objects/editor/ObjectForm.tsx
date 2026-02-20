'use client';

/**
 * ObjectForm - Form fields for editing custom layout objects
 *
 * Renders appropriate fields based on object type:
 * - Common: x, y, width, height, zIndex
 * - Text: title, subtitle, content, backgroundColor, spacers
 * - Image: image, objectFit, borderRadius
 * - Spacer: (no additional fields)
 * - Link: linkType, externalUrl, targetPageNumber
 * - Custom Block: blockType, blockCategory, blockProps
 */

import React from 'react';
import type {
  CustomObject,
  TextCustomObject,
  ImageCustomObject,
  CustomBlockCustomObject,
  LinkCustomObject,
  DimensionValue,
} from '../types';
import { TextObjectForm, ImageObjectForm, LinkObjectForm, CustomBlockForm } from '../fields';

// =============================================================================
// TYPES
// =============================================================================

// Type for available pages (for internal link selection)
interface AvailablePage {
  id: string;
  pageNumber: number;
  title?: string;
  pageType: string;
}

interface ObjectFormProps {
  object: CustomObject;
  onUpdate: (updates: Partial<CustomObject>) => void;
  issueId?: string;
  pdfSettings?: any;  // PagePdfSettings type
  availablePages?: AvailablePage[];  // For link object internal page selection
}

// =============================================================================
// DIMENSION INPUT COMPONENT
// =============================================================================

interface DimensionInputProps {
  label: string;
  value: DimensionValue;
  onChange: (value: DimensionValue) => void;
}

function DimensionInput({ label, value, onChange }: DimensionInputProps) {
  return (
    <div className="flex-1">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex">
        <input
          type="number"
          value={value.value}
          onChange={(e) => onChange({ ...value, value: parseFloat(e.target.value) || 0 })}
          className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={value.unit}
          onChange={(e) => onChange({ ...value, unit: e.target.value as 'px' | '%' })}
          className="px-2 py-1.5 text-sm border border-l-0 border-gray-300 rounded-r-md bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="px">px</option>
          <option value="%">%</option>
        </select>
      </div>
    </div>
  );
}

// =============================================================================
// POSITION & SIZE SECTION (Common to all types)
// =============================================================================

interface PositionSizeSectionProps {
  object: CustomObject;
  onUpdate: (updates: Partial<CustomObject>) => void;
}

function PositionSizeSection({ object, onUpdate }: PositionSizeSectionProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Position & Size</h4>

      {/* Position row */}
      <div className="flex gap-3">
        <DimensionInput
          label="X Position"
          value={object.x}
          onChange={(x) => onUpdate({ x })}
        />
        <DimensionInput
          label="Y Position"
          value={object.y}
          onChange={(y) => onUpdate({ y })}
        />
      </div>

      {/* Size row */}
      <div className="flex gap-3">
        <DimensionInput
          label="Width"
          value={object.width}
          onChange={(width) => onUpdate({ width })}
        />
        <DimensionInput
          label="Height"
          value={object.height}
          onChange={(height) => onUpdate({ height })}
        />
      </div>

      {/* Z-Index */}
      <div className="w-32">
        <label className="block text-xs font-medium text-gray-600 mb-1">Z-Index</label>
        <input
          type="number"
          value={object.zIndex ?? ''}
          onChange={(e) => onUpdate({ zIndex: e.target.value ? parseInt(e.target.value, 10) : undefined })}
          placeholder="auto"
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}

// =============================================================================
// SPACER OBJECT FORM (No additional fields)
// =============================================================================

function SpacerForm() {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Spacers have no additional fields. They are invisible elements used for layout positioning.
      </p>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ObjectForm({ object, onUpdate, issueId, pdfSettings, availablePages }: ObjectFormProps) {
  return (
    <div className="space-y-4">
      {/* Common position & size fields */}
      <PositionSizeSection object={object} onUpdate={onUpdate} />

      {/* Type-specific fields */}
      {object.type === 'text' && (
        <TextObjectForm
          object={object as TextCustomObject}
          onUpdate={onUpdate as (updates: Partial<TextCustomObject>) => void}
        />
      )}
      {object.type === 'image' && (
        <ImageObjectForm
          object={object as ImageCustomObject}
          onUpdate={onUpdate as (updates: Partial<ImageCustomObject>) => void}
          issueId={issueId}
          pdfSettings={pdfSettings}
        />
      )}
      {object.type === 'spacer' && <SpacerForm />}
      {object.type === 'link' && (
        <LinkObjectForm
          object={object as LinkCustomObject}
          onUpdate={onUpdate as (updates: Partial<LinkCustomObject>) => void}
          availablePages={availablePages}
        />
      )}
      {object.type === 'custom-block' && (
        <CustomBlockForm
          object={object as CustomBlockCustomObject}
          onUpdate={onUpdate as (updates: Partial<CustomBlockCustomObject>) => void}
          issueId={issueId}
        />
      )}
    </div>
  );
}
