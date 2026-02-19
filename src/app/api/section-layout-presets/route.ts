import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { collection, getDocs, addDoc, doc, setDoc, query, orderBy } from "firebase/firestore";
import type { SectionLayoutPreset, CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { DEFAULT_CONDENSED_CARD_CONFIG } from "@/lib/features/digital-cards/types/condensedCardConfig";

const COLLECTION_NAME = "section-layout-presets";

/**
 * Create the default preset from DEFAULT_CONDENSED_CARD_CONFIG
 */
function createDefaultPreset(): SectionLayoutPreset {
  return {
    id: "default",
    name: "Default",
    sections: DEFAULT_CONDENSED_CARD_CONFIG.sections,
    isSystemDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// GET /api/section-layout-presets - Fetch all presets
export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const presetsRef = collection(db, COLLECTION_NAME);
    const q = query(presetsRef, orderBy("name"));
    const snapshot = await getDocs(q);

    const presets: SectionLayoutPreset[] = [];
    let hasDefault = false;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const preset: SectionLayoutPreset = {
        id: docSnap.id,
        name: data.name,
        sections: data.sections || [],
        isSystemDefault: data.isSystemDefault || false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
      presets.push(preset);

      if (docSnap.id === "default") {
        hasDefault = true;
      }
    });

    // If no default preset exists, create it
    if (!hasDefault) {
      const defaultPreset = createDefaultPreset();
      const defaultRef = doc(db, COLLECTION_NAME, "default");
      await setDoc(defaultRef, defaultPreset);
      presets.unshift(defaultPreset);
    }

    // Sort: Default first, then alphabetical
    presets.sort((a, b) => {
      if (a.id === "default") return -1;
      if (b.id === "default") return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ success: true, data: presets });
  } catch (error) {
    console.error("Error fetching section layout presets:", error);
    return NextResponse.json(
      { error: "Failed to fetch presets" },
      { status: 500 }
    );
  }
}

// POST /api/section-layout-presets - Create a new preset
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, sections } = body as { name: string; sections: CondensedCardSectionInstance[] };

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Preset name is required" },
        { status: 400 }
      );
    }

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Sections array is required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newPreset: Omit<SectionLayoutPreset, "id"> = {
      name: name.trim(),
      sections,
      isSystemDefault: false,
      createdAt: now,
      updatedAt: now,
    };

    const presetsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(presetsRef, newPreset);

    const createdPreset: SectionLayoutPreset = {
      id: docRef.id,
      ...newPreset,
    };

    return NextResponse.json({ success: true, data: createdPreset });
  } catch (error) {
    console.error("Error creating section layout preset:", error);
    return NextResponse.json(
      { error: "Failed to create preset" },
      { status: 500 }
    );
  }
}
