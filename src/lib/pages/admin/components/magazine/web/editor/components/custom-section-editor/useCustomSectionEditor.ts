import { useState, useCallback, useMemo } from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import type {
  ContentBlock,
  CustomSectionContent,
  CustomSectionLayout,
  BlockPickerItem,
} from '../../../types';
import { createContentBlock, getDefaultCustomSectionContent } from '../../../types';

interface UseCustomSectionEditorReturn {
  content: CustomSectionContent;
  blocks: ContentBlock[];
  layout: CustomSectionLayout;
  sortedBlocks: ContentBlock[];
  isPickerOpen: boolean;
  expandedBlockId: string | null;
  setIsPickerOpen: (open: boolean) => void;
  handleAddBlock: (item: BlockPickerItem) => void;
  handleUpdateBlock: (blockId: string, updates: Partial<ContentBlock>) => void;
  handleDeleteBlock: (blockId: string) => void;
  handleDuplicateBlock: (blockId: string) => void;
  handleMoveUp: (blockId: string) => void;
  handleMoveDown: (blockId: string) => void;
  handleLayoutChange: (newLayout: CustomSectionLayout) => void;
  handleToggleExpand: (blockId: string) => void;
}

export function useCustomSectionEditor(): UseCustomSectionEditorReturn {
  const { getFieldValue, updateField } = useFormContext();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

  // Get current content from form
  const content: CustomSectionContent = getFieldValue('content') || getDefaultCustomSectionContent();
  const blocks = content.blocks || [];
  const layout = content.layout || 'single-column';

  // Update content in form
  const updateContent = useCallback((updates: Partial<CustomSectionContent>) => {
    updateField('content', {
      ...content,
      ...updates,
    });
  }, [content, updateField]);

  // Update blocks
  const updateBlocks = useCallback((newBlocks: ContentBlock[]) => {
    updateContent({ blocks: newBlocks });
  }, [updateContent]);

  // Handle adding a new block
  const handleAddBlock = useCallback((item: BlockPickerItem) => {
    const newBlock = createContentBlock(
      item.name,
      item.category,
      item.defaultProps,
      blocks.length // order = end of list
    );
    updateBlocks([...blocks, newBlock]);
    setExpandedBlockId(newBlock.id); // Expand the new block
  }, [blocks, updateBlocks]);

  // Handle updating a block
  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<ContentBlock>) => {
    const newBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  // Handle deleting a block
  const handleDeleteBlock = useCallback((blockId: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return;

    const newBlocks = blocks
      .filter((block) => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index })); // Re-index

    updateBlocks(newBlocks);

    if (expandedBlockId === blockId) {
      setExpandedBlockId(null);
    }
  }, [blocks, updateBlocks, expandedBlockId]);

  // Handle duplicating a block
  const handleDuplicateBlock = useCallback((blockId: string) => {
    const blockToDuplicate = blocks.find((b) => b.id === blockId);
    if (!blockToDuplicate) return;

    const blockIndex = blocks.findIndex((b) => b.id === blockId);
    const newBlock: ContentBlock = {
      ...blockToDuplicate,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: blockIndex + 1,
    };

    // Insert after the original and re-index
    const newBlocks = [
      ...blocks.slice(0, blockIndex + 1),
      newBlock,
      ...blocks.slice(blockIndex + 1),
    ].map((block, index) => ({ ...block, order: index }));

    updateBlocks(newBlocks);
    setExpandedBlockId(newBlock.id);
  }, [blocks, updateBlocks]);

  // Handle moving a block up
  const handleMoveUp = useCallback((blockId: string) => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index <= 0) return;

    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];

    // Re-index
    newBlocks.forEach((block, i) => {
      block.order = i;
    });

    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  // Handle moving a block down
  const handleMoveDown = useCallback((blockId: string) => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index >= blocks.length - 1) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];

    // Re-index
    newBlocks.forEach((block, i) => {
      block.order = i;
    });

    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  // Handle layout change
  const handleLayoutChange = useCallback((newLayout: CustomSectionLayout) => {
    updateContent({ layout: newLayout });
  }, [updateContent]);

  // Toggle block expansion
  const handleToggleExpand = useCallback((blockId: string) => {
    setExpandedBlockId((prev) => (prev === blockId ? null : blockId));
  }, []);

  // Sorted blocks by order
  const sortedBlocks = useMemo(() =>
    [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [blocks]
  );

  return {
    content,
    blocks,
    layout,
    sortedBlocks,
    isPickerOpen,
    expandedBlockId,
    setIsPickerOpen,
    handleAddBlock,
    handleUpdateBlock,
    handleDeleteBlock,
    handleDuplicateBlock,
    handleMoveUp,
    handleMoveDown,
    handleLayoutChange,
    handleToggleExpand,
  };
}

export default useCustomSectionEditor;
