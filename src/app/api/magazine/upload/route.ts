import { NextRequest, NextResponse } from "next/server";
import magazineServerService from "@/lib/services/firebase/magazineServerService";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { MagazineIssue } from "@/lib/pages/magazine/types/magazine";

// POST /api/magazine/upload - Upload JSON issues to Firebase
export async function POST(request: NextRequest) {
  try {
    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized - please log in" }, { status: 401 });
    }

    const body = await request.json();

    // Handle single issue or multiple issues
    const issues = Array.isArray(body) ? body : [body];

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const issueData of issues) {
      try {
        // Validate required fields
        if (!issueData.id || !issueData.title || !issueData.subtitle) {
          errors.push(`Invalid issue data: missing required fields for ${issueData.id || "unknown"}`);
          failedCount++;
          continue;
        }

        // Type cast to MagazineIssue
        const issue = issueData as MagazineIssue;

        // Upload to Firebase with authenticated db
        const success = await magazineServerService.createIssue(db, issue, "json");

        if (success) {
          successCount++;
          console.log(`Successfully uploaded issue: ${issue.id}`);
        } else {
          failedCount++;
          errors.push(`Failed to upload issue ${issue.id} - may already exist`);
        }
      } catch (error) {
        failedCount++;
        errors.push(`Error processing issue: ${error}`);
      }
    }

    return NextResponse.json({
      success: successCount,
      failed: failedCount,
      total: issues.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Uploaded ${successCount} of ${issues.length} issues`,
    });
  } catch (error) {
    console.error("Error uploading magazine issues:", error);
    return NextResponse.json({ error: "Failed to upload magazine issues" }, { status: 500 });
  }
}

// GET /api/magazine/upload - Get upload status and check Firebase
export async function GET() {
  try {
    // Get authenticated Firebase instance
    const { db } = await getAuthenticatedAppForUser();

    if (!db) {
      return NextResponse.json({
        hasIssues: false,
        count: 0,
        issues: [],
      });
    }

    const hasIssues = await magazineServerService.hasIssues(db);
    const issues = await magazineServerService.getAllIssues(db);

    return NextResponse.json({
      hasIssues,
      count: issues.length,
      issues: issues.map((i) => ({
        id: i.id,
        title: i.title,
        issueNumber: i.issueNumber,
        issueDate: i.issueDate,
      })),
    });
  } catch (error) {
    console.error("Error checking Firebase status:", error);
    return NextResponse.json({ error: "Failed to check Firebase status" }, { status: 500 });
  }
}
