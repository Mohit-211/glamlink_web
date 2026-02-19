import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import promosServerService from "@/lib/features/promos/server/promosServerService";

// GET /api/admin/promos/[id] - Get a single promo (for admin)
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

    const promo = await promosServerService.getPromoById(db, id, false); // Don't check visibility for admin

    if (!promo) {
      return NextResponse.json({ error: "Promo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: promo });
  } catch (error) {
    console.error("Error fetching promo:", error);
    return NextResponse.json(
      { error: "Failed to fetch promo" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/promos/[id] - Update a promo
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

    const updates = await request.json();

    const updatedPromo = await promosServerService.updatePromoAndReturn(db, id, updates);

    if (updatedPromo) {
      return NextResponse.json({ success: true, data: updatedPromo });
    } else {
      return NextResponse.json({ error: "Failed to update promo" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating promo:", error);
    return NextResponse.json(
      { error: "Failed to update promo" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/promos/[id] - Delete a promo
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

    const success = await promosServerService.deletePromo(db, id);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete promo" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting promo:", error);
    return NextResponse.json(
      { error: "Failed to delete promo" },
      { status: 500 }
    );
  }
}