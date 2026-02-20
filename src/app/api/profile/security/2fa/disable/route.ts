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

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code required' },
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

    if (!twoFactor || !twoFactor.enabled) {
      return NextResponse.json(
        { error: '2FA is not enabled' },
        { status: 400 }
      );
    }

    // Decrypt secret
    const secret = EncryptionService.decrypt(twoFactor.secret);

    // Check if it's a TOTP code or backup code
    let isValid = false;

    // Try as TOTP code first
    if (code.length === 6) {
      isValid = await TOTPService.verifyToken(secret, code);
    }

    // Try as backup code if TOTP failed
    if (!isValid && TOTPService.isValidBackupCodeFormat(code)) {
      // Check against backup codes
      for (const hashedCode of twoFactor.backupCodes || []) {
        if (await EncryptionService.compareHash(code, hashedCode)) {
          isValid = true;
          break;
        }
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Disable 2FA and clear all 2FA data
    await updateDoc(brandRef, {
      securitySettings: {
        ...securitySettings,
        twoFactor: {
          enabled: false,
          method: null,
          secret: null,
          backupCodes: [],
          backupCodesRemaining: 0,
        },
        updatedAt: serverTimestamp(),
      },
    });

    return NextResponse.json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    );
  }
}
