import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import magazineServerService from '@/lib/services/firebase/magazineServerService';
import storageService from '@/lib/services/firebase/storageService';

// Allowed emails for PDF upload
const ALLOWED_EMAILS = ['mohit@blockcod.com', 'melanie@glamlink.net', 'admin@glamlink.com'];

// POST /api/magazine/issues/[id]/pdf - Upload PDF for a magazine issue
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }
    
    // Check if user has permission
    if (!ALLOWED_EMAILS.includes(currentUser.email || '')) {
      return NextResponse.json(
        { error: 'Forbidden - you do not have permission to upload PDFs' },
        { status: 403 }
      );
    }
    
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!file.type || file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }
    
    // Check if issue exists
    const issue = await magazineServerService.getIssueById(db, id, false);
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }
    
    // Convert File to Blob for upload
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    
    // Upload to Firebase Storage
    const storagePath = `magazines/${id}/magazine.pdf`;
    const pdfUrl = await storageService.uploadImage(blob, storagePath, {
      contentType: 'application/pdf',
      customMetadata: {
        issueId: id,
        issueTitle: issue.title,
        uploadedBy: currentUser.email || '',
        uploadedAt: new Date().toISOString()
      }
    });
    
    // Update issue with PDF URL
    const updated = await magazineServerService.updateIssue(db, id, {
      pdfUrl
    });
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update issue with PDF URL' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      pdfUrl,
      message: 'PDF uploaded successfully'
    });
    
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json(
      { error: 'Failed to upload PDF' },
      { status: 500 }
    );
  }
}

// DELETE /api/magazine/issues/[id]/pdf - Remove PDF from a magazine issue
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }
    
    // Check if user has permission
    if (!ALLOWED_EMAILS.includes(currentUser.email || '')) {
      return NextResponse.json(
        { error: 'Forbidden - you do not have permission to remove PDFs' },
        { status: 403 }
      );
    }
    
    // Check if issue exists and has a PDF
    const issue = await magazineServerService.getIssueById(db, id, false);
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }
    
    if (!issue.pdfUrl) {
      return NextResponse.json(
        { error: 'No PDF to remove' },
        { status: 400 }
      );
    }
    
    // Delete from Firebase Storage
    try {
      const storagePath = `magazines/${id}/magazine.pdf`;
      await storageService.deleteFile(storagePath);
    } catch (storageError) {
      console.warn('Failed to delete file from storage:', storageError);
      // Continue even if storage deletion fails
    }
    
    // Remove PDF URL from issue
    const updated = await magazineServerService.updateIssue(db, id, {
      pdfUrl: undefined
    });
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update issue' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'PDF removed successfully'
    });
    
  } catch (error) {
    console.error('Error removing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to remove PDF' },
      { status: 500 }
    );
  }
}

// GET /api/magazine/issues/[id]/pdf - Get PDF info for a magazine issue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get authenticated Firebase instance
    const { db } = await getAuthenticatedAppForUser();
    
    if (!db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get issue
    const issue = await magazineServerService.getIssueById(db, id, false);
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      hasPdf: !!issue.pdfUrl,
      pdfUrl: issue.pdfUrl || null
    });
    
  } catch (error) {
    console.error('Error getting PDF info:', error);
    return NextResponse.json(
      { error: 'Failed to get PDF info' },
      { status: 500 }
    );
  }
}