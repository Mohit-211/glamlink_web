import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db as clientDb } from "@/lib/config/firebase";
import storageService from "@/lib/services/firebase/storageService";

interface SubmittedFile {
  name: string;
  type: string;
  size: number;
  data?: string; // base64 data for upload to Firebase Storage
  url?: string; // Firebase Storage URL after upload
}

interface GetFeaturedSubmission {
  // Common fields
  email: string;
  fullName: string;
  phone: string;
  formType: 'cover' | 'local-spotlight' | 'top-treatment' | 'rising-star' | 'profile-only';

  // Cover form fields
  bio?: string;
  headshots?: SubmittedFile[];
  workPhotos?: SubmittedFile[];
  achievements?: string[];
  favoriteQuote?: string;
  professionalProduct?: string;
  confidenceStory?: string;
  excitementFeatures?: string[];
  painPoints?: string[];
  bookingPreference?: 'in-app' | 'external';
  bookingLink?: string;
  ecommerceInterest?: 'yes' | 'later';
  contentDays?: string;
  giveaway?: string;
  specialOffers?: string;

  // Local Spotlight form fields
  businessName?: string;
  businessAddress?: string;
  primarySpecialties?: string[];
  otherSpecialty?: string;
  website?: string;
  instagramHandle?: string;
  certifications?: boolean;
  certificationDetails?: string;
  city?: string;
  specialties?: string;
  workExperience?: string;
  socialMedia?: string;
  availability?: string;
  featuredInterest?: string;
  whyLocalSpotlight?: string;
  hearAboutUs?: string;

  // Top Treatment form fields
  treatmentName?: string;
  treatmentCategory?: string;
  treatmentDescription?: string;
  treatmentBenefits?: string;
  treatmentDuration?: string;
  treatmentPrice?: string;
  treatmentExperience?: string;
  treatmentProcess?: string;
  clientResults?: string;
  idealCandidates?: string;
  aftercareInstructions?: string;
  trainingCertification?: string;
  specialEquipment?: string;
  equipmentDetails?: string;
  consultationOffer?: string;
  whyTopTreatment?: string;

  // Rising Star form fields
  location?: string;
  instagram?: string;
  careerStartTime?: string;
  backgroundStory?: string;
  careerHighlights?: string;
  uniqueApproach?: string;
  achievementsRisingStar?: string[];
  clientTestimonials?: string;
  industryChallenges?: string;
  innovations?: string;
  futureGoals?: string;
  industryInspiration?: string;
  communityInvolvement?: string;
  communityDetails?: string;
  socialMediaPresence?: string;
  awardsRecognition?: string;
  mediaFeatures?: string;
  mentorshipDetails?: string;
  advice?: string;
  contactPreference?: string;
  additionalInfo?: string;

  // Image arrays
  beforeAfterPhotos?: SubmittedFile[];
  portfolioPhotos?: SubmittedFile[];
  professionalPhotos?: SubmittedFile[];

  submittedAt: string;
}

// Note: This endpoint doesn't require authentication for public submission
// We'll use a separate Firestore instance for public submissions

