/**
 * Lock Status Route Handler
 * 
 * Handles checking the current lock status for a resource.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { lockService } from '../services/LockService';
import { RouteHandlerOptions } from '../types/api.types';

/**
 * Create a status check handler for locks
 */
export function createStatusLockHandler(options: RouteHandlerOptions) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> => {
    try {
      // Get authenticated user
      const { currentUser, db } = await getAuthenticatedAppForUser();
      
      if (!currentUser || !db) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Get resource ID from params
      const { id } = await params;
      
      // Get lock status
      const lockStatus = await lockService.getLockStatus(
        db,
        id,
        options.collection,
        currentUser.uid
      );

      // Add current user and tab context for client-side comparison
      const enhancedStatus = {
        ...lockStatus,
        currentUserId: currentUser.uid,
        currentTabId: request.headers.get('X-Tab-Id') || 'unknown'
      };

      return NextResponse.json(enhancedStatus);
    } catch (error) {
      console.error('Error checking lock status:', error);
      return NextResponse.json(
        { error: 'Failed to check lock status' },
        { status: 500 }
      );
    }
  };
}