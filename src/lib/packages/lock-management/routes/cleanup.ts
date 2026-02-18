/**
 * Cleanup Expired Locks Route Handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '../services/LockService';
import { CleanupOptions } from '../types/lock.types';

export async function handleCleanupExpiredLocks(
  request: NextRequest,
  options: { collections: string[]; adminOnly?: boolean }
): Promise<NextResponse> {
  try {
    const { currentUser, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    // Check admin permissions if required
    if (options.adminOnly && !isAdminUser(currentUser)) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    let requestBody: any = {};
    try {
      if (request.headers.get('content-length') !== '0') {
        requestBody = await request.json();
      }
    } catch (error) {
      // Use defaults
    }

    const cleanupOptions: CleanupOptions = {
      olderThan: requestBody.olderThanMinutes || 5,
      dryRun: requestBody.dryRun || false,
      force: requestBody.force || false
    };

    const results = [];
    let totalCleaned = 0;

    for (const collection of options.collections) {
      const result = await lockService.cleanupExpiredLocks(db, collection, cleanupOptions);
      results.push({
        collection,
        cleanedCount: result.count,
        details: result.details
      });
      totalCleaned += result.count;
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${totalCleaned} expired locks across ${options.collections.length} collections`,
      results,
      summary: {
        totalCleaned,
        collectionsProcessed: options.collections.length,
        dryRun: cleanupOptions.dryRun
      }
    });

  } catch (error) {
    console.error('Error in handleCleanupExpiredLocks:', error);
    return NextResponse.json({ success: false, error: 'Failed to cleanup expired locks' }, { status: 500 });
  }
}

function isAdminUser(user: any): boolean {
  const adminEmails = ['admin@glamlink.com', 'mohit@blockcod.com', 'melanie@glamlink.net'];
  return adminEmails.includes(user.email);
}

export const cleanupHandlers = {
  allCollections: (request: NextRequest) => handleCleanupExpiredLocks(request, {
    collections: ['magazine_issues', 'sections', 'documents', 'products', 'brands'],
    adminOnly: true
  }),
  
  magazineOnly: (request: NextRequest) => handleCleanupExpiredLocks(request, {
    collections: ['magazine_issues', 'sections'],
    adminOnly: false
  })
};