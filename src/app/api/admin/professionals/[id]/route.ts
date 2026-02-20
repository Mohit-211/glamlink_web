import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await getAuthenticatedAppForUser();

    if (!db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedData = await request.json();

    await professionalsServerService.updateProfessional(db, id, updatedData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating professional:", error);
    return NextResponse.json({ error: "Failed to update professional" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await getAuthenticatedAppForUser();

    if (!db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await professionalsServerService.deleteProfessional(db, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting professional:", error);
    return NextResponse.json({ error: "Failed to delete professional" }, { status: 500 });
  }
}