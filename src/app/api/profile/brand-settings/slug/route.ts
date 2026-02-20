import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";

// PATCH - Update slug
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const brandRef = doc(db, "brands", brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentSlug = brandData.slug;

    // Check if slug is already taken by another brand
    const brandsRef = collection(db, "brands");
    const q = query(brandsRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty && querySnapshot.docs[0].id !== brandId) {
      return NextResponse.json({ error: "This URL is already taken" }, { status: 409 });
    }

    // Update brand document
    const currentSettings = brandData.brandSettings || {};
    const currentUrlSettings = currentSettings.url || { slug: currentSlug, previousSlugs: [] };

    // Add current slug to previous slugs if changing
    const previousSlugs = currentSlug !== slug
      ? [...(currentUrlSettings.previousSlugs || []), currentSlug]
      : currentUrlSettings.previousSlugs;

    const updatedUrlSettings = {
      ...currentUrlSettings,
      slug,
      previousSlugs,
      slugChangedAt: new Date().toISOString(),
    };

    const updatedSettings = {
      ...currentSettings,
      url: updatedUrlSettings,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(brandRef, {
      slug, // Also update top-level slug for queries
      brandSettings: updatedSettings,
    });

    // Fetch updated
    const updatedSnap = await getDoc(brandRef);
    const finalSettings = updatedSnap.data()?.brandSettings;

    return NextResponse.json({
      success: true,
      settings: finalSettings,
    });
  } catch (error) {
    console.error("Error updating slug:", error);
    return NextResponse.json(
      { error: "Failed to update slug" },
      { status: 500 }
    );
  }
}
