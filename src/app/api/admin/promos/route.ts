import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import promosServerService from "@/lib/features/promos/server/promosServerService";
import { PromoItem } from "@/lib/features/promos/config";

// GET /api/admin/promos - Fetch all promos (including hidden)
export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all promos (including hidden ones for admin)
    const promos = await promosServerService.getAllPromos(db, true);

    return NextResponse.json({ success: true, data: promos });
  } catch (error) {
    console.error("Error fetching admin promos:", error);
    return NextResponse.json(
      { error: "Failed to fetch promos" },
      { status: 500 }
    );
  }
}

// POST /api/admin/promos - Create a new promo
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const promoData = await request.json();

    // Validate required fields
    if (!promoData.title || !promoData.link || !promoData.ctaText || !promoData.startDate || !promoData.endDate) {
      return NextResponse.json(
        { error: "Missing required fields: title, link, ctaText, startDate, endDate" },
        { status: 400 }
      );
    }

    // Create the promo object with timestamps
    const newPromo: Omit<PromoItem, 'id'> = {
      title: promoData.title,
      subtitle: promoData.subtitle || null,
      descriptionShort: promoData.descriptionShort || null,
      description: promoData.description || null,
      modalContentHeader: promoData.modalContentHeader || null,
      image: promoData.image || '',
      link: promoData.link,
      ctaText: promoData.ctaText,
      popupDisplay: promoData.popupDisplay || '',
      startDate: promoData.startDate,
      endDate: promoData.endDate,
      category: promoData.category || null,
      discount: promoData.discount || null,
      modalStatusBadge: promoData.modalStatusBadge || null,
      modalCategoryBadge: promoData.modalCategoryBadge || null,
      priority: promoData.priority || 5,
      visible: promoData.visible !== undefined ? promoData.visible : true,
      featured: promoData.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdPromo = await promosServerService.createPromoWithAutoId(db, newPromo);

    if (!createdPromo) {
      return NextResponse.json(
        { error: "Failed to create promo" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: createdPromo });
  } catch (error) {
    console.error("Error creating promo:", error);
    return NextResponse.json(
      { error: "Failed to create promo" },
      { status: 500 }
    );
  }
}