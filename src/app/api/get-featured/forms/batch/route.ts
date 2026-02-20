import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, doc, setDoc, deleteDoc, orderBy, query } from 'firebase/firestore';

const COLLECTION_NAME = 'get-featured-forms';

/**
 * POST /api/get-featured/forms/batch
 * Replace all form configurations with new batch
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const configs = body.configs || body;

    // Validate that configs is an array
    if (!Array.isArray(configs)) {
      return NextResponse.json(
        { error: 'Invalid request: configs must be an array' },
        { status: 400 }
      );
    }

    // Validate each config has required fields
    for (let i = 0; i < configs.length; i++) {
      if (!configs[i].id) {
        return NextResponse.json(
          { error: `Config at index ${i}: missing 'id' field` },
          { status: 400 }
        );
      }
      if (!configs[i].title) {
        return NextResponse.json(
          { error: `Config at index ${i}: missing 'title' field` },
          { status: 400 }
        );
      }
    }

    // Step 1: Delete all existing form configs
    const existingQuery = query(collection(db, COLLECTION_NAME));
    const existingSnapshot = await getDocs(existingQuery);

    const deletePromises = existingSnapshot.docs.map(docSnapshot =>
      deleteDoc(doc(db, COLLECTION_NAME, docSnapshot.id))
    );
    await Promise.all(deletePromises);

    // Step 2: Insert all new configs
    const now = new Date().toISOString();
    const insertPromises = configs.map((config, index) => {
      const formConfig = {
        ...config,
        order: config.order ?? index,
        enabled: config.enabled ?? true,
        createdAt: config.createdAt || now,
        updatedAt: now
      };
      return setDoc(doc(db, COLLECTION_NAME, config.id), formConfig);
    });
    await Promise.all(insertPromises);

    // Step 3: Fetch and return the new list
    const newQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('order', 'asc')
    );
    const newSnapshot = await getDocs(newQuery);
    const newConfigs = newSnapshot.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data()
    }));

    return NextResponse.json({
      success: true,
      data: newConfigs,
      count: newConfigs.length,
      message: `Successfully replaced ${existingSnapshot.docs.length} configs with ${configs.length} new configs`
    });

  } catch (error) {
    console.error('Error in batch upload:', error);
    return NextResponse.json(
      {
        error: 'Failed to batch upload form configurations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
