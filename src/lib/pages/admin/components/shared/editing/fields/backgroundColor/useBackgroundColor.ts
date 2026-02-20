"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// Preset colors optimized for backgrounds
export const presetColors = [
  { name: "White", value: "#ffffff", display: "#ffffff" },
  { name: "Warm White", value: "#FAF7F2", display: "#FAF7F2" },
  { name: "Light Gray", value: "#f9fafb", display: "#f9fafb" },
  { name: "Glamlink Teal", value: "#14b8a6", display: "#14b8a6" },
  { name: "Teal Light", value: "bg-glamlink-teal/10", display: "#14b8a6", opacity: 0.1 },
  { name: "Purple Light", value: "bg-glamlink-purple/10", display: "#a855f7", opacity: 0.1 },
  { name: "Gray 100", value: "bg-gray-100", display: "#f3f4f6" },
  { name: "Gradient Teal", value: "bg-gradient-to-br from-glamlink-teal/5 to-glamlink-purple/5", display: "gradient" },
];

interface UseBackgroundColorProps {
  value: string;
  fieldName: string;
  updateField: (name: string, value: any) => void;
  validateField: (name: string) => void;
}

export interface UseBackgroundColorReturn {
  // State
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  inputValue: string;
  localColorValue: string;
  isGradientMode: boolean;
  gradientColor1: string;
  gradientColor2: string;
  gradientAngle: number;

  // Computed
  isTransparent: boolean;
  isHexColor: boolean;
  isGradient: boolean;

  // Handlers
  handleColorPickerChange: (color: string) => void;
  handlePresetClick: (preset: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTransparentToggle: () => void;
  handleClear: () => void;
  handleBlur: () => void;
  toggleGradientMode: () => void;
  handleGradientColor1Change: (color: string) => void;
  handleGradientColor2Change: (color: string) => void;
  handleGradientAngleChange: (angle: number) => void;

  // Utilities
  getCurrentDisplayColor: () => string;
  buildGradientString: () => string;
}

export function useBackgroundColor({
  value,
  fieldName,
  updateField,
  validateField,
}: UseBackgroundColorProps): UseBackgroundColorReturn {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [localColorValue, setLocalColorValue] = useState(value);
  const [isGradientMode, setIsGradientMode] = useState(false);
  const [gradientColor1, setGradientColor1] = useState("#f5f7fa");
  const [gradientColor2, setGradientColor2] = useState("#c3cfe2");
  const [gradientAngle, setGradientAngle] = useState(135);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const gradientTimer1 = useRef<NodeJS.Timeout | null>(null);
  const gradientTimer2 = useRef<NodeJS.Timeout | null>(null);

  // Computed values
  const isTransparent = value === "transparent" || value === "";
  const isHexColor = value?.startsWith("#");
  const isGradient = value?.startsWith("linear-gradient") || value?.startsWith("radial-gradient");

  // Parse gradient values when switching to gradient mode or value changes
  useEffect(() => {
    if (isGradient && value) {
      const match = value.match(/linear-gradient\((\d+)deg,\s*([^,]+),\s*([^)]+)\)/);
      if (match) {
        setGradientAngle(parseInt(match[1]));
        setGradientColor1(match[2].trim());
        setGradientColor2(match[3].trim());
        setIsGradientMode(true);
      }
    }
  }, [value, isGradient]);

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value);
    setLocalColorValue(value);
  }, [value]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (gradientTimer1.current) clearTimeout(gradientTimer1.current);
      if (gradientTimer2.current) clearTimeout(gradientTimer2.current);
    };
  }, []);

  // Get display color for the current value
  const getCurrentDisplayColor = useCallback(() => {
    if (isTransparent) return "transparent";
    if (isGradient) return value;
    if (isHexColor) return value;
    const preset = presetColors.find(p => p.value === value);
    return preset ? preset.display : "#e5e7eb";
  }, [isTransparent, isGradient, isHexColor, value]);

  // Build gradient string
  const buildGradientString = useCallback(() => {
    return `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`;
  }, [gradientAngle, gradientColor1, gradientColor2]);

  // Toggle gradient mode
  const toggleGradientMode = useCallback(() => {
    if (isGradientMode) {
      setIsGradientMode(false);
      const newColor = gradientColor1;
      updateField(fieldName, newColor);
      setInputValue(newColor);
      setLocalColorValue(newColor);
    } else {
      setIsGradientMode(true);
      const currentColor = isHexColor ? value : "#f5f7fa";
      setGradientColor1(currentColor);
      setGradientColor2("#c3cfe2");
      const gradient = `linear-gradient(${gradientAngle}deg, ${currentColor}, #c3cfe2)`;
      updateField(fieldName, gradient);
      setInputValue(gradient);
    }
  }, [isGradientMode, gradientColor1, isHexColor, value, gradientAngle, updateField, fieldName]);

  // Debounced color change handler for the color picker
  const handleColorPickerChange = useCallback((color: string) => {
    setLocalColorValue(color);
    setInputValue(color);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      updateField(fieldName, color);
    }, 150);
  }, [fieldName, updateField]);

  // Handle gradient color changes with debouncing
  const handleGradientColor1Change = useCallback((color: string) => {
    setGradientColor1(color);
    if (gradientTimer1.current) clearTimeout(gradientTimer1.current);
    gradientTimer1.current = setTimeout(() => {
      const gradient = `linear-gradient(${gradientAngle}deg, ${color}, ${gradientColor2})`;
      updateField(fieldName, gradient);
      setInputValue(gradient);
    }, 150);
  }, [gradientAngle, gradientColor2, fieldName, updateField]);

  const handleGradientColor2Change = useCallback((color: string) => {
    setGradientColor2(color);
    if (gradientTimer2.current) clearTimeout(gradientTimer2.current);
    gradientTimer2.current = setTimeout(() => {
      const gradient = `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${color})`;
      updateField(fieldName, gradient);
      setInputValue(gradient);
    }, 150);
  }, [gradientAngle, gradientColor1, fieldName, updateField]);

  const handleGradientAngleChange = useCallback((angle: number) => {
    setGradientAngle(angle);
    const gradient = `linear-gradient(${angle}deg, ${gradientColor1}, ${gradientColor2})`;
    updateField(fieldName, gradient);
    setInputValue(gradient);
  }, [gradientColor1, gradientColor2, fieldName, updateField]);

  const handlePresetClick = useCallback((presetValue: string) => {
    updateField(fieldName, presetValue);
    setInputValue(presetValue);
    setLocalColorValue(presetValue);
  }, [fieldName, updateField]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setLocalColorValue(newValue);
    updateField(fieldName, newValue);
  }, [fieldName, updateField]);

  const handleTransparentToggle = useCallback(() => {
    const newValue = isTransparent ? "#ffffff" : "transparent";
    updateField(fieldName, newValue);
    setInputValue(newValue);
    setLocalColorValue(newValue);
  }, [isTransparent, fieldName, updateField]);

  const handleClear = useCallback(() => {
    updateField(fieldName, "");
    setInputValue("");
  }, [fieldName, updateField]);

  const handleBlur = useCallback(() => {
    validateField(fieldName);
  }, [fieldName, validateField]);

  return {
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
  };
}
