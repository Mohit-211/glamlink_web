'use client';

import { EditorContent } from '@tiptap/react';
import { useTiptapEditor } from './useTiptapEditor';
import TiptapEditorToolbar from './TiptapEditorToolbar';
import RawHtmlModal from './RawHtmlModal';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minHeight?: number;
  placeholder?: string;
  showHtmlButton?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

export default function TiptapEditor({
  value,
  onChange,
  disabled = false,
  minHeight = 100,
  placeholder = 'Start typing...',
  showHtmlButton = true,
  maxLength,
  showCharCount = false,
}: TiptapEditorProps) {
  const {
    editor,
    showColorPicker,
    setShowColorPicker,
    currentColor,
    showRawHtmlModal,
    setShowRawHtmlModal,
    colorPickerRef,
    characterCount,
    fontSizes,
    presetColors,
    handleColorChange,
    handleFontSizeChange,
    getCurrentFontSize,
    handleRawHtmlApply,
    handleClearFormatting,
  } = useTiptapEditor({ value, onChange, disabled, maxLength });

  if (!editor) {
    return <div className="h-32 border border-gray-300 rounded-md bg-gray-50 animate-pulse" />;
  }

  return (
    <div className="border border-gray-300 rounded-md">
      <TiptapEditorToolbar
        editor={editor}
        showColorPicker={showColorPicker}
        setShowColorPicker={setShowColorPicker}
        currentColor={currentColor}
        colorPickerRef={colorPickerRef}
        setShowRawHtmlModal={setShowRawHtmlModal}
        fontSizes={fontSizes}
        presetColors={presetColors}
        handleColorChange={handleColorChange}
        handleFontSizeChange={handleFontSizeChange}
        getCurrentFontSize={getCurrentFontSize}
        handleClearFormatting={handleClearFormatting}
        showHtmlButton={showHtmlButton}
        characterCount={characterCount}
        maxLength={maxLength}
        showCharCount={showCharCount}
      />

      <EditorContent
        editor={editor}
        className="tiptap-editor px-3 py-2 focus-within:ring-2 focus-within:ring-glamlink-teal"
        style={{ minHeight: `${minHeight}px` }}
      />

      <RawHtmlModal
        isOpen={showRawHtmlModal}
        onClose={() => setShowRawHtmlModal(false)}
        htmlContent={editor?.getHTML() || ''}
        onApply={handleRawHtmlApply}
      />
    </div>
  );
}
