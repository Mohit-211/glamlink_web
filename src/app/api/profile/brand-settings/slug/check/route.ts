import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { collection, query, where, getDocs } from "firebase/firestore";

// GET - Check slug availability
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Check if slug exists in brands collection
    const brandsRef = collection(db, "brands");
    const q = query(brandsRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    // Available if no documents found or if it's the current user's brand
    const available = querySnapshot.empty || querySnapshot.docs[0].id === `brand_${currentUser.uid}`;

    let suggestion;
    if (!available) {
      // Generate suggestion by appending number
      suggestion = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    return NextResponse.json({
      available,
      suggestion,
    });
  } catch (error) {
    console.error("Error checking slug availability:", error);
    return NextResponse.json(
      { error: "Failed to check slug availability" },
      { status: 500 }
    );
  }
}
