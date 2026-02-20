import { NextRequest, NextResponse } from 'next/server';
import promosServerService from '@/lib/features/promos/server/promosServerService';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, deleteDoc, doc, Firestore } from 'firebase/firestore';

/**
 * DELETE /api/promos/clear - Clear all promos from Firebase (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log('API: Clearing all promos from Firebase...');

    // Get authenticated Firebase app
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Admin access required.'
      }, { status: 401 });
    }

    // Get all promos and delete them one by one
    const collectionRef = collection(db, 'promos');
    const snapshot = await getDocs(collectionRef);

    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'No promos to clear. Database is already empty.'
      });
    }

    let deletedCount = 0;
    let failedCount = 0;

    for (const docSnapshot of snapshot.docs) {
      try {
        await deleteDoc(doc(db, 'promos', docSnapshot.id));
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete promo ${docSnapshot.id}:`, error);
        failedCount++;
      }
    }

    console.log(`API: Cleared ${deletedCount} promos, ${failedCount} failed`);

    return NextResponse.json({
      success: true,
      message: `Successfully cleared ${deletedCount} promos from Firebase.`,
      data: {
        deleted: deletedCount,
        failed: failedCount,
        total: snapshot.size
      }
    });

  } catch (error) {
    console.error('API: Error clearing promos:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to clear promos. Please try again later.'
    }, { status: 500 });
  }
}

/**
 * GET /api/promos/clear - Get clear status
 */
export async function GET() {
  try {
    // Get authenticated Firebase app
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Admin access required.'
      }, { status: 401 });
    }

    // Count existing promos
    const collectionRef = collection(db, 'promos');
    const snapshot = await getDocs(collectionRef);

    return NextResponse.json({
      success: true,
      data: {
        promoCount: snapshot.size,
        message: snapshot.size > 0
          ? `Found ${snapshot.size} promos in database. Use DELETE to clear them.`
          : 'Database is empty.'
      }
    });

  } catch (error) {
    console.error('API: Error checking clear status:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to check clear status.'
    }, { status: 500 });
  }
}