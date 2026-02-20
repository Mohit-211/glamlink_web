import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the image URL from query params
    const url = request.nextUrl.searchParams.get('url');
    if (!url) {
      return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
    }

    // Only allow Firebase Storage URLs for security
    if (!url.includes('firebasestorage.googleapis.com')) {
      // For local images, just redirect
      if (url.startsWith('/')) {
        return NextResponse.redirect(new URL(url, request.url));
      }
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    console.log('Proxying image from:', url);

    // Fetch the image from Firebase Storage (server-side, no CORS!)
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }

    // Get the image data as ArrayBuffer
    const imageData = await response.arrayBuffer();
    
    console.log('Image fetched successfully, size:', imageData.byteLength);

    // Return the image with proper headers
    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Content-Length': imageData.byteLength.toString(),
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image', details: error instanceof Error ? error.message : 'Unknown error' },
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