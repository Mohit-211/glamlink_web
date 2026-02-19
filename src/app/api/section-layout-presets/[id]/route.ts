import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import type { SectionLayoutPreset, CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";

const COLLECTION_NAME = "section-layout-presets";

// GET /api/section-layout-presets/[id] - Get a single preset
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const presetRef = doc(db, COLLECTION_NAME, id);
    const presetDoc = await getDoc(presetRef);

    if (!presetDoc.exists()) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    const data = presetDoc.data();
    const preset: SectionLayoutPreset = {
      id: presetDoc.id,
      name: data.name,
      sections: data.sections || [],
      isSystemDefault: data.isSystemDefault || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return NextResponse.json({ success: true, data: preset });
  } catch (error) {
    console.error("Error fetching preset:", error);
    return NextResponse.json(
      { error: "Failed to fetch preset" },
      { status: 500 }
    );
  }
}

// PUT /api/section-layout-presets/[id] - Update a preset
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sections, name } = body as { sections?: CondensedCardSectionInstance[]; name?: string };

    // Validate sections if provided
    if (sections !== undefined && !Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Sections must be an array" },
        { status: 400 }
      );
    }

    const presetRef = doc(db, COLLECTION_NAME, id);
    const presetDoc = await getDoc(presetRef);

    if (!presetDoc.exists()) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (sections !== undefined) {
      updates.sections = sections;
    }

    if (name !== undefined && typeof name === "string" && name.trim() !== "") {
      updates.name = name.trim();
    }

    await updateDoc(presetRef, updates);

    // Fetch updated document
    const updatedDoc = await getDoc(presetRef);
    const data = updatedDoc.data()!;

    const updatedPreset: SectionLayoutPreset = {
      id: updatedDoc.id,
      name: data.name,
      sections: data.sections || [],
      isSystemDefault: data.isSystemDefault || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return NextResponse.json({ success: true, data: updatedPreset });
  } catch (error) {
    console.error("Error updating preset:", error);
    return NextResponse.json(
      { error: "Failed to update preset" },
      { status: 500 }
    );
  }
}

// DELETE /api/section-layout-presets/[id] - Delete a preset
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prevent deletion of the default preset
    if (id === "default") {
      return NextResponse.json(
        { error: "Cannot delete the default preset" },
        { status: 400 }
      );
    }

    const presetRef = doc(db, COLLECTION_NAME, id);
    const presetDoc = await getDoc(presetRef);

    if (!presetDoc.exists()) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    // Double-check isSystemDefault flag
    const data = presetDoc.data();
    if (data.isSystemDefault) {
      return NextResponse.json(
        { error: "Cannot delete a system default preset" },
        { status: 400 }
      );
    }

    await deleteDoc(presetRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting preset:", error);
    return NextResponse.json(
      { error: "Failed to delete preset" },
      { status: 500 }
    );
  }
}
