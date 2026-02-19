import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the video URL from query params
    const url = request.nextUrl.searchParams.get('url');
    if (!url) {
      return NextResponse.json({ error: 'Missing video URL' }, { status: 400 });
    }

    // Only allow Firebase Storage URLs for security
    if (!url.includes('firebasestorage.googleapis.com')) {
      return NextResponse.json({ error: 'Invalid video URL' }, { status: 400 });
    }

    console.log('Proxying video from:', url);

    // Fetch the video from Firebase Storage (server-side, no CORS!)
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Failed to fetch video:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch video' }, { status: response.status });
    }

    // Get the video data
    const videoData = await response.arrayBuffer();
    
    console.log('Video fetched successfully, size:', videoData.byteLength);

    // Return the video with headers that allow our domain
    return new Response(videoData, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'video/mp4',
        'Content-Length': videoData.byteLength.toString(),
        'Access-Control-Allow-Origin': '*', // Allow all origins for now
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Video proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}