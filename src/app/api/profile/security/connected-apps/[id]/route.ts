import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if user has multiple sign-in methods
    if (currentUser.providerData.length <= 1) {
      return NextResponse.json(
        { error: 'Cannot disconnect the only sign-in method' },
        { status: 400 }
      );
    }

    // Note: Firebase doesn't provide a simple way to unlink providers from server-side
    // This would need to be done client-side using user.unlink(providerId)
    // For now, return a message indicating this limitation
    return NextResponse.json({
      success: false,
      error: 'Provider unlinking must be done from the client application',
      message: 'Use Firebase Auth client SDK to unlink providers',
    }, { status: 501 });
  } catch (error) {
    console.error('Error disconnecting app:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect app' },
      { status: 500 }
    );
  }
}
