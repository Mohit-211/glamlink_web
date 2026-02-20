/**
 * Digital Layouts Server Service
 *
 * Firestore operations for managing digital layout templates.
 * Provides CRUD operations and batch upload functionality.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  type Firestore
} from 'firebase/firestore';
import type { DigitalLayout } from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// COLLECTION NAME
// =============================================================================

const COLLECTION_NAME = 'digital_layouts';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert Firestore Timestamp to ISO string
 */
function timestampToString(timestamp: any): string {
  if (!timestamp) return new Date().toISOString();
  if (typeof timestamp === 'string') return timestamp;
  if (timestamp?.toDate) return timestamp.toDate().toISOString();
  return new Date().toISOString();
}

/**
 * Convert undefined values to null for Firestore
 */
function removeUndefinedDeep(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedDeep(item));
  }
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const key in obj) {
      const value = obj[key];
      if (value !== undefined) {
        result[key] = removeUndefinedDeep(value);
      }
    }
    return result;
  }
  return obj;
}

// =============================================================================
// CRUD OPERATIONS
// =============================================================================

/**
 * Get a single layout by ID
 */
async function getLayoutById(
  db: Firestore,
  id: string
): Promise<DigitalLayout | null> {
  try {
    const layoutRef = doc(db, COLLECTION_NAME, id);
    const layoutDoc = await getDoc(layoutRef);

    if (!layoutDoc.exists()) {
      return null;
    }

    const data = layoutDoc.data();

    return {
      id: layoutDoc.id,
      ...data,
      createdAt: timestampToString(data.createdAt),
      updatedAt: timestampToString(data.updatedAt),
    } as DigitalLayout;
  } catch (error) {
    console.error('Error fetching layout:', error);
    throw error;
  }
}

/**
 * Get all layouts for a specific issue
 */
async function getLayoutsByIssue(
  db: Firestore,
  issueId: string
): Promise<DigitalLayout[]> {
  try {
    const layoutsRef = collection(db, COLLECTION_NAME);
    let layouts: DigitalLayout[] = [];

    try {
      // Try with composite index
      const q = query(
        layoutsRef,
        where('issueId', '==', issueId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        layouts.push({
          id: docSnap.id,
          ...data,
          createdAt: timestampToString(data.createdAt),
          updatedAt: timestampToString(data.updatedAt),
        } as DigitalLayout);
      });
    } catch (indexError: any) {
      // Fallback to simple query with client-side sorting
      if (indexError?.code === 'failed-precondition') {
        console.log('Composite index not found, using simple query');
        const simpleQuery = query(layoutsRef, where('issueId', '==', issueId));
        const snapshot = await getDocs(simpleQuery);

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          layouts.push({
            id: docSnap.id,
            ...data,
            createdAt: timestampToString(data.createdAt),
            updatedAt: timestampToString(data.updatedAt),
          } as DigitalLayout);
        });

        // Sort by createdAt in memory
        layouts.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        throw indexError;
      }
    }

    return layouts;
  } catch (error) {
    console.error('Error fetching layouts by issue:', error);
    throw error;
  }
}

/**
 * Create a new layout
 */
