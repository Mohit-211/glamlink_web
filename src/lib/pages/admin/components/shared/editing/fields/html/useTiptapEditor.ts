'use client';

import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontSize from '@tiptap/extension-font-size';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useState, useRef, useCallback, RefObject, useMemo } from 'react';

// Font size options
export const fontSizes = [
  { label: 'Small', value: '12px' },
  { label: 'Normal', value: '14px' },
  { label: 'Medium', value: '16px' },
  { label: 'Large', value: '18px' },
  { label: 'XL', value: '20px' },
  { label: '2XL', value: '24px' },
  { label: '3XL', value: '28px' },
  { label: '4XL', value: '32px' },
];

// Preset color options
export const presetColors = [
  '#000000', // Black
  '#333333', // Dark Gray
  '#666666', // Gray
  '#999999', // Light Gray
  '#FF0000', // Red
  '#FF6B6B', // Light Red
  '#4ECDC4', // Teal (Glamlink)
  '#95E1D3', // Light Teal
  '#A855F7', // Purple
  '#C084FC', // Light Purple
  '#3B82F6', // Blue
  '#60A5FA', // Light Blue
  '#10B981', // Green
  '#34D399', // Light Green
  '#F59E0B', // Orange
  '#FCD34D', // Light Orange
];

interface UseTiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

interface UseTiptapEditorReturn {
  // Editor
  editor: Editor | null;

  // State
  showColorPicker: boolean;
  setShowColorPicker: (v: boolean) => void;
  currentColor: string;
  setCurrentColor: (v: string) => void;
  showRawHtmlModal: boolean;
  setShowRawHtmlModal: (v: boolean) => void;
  colorPickerRef: RefObject<HTMLDivElement | null>;

  // Character count
  characterCount: number;

  // Constants
  fontSizes: typeof fontSizes;
  presetColors: typeof presetColors;

  // Handlers
  handleColorChange: (color: string) => void;
  handleFontSizeChange: (size: string) => void;
  getCurrentFontSize: () => string;
  handleRawHtmlApply: (newHtml: string) => void;
  handleClearFormatting: () => void;
}

export function useTiptapEditor({
  value,
  onChange,
  disabled = false,
  maxLength,
}: UseTiptapEditorProps): UseTiptapEditorReturn {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [showRawHtmlModal, setShowRawHtmlModal] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Build extensions array with optional CharacterCount
  const extensions = useMemo(() => {
    const baseExtensions: any[] = [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      TextStyle,  // MUST be first for Color and FontSize to work
      Color.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
    ];

    // Add CharacterCount extension with limit if maxLength is provided
    if (maxLength !== undefined) {
      baseExtensions.push(
        CharacterCount.configure({
          limit: maxLength,
        })
      );
    }

    return baseExtensions;
  }, [maxLength]);

  const editor = useEditor({
    extensions,
    content: value || '',
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        spellcheck: 'true',  // Enable browser spell check
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  // Update content when value changes externally
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  const handleColorChange = useCallback((color: string) => {
    setCurrentColor(color);
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  }, [editor]);

  const handleFontSizeChange = useCallback((size: string) => {
    if (editor) {
      (editor.chain().focus() as any).setFontSize(size).run();
    }
  }, [editor]);

  const getCurrentFontSize = useCallback(() => {
    if (!editor) return '14px';
    const { $from } = editor.state.selection;
    const marks = $from.marks();
    const textStyleMark = marks.find(mark => mark.type.name === 'textStyle');
    return textStyleMark?.attrs?.fontSize || '14px';
  }, [editor]);

  const handleRawHtmlApply = useCallback((newHtml: string) => {
    if (editor) {
      editor.commands.setContent(newHtml);
      onChange(newHtml);
    }
  }, [editor, onChange]);

  const handleClearFormatting = useCallback(() => {
    if (editor) {
      editor.chain()
        .focus()
        .clearNodes()
        .unsetAllMarks()
        .run();
      setCurrentColor('#000000');
    }
  }, [editor]);

  // Calculate character count - use CharacterCount extension if available, otherwise fallback to getText()
  const characterCount = editor?.storage.characterCount?.characters() ?? editor?.getText().length ?? 0;

  return {
    editor,
    showColorPicker,
    setShowColorPicker,
    currentColor,
    setCurrentColor,
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
  };
}
