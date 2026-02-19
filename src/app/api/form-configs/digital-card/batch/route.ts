import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'digital-card-forms';

/**
 * POST /api/form-configs/digital-card/batch
 * Batch upload digital card form configurations (replaces existing)
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

    const { configs } = await request.json();

    // Validate array
    if (!Array.isArray(configs)) {
      return NextResponse.json(
        { error: 'Invalid request: configs must be an array' },
        { status: 400 }
      );
    }

    // Validate required fields for each config
    for (let i = 0; i < configs.length; i++) {
      if (!configs[i].id) {
        return NextResponse.json(
          { error: `Config ${i}: missing 'id'` },
          { status: 400 }
        );
      }
      if (!configs[i].title) {
        return NextResponse.json(
          { error: `Config ${i}: missing 'title'` },
          { status: 400 }
        );
      }
    }

    // Delete existing configs
    const existingSnapshot = await getDocs(collection(db, COLLECTION_NAME));
    for (const docRef of existingSnapshot.docs) {
      await deleteDoc(doc(db, COLLECTION_NAME, docRef.id));
    }

    // Upload new configs
    const now = new Date().toISOString();
    const uploadedConfigs = [];

    for (const config of configs) {
      const formConfig = {
        ...config,
        category: 'digital-card',
        createdAt: config.createdAt || now,
        updatedAt: now
      };

      const formRef = doc(db, COLLECTION_NAME, config.id);
      await setDoc(formRef, formConfig);
      uploadedConfigs.push(formConfig);
    }

    return NextResponse.json({
      success: true,
      data: uploadedConfigs,
      message: `Successfully uploaded ${uploadedConfigs.length} digital card form configuration(s)`
    });

  } catch (error) {
    console.error('Error in batch upload:', error);
    return NextResponse.json(
      {
        error: 'Batch upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
