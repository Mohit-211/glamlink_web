import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, doc, setDoc, orderBy, query } from 'firebase/firestore';

const COLLECTION_NAME = 'digital-card-forms';

/**
 * GET /api/form-configs/digital-card
 * Get all digital card form configurations
 */
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all digital card form configs, ordered by order field
    const formsQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('order', 'asc')
    );

    const querySnapshot = await getDocs(formsQuery);
    const formConfigs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: formConfigs,
      count: formConfigs.length
    });

  } catch (error) {
    console.error('Error fetching digital card form configs:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch digital card form configurations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/form-configs/digital-card
 * Create a new digital card form configuration
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

    const data = await request.json();

    // Validate required fields
    if (!data.id) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    if (!data.title) {
      return NextResponse.json(
        { error: 'Form title is required' },
        { status: 400 }
      );
    }

    // Prepare form config with timestamps and category
    const now = new Date().toISOString();
    const formConfig = {
      ...data,
      category: 'digital-card',
      createdAt: data.createdAt || now,
      updatedAt: now
    };

    // Use the provided ID as the document ID
    const formRef = doc(db, COLLECTION_NAME, data.id);
    await setDoc(formRef, formConfig);

    return NextResponse.json({
      success: true,
      data: formConfig,
      message: 'Digital card form configuration created successfully'
    });

  } catch (error) {
    console.error('Error creating digital card form config:', error);
    return NextResponse.json(
      {
        error: 'Failed to create digital card form configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
