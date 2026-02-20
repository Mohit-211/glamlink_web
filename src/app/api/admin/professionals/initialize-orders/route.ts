import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

/**
 * POST /api/admin/professionals/initialize-orders
 * Initialize order values for professionals that don't have them
 *
 * This is called automatically on load when professionals are fetched
 * and some are missing order values.
 *
 * Response: { success: true, initialized: number, total: number }
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!db || !currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await professionalsServerService.initializeOrders(db);

    // Return the updated professionals list
    const professionals = await professionalsServerService.getAllProfessionals(db, true);

    return NextResponse.json({
      success: true,
      initialized: result.initialized,
      total: result.total,
      message: result.initialized > 0
        ? `Initialized order values for ${result.initialized} of ${result.total} professionals`
        : 'All professionals already have order values',
      data: professionals
    });
  } catch (error) {
    console.error("Error initializing professional orders:", error);
    return NextResponse.json(
      { error: "Failed to initialize professional orders" },
      { status: 500 }
    );
  }
}
