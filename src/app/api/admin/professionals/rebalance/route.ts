import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

/**
 * POST /api/admin/professionals/rebalance
 * Rebalance all order values with even gaps (1000, 2000, 3000, ...)
 *
 * This is called automatically when precision gets too low due to many
 * fractional ordering operations in the same area.
 *
 * Response: { success: true, message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!db || !currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await professionalsServerService.rebalanceAllOrders(db);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to rebalance order values" },
        { status: 500 }
      );
    }

    // Return the updated professionals list
    const professionals = await professionalsServerService.getAllProfessionals(db, true);

    return NextResponse.json({
      success: true,
      message: `Rebalanced order values for ${professionals.length} professionals`,
      data: professionals
    });
  } catch (error) {
    console.error("Error rebalancing professionals:", error);
    return NextResponse.json(
      { error: "Failed to rebalance professionals" },
      { status: 500 }
    );
  }
}
