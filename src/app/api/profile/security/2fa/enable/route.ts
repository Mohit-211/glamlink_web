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

    const { method } = await request.json();

    // Only authenticator method is implemented for now
    if (method !== 'authenticator') {
      return NextResponse.json(
        { error: 'Only authenticator method is currently supported' },
        { status: 400 }
      );
    }

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Generate TOTP secret
    const secret = TOTPService.generateSecret();

    // Generate QR code
    const qrCodeUrl = await TOTPService.generateQRCode(
      secret,
      currentUser.email || currentUser.uid,
      'Glamlink'
    );

    // Generate backup codes
    const backupCodes = TOTPService.generateBackupCodes(10);

    // Hash backup codes for storage
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => EncryptionService.hash(code))
    );

    // Encrypt secret for storage
    const encryptedSecret = EncryptionService.encrypt(secret);

    // Store in brand document (not enabled yet - waiting for verification)
    const brandData = brandSnap.data();
    const securitySettings = brandData.securitySettings || {};

    await updateDoc(brandRef, {
      securitySettings: {
        ...securitySettings,
        twoFactor: {
          enabled: false, // Not enabled until verified
          method,
          secret: encryptedSecret,
          backupCodes: hashedBackupCodes,
          backupCodesRemaining: 10,
          setupInProgress: true,
        },
        updatedAt: serverTimestamp(),
      },
    });

    // Return setup data (only send plain codes to user once)
    return NextResponse.json({
      success: true,
      setupData: {
        secret, // For manual entry
        qrCodeUrl, // For QR scanning
        backupCodes, // Plain codes (user must save these)
      },
    });
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    return NextResponse.json(
      { error: 'Failed to enable 2FA' },
      { status: 500 }
    );
  }
}
