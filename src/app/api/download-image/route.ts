import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/download-image?url=...&filename=...
 *
 * Proxy endpoint to download images from Firebase Storage or other external URLs.
 * This bypasses CORS restrictions by fetching server-side.
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    const filename = request.nextUrl.searchParams.get('filename') || 'image.png';

    if (!url) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    // Validate URL is from allowed domains (Firebase Storage or our own domain)
    const allowedDomains = [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
    ];

    const urlObj = new URL(url);
    const isAllowed = allowedDomains.some(domain => urlObj.hostname.includes(domain));

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'URL not from allowed domain' },
        { status: 403 }
      );
    }

    // Fetch the image server-side (no CORS issues)
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    // Return with download headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error in download-image proxy:', error);
    return NextResponse.json(
      { error: 'Failed to download image' },
      { status: 500 }
    );
  }
}
