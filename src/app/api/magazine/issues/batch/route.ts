import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import magazineServerService from '@/lib/services/firebase/magazineServerService';

export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { issues } = body;

    // Validate request body
    if (!Array.isArray(issues)) {
      return NextResponse.json({ error: "Invalid request: issues must be an array" }, { status: 400 });
    }

    // Validate each issue item
    const requiredFields = ['id', 'title', 'issueNumber', 'issueDate'];

    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i];

      if (!issue || typeof issue !== 'object') {
        return NextResponse.json({
          error: `Invalid issue at index ${i}: each item must be an object`
        }, { status: 400 });
      }

      // Check all required fields
      for (const field of requiredFields) {
        if (!issue[field]) {
          return NextResponse.json({
            error: `Invalid issue at index ${i}: missing required field '${field}'`
          }, { status: 400 });
        }
      }
    }

    // Prepare issues with default values and timestamps
    const issuesWithDefaults = issues.map(issue => ({
      ...issue,
      urlId: issue.urlId || issue.id,
      subtitle: issue.subtitle || "",
      description: issue.description || "",
      editorNote: issue.editorNote || "",
      publuuLink: issue.publuuLink || "",
      featured: issue.featured ?? false,
      visible: issue.visible ?? true,
      isEmpty: issue.isEmpty ?? false,
      sections: issue.sections || [],
      coverImage: issue.coverImage || "",
      coverImageAlt: issue.coverImageAlt || issue.title,
      createdAt: issue.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Use the existing bulk upload service to replace all issues
    // First, clear existing issues
    try {
      const existingIssues = await magazineServerService.getAllIssues(db, true);

      // Delete all existing issues
      for (const existingIssue of existingIssues) {
        await magazineServerService.deleteIssue(db, existingIssue.id);
      }
    } catch (error) {
      // Continue even if deletion fails - collection might be empty
      console.log("Note: No existing issues to delete or deletion failed:", error);
    }

    // Upload new issues
    const result = await magazineServerService.bulkUploadIssues(db, issuesWithDefaults);

    if (result.failed > 0) {
      return NextResponse.json({
        error: `Failed to upload ${result.failed} out of ${issuesWithDefaults.length} issues`,
        success: result.success,
        failed: result.failed
      }, { status: 500 });
    }

    // Return the uploaded issues
    const uploadedIssues = await magazineServerService.getAllIssues(db, true);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${result.success} issues`,
      data: uploadedIssues
    });

  } catch (error) {
    console.error("Error in magazine issues batch upload:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload magazine issues"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    error: "Method not allowed"
  }, { status: 405 });
}
