/**
 * Row Utilities for Column Layout Editor
 *
 * Helper functions for grouping sections into rows and handling
 * drag-and-drop reordering in the column-based layout editor.
 */

import type { CondensedCardSectionInstance, SectionColumn } from '@/lib/features/digital-cards/types/sections';
import { deriveColumnFromPosition } from '@/lib/features/digital-cards/preview/utils/sectionUtils';

// =============================================================================
// TYPES
// =============================================================================

/**
 * A row in the column layout editor
 * Can be either a two-column row (left/right) or a full-width row
 */
export interface LayoutRow {
  /** Row index (0-based) */
  rowIndex: number;
  /** Section in left column (or null if empty) */
  left: CondensedCardSectionInstance | null;
  /** Section in right column (or null if empty) */
  right: CondensedCardSectionInstance | null;
  /** Full-width section (mutually exclusive with left/right) */
  full: CondensedCardSectionInstance | null;
  /** Whether this is a full-width row */
  isFullWidth: boolean;
}

/**
 * Result of a drag operation
 */
export interface DragResult {
  sectionId: string;
  targetColumn: SectionColumn;
  targetRowIndex: number;
  /** If true, insert as a new row at targetRowIndex */
  insertNewRow?: boolean;
}

// =============================================================================
// SECTION COLUMN HELPERS
// =============================================================================

/**
 * Get the effective column for a section.
 * Uses explicit column if set, otherwise derives from position.
 */
export function getEffectiveColumn(section: CondensedCardSectionInstance): SectionColumn {
  if (section.column) {
    return section.column;
  }
  return deriveColumnFromPosition(section);
}

/**
 * Get the effective row order for a section.
 * Uses explicit rowOrder if set, otherwise derives from Y position.
 */
export function getEffectiveRowOrder(section: CondensedCardSectionInstance): number {
  if (section.rowOrder !== undefined) {
    return section.rowOrder;
  }
  // Derive from Y position (normalize to 0-100 range, then scale to integer)
  const yPercent = section.position?.y?.unit === '%'
    ? section.position.y.value
    : (section.position?.y?.value ?? 0) / 19.2; // Assume 1920px height
  return Math.floor(yPercent / 10); // Group into ~10 rows
}

// =============================================================================
// ROW GROUPING
// =============================================================================

/**
 * Group sections into rows for the column layout editor.
 *
 * Rules:
 * - Full-width sections get their own row
 * - Left/right sections on the same rowOrder share a row
 * - Sections are sorted by rowOrder
 */
export function groupSectionsIntoRows(sections: CondensedCardSectionInstance[]): LayoutRow[] {
  if (!sections || sections.length === 0) {
    return [];
  }

  // Add effective column and rowOrder to each section
  const sectionsWithLayout = sections.map(section => ({
    section,
    column: getEffectiveColumn(section),
    rowOrder: getEffectiveRowOrder(section),
  }));

  // Sort by rowOrder
  sectionsWithLayout.sort((a, b) => a.rowOrder - b.rowOrder);

  const rows: LayoutRow[] = [];
  let currentRowIndex = 0;

  // Process sections to build rows
  const processed = new Set<string>();

  for (const { section, column, rowOrder } of sectionsWithLayout) {
    if (processed.has(section.id)) continue;

    if (column === 'full') {
      // Full-width sections get their own row
      rows.push({
        rowIndex: currentRowIndex++,
        left: null,
        right: null,
        full: section,
        isFullWidth: true,
      });
      processed.add(section.id);
    } else {
      // Find a partner section with the same rowOrder but opposite column
      const partner = sectionsWithLayout.find(
        s => !processed.has(s.section.id) &&
             s.rowOrder === rowOrder &&
             s.column !== column &&
             s.column !== 'full'
      );

      const row: LayoutRow = {
        rowIndex: currentRowIndex++,
        left: column === 'left' ? section : (partner?.section ?? null),
        right: column === 'right' ? section : (partner?.section ?? null),
        full: null,
        isFullWidth: false,
      };

      rows.push(row);
      processed.add(section.id);
      if (partner) {
        processed.add(partner.section.id);
      }
    }
  }

  return rows;
}

