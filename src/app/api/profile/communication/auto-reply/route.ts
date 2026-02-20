import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS } from '@/lib/features/profile-settings/communication/config';
import type { AutoReplySettings } from '@/lib/features/profile-settings/communication/types';

// PATCH - Update auto-reply settings
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const updates: Partial<AutoReplySettings> = await request.json();

    // Get current settings
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentAutoReply = brandData?.communicationSettings?.autoReply || DEFAULT_COMMUNICATION_SETTINGS.autoReply;

    // Merge updates
    const updatedAutoReply: AutoReplySettings = {
      ...currentAutoReply,
      ...updates,
    };

    await updateDoc(brandRef, {
      'communicationSettings.autoReply': updatedAutoReply,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedAutoReply });
  } catch (error) {
    console.error('Error updating auto-reply settings:', error);
    return NextResponse.json(
      { error: "Failed to update auto-reply settings" },
      { status: 500 }
    );
  }
}
