import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS } from '@/lib/features/profile-settings/communication/config';
import type { BookingSettings } from '@/lib/features/profile-settings/communication/types';

// PATCH - Update booking settings
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const updates: Partial<BookingSettings> = await request.json();

    // Validate pausedUntil is in future if provided
    if (updates.pausedUntil) {
      const pauseDate = new Date(updates.pausedUntil);
      if (pauseDate <= new Date()) {
        return NextResponse.json(
          { error: "Pause date must be in the future" },
          { status: 400 }
        );
      }
    }

    // Get current settings
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentBooking = brandData?.communicationSettings?.booking || DEFAULT_COMMUNICATION_SETTINGS.booking;

    // Merge updates
    const updatedBooking: BookingSettings = {
      ...currentBooking,
      ...updates,
    };

    await updateDoc(brandRef, {
      'communicationSettings.booking': updatedBooking,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Error updating booking settings:', error);
    return NextResponse.json(
      { error: "Failed to update booking settings" },
      { status: 500 }
    );
  }
}
