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
        settings: {
          name: '',
          tagline: '',
          description: '',
          mission: '',
          email: '',
          phone: '',
        },
      });
    }

    const brandData = brandSnap.data();

    // Return brand settings with defaults if not configured
    const settings = brandData.brandSettings || {
      // Default brand settings structure
      name: brandData.name || '',
      tagline: brandData.tagline || '',
      description: brandData.description || '',
      mission: brandData.mission || '',
      email: brandData.email || '',
      phone: brandData.phone || '',
    };

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching brand settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand settings" },
      { status: 500 }
    );
  }
}
