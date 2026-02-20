import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// PATCH - Update business hours
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { day, hours, allHours } = body;

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, "brands", brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentSettings = brandData.brandSettings || {};
    const currentHours = currentSettings.hours || {};

    let updatedHours;
    if (allHours) {
      // Update all hours
      updatedHours = allHours;
    } else if (day && hours) {
      // Update single day
      updatedHours = {
        ...currentHours,
        [day]: hours,
      };
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const updatedSettings = {
      ...currentSettings,
      hours: updatedHours,
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
    console.error("Error updating hours:", error);
    return NextResponse.json(
      { error: "Failed to update hours" },
      { status: 500 }
    );
  }
}