async function createLayout(
  db: Firestore,
  layoutData: Omit<DigitalLayout, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DigitalLayout | null> {
  try {
    const now = Timestamp.now();

    const newLayout = {
      ...layoutData,
      createdAt: now,
      updatedAt: now,
    };

    const cleanedData = removeUndefinedDeep(newLayout);

    const layoutsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(layoutsRef, cleanedData);

    console.log('Created digital layout:', {
      id: docRef.id,
      issueId: layoutData.issueId,
      layoutName: layoutData.layoutName
    });

    return {
      id: docRef.id,
      ...layoutData,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };
  } catch (error) {
    console.error('Error creating layout:', error);
    throw error;
  }
}

/**
 * Update an existing layout
 */
async function updateLayout(
  db: Firestore,
  id: string,
  updates: Partial<Omit<DigitalLayout, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>
): Promise<DigitalLayout | null> {
  try {
    const layoutRef = doc(db, COLLECTION_NAME, id);
    const layoutDoc = await getDoc(layoutRef);

    if (!layoutDoc.exists()) {
      throw new Error(`Layout with ID ${id} not found`);
    }

    const now = Timestamp.now();
    const updateData = {
      ...updates,
      updatedAt: now,
    };

    const cleanedData = removeUndefinedDeep(updateData);

    await updateDoc(layoutRef, cleanedData);

    console.log('Updated layout:', id);

    const updatedDoc = await getDoc(layoutRef);
    const data = updatedDoc.data();

    return {
      id: updatedDoc.id,
      ...data,
      createdAt: timestampToString(data!.createdAt),
      updatedAt: timestampToString(data!.updatedAt),
    } as DigitalLayout;
  } catch (error) {
    console.error('Error updating layout:', error);
    throw error;
  }
}

/**
 * Delete a layout
 */
async function deleteLayout(
  db: Firestore,
  id: string
): Promise<boolean> {
  try {
    const layoutRef = doc(db, COLLECTION_NAME, id);
    const layoutDoc = await getDoc(layoutRef);

    if (!layoutDoc.exists()) {
      throw new Error(`Layout with ID ${id} not found`);
    }

    await deleteDoc(layoutRef);

    console.log('Deleted layout:', id);
    return true;
  } catch (error) {
    console.error('Error deleting layout:', error);
    throw error;
  }
}

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

/**
 * Bulk upload layouts (replaces existing layouts for the issue)
 */
async function bulkUploadLayouts(
  db: Firestore,
  layouts: Omit<DigitalLayout, 'createdAt' | 'updatedAt'>[]
): Promise<{ success: number; failed: number }> {
  const batch = writeBatch(db);
  let success = 0;
  let failed = 0;

  for (const layout of layouts) {
    try {
      console.log(`Processing layout ${layout.id}:`, {
        layoutName: layout.layoutName,
        issueId: layout.issueId
      });

      const docRef = doc(db, COLLECTION_NAME, layout.id);

      // Check if already exists (avoid duplicates)
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        console.log(`Skipping ${layout.id} - already exists`);
        failed++;
        continue;
      }

      const firebaseLayout = {
        ...layout,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Convert undefined fields to null
      const cleanedLayout = removeUndefinedDeep(firebaseLayout);

      batch.set(docRef, cleanedLayout);
      success++;
    } catch (error) {
      console.error(`Error preparing layout ${layout.id} for upload:`, error);
      failed++;
    }
  }

  if (success > 0) {
    try {
      await batch.commit();
      console.log(`Successfully uploaded ${success} layouts`);
    } catch (error) {
      console.error("Error committing batch upload:", error);
      return { success: 0, failed: layouts.length };
    }
  }

  return { success, failed };
}

/**
 * Delete all layouts for a specific issue
 */
async function deleteLayoutsByIssue(
  db: Firestore,
  issueId: string
): Promise<number> {
  try {
    const layouts = await getLayoutsByIssue(db, issueId);
    const batch = writeBatch(db);
    let deleteCount = 0;

    for (const layout of layouts) {
      const layoutRef = doc(db, COLLECTION_NAME, layout.id);
      batch.delete(layoutRef);
      deleteCount++;
    }

    if (deleteCount > 0) {
      await batch.commit();
      console.log(`Deleted ${deleteCount} layouts for issue ${issueId}`);
    }

    return deleteCount;
  } catch (error) {
    console.error('Error deleting layouts by issue:', error);
    throw error;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

const digitalLayoutsServerService = {
  getLayoutById,
  getLayoutsByIssue,
  createLayout,
  updateLayout,
  deleteLayout,
  bulkUploadLayouts,
  deleteLayoutsByIssue,
};

export default digitalLayoutsServerService;
