import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { defaultPageVisibility, PageConfig } from '@/lib/config/pageVisibility';

/**
 * GET /api/content-settings/visibility
 * Fetch current page visibility settings
 */
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get visibility settings from Firestore or use defaults
    // IMPORTANT: Use same collection as middleware (/api/settings/page-visibility)
    const docRef = doc(db, 'settings', 'pageVisibility');
    const docSnap = await getDoc(docRef);

    let settings: PageConfig[];
    if (docSnap.exists()) {
      const savedSettings = docSnap.data()?.pages || [];

      // Merge saved settings with defaults to include new pages
      const savedPaths = new Set(savedSettings.map((s: PageConfig) => s.path));
      const newPages = defaultPageVisibility.filter(p => !savedPaths.has(p.path));

      settings = [...savedSettings, ...newPages];
    } else {
      settings = defaultPageVisibility;
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching visibility settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visibility settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content-settings/visibility
 * Update page visibility settings
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await request.json();

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Invalid settings format' },
        { status: 400 }
      );
    }

    // Save to Firestore
    // IMPORTANT: Use same collection as middleware (/api/settings/page-visibility)
    const docRef = doc(db, 'settings', 'pageVisibility');
    await setDoc(docRef, {
      pages: settings,
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: currentUser.uid,
      version: 1
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating visibility settings:', error);
    return NextResponse.json(
      { error: 'Failed to update visibility settings' },
      { status: 500 }
    );
  }
}
