import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import magazineServerService from '@/lib/services/firebase/magazineServerService';

export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get issueId from query params
    const searchParams = request.nextUrl.searchParams;
    const issueId = searchParams.get('issueId');

    if (!issueId) {
      return NextResponse.json({ error: "Issue ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { sections } = body;

    // Validate request body
    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: "Invalid request: sections must be an array" }, { status: 400 });
    }

    // Validate each section item
    const requiredFields = ['id', 'type'];

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      if (!section || typeof section !== 'object') {
        return NextResponse.json({
          error: `Invalid section at index ${i}: each item must be an object`
        }, { status: 400 });
      }

      // Check all required fields
      for (const field of requiredFields) {
        if (!section[field]) {
          return NextResponse.json({
            error: `Invalid section at index ${i}: missing required field '${field}'`
          }, { status: 400 });
        }
      }
    }

    // Prepare sections with default values
    const sectionsWithDefaults = sections.map(section => ({
      ...section,
      title: section.title || "",
      subtitle: section.subtitle || "",
      content: section.content || {},
      order: section.order ?? 0,
      backgroundColor: section.backgroundColor || "#ffffff"
    }));

    // Get the issue to update its sections
    const issue = await magazineServerService.getIssueById(db, issueId);

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Update the issue with new sections (replaces all sections)
    await magazineServerService.updateIssue(db, issueId, {
      sections: sectionsWithDefaults
    });

    // Get the updated issue to return
    const updatedIssue = await magazineServerService.getIssueById(db, issueId);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${sectionsWithDefaults.length} sections`,
      data: updatedIssue?.sections || []
    });

  } catch (error) {
    console.error("Error in magazine sections batch upload:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload magazine sections"
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
