import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import magazineServerService from '@/lib/services/firebase/magazineServerService';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

// Path to the magazine configuration files (fallback)
const MAGAZINES_CONFIG_PATH = path.join(process.cwd(), 'lib/pages/magazine/config/magazines.json');
const ISSUES_DIR_PATH = path.join(process.cwd(), 'lib/pages/magazine/config/issues');

// GET /api/magazine/issues - Get all magazine issues
export async function GET(request: NextRequest) {
  try {
    // Check for includeHidden query parameter
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';
    
    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();
    
    // For GET, we allow unauthenticated reads (public access)
    // But we need db for Firebase operations
    if (!db) {
      console.log('No authenticated db, falling back to file system');
      // Fall back to file system if no auth
      const issueFiles = await fs.readdir(ISSUES_DIR_PATH);
      const fileIssues = [];
      
      for (const file of issueFiles) {
        if (file.endsWith('.json')) {
          const issueData = await fs.readFile(path.join(ISSUES_DIR_PATH, file), 'utf-8');
          try {
            const issue = JSON.parse(issueData);
            fileIssues.push(issue);
          } catch (error) {
            console.error(`Error parsing issue file ${file}:`, error);
          }
        }
      }
      
      return NextResponse.json(fileIssues);
    }
    
    // First, try to get issues from Firebase with authenticated db
    // Pass includeHidden parameter to get all issues if requested
    let issues = await magazineServerService.getAllIssues(db, includeHidden);
    
    // If Firebase is empty, fall back to file system and migrate
    if (issues.length === 0) {
      console.log('Firebase is empty, loading from file system and migrating...');
      
      // Get all issue files
      try {
        const issueFiles = await fs.readdir(ISSUES_DIR_PATH);
        const fileIssues = [];
        
        // Read each issue file
        for (const file of issueFiles) {
          if (file.endsWith('.json')) {
            const issueData = await fs.readFile(path.join(ISSUES_DIR_PATH, file), 'utf-8');
            try {
              const issue = JSON.parse(issueData);
              fileIssues.push(issue);
            } catch (error) {
              console.error(`Error parsing issue file ${file}:`, error);
            }
          }
        }
        
        // If we found files, migrate them to Firebase
        if (fileIssues.length > 0) {
          console.log(`Migrating ${fileIssues.length} issues to Firebase...`);
          const result = await magazineServerService.bulkUploadIssues(db, fileIssues);
          console.log(`Migration result: ${result.success} success, ${result.failed} failed`);
          
          // Return the file issues for now
          issues = fileIssues;
        }
      } catch (error) {
        console.error('Error reading file system:', error);
      }
    }
    
    return NextResponse.json(issues);
  } catch (error) {
    console.error('Error fetching magazine issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch magazine issues' },
      { status: 500 }
    );
  }
}

// POST /api/magazine/issues - Create a new magazine issue
export async function POST(request: NextRequest) {
  try {
    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();
    
    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }
    
    const issueFromRequest = await request.json();
    
    // STRIP SECTIONS - they go in separate collection, NOT in magazine_issues
    const { sections, ...issue } = issueFromRequest;
    
    // Validate required fields
    if (!issue.id || !issue.title || !issue.subtitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create in Firebase with authenticated db - WITHOUT sections
    const success = await magazineServerService.createIssue(db, issue, 'editor');
    
    if (!success) {
      return NextResponse.json(
        { error: 'Issue already exists or failed to create' },
        { status: 409 }
      );
    }
    
    // If this issue is featured, unfeatured all others
    if (issue.featured) {
      const allIssues = await magazineServerService.getAllIssues(db);
      for (const existingIssue of allIssues) {
        if (existingIssue.id !== issue.id && existingIssue.featured) {
          await magazineServerService.updateIssue(db, existingIssue.id, { featured: false });
        }
      }
    }
    
    return NextResponse.json(issue);
  } catch (error) {
    console.error('Error creating magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to create magazine issue' },
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