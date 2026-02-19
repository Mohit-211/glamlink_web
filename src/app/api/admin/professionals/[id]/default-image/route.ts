import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';

/**
 * POST /api/admin/professionals/[id]/default-image
 * Uploads a condensed card preview image (base64) to Firebase Storage
 * and updates the professional's defaultCondensedCardImage field
 *
 * Body: {
 *   imageDataUrl: string (base64 data URL)
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { currentUser, firebaseServerApp, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { imageDataUrl } = body;

    // Validate required fields
    if (!imageDataUrl) {
      return NextResponse.json(
        { error: 'Image data URL is required' },
        { status: 400 }
      );
    }

    // Check if professional exists
    const professional = await professionalsServerService.getProfessionalById(db, id, false);
    if (!professional) {
      return NextResponse.json(
        { error: 'Professional not found' },
        { status: 404 }
      );
    }

    // Check if it's already a Firebase URL (no need to upload)
    if (imageDataUrl.includes('firebasestorage.googleapis.com')) {
      // Just update the field with the existing URL
      await professionalsServerService.updateProfessional(db, id, {
        defaultCondensedCardImage: imageDataUrl
      });

      return NextResponse.json({
        success: true,
        data: { imageUrl: imageDataUrl }
      });
    }

    // Check if it's a base64 data URL
    if (!imageDataUrl.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image data URL format. Expected base64 image data.' },
        { status: 400 }
      );
    }

    // Convert base64 to Blob
    const base64Data = imageDataUrl.split(',')[1];
    const mimeMatch = imageDataUrl.match(/data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Get storage instance from the server app
    const storage = getStorage(firebaseServerApp);

    // Delete old image if exists
    if (professional.defaultCondensedCardImage) {
      try {
        // Extract path from URL
        const oldUrl = professional.defaultCondensedCardImage;
        const pathMatch = oldUrl.match(/\/o\/(.*?)\?/);
        if (pathMatch) {
          const oldPath = decodeURIComponent(pathMatch[1]);
          const oldRef = ref(storage, oldPath);
          await deleteObject(oldRef);
          console.log('Deleted old default condensed card image');
        }
      } catch (deleteError) {
        // Log but don't fail if delete fails
        console.warn('Could not delete old image:', deleteError);
      }
    }

    // Create storage path
    const timestamp = Date.now();
    const extension = mimeType === 'image/png' ? 'png' : 'jpg';
    const fileName = `condensed_card_${timestamp}.${extension}`;
    const path = `professionals/${id}/condensed-card/${fileName}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: mimeType,
      customMetadata: {
        professionalId: id,
        uploadedBy: currentUser.uid,
        uploadedAt: new Date().toISOString(),
        type: 'condensed-card-default'
      }
    });

    // Get download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);

    // Update professional with the new image URL
    await professionalsServerService.updateProfessional(db, id, {
      defaultCondensedCardImage: downloadUrl
    });

    console.log('Default condensed card image uploaded successfully:', {
      professionalId: id,
      path,
      downloadUrl: downloadUrl.substring(0, 50) + '...'
    });

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: downloadUrl,
        path
      }
    });
  } catch (error) {
    console.error('Error uploading default condensed card image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/professionals/[id]/default-image
 * Removes the default condensed card image from Firebase Storage
 * and clears the professional's defaultCondensedCardImage field
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { currentUser, firebaseServerApp, db } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if professional exists
    const professional = await professionalsServerService.getProfessionalById(db, id, false);
    if (!professional) {
      return NextResponse.json(
        { error: 'Professional not found' },
        { status: 404 }
      );
    }

    // Delete from storage if exists
    if (professional.defaultCondensedCardImage) {
      try {
        const storage = getStorage(firebaseServerApp);
        const oldUrl = professional.defaultCondensedCardImage;
        const pathMatch = oldUrl.match(/\/o\/(.*?)\?/);
        if (pathMatch) {
          const oldPath = decodeURIComponent(pathMatch[1]);
          const oldRef = ref(storage, oldPath);
          await deleteObject(oldRef);
          console.log('Deleted default condensed card image from storage');
        }
      } catch (deleteError) {
        console.warn('Could not delete image from storage:', deleteError);
      }
    }

    // Clear the field in Firestore
    await professionalsServerService.updateProfessional(db, id, {
      defaultCondensedCardImage: null
    } as any);

    return NextResponse.json({
      success: true,
      message: 'Default condensed card image removed'
    });
  } catch (error) {
    console.error('Error removing default condensed card image:', error);
    return NextResponse.json(
      { error: 'Failed to remove image' },
      { status: 500 }
    );
  }
}
