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

    // Verify code (TOTP or backup code)
    let isValid = false;

    if (code.length === 6) {
      isValid = await TOTPService.verifyToken(secret, code);
    } else if (TOTPService.isValidBackupCodeFormat(code)) {
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

    // Generate new backup codes
    const newBackupCodes = TOTPService.generateBackupCodes(10);

    // Hash new backup codes
    const hashedBackupCodes = await Promise.all(
      newBackupCodes.map((code) => EncryptionService.hash(code))
    );

    // Update in database
    await updateDoc(brandRef, {
      securitySettings: {
        ...securitySettings,
        twoFactor: {
          ...twoFactor,
          backupCodes: hashedBackupCodes,
          backupCodesRemaining: 10,
        },
        updatedAt: serverTimestamp(),
      },
    });

    // Return new backup codes (only time they're shown)
    return NextResponse.json({
      success: true,
      backupCodes: newBackupCodes,
    });
  } catch (error) {
    console.error('Error regenerating backup codes:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate backup codes' },
      { status: 500 }
    );
  }
}
