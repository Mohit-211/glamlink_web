import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import magazineServerService from '@/lib/services/firebase/magazineServerService';
import magazineSectionService from '@/lib/pages/magazine/services/magazineSectionService';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

// Path to the magazine configuration files (fallback)
const MAGAZINES_CONFIG_PATH = path.join(process.cwd(), 'lib/pages/magazine/config/magazines.json');
const ISSUES_DIR_PATH = path.join(process.cwd(), 'lib/pages/magazine/config/issues');

// GET /api/magazine/issues/[id] - Get a specific magazine issue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: issueId } = await params;
    
    // Get authenticated Firebase instance
    const { db } = await getAuthenticatedAppForUser();
    
    if (!db) {
      // Fall back to file system if no auth
      try {
        const issueFilePath = path.join(ISSUES_DIR_PATH, `${issueId}.json`);
        const issueData = await fs.readFile(issueFilePath, 'utf-8');
        const issue = JSON.parse(issueData);
        return NextResponse.json(issue);
      } catch (error) {
        return NextResponse.json(
          { error: 'Issue not found' },
          { status: 404 }
        );
      }
    }
    
    // Try Firebase first with authenticated db
    let issue = await magazineServerService.getIssueById(db, issueId);
    
    // If not in Firebase, try file system and migrate
    if (!issue) {
      try {
        const issueFilePath = path.join(ISSUES_DIR_PATH, `${issueId}.json`);
        const issueData = await fs.readFile(issueFilePath, 'utf-8');
        issue = JSON.parse(issueData);
        
        // Upload to Firebase for future use
        if (issue) {
          await magazineServerService.createIssue(db, issue, 'migration');
        }
      } catch (error) {
        // File doesn't exist either
      }
    }
    
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(issue);
  } catch (error) {
    console.error('Error fetching magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch magazine issue' },
      { status: 500 }
    );
  }
}

// PUT /api/magazine/issues/[id] - Update a magazine issue
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: issueId } = await params;
    
    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }
    const updates = await request.json();
    
    // Debug logging for save operation
    console.log(`💾 PUT /api/magazine/issues/${issueId} - Received updates:`, {
      issueId,
      updateKeys: Object.keys(updates),
      updateValues: Object.entries(updates).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' && value.length > 100 
          ? value.substring(0, 100) + '...' 
          : value;
        return acc;
      }, {} as Record<string, any>)
    });
    
    // Update in Firebase with authenticated db
    const success = await magazineServerService.updateIssue(db, issueId, updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Issue not found or failed to update' },
        { status: 404 }
      );
    }
    
    // If this issue is featured, unfeatured all others
    if (updates.featured) {
      const allIssues = await magazineServerService.getAllIssues(db);
      for (const existingIssue of allIssues) {
        if (existingIssue.id !== issueId && existingIssue.featured) {
          await magazineServerService.updateIssue(db, existingIssue.id, { featured: false });
        }
      }
    }
    
    // Get the updated issue to return
    // IMPORTANT: Pass checkVisibility: false to get the issue even if it's hidden
    // The editor needs to see the issue regardless of visibility status
    const updatedIssue = await magazineServerService.getIssueById(db, issueId, false);
    
    if (!updatedIssue) {
      return NextResponse.json(
        { error: 'Failed to retrieve updated issue' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error('Error updating magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to update magazine issue' },
      { status: 500 }
    );
  }
}

// DELETE /api/magazine/issues/[id] - Delete a magazine issue
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: issueId } = await params;
    
    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }
    
    // First, delete all sections for this issue from the sections collection
    console.log(`Deleting sections for issue ${issueId}...`);
    const sectionsDeleted = await magazineSectionService.deleteAllSectionsForIssue(db, issueId);
    
    if (!sectionsDeleted) {
      console.warn('Failed to delete some sections, but continuing with issue deletion');
    }
    
    // Then delete the issue itself from Firebase
    const success = await magazineServerService.deleteIssue(db, issueId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Issue not found or failed to delete' },
        { status: 404 }
      );
    }
    
    console.log(`Successfully deleted issue ${issueId} and its sections`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to delete magazine issue' },
      { status: 500 }
    );
  }
}

// Helper function to update the magazineIssueService.ts imports
async function updateServiceImports() {
  try {
    const servicePath = path.join(process.cwd(), 'lib/pages/magazine/services/magazineIssueService.ts');
    const serviceContent = await fs.readFile(servicePath, 'utf-8');
    
    // Get all issue files
    const issueFiles = await fs.readdir(ISSUES_DIR_PATH);
    const issueIds = issueFiles
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
    
    // Generate imports
    const imports = issueIds.map((id, index) => 
      `import issue${index + 1} from '../config/issues/${id}.json';`
    ).join('\n');
    
    // Generate issue map
    const issueMap = issueIds.map((id, index) => 
      `  '${id}': issue${index + 1} as MagazineIssue,`
    ).join('\n');
    
    // Update the service file
    const updatedContent = serviceContent
      .replace(/import issue\d+ from.*?;/g, '') // Remove old imports
      .replace(/const issueContentMap[\s\S]*?};/, `const issueContentMap: Record<string, MagazineIssue> = {\n${issueMap}\n};`);
    
    // Add imports at the top (after other imports)
    const lines = updatedContent.split('\n');
    const typeImportIndex = lines.findIndex(line => line.includes("import { MagazineIssue"));
    lines.splice(typeImportIndex + 2, 0, imports);
    
    await fs.writeFile(servicePath, lines.join('\n'));
  } catch (error) {
    console.error('Error updating service imports:', error);
    // Non-critical error, continue
  }
}