import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  // Only proxy Firebase Storage URLs
  if (!url?.includes('firebasestorage.googleapis.com')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // Fetch server-side (no CORS!)
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }

    const imageData = await response.arrayBuffer();

    // Return with permissive CORS headers
    return new Response(imageData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
  }
}