import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// PATCH - Pause account
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, "brands", brandId);

    await updateDoc(brandRef, {
      accountStatus: 'paused',
      pauseSettings: {
        ...body,
        isPaused: true,
      },
      updatedAt: serverTimestamp(),
    });

    const updatedSnap = await getDoc(brandRef);
    const finalSettings = updatedSnap.data()?.pauseSettings;

    return NextResponse.json({
      success: true,
      pauseSettings: finalSettings,
    });
  } catch (error) {
    console.error("Error pausing account:", error);
    return NextResponse.json(
      { error: "Failed to pause account" },
      { status: 500 }
    );
  }
}

// DELETE - Resume account
export async function DELETE() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, "brands", brandId);

    await updateDoc(brandRef, {
      accountStatus: 'active',
      pauseSettings: {
        isPaused: false,
        showPausedMessage: true,
        preserveBookings: true,
      },
      updatedAt: serverTimestamp(),
    });

    const updatedSnap = await getDoc(brandRef);
    const finalSettings = updatedSnap.data()?.pauseSettings;

    return NextResponse.json({
      success: true,
      pauseSettings: finalSettings,
    });
  } catch (error) {
    console.error("Error resuming account:", error);
    return NextResponse.json(
      { error: "Failed to resume account" },
      { status: 500 }
    );
  }
}
