/**
 * BackgroundEditor Component
 *
 * Background editing tools: remove, replace, blur
 */

'use client';

import { useState } from 'react';

interface BackgroundEditorProps {
  imageUrl: string;
  onApply: (result: BackgroundEditResult) => void;
  onCancel: () => void;
}

export interface BackgroundEditResult {
  type: 'remove' | 'replace' | 'blur';
  backgroundColor?: string;
  backgroundImage?: string;
  blurAmount?: number;
}

const BACKGROUND_COLORS = [
  '#FFFFFF', // White
  '#F3F4F6', // Gray-100
  '#000000', // Black
  '#FEF2F2', // Red-50
  '#FFF7ED', // Orange-50
  '#FFFBEB', // Yellow-50
  '#F0FDF4', // Green-50
  '#EFF6FF', // Blue-50
  '#FAF5FF', // Purple-50
  '#FDF2F8', // Pink-50
  'transparent', // Transparent
];

const BLUR_LEVELS = [
  { label: 'Light', value: 5 },
  { label: 'Medium', value: 10 },
  { label: 'Strong', value: 20 },
  { label: 'Extra', value: 40 },
];

export function BackgroundEditor({ imageUrl, onApply, onCancel }: BackgroundEditorProps) {
  const [mode, setMode] = useState<'remove' | 'replace' | 'blur'>('remove');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [customColor, setCustomColor] = useState('#FFFFFF');
  const [blurAmount, setBlurAmount] = useState(10);
  const [processing, setProcessing] = useState(false);

  const handleApply = async () => {
    setProcessing(true);

    // In a real implementation, this would call an AI service
    // to remove/process the background
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result: BackgroundEditResult = {
      type: mode,
    };

    switch (mode) {
      case 'remove':
        result.backgroundColor = 'transparent';
        break;
      case 'replace':
        result.backgroundColor = backgroundColor === 'custom' ? customColor : backgroundColor;
        break;
      case 'blur':
        result.blurAmount = blurAmount;
        break;
    }

    setProcessing(false);
    onApply(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Background</h2>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex">
          {/* Preview */}
          <div className="w-1/2 p-6 border-r border-gray-200">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect fill='%23f3f4f6' width='10' height='10'/%3E%3Crect fill='%23fff' x='10' width='10' height='10'/%3E%3Crect fill='%23fff' y='10' width='10' height='10'/%3E%3Crect fill='%23f3f4f6' x='10' y='10' width='10' height='10'/%3E%3C/svg%3E")`,
                }}
              />
              <img
                src={imageUrl}
                alt="Preview"
                className="relative w-full h-full object-contain"
                style={{
                  filter: mode === 'blur' ? `blur(${blurAmount}px)` : undefined,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Preview (processing may differ)
            </p>
          </div>

          {/* Options */}
          <div className="w-1/2 p-6">
            {/* Mode tabs */}
            <div className="flex space-x-2 mb-6">
              {[
                { id: 'remove', label: 'Remove', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
                { id: 'replace', label: 'Replace', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { id: 'blur', label: 'Blur', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMode(tab.id as typeof mode)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === tab.id
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mode-specific options */}
            {mode === 'remove' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Remove Background</h3>
                  <p className="text-sm text-gray-500">
                    AI will automatically detect and remove the background from your image,
                    leaving a transparent background.
                  </p>
                </div>
                <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700">
                    Works best with images that have clear subject-background separation.
                  </p>
                </div>
              </div>
            )}

            {mode === 'replace' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Background Color</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {BACKGROUND_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBackgroundColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          backgroundColor === color
                            ? 'border-pink-500 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          backgroundColor: color === 'transparent' ? undefined : color,
                          backgroundImage: color === 'transparent'
                            ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect fill='%23f3f4f6' width='10' height='10'/%3E%3Crect fill='%23fff' x='10' width='10' height='10'/%3E%3Crect fill='%23fff' y='10' width='10' height='10'/%3E%3Crect fill='%23f3f4f6' x='10' y='10' width='10' height='10'/%3E%3C/svg%3E")`
                            : undefined,
                        }}
                        title={color === 'transparent' ? 'Transparent' : color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Custom Color</h3>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        setBackgroundColor('custom');
                      }}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        setBackgroundColor('custom');
                      }}
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'blur' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Blur Amount</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {BLUR_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setBlurAmount(level.value)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          blurAmount === level.value
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {level.label} ({level.value}px)
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Custom Amount</h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={blurAmount}
                      onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-12 text-right">{blurAmount}px</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700">
                    Background blur helps draw attention to the main subject while keeping context visible.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            disabled={processing}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={processing}
            className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center"
          >
            {processing && (
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {processing ? 'Processing...' : 'Apply changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundEditor;
