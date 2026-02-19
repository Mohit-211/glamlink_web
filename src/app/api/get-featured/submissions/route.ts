import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch submissions from the get-featured-submissions collection
    const submissionsQuery = query(
      collection(db, 'get-featured-submissions'),
      orderBy('submittedAt', 'desc')
    );

    const querySnapshot = await getDocs(submissionsQuery);
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      submissions,
      count: submissions.length
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch submissions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}