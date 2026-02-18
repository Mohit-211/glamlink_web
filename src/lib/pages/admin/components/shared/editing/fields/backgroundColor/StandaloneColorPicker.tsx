"use client";

import { useBackgroundColor, presetColors } from './useBackgroundColor';
import ExpandedColors from './ExpandedColors';

interface StandaloneColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * StandaloneColorPicker - Background color picker without FormContext dependency
 *
 * Use this when you need a color picker outside of a FormProvider context,
 * such as in PdfConfigPanel or other standalone settings panels.
 *
 * Features same capabilities as BackgroundColorField:
 * - Hex color picker with presets
 * - Gradient mode with start/end colors and angle
 * - Transparent background toggle
 * - Expandable UI
 */
export function StandaloneColorPicker({
  value,
  onChange,
  label,
  helperText,
  disabled = false,
  placeholder = "#ffffff or gradient",
}: StandaloneColorPickerProps) {
  // Create adapter functions for useBackgroundColor
  const updateField = (_name: string, newValue: string) => {
    onChange(newValue);
  };
  const validateField = () => {}; // No validation in standalone mode

  const {
    isExpanded,
    setIsExpanded,
    inputValue,
    localColorValue,
    isGradientMode,
    gradientColor1,
    gradientColor2,
    gradientAngle,
    isTransparent,
    isHexColor,
    isGradient,
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
    getCurrentDisplayColor,
    buildGradientString,
  } = useBackgroundColor({
    value,
    fieldName: 'backgroundColor',
    updateField,
    validateField,
  });

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-gray-600">
          {label}
        </label>
      )}

      {/* Main compact row */}
      <div className="flex items-center gap-2">
        {/* Current color preview */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
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
          disabled={disabled}
          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-glamlink-teal font-mono"
          placeholder={placeholder}
        />

        {/* Gradient toggle */}
        <button
          type="button"
          onClick={toggleGradientMode}
          disabled={disabled}
          className={`px-2 py-1.5 text-xs rounded border transition-colors ${
            isGradientMode
              ? "bg-gradient-to-r from-purple-100 to-teal-100 border-gray-400 text-gray-700"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
          title="Toggle gradient mode"
        >
          {isGradientMode ? "✓ Gradient" : "Gradient"}
        </button>

        {/* Transparent toggle */}
        <button
          type="button"
          onClick={handleTransparentToggle}
          disabled={disabled || isGradientMode}
          className={`px-2 py-1.5 text-xs rounded border transition-colors ${
            isTransparent
              ? "bg-gray-100 border-gray-400 text-gray-700"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          } ${isGradientMode ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Toggle transparent background"
        >
          {isTransparent ? "✓ None" : "None"}
        </button>
      </div>

      {/* Expanded preset colors and color picker */}
      {isExpanded && (
        <ExpandedColors
          isGradientMode={isGradientMode}
          gradientColor1={gradientColor1}
          gradientColor2={gradientColor2}
          gradientAngle={gradientAngle}
          localColorValue={localColorValue}
          isHexColor={isHexColor}
          value={value}
          disabled={disabled}
          onGradientColor1Change={handleGradientColor1Change}
          onGradientColor2Change={handleGradientColor2Change}
          onGradientAngleChange={handleGradientAngleChange}
          onColorPickerChange={handleColorPickerChange}
          onPresetClick={handlePresetClick}
          buildGradientString={buildGradientString}
        />
      )}

      {helperText && (
        <p className="text-xs text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

export default StandaloneColorPicker;
