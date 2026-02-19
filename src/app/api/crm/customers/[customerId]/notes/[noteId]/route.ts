import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { deleteCustomerNote } from '@/lib/features/crm/services/customerDbService';

interface RouteParams {
  params: Promise<{ customerId: string; noteId: string }>;
}

// DELETE /api/crm/customers/[customerId]/notes/[noteId]
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { customerId, noteId } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const brandId = currentUser.uid;
    await deleteCustomerNote(db, brandId, customerId, noteId);

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting note:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
