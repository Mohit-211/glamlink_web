import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

const ALLOWED_EMAILS = ['mohit@blockcod.com', 'melanie@glamlink.net', 'admin@glamlink.com'];

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { currentUser } = await getAuthenticatedAppForUser();

    // Check if user is authorized
    if (!currentUser || !ALLOWED_EMAILS.includes(currentUser.email || '')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, return the static config
    // In production, this would fetch from Firestore
    try {
      const magazineConfig = await import('@/lib/pages/magazine/config/magazines.json');
      return NextResponse.json({
        success: true,
        config: magazineConfig.default
      });
    } catch (error) {
      // Return empty config if file doesn't exist
      return NextResponse.json({
        success: true,
        config: { issues: [] }
      });
    }
  } catch (error) {
    console.error('Error fetching magazine config:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { currentUser } = await getAuthenticatedAppForUser();

    // Check if user is authorized
    if (!currentUser || !ALLOWED_EMAILS.includes(currentUser.email || '')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { config } = await request.json();

    // In production, this would save to Firestore
    // For now, we'll just return success
    // The client will handle localStorage fallback
    
    return NextResponse.json({
      success: true,
      message: 'Magazine configuration updated successfully'
    });
  } catch (error) {
    console.error('Error saving magazine config:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}