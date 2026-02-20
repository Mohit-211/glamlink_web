/**
 * Single Blog Post API Routes
 *
 * GET /api/crm/content/blog/[id] - Get blog post by ID
 * PATCH /api/crm/content/blog/[id] - Update blog post
 * DELETE /api/crm/content/blog/[id] - Delete blog post
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = (currentUser as any).brandId;
    if (!brandId) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const postRef = doc(db, `brands/${brandId}/blogPosts`, id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: postSnap.id,
        ...postSnap.data(),
      },
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const postRef = doc(db, `brands/${brandId}/blogPosts`, id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (featuredImage !== undefined) updates.featuredImage = featuredImage;
    if (author !== undefined) updates.author = author;
    if (status !== undefined) updates.status = status;
    if (visibility !== undefined) updates.visibility = visibility;
    if (tags !== undefined) updates.tags = tags;
    if (publishedAt !== undefined) updates.publishedAt = publishedAt;
    if (scheduledAt !== undefined) updates.scheduledAt = scheduledAt;

    // Handle SEO updates
    if (seo !== undefined) {
      const existingSeo = postSnap.data().seo || {};
      updates.seo = { ...existingSeo, ...seo };

      // Update slug if SEO slug changes
      if (seo.slug) {
        updates.slug = seo.slug;
      }
    }

    // If publishing, set publishedAt
    if (status === 'published' && !postSnap.data().publishedAt) {
      updates.publishedAt = new Date().toISOString();
    }

    await updateDoc(postRef, updates);

    const updatedSnap = await getDoc(postRef);

    return NextResponse.json({
      success: true,
      data: {
        id: updatedSnap.id,
        ...updatedSnap.data(),
      },
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = (currentUser as any).brandId;
    if (!brandId) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const postRef = doc(db, `brands/${brandId}/blogPosts`, id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await deleteDoc(postRef);

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