// =============================================================================
// SECTION UPDATES
// =============================================================================

/**
 * Update a section's column placement.
 * Returns a new section object with updated column.
 */
export function updateSectionColumn(
  section: CondensedCardSectionInstance,
  column: SectionColumn
): CondensedCardSectionInstance {
  return {
    ...section,
    column,
  };
}

/**
 * Update a section's row order.
 * Returns a new section object with updated rowOrder.
 */
export function updateSectionRowOrder(
  section: CondensedCardSectionInstance,
  rowOrder: number
): CondensedCardSectionInstance {
  return {
    ...section,
    rowOrder,
  };
}

// =============================================================================
// DRAG AND DROP REORDERING
// =============================================================================

/**
 * Handle a drag-and-drop operation.
 * Returns updated sections array with the dragged section moved to the target.
 */
export function reorderSections(
  sections: CondensedCardSectionInstance[],
  dragResult: DragResult
): CondensedCardSectionInstance[] {
  const { sectionId, targetColumn, targetRowIndex, insertNewRow } = dragResult;

  // Find the dragged section
  const draggedIndex = sections.findIndex(s => s.id === sectionId);
  if (draggedIndex === -1) return sections;

  const draggedSection = sections[draggedIndex];

  // Create updated sections array
  const updated = sections.map(section => {
    if (section.id === sectionId) {
      // Update the dragged section
      return {
        ...section,
        column: targetColumn,
        rowOrder: targetRowIndex,
      };
    }

    // If inserting a new row, shift other sections down
    if (insertNewRow && section.rowOrder !== undefined && section.rowOrder >= targetRowIndex) {
      return {
        ...section,
        rowOrder: section.rowOrder + 1,
      };
    }

    return section;
  });

  return updated;
}

/**
 * Move a section to a specific row and column.
 * Handles row creation/shifting as needed.
 */
export function moveSectionToPosition(
  sections: CondensedCardSectionInstance[],
  sectionId: string,
  targetColumn: SectionColumn,
  targetRowIndex: number,
  createNewRow: boolean = false
): CondensedCardSectionInstance[] {
  return reorderSections(sections, {
    sectionId,
    targetColumn,
    targetRowIndex,
    insertNewRow: createNewRow,
  });
}

// =============================================================================
// SECTION MANAGEMENT
// =============================================================================

/**
 * Get the next available row index for a new section.
 */
export function getNextRowIndex(sections: CondensedCardSectionInstance[]): number {
  if (!sections || sections.length === 0) {
    return 0;
  }

  const maxRowOrder = Math.max(
    ...sections.map(s => s.rowOrder ?? getEffectiveRowOrder(s))
  );

  return maxRowOrder + 1;
}

/**
 * Normalize row orders to be sequential (0, 1, 2, ...).
 * Useful after deletions or imports.
 */
export function normalizeRowOrders(sections: CondensedCardSectionInstance[]): CondensedCardSectionInstance[] {
  const rows = groupSectionsIntoRows(sections);

  return sections.map(section => {
    // Find which row this section is in
    const rowIndex = rows.findIndex(row =>
      row.left?.id === section.id ||
      row.right?.id === section.id ||
      row.full?.id === section.id
    );

    return {
      ...section,
      rowOrder: rowIndex >= 0 ? rowIndex : getEffectiveRowOrder(section),
      column: section.column ?? getEffectiveColumn(section),
    };
  });
}

/**
 * Remove a section and renumber remaining rows.
 */
export function removeSectionAndRenumber(
  sections: CondensedCardSectionInstance[],
  sectionIdToRemove: string
): CondensedCardSectionInstance[] {
  const filtered = sections.filter(s => s.id !== sectionIdToRemove);
  return normalizeRowOrders(filtered);
}
