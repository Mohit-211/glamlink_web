import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// DELETE - Remove special hours
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, "brands", brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentSettings = brandData.brandSettings || {};
    const currentHours = currentSettings.hours || {};
    const specialHours = currentHours.specialHours || [];

    const updatedSpecialHours = specialHours.filter((sh: any) => sh.id !== id);

    const updatedHours = {
      ...currentHours,
      specialHours: updatedSpecialHours,
    };

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
    console.error("Error removing special hours:", error);
    return NextResponse.json(
      { error: "Failed to remove special hours" },
      { status: 500 }
    );
  }
}
