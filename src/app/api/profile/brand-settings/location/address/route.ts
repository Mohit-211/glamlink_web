import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// PATCH - Update address
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const address = await request.json();

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, "brands", brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentSettings = brandData.brandSettings || {};
    const currentLocation = currentSettings.location || {};

    const updatedLocation = {
      ...currentLocation,
      address,
    };

    const updatedSettings = {
      ...currentSettings,
      location: updatedLocation,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(brandRef, {
      brandSettings: updatedSettings,
    });

    const updatedSnap = await getDoc(brandRef);
    const finalSettings = updatedSnap.data()?.brandSettings;

    return NextResponse.json({
      success: true,
      settings: finalSettings,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}
