import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// PATCH /api/profile/professional-settings/certifications - Update certification settings
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const updates = await request.json();

    // Get current settings
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    const currentSettings = brandSnap.data()?.professionalSettings?.certifications || {};
    const newCertificationSettings = { ...currentSettings, ...updates };

    // Update only the certifications subsection
    await updateDoc(brandRef, {
      'professionalSettings.certifications': newCertificationSettings,
      'updatedAt': new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: newCertificationSettings });
  } catch (error) {
    console.error('Error updating certification settings:', error);
    return NextResponse.json(
      { error: "Failed to update certification settings" },
      { status: 500 }
    );
  }
}
