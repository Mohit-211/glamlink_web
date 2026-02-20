import { NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

export async function GET() {
  try {
    const { currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get connected providers from Firebase Auth
    const connectedApps = currentUser.providerData.map((provider) => ({
      id: provider.providerId,
      provider: provider.providerId.replace('.com', '') as 'google' | 'apple' | 'facebook',
      email: provider.email || '',
      connectedAt: currentUser.metadata.creationTime || new Date().toISOString(),
      lastUsed: currentUser.metadata.lastSignInTime || new Date().toISOString(),
      scopes: [], // Firebase doesn't expose scopes, would need custom implementation
    }));

    return NextResponse.json({
      success: true,
      connectedApps,
    });
  } catch (error) {
    console.error('Error fetching connected apps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connected apps' },
      { status: 500 }
    );
  }
}
