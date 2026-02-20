import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// GET /api/profile/professional - Get the current user's professional profile
export async function GET() {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find professional where ownerId matches current user
    const professionalsRef = collection(db, 'professionals');
    const q = query(professionalsRef, where('ownerId', '==', currentUser.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ professional: null });
    }

    const professionalDoc = snapshot.docs[0];
    const professional = {
      id: professionalDoc.id,
      ...professionalDoc.data()
    };

    return NextResponse.json({ professional });
  } catch (error) {
    console.error('Error fetching professional:', error);
    return NextResponse.json({ error: "Failed to fetch professional" }, { status: 500 });
  }
}

// PUT /api/profile/professional - Update the current user's professional profile
export async function PUT(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();

    // Find professional where ownerId matches current user
    const professionalsRef = collection(db, 'professionals');
    const q = query(professionalsRef, where('ownerId', '==', currentUser.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "No professional profile linked to this account" }, { status: 404 });
    }

    const professionalDoc = snapshot.docs[0];
    
    // Remove fields that shouldn't be updated by the user
    delete updates.id;
    delete updates.ownerId;
    delete updates.createdAt;
    
    // Add updatedAt timestamp
    updates.updatedAt = new Date().toISOString();

    // Update the professional document
    const professionalRef = doc(db, 'professionals', professionalDoc.id);
    await updateDoc(professionalRef, updates);

    return NextResponse.json({ 
      success: true,
      professional: {
        id: professionalDoc.id,
        ...professionalDoc.data(),
        ...updates
      }
    });
  } catch (error) {
    console.error('Error updating professional:', error);
    return NextResponse.json({ error: "Failed to update professional" }, { status: 500 });
  }
}
