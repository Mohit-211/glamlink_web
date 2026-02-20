import { NextResponse } from 'next/server';
import { getPublicFirebaseApp } from '@/lib/firebase/serverApp';
import { collection, getDocs } from 'firebase/firestore';

interface DebugProfessional {
  id: string;
  name: string;
  featured: unknown;
  exists: boolean;
}

export async function GET() {
  try {
    const { db } = await getPublicFirebaseApp();

    if (!db) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 500 }
      );
    }

    const professionalsCollection = collection(db, 'professionals');
    const snapshot = await getDocs(professionalsCollection);

    const professionals: DebugProfessional[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      professionals.push({
        id: doc.id,
        name: data.name || 'No name',
        featured: data.featured,
        exists: true
      });
    });

    return NextResponse.json({
      success: true,
      count: professionals.length,
      professionals
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error },
      { status: 500 }
    );
  }
}