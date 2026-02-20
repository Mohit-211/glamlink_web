import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ProfileTabConfig, defaultProfileTabs } from "@/lib/config/profileTabs";

// GET - Fetch profile tabs settings
export async function GET(request: NextRequest) {
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docRef = doc(db, "settings", "profileTabs");
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return NextResponse.json({ success: true, data: defaultProfileTabs });
  }

  // Merge existing data with default structure to ensure subsections exist
  const existingTabs = docSnap.data().tabs || [];
  const mergedTabs = defaultProfileTabs.map(defaultTab => {
    const existingTab = existingTabs.find((t: ProfileTabConfig) => t.id === defaultTab.id);

    if (!existingTab) {
      return defaultTab;
    }

    // Merge subsections - keep existing visibility but ensure all subsections exist
    const mergedSubsections = defaultTab.subsections.map(defaultSubsection => {
      const existingSubsection = existingTab.subsections?.find(
        (s: { id: string }) => s.id === defaultSubsection.id
      );
      return existingSubsection || defaultSubsection;
    });

    return {
      ...defaultTab,
      ...existingTab,
      subsections: mergedSubsections
    };
  });

  return NextResponse.json({ success: true, data: mergedTabs });
}

// POST - Update profile tabs settings
export async function POST(request: NextRequest) {
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tabs } = await request.json();

  if (!Array.isArray(tabs)) {
    return NextResponse.json({ error: "Invalid request: tabs must be an array" }, { status: 400 });
  }

  const docRef = doc(db, "settings", "profileTabs");
  await setDoc(docRef, {
    tabs,
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedBy: currentUser.uid,
    version: 1
  });

  return NextResponse.json({ success: true, data: tabs });
}
