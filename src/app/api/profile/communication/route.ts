import { NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS } from '@/lib/features/profile-settings/communication/config';

// GET /api/profile/communication - Get all communication settings
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

    // Return communicationSettings or default
    const brandData = brandSnap.data();
    const settings = brandData?.communicationSettings || DEFAULT_COMMUNICATION_SETTINGS;

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching communication settings:', error);
    return NextResponse.json(
      { error: "Failed to fetch communication settings" },
      { status: 500 }
    );
  }
}
