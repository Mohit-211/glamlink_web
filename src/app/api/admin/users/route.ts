import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, query, getDocs, where, limit } from 'firebase/firestore';

interface UserResult {
  uid: string;
  displayName: string | null;
  email: string | null;
}

/**
 * GET /api/admin/users
 *
 * Search users by name or email.
 * Query params:
 *   - search: Search query (matches displayName or email)
 *   - uid: Get specific user by UID
 *
 * Returns: Array of { uid, displayName, email }
 */
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search')?.toLowerCase().trim();
    const specificUid = searchParams.get('uid');

    // If requesting specific UID
    if (specificUid) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', specificUid), limit(1));
      const snapshot = await getDocs(q);

      const users: UserResult[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        users.push({
          uid: data.uid || doc.id,
          displayName: data.displayName || null,
          email: data.email || null,
        });
      });

      return NextResponse.json({ success: true, data: users });
    }

    // If no search query, return empty (don't load all users)
    if (!searchQuery || searchQuery.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Firestore doesn't support LIKE queries, so we fetch all users and filter client-side
    // For large user bases, consider using Algolia or ElasticSearch
    // For now, we'll fetch up to 100 users and filter
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(100));
    const snapshot = await getDocs(q);

    const users: UserResult[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const displayName = (data.displayName || '').toLowerCase();
      const email = (data.email || '').toLowerCase();

      // Filter by search query
      if (displayName.includes(searchQuery) || email.includes(searchQuery)) {
        users.push({
          uid: data.uid || doc.id,
          displayName: data.displayName || null,
          email: data.email || null,
        });
      }
    });

    // Sort by displayName, then by email
    users.sort((a, b) => {
      const nameA = (a.displayName || a.email || '').toLowerCase();
      const nameB = (b.displayName || b.email || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // Limit results
    const limitedUsers = users.slice(0, 20);

    return NextResponse.json({ success: true, data: limitedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
