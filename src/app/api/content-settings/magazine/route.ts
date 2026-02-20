import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, query, orderBy, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * GET /api/content-settings/magazine
 * Fetch all magazine issues
 */
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all magazine issues from Firestore
    const q = query(collection(db, 'magazineIssues'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    const issues = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: issues });
  } catch (error) {
    console.error('Error fetching magazine issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch magazine issues' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content-settings/magazine
 * Create a new magazine issue
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.id || !data.title) {
      return NextResponse.json(
        { error: 'Missing required fields: id and title' },
        { status: 400 }
      );
    }

    // Check if issue with this ID already exists
    const docRef = doc(db, 'magazineIssues', data.id);
    const existingDoc = await getDoc(docRef);
    if (existingDoc.exists()) {
      return NextResponse.json(
        { error: 'Magazine issue with this ID already exists' },
        { status: 400 }
      );
    }

    // Create new issue
    const issueData = {
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.uid,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid
    };

    await setDoc(docRef, issueData);

    return NextResponse.json({ success: true, data: { id: data.id, ...issueData } });
  } catch (error) {
    console.error('Error creating magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to create magazine issue' },
      { status: 500 }
    );
  }
}
