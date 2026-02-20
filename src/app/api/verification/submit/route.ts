import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import type { VerificationSubmitRequest, VerificationSubmission } from "@/lib/features/profile-settings/verification/types";

/**
 * POST /api/verification/submit
 * Submit a new verification request
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const userId = currentUser.uid;
    const brandId = `brand_${userId}`;

    // Parse request body
    const body: VerificationSubmitRequest = await request.json();

    // Validate required fields
    const { businessInfo, ownerIdentity, businessDocs } = body;

    if (!businessInfo?.businessName || !businessInfo?.businessType) {
      return NextResponse.json(
        { error: "Business name and type are required" },
        { status: 400 }
      );
    }

    if (!ownerIdentity?.ownerFullName || !ownerIdentity?.ownerIdFront) {
      return NextResponse.json(
        { error: "Owner name and ID document are required" },
        { status: 400 }
      );
    }

    if (!businessDocs?.businessLicense) {
      return NextResponse.json(
        { error: "Business license is required" },
        { status: 400 }
      );
    }

    // Check if user already has a pending submission
    const existingDoc = await getDoc(doc(db, "verificationSubmissions", brandId));
    if (existingDoc.exists()) {
      const existingData = existingDoc.data();
      if (existingData.status === "pending") {
        return NextResponse.json(
          { error: "You already have a pending verification request" },
          { status: 400 }
        );
      }
    }

    // Create submission document
    const submission: Omit<VerificationSubmission, "id"> = {
      // Business Info
      businessName: businessInfo.businessName,
      businessType: businessInfo.businessType,
      businessAddress: businessInfo.businessAddress,
      city: businessInfo.city,
      state: businessInfo.state,
      zipCode: businessInfo.zipCode,
      country: businessInfo.country,
      yearsInBusiness: businessInfo.yearsInBusiness,
      website: businessInfo.website,
      socialMedia: businessInfo.socialMedia,

      // Owner Identity
      ownerFullName: ownerIdentity.ownerFullName,
      ownerIdFront: ownerIdentity.ownerIdFront,
      ownerIdBack: ownerIdentity.ownerIdBack,

      // Business Documents
      businessLicense: businessDocs.businessLicense,
      certifications: businessDocs.certifications,
      insurance: businessDocs.insurance,
      taxDocument: businessDocs.taxDocument,

      // Metadata
      userId,
      brandId,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    // Save to Firestore
    await setDoc(doc(db, "verificationSubmissions", brandId), {
      id: brandId,
      ...submission,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`Verification submission created for brand: ${brandId}`);

    return NextResponse.json({
      success: true,
      data: {
        id: brandId,
        status: "pending",
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error) {
    console.error("Error submitting verification:", error);
    return NextResponse.json(
      { error: "Failed to submit verification" },
      { status: 500 }
    );
  }
}
