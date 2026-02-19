import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { sendEmailVerification } from "firebase/auth";

/**
 * POST /api/profile/send-verification
 * Sends email verification to the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const { currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if email is already verified
    if (currentUser.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Send verification email
    await sendEmailVerification(currentUser);

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);

    // Handle specific Firebase errors
    if (error instanceof Error) {
      if (error.message.includes("too-many-requests")) {
        return NextResponse.json(
          { success: false, error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
