import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { digitalCardFormConfig } from '@/lib/pages/admin/components/form-submissions/form-configurations/data';

const COLLECTION_NAME = 'digital-card-forms';

/**
 * POST /api/form-configs/digital-card/migrate
 * Migrate static digital card form configuration to database
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

    // Check for existing configs
    const existingForms = await getDocs(collection(db, COLLECTION_NAME));
    if (!existingForms.empty) {
      return NextResponse.json({
        success: false,
        error: 'Digital card form configurations already exist in database',
        existingCount: existingForms.size,
        message: 'Delete existing forms before running migration'
      }, { status: 400 });
    }

    // Prepare the config with timestamps
    const now = new Date().toISOString();
    const configToSave = {
      ...digitalCardFormConfig,
      createdAt: now,
      updatedAt: now
    };

    // Calculate stats
    const sectionCount = configToSave.sections?.length || 0;
    const fieldCount = configToSave.sections?.reduce(
      (sum, section) => sum + (section.fields?.length || 0),
      0
    ) || 0;

    // Save to Firestore
    const formRef = doc(db, COLLECTION_NAME, configToSave.id);
    await setDoc(formRef, configToSave);

    return NextResponse.json({
      success: true,
      message: 'Digital Card form migration completed successfully',
      migratedForms: [{
        id: configToSave.id,
        title: configToSave.title,
        sectionCount,
        fieldCount
      }],
      totalForms: 1
    });

  } catch (error) {
    console.error('Error during digital card migration:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
