import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import {
  addCustomerNote
} from '@/lib/features/crm/services/customerDbService';

interface RouteParams {
  params: Promise<{ customerId: string }>;
}

// POST /api/crm/customers/[customerId]/notes - Add a note
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { customerId } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const brandId = currentUser.uid;
    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      );
    }

    const note = await addCustomerNote(
      db,
      brandId,
      customerId,
      content.trim(),
      currentUser.uid
    );

    return NextResponse.json({
      success: true,
      data: note,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding note:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}
