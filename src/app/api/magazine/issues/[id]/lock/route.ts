/**
 * Magazine Issue Lock Route - Uses Lock Management Package
 * 
 * Replaces 370 lines of complex lock logic with centralized package handlers.
 * Handles lock grouping for basic-info and cover-config tabs.
 */

import { NextRequest } from 'next/server';
import { lockRouteHandlers } from '@/lib/packages/lock-management/server';

// Use pre-configured magazine issue lock handlers from lock-management package
// These handlers support lock grouping (basic-info + cover-config = issue-metadata)
const issueHandlers = lockRouteHandlers.magazineIssues;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return issueHandlers.status(request, { params });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return issueHandlers.acquire(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return issueHandlers.release(request, { params });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return issueHandlers.extend(request, { params });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return issueHandlers.transfer(request, { params });
}