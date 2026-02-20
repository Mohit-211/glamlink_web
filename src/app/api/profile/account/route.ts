import { NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc } from "firebase/firestore";

// GET - Fetch account status and settings
export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, "brands", brandId);
    const brandSnap = await getDoc(brandRef);

    // Default account data for new users
    const defaultAccountData = {
      success: true,
      accountStatus: 'active',
      pauseSettings: {
        isPaused: false,
        showPausedMessage: true,
        preserveBookings: true,
      },
      deletionRequest: null,  // Phase C
      transferRequest: null,  // Phase D
      exportHistory: [],      // Phase B
    };

    // Return defaults if brand doesn't exist (new user)
    if (!brandSnap.exists()) {
      return NextResponse.json(defaultAccountData);
    }

    const brandData = brandSnap.data();

    return NextResponse.json({
      success: true,
      accountStatus: brandData.accountStatus || 'active',
      pauseSettings: brandData.pauseSettings || defaultAccountData.pauseSettings,
      deletionRequest: null,  // Phase C
      transferRequest: null,  // Phase D
      exportHistory: [],      // Phase B
    });
  } catch (error) {
    console.error("Error fetching account data:", error);
    return NextResponse.json(
      { error: "Failed to fetch account data" },
      { status: 500 }
    );
  }
}
