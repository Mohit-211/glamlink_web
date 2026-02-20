/**
 * Order Utilities for Fractional Ordering System
 *
 * Uses fractional ordering to minimize database writes when reordering.
 * Instead of updating all records when moving an item, we calculate a new
 * order value between two existing values.
 *
 * Example: Moving item between positions with orders 1000 and 2000
 *          results in new order = 1500 (only 1 write instead of n writes)
 */

// Default gap between order values (allows ~52 insertions before rebalancing)
const DEFAULT_GAP = 1000;

// Minimum gap before triggering automatic rebalancing
const MIN_GAP_THRESHOLD = 0.0001;

/**
 * Calculate the order value for inserting an item between two others
 *
 * @param prevOrder - Order of the item that will be before the inserted item (null if inserting at start)
 * @param nextOrder - Order of the item that will be after the inserted item (null if inserting at end)
 * @param defaultGap - Gap to use when inserting at boundaries
 * @returns New order value for the inserted item
 */
export function calculateInsertOrder(
  prevOrder: number | null | undefined,
  nextOrder: number | null | undefined,
  defaultGap: number = DEFAULT_GAP
): number {
  const prev = prevOrder ?? null;
  const next = nextOrder ?? null;

  // Case 1: Inserting at the beginning (no previous item)
  if (prev === null && next !== null) {
    return next / 2;
  }

  // Case 2: Inserting at the end (no next item)
  if (prev !== null && next === null) {
    return prev + defaultGap;
  }

  // Case 3: Inserting between two items
  if (prev !== null && next !== null) {
    return (prev + next) / 2;
  }

  // Case 4: Empty list (no items at all)
  return defaultGap;
}

/**
 * Check if the order values need rebalancing due to precision limits
 *
 * @param items - Array of items with order property
 * @returns true if rebalancing is needed
 */
export function needsRebalancing<T extends { order?: number | null }>(
  items: T[]
): boolean {
  if (items.length < 2) return false;

  // Sort by order
  const sorted = [...items]
    .filter(item => item.order !== null && item.order !== undefined)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Check gaps between consecutive items
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = (sorted[i + 1].order ?? 0) - (sorted[i].order ?? 0);
    if (gap < MIN_GAP_THRESHOLD) {
      return true;
    }
  }

  return false;
}

/**
 * Generate evenly-spaced order values for a given count
 *
 * @param count - Number of order values to generate
 * @param gap - Gap between values
 * @returns Array of order values [gap, gap*2, gap*3, ...]
 */
export function generateBalancedOrders(
  count: number,
  gap: number = DEFAULT_GAP
): number[] {
  return Array.from({ length: count }, (_, i) => (i + 1) * gap);
}

/**
 * Convert a display position (1-based) to an actual order value
 * Calculates the order needed to place an item at the target position
 *
 * @param targetPosition - Target position (1-based, 1 = first)
 * @param sortedItems - Items sorted by order
 * @param currentItemId - ID of the item being moved (to exclude from calculation)
 * @returns Order value that will place item at target position
 */
export function positionToOrder<T extends { id: string; order?: number | null }>(
  targetPosition: number,
  sortedItems: T[],
  currentItemId: string
): number {
  // Filter out the current item and ensure sorted
  const others = sortedItems
    .filter(item => item.id !== currentItemId)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  // Clamp position to valid range
  const pos = Math.max(1, Math.min(targetPosition, others.length + 1));

  // Position 1 = before first item
  if (pos === 1) {
    if (others.length === 0) {
      return DEFAULT_GAP;
    }
    return calculateInsertOrder(null, others[0].order);
  }

  // Position after last item
  if (pos > others.length) {
    return calculateInsertOrder(others[others.length - 1].order, null);
  }

  // Position between two items
  const prevItem = others[pos - 2]; // -2 because pos is 1-based and we want item before target
  const nextItem = others[pos - 1]; // -1 because pos is 1-based
  return calculateInsertOrder(prevItem.order, nextItem.order);
}

/**
 * Sort items by order, with null/undefined orders at the end
 * Secondary sort by name if orders are equal
 *
 * @param items - Array of items to sort
 * @returns New sorted array
 */
export function sortByOrder<T extends { order?: number | null; name?: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aOrder = a.order === null || a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
    const bOrder = b.order === null || b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    // Secondary sort by name
    return (a.name ?? '').localeCompare(b.name ?? '');
  });
}

/**
 * Check if any items need order initialization (have null/undefined order)
 *
 * @param items - Array of items to check
 * @returns true if any items have null/undefined order
 */
export function needsOrderInitialization<T extends { order?: number | null }>(
  items: T[]
): boolean {
  return items.some(item => item.order === null || item.order === undefined);
}

/**
 * Assign initial order values to items that don't have them
 * Preserves existing order values and fills in gaps
 *
 * @param items - Array of items, some may have order values
 * @param sortByName - Whether to sort unordered items by name first
 * @returns Map of item index to new order value (only for items that need initialization)
 */
export function calculateInitialOrders<T extends { order?: number | null; name?: string }>(
  items: T[],
  sortByName: boolean = true
): Map<number, number> {
  const orderMap = new Map<number, number>();

  // Separate items with and without orders
  const withOrders = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.order !== null && item.order !== undefined);

  const withoutOrders = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.order === null || item.order === undefined);

  if (withoutOrders.length === 0) {
    return orderMap; // Nothing to initialize
  }

  // Sort items without orders by name if requested
  if (sortByName) {
    withoutOrders.sort((a, b) => (a.item.name ?? '').localeCompare(b.item.name ?? ''));
  }

  // Find the maximum existing order value
  const maxExistingOrder = withOrders.reduce(
    (max, { item }) => Math.max(max, item.order ?? 0),
    0
  );

  // Assign order values starting after the max existing order
  let nextOrder = maxExistingOrder + DEFAULT_GAP;
  for (const { index } of withoutOrders) {
    orderMap.set(index, nextOrder);
    nextOrder += DEFAULT_GAP;
  }

  return orderMap;
}
