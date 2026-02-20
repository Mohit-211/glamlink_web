import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage } from 'firebase/storage';

/**
 * POST /api/digital-pages/upload-canvas
 * Uploads a canvas image (base64) to Firebase Storage and returns the download URL
 *
 * Body: {
 *   canvasDataUrl: string (base64 data URL)
 *   issueId: string
 *   pageId: string
 *   pageNumber: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { currentUser, firebaseServerApp } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { canvasDataUrl, issueId, pageId, pageNumber } = body;

    // Validate required fields
    if (!canvasDataUrl) {
      return NextResponse.json(
        { error: 'Canvas data URL is required' },
        { status: 400 }
      );
    }

    if (!issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    // Check if it's already a Firebase URL (no need to upload)
    if (canvasDataUrl.includes('firebasestorage.googleapis.com')) {
      return NextResponse.json({
        success: true,
        data: { canvasUrl: canvasDataUrl }
      });
    }

    // Check if it's a base64 data URL
    if (!canvasDataUrl.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid canvas data URL format. Expected base64 image data.' },
        { status: 400 }
      );
    }

    // Convert base64 to Blob
    const base64Data = canvasDataUrl.split(',')[1];
    const mimeMatch = canvasDataUrl.match(/data:([^;]+);/);
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

    // Create storage path
    const timestamp = Date.now();
    const extension = mimeType === 'image/png' ? 'png' : 'jpg';
    const fileName = `page_${pageNumber || 'new'}_${timestamp}.${extension}`;
    const path = `digital-pages/${issueId}/${pageId || 'new'}/${fileName}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: mimeType,
      customMetadata: {
        issueId,
        pageId: pageId || 'new',
        pageNumber: String(pageNumber || 1),
        uploadedBy: currentUser.uid,
        uploadedAt: new Date().toISOString()
      }
    });

    // Get download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);

    console.log('Canvas uploaded successfully:', {
      issueId,
      pageId,
      pageNumber,
      path,
      downloadUrl: downloadUrl.substring(0, 50) + '...'
    });

    return NextResponse.json({
      success: true,
      data: {
        canvasUrl: downloadUrl,
        path
      }
    });
  } catch (error) {
    console.error('Error uploading canvas:', error);
    return NextResponse.json(
      { error: 'Failed to upload canvas' },
      { status: 500 }
    );
  }
}
