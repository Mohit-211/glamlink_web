import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser, getPublicFirebaseApp } from "@/lib/firebase/serverApp";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { PageConfig, defaultPageVisibility } from "@/lib/config/pageVisibility";

// Settings document structure
interface PageVisibilitySettings {
  pages: PageConfig[];
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  version: number;
}

// Allowed emails for settings management
const ALLOWED_EMAILS = [
  "mohit@blockcod.com",
  "melanie@glamlink.net",
  "admin@glamlink.com"
];

// GET - Fetch current page visibility settings
export async function GET() {
  try {
    // [page-visibility GET] Fetching settings from database...

    // Use server-side DB for reading (no auth required)
    const { db } = await getPublicFirebaseApp();

    if (!db) {
      // [page-visibility GET] No database connection, returning defaults
      return NextResponse.json({
        success: false,
        settings: defaultPageVisibility,
        isDefault: true
      });
    }

    const settingsDoc = await getDoc(doc(db, "settings", "pageVisibility"));
    
    if (!settingsDoc.exists()) {
      // [page-visibility GET] No settings document found, returning defaults
      // Return defaults if no settings exist
      return NextResponse.json({
        success: true,
        settings: defaultPageVisibility,
        isDefault: true
      });
    }

    const data = settingsDoc.data() as PageVisibilitySettings;
    // [page-visibility GET] Found settings document
    
    // Merge with defaults to ensure ALL pages are included
    // This ensures new pages added to defaults automatically appear
    const mergedSettings = defaultPageVisibility.map(defaultPage => {
      const savedPage = data.pages.find(p => p.path === defaultPage.path);
      // If page exists in saved data, use saved settings (preserves visibility)
      // If page doesn't exist in saved data, use default settings
      return savedPage || defaultPage;
    });
    
    // Log that we successfully merged settings
  // [page-visibility GET] Settings merged with defaults successfully

    return NextResponse.json({
      success: true,
      settings: mergedSettings,
      lastUpdatedBy: data.lastUpdatedBy,
      lastUpdatedAt: data.lastUpdatedAt,
      version: data.version || 1,
      isDefault: false
    });
  } catch (error) {
    // Error fetching page visibility settings
    return NextResponse.json({
      success: false,
      error: "Failed to fetch settings",
      settings: defaultPageVisibility,
      isDefault: true
    });
  }
}

// POST - Update page visibility settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;
    
    // [page-visibility POST] Update request received
    // [page-visibility POST] Settings count

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json({
        success: false,
        error: "Invalid settings format"
      }, { status: 400 });
    }

    // Check authentication
    const { db, currentUser } = await getAuthenticatedAppForUser();
    
    // Check if user is in allowed list
    if (!currentUser || !currentUser.email || !ALLOWED_EMAILS.includes(currentUser.email)) {
      // [page-visibility POST] Unauthorized access attempt
      return NextResponse.json({
        success: false,
        error: "Unauthorized - you don't have permission to update settings"
      }, { status: 401 });
    }
    
    // [page-visibility POST] Auth check

    // Use authenticated db from the logged-in user
    if (!db) {
      return NextResponse.json({
        success: false,
        error: "Database connection failed"
      }, { status: 500 });
    }

    // Get current version
    const currentDoc = await getDoc(doc(db, "settings", "pageVisibility"));
    const currentVersion = currentDoc.exists() 
      ? (currentDoc.data() as PageVisibilitySettings).version || 0 
      : 0;

    // Ensure we include ALL pages from defaults (for new pages added after initial save)
    const completeSettings = defaultPageVisibility.map(defaultPage => {
      const incomingPage = settings.find(p => p.path === defaultPage.path);
      // Use incoming page data if available, otherwise use default
      return incomingPage || defaultPage;
    });

    // Save to database
    const settingsData: PageVisibilitySettings = {
      pages: completeSettings,
      lastUpdatedBy: currentUser.email,
      lastUpdatedAt: new Date().toISOString(),
      version: currentVersion + 1
    };
    
    // Log that we're saving complete settings including any new defaults
  // [page-visibility POST] Saving complete settings with all pages included

    await setDoc(doc(db, "settings", "pageVisibility"), settingsData);
    
    // [page-visibility POST] Settings saved successfully to database

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      lastUpdatedBy: currentUser.email,
      lastUpdatedAt: settingsData.lastUpdatedAt,
      version: settingsData.version
    });
  } catch (error) {
    // Error updating page visibility settings
    return NextResponse.json({
      success: false,
      error: "Failed to update settings"
    }, { status: 500 });
  }
}