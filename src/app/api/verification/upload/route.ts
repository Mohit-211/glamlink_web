import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/config/firebase";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/verification/upload
 * Upload a verification document to Firebase Storage
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const documentType = formData.get("documentType") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!documentType) {
      return NextResponse.json(
        { error: "Document type is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, PDF" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    if (!storage) {
      return NextResponse.json(
        { error: "Storage not configured" },
        { status: 500 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `verification/${currentUser.uid}/${documentType}/${timestamp}_${sanitizedFilename}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    const metadata = {
      contentType: file.type,
      customMetadata: {
        userId: currentUser.uid,
        documentType: documentType,
        uploadedAt: new Date().toISOString(),
      },
    };

    await uploadBytes(storageRef, uint8Array, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json({
      success: true,
      url: downloadURL,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Error uploading verification document:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
