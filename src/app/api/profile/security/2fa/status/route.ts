import { NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const twoFactor = brandData.securitySettings?.twoFactor;

    // Return status (never expose secret or backup codes)
    const status = {
      enabled: twoFactor?.enabled || false,
      method: twoFactor?.method || null,
      enabledAt: twoFactor?.enabledAt || null,
      backupCodesRemaining: twoFactor?.backupCodesRemaining || 0,
      phoneLastFour: twoFactor?.phoneNumber?.slice(-4),
    };

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('Error fetching 2FA status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch 2FA status' },
      { status: 500 }
    );
  }
}
