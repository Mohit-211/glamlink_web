import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_PREFERENCES } from '@/lib/features/profile-settings/notifications/config';
import type { NotificationPreferences } from '@/lib/features/profile-settings/notifications/types';

// GET /api/profile/notifications - Get notification preferences
export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    // Return notificationPreferences or default
    const brandData = brandSnap.data();
    const preferences = brandData?.notificationPreferences || DEFAULT_PREFERENCES;

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: "Failed to fetch notification preferences" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile/notifications - Update notification preferences
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const updates = await request.json();

    // Prevent disabling security alerts
    if ('emailSecurity' in updates && updates.emailSecurity === false) {
      return NextResponse.json(
        { error: "Security alerts cannot be disabled" },
        { status: 400 }
      );
    }

    // Get current preferences
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    const brandData = brandSnap.data();
    const currentPreferences = brandData?.notificationPreferences || DEFAULT_PREFERENCES;

    // Merge updates
    const updatedPreferences: NotificationPreferences = {
      ...currentPreferences,
      ...updates,
      emailSecurity: true, // Always force true
    };

    // Update brand document
    await updateDoc(brandRef, {
      'notificationPreferences': updatedPreferences,
      'updatedAt': new Date().toISOString()
    });

    return NextResponse.json({ success: true, preferences: updatedPreferences });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}
