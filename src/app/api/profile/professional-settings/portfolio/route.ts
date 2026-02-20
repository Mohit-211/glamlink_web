import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// PATCH /api/profile/professional-settings/portfolio - Update portfolio settings
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

    const currentSettings = brandSnap.data()?.professionalSettings?.portfolio || {};
    const newPortfolioSettings = { ...currentSettings, ...updates };

    // Update only the portfolio subsection
    await updateDoc(brandRef, {
      'professionalSettings.portfolio': newPortfolioSettings,
      'updatedAt': new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: newPortfolioSettings });
  } catch (error) {
    console.error('Error updating portfolio settings:', error);
    return NextResponse.json(
      { error: "Failed to update portfolio settings" },
      { status: 500 }
    );
  }
}
