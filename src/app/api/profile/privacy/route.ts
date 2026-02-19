import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// Default privacy settings
const DEFAULT_PRIVACY_SETTINGS = {
  profileVisibility: 'public',
  searchVisibility: 'visible',
  showActivityStatus: true,
  showLastActive: true,
  hideEmail: false,
  hidePhone: true,
  hideAddress: false,
  showCityOnly: false,
  allowMessages: true,
  allowReviews: true,
  showReviewCount: true,
  hideFromAnalytics: false,
};

export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, "brands", brandId);
    const brandSnap = await getDoc(brandRef);

    // Return defaults if brand doesn't exist (new user)
    if (!brandSnap.exists()) {
      return NextResponse.json({
        success: true,
        settings: DEFAULT_PRIVACY_SETTINGS,
      });
    }

    const brandData = brandSnap.data();
    const settings = brandData.privacySettings || DEFAULT_PRIVACY_SETTINGS;

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching privacy settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch privacy settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, "brands", brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentSettings = brandData.privacySettings || DEFAULT_PRIVACY_SETTINGS;

    // Merge updates with current settings
    const updatedSettings = {
      ...currentSettings,
      ...body,
      updatedAt: serverTimestamp(),
    };

    // Update brand document
    await updateDoc(brandRef, {
      privacySettings: updatedSettings,
    });

    // Fetch updated settings (without serverTimestamp)
    const updatedSnap = await getDoc(brandRef);
    const finalSettings = updatedSnap.data()?.privacySettings || updatedSettings;

    return NextResponse.json({
      success: true,
      settings: finalSettings,
    });
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    return NextResponse.json(
      { error: "Failed to update privacy settings" },
      { status: 500 }
    );
  }
}
