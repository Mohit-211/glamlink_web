/**
 * Blog Posts API Routes
 *
 * GET /api/crm/content/blog - List blog posts for brand
 * POST /api/crm/content/blog - Create new blog post
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, query, where, orderBy, limit, startAfter, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = (currentUser as any).brandId;
    if (!brandId) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const cursor = searchParams.get('cursor');
    const status = searchParams.get('status');

    // Build query
    let q = query(
      collection(db, `brands/${brandId}/blogPosts`),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    // Add status filter
    if (status && status !== 'all') {
      q = query(
        collection(db, `brands/${brandId}/blogPosts`),
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }

    // Add cursor pagination
    if (cursor) {
      const cursorDoc = await getDoc(doc(db, `brands/${brandId}/blogPosts`, cursor));
      if (cursorDoc.exists()) {
        q = query(q, startAfter(cursorDoc));
      }
    }

    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        posts,
        hasMore: snapshot.docs.length === pageSize,
        cursor: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null,
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = (currentUser as any).brandId;
    if (!brandId) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      featuredImage,
      author,
      status,
      visibility,
      tags,
      seo,
      publishedAt,
      scheduledAt,
    } = body;

    // Generate slug from title or SEO slug
    const slug = seo?.slug || title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `post-${Date.now()}`;

    const postData = {
      brandId,
      title: title || '',
      content: content || '',
      excerpt: excerpt || '',
      featuredImage: featuredImage || '',
      author: author || '',
      status: status || 'draft',
      visibility: visibility || 'visible',
      tags: tags || [],
      seo: {
        title: seo?.title || title || '',
        description: seo?.description || excerpt || '',
        slug,
      },
      slug,
      publishedAt: publishedAt || null,
      scheduledAt: scheduledAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, `brands/${brandId}/blogPosts`), postData);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...postData,
      },
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
