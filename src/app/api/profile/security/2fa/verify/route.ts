import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { TOTPService } from '@/lib/services/security/totpService';
import { EncryptionService } from '@/lib/services/security/encryptionService';

export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const securitySettings = brandData.securitySettings;
    const twoFactor = securitySettings?.twoFactor;

    if (!twoFactor || !twoFactor.setupInProgress) {
      return NextResponse.json(
        { error: '2FA setup not in progress' },
        { status: 400 }
      );
    }

    // Decrypt secret
    const secret = EncryptionService.decrypt(twoFactor.secret);

    // Verify code
    const isValid = TOTPService.verifyToken(secret, code);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Enable 2FA
    await updateDoc(brandRef, {
      securitySettings: {
        ...securitySettings,
        twoFactor: {
          ...twoFactor,
          enabled: true,
          enabledAt: new Date().toISOString(),
          setupInProgress: false,
        },
        updatedAt: serverTimestamp(),
      },
    });

    return NextResponse.json({
      success: true,
      message: '2FA enabled successfully',
    });
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    return NextResponse.json(
      { error: 'Failed to verify 2FA code' },
      { status: 500 }
    );
  }
}
