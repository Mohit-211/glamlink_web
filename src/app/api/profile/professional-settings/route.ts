import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_PROFESSIONAL_SETTINGS } from '@/lib/features/profile-settings/professional/config';

// GET /api/profile/professional-settings - Get professional display settings
export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;

    // Get brand document
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    // Return professionalSettings or default
    const brandData = brandSnap.data();
    const settings = brandData?.professionalSettings || DEFAULT_PROFESSIONAL_SETTINGS;

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching professional settings:', error);
    return NextResponse.json(
      { error: "Failed to fetch professional settings" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile/professional-settings - Update all professional settings
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const updates = await request.json();

    // Update brand document
    const brandRef = doc(db, 'brands', brandId);
    await updateDoc(brandRef, {
      'professionalSettings': updates,
      'updatedAt': new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: updates });
  } catch (error) {
    console.error('Error updating professional settings:', error);
    return NextResponse.json(
      { error: "Failed to update professional settings" },
      { status: 500 }
    );
  }
}
