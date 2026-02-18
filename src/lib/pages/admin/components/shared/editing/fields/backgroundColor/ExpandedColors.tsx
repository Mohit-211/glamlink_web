"use client";

import React from "react";
import { HexColorPicker } from "react-colorful";
import { presetColors } from "./useBackgroundColor";

interface ExpandedColorsProps {
  // Mode
  isGradientMode: boolean;

  // Values
  gradientColor1: string;
  gradientColor2: string;
  gradientAngle: number;
  localColorValue: string;
  isHexColor: boolean;
  value: string;
  disabled?: boolean;

  // Handlers
  onGradientColor1Change: (color: string) => void;
  onGradientColor2Change: (color: string) => void;
  onGradientAngleChange: (angle: number) => void;
  onColorPickerChange: (color: string) => void;
  onPresetClick: (preset: string) => void;
  buildGradientString: () => string;
}

/**
 * ExpandedColors - Expanded color picker UI
 *
 * Contains both gradient mode and solid color mode UI
 */
export default function ExpandedColors({
  isGradientMode,
  gradientColor1,
  gradientColor2,
  gradientAngle,
  localColorValue,
  isHexColor,
  value,
  disabled,
  onGradientColor1Change,
  onGradientColor2Change,
  onGradientAngleChange,
  onColorPickerChange,
  onPresetClick,
  buildGradientString,
}: ExpandedColorsProps) {
  if (isGradientMode) {
    // Gradient mode UI
    return (
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
        <div className="space-y-3">
          <div className="flex gap-4">
            {/* Color 1 Picker */}
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-2">Start Color:</div>
              <HexColorPicker
                color={gradientColor1}
                onChange={onGradientColor1Change}
                style={{ width: "120px", height: "120px" }}
              />
              <input
                type="text"
                value={gradientColor1}
                onChange={(e) => onGradientColor1Change(e.target.value)}
                className="mt-2 w-[120px] px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                placeholder="#ffffff"
              />
            </div>

            {/* Angle Selector */}
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-2">Direction: {gradientAngle} deg</div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradientAngle}
                  onChange={(e) => onGradientAngleChange(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="grid grid-cols-4 gap-1">
                  <button
                    type="button"
                    onClick={() => onGradientAngleChange(0)}
                    className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50"
                    title="Top to Bottom"
                  >Down</button>
                  <button
                    type="button"
                    onClick={() => onGradientAngleChange(45)}
                    className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50"
                    title="Diagonal"
                  >45</button>
                  <button
                    type="button"
                    onClick={() => onGradientAngleChange(90)}
                    className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50"
                    title="Left to Right"
                  >Right</button>
                  <button
                    type="button"
                    onClick={() => onGradientAngleChange(135)}
                    className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50"
                    title="Diagonal"
                  >135</button>
                </div>
              </div>
            </div>

            {/* Color 2 Picker */}
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-2">End Color:</div>
              <HexColorPicker
                color={gradientColor2}
                onChange={onGradientColor2Change}
                style={{ width: "120px", height: "120px" }}
              />
              <input
                type="text"
                value={gradientColor2}
                onChange={(e) => onGradientColor2Change(e.target.value)}
                className="mt-2 w-[120px] px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Gradient Preview */}
          <div>
            <div className="text-xs text-gray-600 mb-1">Preview:</div>
            <div
              className="h-12 rounded border-2 border-gray-300"
              style={{ background: buildGradientString() }}
            />
          </div>

          <div className="text-xs text-gray-500">
            Tip: Adjust the angle slider or use arrow buttons for common directions
          </div>
        </div>
      </div>
    );
  }

  // Solid color mode UI
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <div className="flex gap-4">
        {/* Left side - Color Picker */}
        <div className="flex-shrink-0">
          <div className="text-xs text-gray-600 mb-2">Color Picker:</div>
          <HexColorPicker
            color={isHexColor ? localColorValue : "#ffffff"}
            onChange={onColorPickerChange}
            style={{ width: "120px", height: "120px" }}
          />
        </div>

        {/* Right side - Preset Colors */}
        <div className="flex-1">
          <div className="text-xs text-gray-600 mb-2">Quick Presets:</div>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((preset) => {
              const isSelected = value === preset.value;
              const displayStyle = preset.display === "gradient"
                ? { background: "linear-gradient(135deg, rgba(20, 184, 166, 0.05), rgba(168, 85, 247, 0.05))" }
                : preset.opacity
                ? { backgroundColor: preset.display, opacity: preset.opacity }
                : { backgroundColor: preset.display };

              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onPresetClick(preset.value)}
                  disabled={disabled}
                  className={`relative w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                    isSelected
                      ? "border-glamlink-teal shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={displayStyle}
                  title={preset.name}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-gray-500 mt-3">
            Tip: You can enter hex colors (#ffffff) or Tailwind classes (bg-gray-100)
          </div>
        </div>
      </div>
    </div>
  );
}
