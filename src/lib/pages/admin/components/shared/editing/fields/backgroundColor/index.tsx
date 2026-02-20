"use client";

import { memo } from "react";
import { useFormContext } from '../../form/FormProvider';
import { BaseField } from '../BaseField';
import { useBackgroundColor } from './useBackgroundColor';
import ExpandedColors from './ExpandedColors';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface BackgroundColorFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * BackgroundColorField - Advanced color picker with gradient support
 *
 * Key features:
 * - Hex color picker with 8 presets
 * - Gradient mode with start/end colors and angle control
 * - Support for Tailwind classes (bg-gray-100, bg-glamlink-teal/10)
 * - Transparent background toggle
 * - Expandable UI to save space
 * - Debounced updates for performance
 */
function BackgroundColorFieldComponent({ field, error }: BackgroundColorFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const value = getFieldValue(field.name) ?? '';

  const {
    // State
    isExpanded,
    setIsExpanded,
    inputValue,
    localColorValue,
    isGradientMode,
    gradientColor1,
    gradientColor2,
    gradientAngle,
    // Computed
    isTransparent,
    isHexColor,
    isGradient,
    // Handlers
    handleColorPickerChange,
    handlePresetClick,
    handleInputChange,
    handleTransparentToggle,
    handleClear,
    handleBlur,
    toggleGradientMode,
    handleGradientColor1Change,
    handleGradientColor2Change,
    handleGradientAngleChange,
    // Utilities
    getCurrentDisplayColor,
    buildGradientString,
  } = useBackgroundColor({
    value,
    fieldName: field.name,
    updateField,
    validateField,
  });

  return (
    <BaseField field={field} error={error}>
      <div className="space-y-2">
        {/* Main compact row */}
        <div className="flex items-center gap-2">
          {/* Current color preview */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={field.disabled}
            className="flex-shrink-0 w-10 h-10 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors relative overflow-hidden"
            title="Click to expand color options"
            style={{
              background: getCurrentDisplayColor() === "gradient"
                ? "linear-gradient(135deg, rgba(20, 184, 166, 0.05), rgba(168, 85, 247, 0.05))"
                : getCurrentDisplayColor() === "transparent"
                ? "repeating-linear-gradient(45deg, #fff, #fff 5px, #f3f4f6 5px, #f3f4f6 10px)"
                : isGradient
                ? getCurrentDisplayColor()
                : getCurrentDisplayColor(),
            }}
          >
            {isExpanded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={field.disabled}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-glamlink-teal font-mono"
            placeholder={field.placeholder || "#ffffff or bg-gray-100"}
          />

          {/* Quick actions */}
          <button
            type="button"
            onClick={toggleGradientMode}
            disabled={field.disabled}
            className={`px-2 py-1.5 text-xs rounded border transition-colors ${
              isGradientMode
                ? "bg-gradient-to-r from-purple-100 to-teal-100 border-gray-400 text-gray-700"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
            title="Toggle gradient mode"
          >
            {isGradientMode ? "✓ Gradient" : "Gradient"}
          </button>

          <button
            type="button"
            onClick={handleTransparentToggle}
            disabled={field.disabled || isGradientMode}
            className={`px-2 py-1.5 text-xs rounded border transition-colors ${
              isTransparent
                ? "bg-gray-100 border-gray-400 text-gray-700"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            } ${isGradientMode ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Toggle transparent background"
          >
            {isTransparent ? "✓ Transparent" : "Transparent"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={field.disabled}
            className="px-2 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
            title="Clear value"
          >
            Clear
          </button>
        </div>

        {/* Expanded preset colors and color picker (only show when expanded) */}
        {isExpanded && (
          <ExpandedColors
            isGradientMode={isGradientMode}
            gradientColor1={gradientColor1}
            gradientColor2={gradientColor2}
            gradientAngle={gradientAngle}
            localColorValue={localColorValue}
            isHexColor={isHexColor}
            value={value}
            disabled={field.disabled}
            onGradientColor1Change={handleGradientColor1Change}
            onGradientColor2Change={handleGradientColor2Change}
            onGradientAngleChange={handleGradientAngleChange}
            onColorPickerChange={handleColorPickerChange}
            onPresetClick={handlePresetClick}
            buildGradientString={buildGradientString}
          />
        )}
      </div>
    </BaseField>
  );
}

// Memo compares field and error - re-renders only when field config or validation error changes
export const BackgroundColorField = memo(BackgroundColorFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});

// Alias for backward compatibility
export const ColorField = BackgroundColorField;

// Re-export presetColors for external use
export { presetColors } from './useBackgroundColor';

// Export standalone color picker for use outside FormContext
export { StandaloneColorPicker } from './StandaloneColorPicker';
