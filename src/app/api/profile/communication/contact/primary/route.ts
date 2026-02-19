import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS } from '@/lib/features/profile-settings/communication/config';
import type { ContactMethodConfig, ContactMethod } from '@/lib/features/profile-settings/communication/types';

// PATCH - Set primary contact method
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const { method }: { method: ContactMethod } = await request.json();

    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentMethods: ContactMethodConfig[] = brandData?.communicationSettings?.contactMethods || DEFAULT_COMMUNICATION_SETTINGS.contactMethods;

    // Set all to false except specified
    const updatedMethods = currentMethods.map(m => ({
      ...m,
      isPrimary: m.method === method,
    }));

    await updateDoc(brandRef, {
      'communicationSettings.contactMethods': updatedMethods,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedMethods });
  } catch (error) {
    console.error('Error setting primary contact:', error);
    return NextResponse.json(
      { error: "Failed to set primary contact" },
      { status: 500 }
    );
  }
}
