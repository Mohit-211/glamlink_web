import { NextRequest, NextResponse } from 'next/server';
import { initializeServerApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { firebaseConfig } from '@/lib/config/firebase';
import { digitalCardFormConfig } from '@/lib/pages/admin/components/form-submissions/form-configurations/data';

const COLLECTION_NAME = 'digital-card-forms';

/**
 * GET /api/public/form-configs/digital-card
 * Public endpoint to get digital card form configuration (no auth required)
 * Returns only enabled configs
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize Firebase without authentication
    const app = initializeServerApp(firebaseConfig, {});
    const db = getFirestore(app);

    // Try to fetch from database (simple query - no index required)
    // Note: Removed orderBy to avoid composite index requirement.
    // Since there's typically only one config, ordering isn't necessary.
    const formsQuery = query(
      collection(db, COLLECTION_NAME),
      where('enabled', '==', true)
    );

    const querySnapshot = await getDocs(formsQuery);

    if (querySnapshot.empty) {
      // Return static config as fallback
      return NextResponse.json({
        success: true,
        data: digitalCardFormConfig,
        source: 'static',
        message: 'Using static configuration (no database config found)'
      });
    }

    // Return the first enabled config (typically there's only one)
    const configs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: configs.length === 1 ? configs[0] : configs,
      source: 'database',
      count: configs.length
    });

  } catch (error) {
    console.error('Error fetching public digital card form config:', error);

    // Return static config as fallback on error
    return NextResponse.json({
      success: true,
      data: digitalCardFormConfig,
      source: 'static-fallback',
      warning: 'Database fetch failed, using static configuration'
    });
  }
}
