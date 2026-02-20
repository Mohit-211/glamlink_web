import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import professionalsServerService from '@/lib/pages/for-professionals/server/professionalsServerService';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

/**
 * Remove undefined and null values from object (Firestore doesn't accept undefined)
 */
function removeInvalidValues<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    const value = obj[key];
    // Keep the value if it's not undefined and not null
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Transform submission data to Professional format
 */
function transformSubmissionToProfessional(submission: any): Omit<Professional, 'id'> {
  const professional = {
    name: submission.name || '',
    title: submission.title || '',
    specialty: submission.specialty || '',
    bio: submission.bio || '',
    email: submission.email || '',
    phone: submission.phone || '',
    website: submission.website || '',
    instagram: submission.instagram || '',
    tiktok: submission.tiktok || '',
    bookingUrl: submission.bookingUrl || '',
    preferredBookingMethod: submission.preferredBookingMethod,
    customHandle: submission.customHandle || '',  // Custom URL handle for the professional
    business_name: submission.businessName || '',
    location: submission.locations?.[0]?.address || '',
    locationData: submission.locations?.[0],
    locations: submission.locations || [],
    specialties: submission.specialties?.length > 0
      ? submission.specialties
      : submission.primarySpecialties || [],
    businessHours: submission.businessHours || [],
    importantInfo: submission.importantInfo || [],
    // Gallery and portfolio
    gallery: submission.gallery || [],
    // Professional settings
    certificationLevel: 'Silver' as const,
    yearsExperience: 5,
    hasDigitalCard: true,
    featured: false,
    isFounder: false,
    rating: 0,
    reviewCount: 0,
    profileImage: submission.profileImage || 'https://source.unsplash.com/300x300/?beauty,professional',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Remove any remaining undefined or null values
  return removeInvalidValues(professional) as Omit<Professional, 'id'>;
}

/**
 * POST /api/apply/digital-card/submissions/[id]/convert
 * Convert a submission to a Professional
 * 1. Transform submission data → Professional format
 * 2. Create professional in `professionals` collection
 * 3. Update submission: hidden = true
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();
    const { id } = await params;

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the submission
    const submissionRef = doc(db, 'digital-card-applications', id);
    const submissionDoc = await getDoc(submissionRef);

    if (!submissionDoc.exists()) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const submission = submissionDoc.data();

    // Check if submission is approved
    if (submission.status !== 'approved') {
      return NextResponse.json(
        { error: 'Only approved submissions can be converted to professionals' },
        { status: 400 }
      );
    }

    // Check if already converted (hidden)
    if (submission.hidden === true) {
      return NextResponse.json(
        { error: 'This submission has already been converted to a professional' },
        { status: 400 }
      );
    }

    // Transform submission to professional format
    const professionalData = transformSubmissionToProfessional(submission);

    // Create the professional
    const result = await professionalsServerService.createProfessionalWithAutoId(db, professionalData);

    if (!result?.id) {
      return NextResponse.json(
        { error: 'Failed to create professional' },
        { status: 500 }
      );
    }

    // Mark submission as hidden
    await updateDoc(submissionRef, {
      hidden: true,
      convertedToProfessionalId: result.id,
      convertedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      professionalId: result.id,
      message: 'Professional created successfully'
    });

  } catch (error) {
    console.error('Error converting submission to professional:', error);
    return NextResponse.json(
      {
        error: 'Failed to convert submission to professional',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