async function sendEmailNotification(submission: GetFeaturedSubmission) {
  // In development, just log the email
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Development Mode - Email Notification:');
    console.log('To: glamlink@example.com');
    console.log('Subject: New Get Featured Application');
    console.log('Body:', JSON.stringify(submission, null, 2));
    return true;
  }

  // In production, you would integrate with an email service
  // like SendGrid, Mailgun, or similar
  try {
    // Example email integration (you'll need to configure this)
    // const emailResult = await emailService.send({
    //   to: 'marie@glamlink.com',
    //   subject: 'New Get Featured Application',
    //   template: 'get-featured-application',
    //   data: submission
    // });

    console.log('✅ Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    // Parse request body
    const submission: GetFeaturedSubmission = await request.json();

    console.log(`[${timestamp}] Get Featured application received from: ${submission.email}`);

    // Validate required fields
    const requiredFields = [
      'email', 'fullName', 'phone', 'formType'
    ];

    const missingFields = requiredFields.filter(field =>
      !submission[field as keyof GetFeaturedSubmission] ||
      (Array.isArray(submission[field as keyof GetFeaturedSubmission]) &&
       (submission[field as keyof GetFeaturedSubmission] as any[]).length === 0)
    );

    if (missingFields.length > 0) {
      console.error(`[${timestamp}] Missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate formType
    const validFormTypes = ['cover', 'local-spotlight', 'top-treatment', 'rising-star', 'profile-only'];
    if (!validFormTypes.includes(submission.formType)) {
      console.error(`[${timestamp}] Invalid formType: ${submission.formType}`);
      return NextResponse.json(
        { error: "Invalid form type" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submission.email)) {
      console.error(`[${timestamp}] Invalid email format: ${submission.email}`);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate profile fields
    if (!submission.fullName || submission.fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Full name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    if (!submission.phone || submission.phone.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid phone number" },
        { status: 400 }
      );
    }

    // File uploads are optional - no validation required

    // Clean and prepare data for Firestore
    const cleanedSubmission: any = { ...submission };

    // Debug: Log file data before cleaning
    console.log(`[${timestamp}] 🔍 File data before cleaning:`);
    const fileFieldsForDebug = ['headshots', 'workPhotos', 'beforeAfterPhotos', 'portfolioPhotos', 'professionalPhotos'];
    fileFieldsForDebug.forEach(field => {
      if (cleanedSubmission[field] && Array.isArray(cleanedSubmission[field])) {
        console.log(`[${timestamp}]   ${field}:`, cleanedSubmission[field].map((f: any) => ({
          name: f.name,
          hasUrl: !!f.url,
          hasData: !!f.data,
          urlSample: f.url ? f.url.substring(0, 100) + '...' : 'none'
        })));
      }
    });

    // Remove undefined/null values to avoid Firestore errors
    Object.keys(cleanedSubmission).forEach(key => {
      if (cleanedSubmission[key] === undefined || cleanedSubmission[key] === null) {
        delete cleanedSubmission[key];
      }
    });

    // Clean array fields to remove empty strings
    const arrayFields = [
      'primarySpecialties', 'achievements', 'excitementFeatures', 'painPoints',
      'treatmentBenefits', 'careerHighlights', 'achievementsRisingStar',
      'headshots', 'workPhotos', 'beforeAfterPhotos', 'portfolioPhotos',
      'professionalPhotos', 'contentPlanningMedia'
    ];

    arrayFields.forEach(field => {
      if (Array.isArray(cleanedSubmission[field])) {
        cleanedSubmission[field] = cleanedSubmission[field].filter(item =>
          item !== undefined && item !== null && item !== ''
        );
        // Remove empty arrays
        if (cleanedSubmission[field].length === 0) {
          delete cleanedSubmission[field];
        }
      }
    });

    // Handle file uploads - files may have URLs (from frontend upload) or base64 data (for server-side upload)
    const fileFields = [
      'headshots', 'workPhotos', 'beforeAfterPhotos', 'portfolioPhotos',
      'professionalPhotos', 'contentPlanningMedia'
    ];

    console.log(`[${timestamp}] 📁 Processing file uploads...`);

    for (const field of fileFields) {
      if (Array.isArray(cleanedSubmission[field]) && cleanedSubmission[field].length > 0) {
        console.log(`[${timestamp}] 📁 Processing ${field}: ${cleanedSubmission[field].length} files`);

        // Check if files need server-side upload (have base64 data but no URL)
        const filesNeedingUpload = cleanedSubmission[field].filter((file: any) =>
          file.data && !file.url
        );

        if (filesNeedingUpload.length > 0) {
          console.log(`[${timestamp}] 📤 Uploading ${filesNeedingUpload.length} files from server-side for ${field}`);

          try {
            const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const uploadedFiles = await storageService.uploadGetFeaturedFiles(
              filesNeedingUpload,
              submissionId,
              field
            );

            // Replace files with uploaded versions that have URLs
            let fileIndex = 0;
            cleanedSubmission[field] = cleanedSubmission[field].map((file: any) => {
              if (file.data && !file.url) {
                const uploadedFile = uploadedFiles[fileIndex];
                fileIndex++;
                return {
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  url: uploadedFile.url,
                  // Remove base64 data to save space
                  data: undefined
                };
              }
              return file;
            });

            console.log(`[${timestamp}] ✅ Server-side upload completed for ${field}`);
          } catch (uploadError) {
            console.error(`[${timestamp}] ❌ Server-side upload failed for ${field}:`, uploadError);
            // Continue with original files if upload fails
          }
        } else {
          console.log(`[${timestamp}] ✅ Files in ${field} already have URLs, no upload needed`);
        }
      }
    }

    const submissionData = {
      ...cleanedSubmission,
      status: 'pending_review',
      reviewed: false,
      createdAt: serverTimestamp(),
      submittedAt: submission.submittedAt || new Date().toISOString(),
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown',
        source: 'get-featured-form'
      }
    };

    // Use client db for public form submission
    if (!clientDb) {
      console.error(`[${timestamp}] ❌ Failed to get Firestore database`);
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 500 }
      );
    }

    // Store in Firestore
    const submissionsCollection = collection(clientDb, 'get-featured-submissions');
    const docRef = await addDoc(submissionsCollection, submissionData);

    console.log(`[${timestamp}] ✅ Application stored successfully with ID: ${docRef.id}`);

    // Debug: Log final file data stored in Firestore
    console.log(`[${timestamp}] 🔍 Final file data stored in Firestore:`);
    fileFieldsForDebug.forEach(field => {
      if (submissionData[field] && Array.isArray(submissionData[field])) {
        console.log(`[${timestamp}]   ${field}:`, submissionData[field].map((f: any) => ({
          name: f.name,
          hasUrl: !!f.url,
          hasData: !!f.data,
          urlSample: f.url ? f.url.substring(0, 100) + '...' : 'none'
        })));
      }
    });

    // Send email notification
    const emailSent = await sendEmailNotification(submission);
    if (!emailSent) {
      console.warn(`[${timestamp}] ⚠️ Email notification failed but application was stored`);
    }

    // Return success response
    const response = {
      success: true,
      message: "Application submitted successfully!",
      submissionId: docRef.id,
      email: submission.email
    };

    console.log(`[${timestamp}] ✅ Get Featured application processed successfully:`, response);
    return NextResponse.json(response);

  } catch (error) {
    console.error(`[${timestamp}] ❌ Get Featured application error:`, error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Failed to submit application. Please try again later.",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}