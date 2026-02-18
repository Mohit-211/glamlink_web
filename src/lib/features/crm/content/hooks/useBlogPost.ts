/**
 * useBlogPost Hook
 *
 * Manages single blog post fetching and editing
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '../types';

interface UseBlogPostReturn {
  post: BlogPost | null;
  loading: boolean;
  error: string | null;
  savePost: (post: Partial<BlogPost>) => Promise<BlogPost>;
  updatePost: (updates: Partial<BlogPost>) => Promise<void>;
  refresh: () => void;
}

export function useBlogPost(brandId: string, postId?: string): UseBlogPostReturn {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(!!postId);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!postId || postId === 'new') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/content/blog/${postId}?brandId=${brandId}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch blog post');

      const data = await response.json();
      setPost(data.post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [brandId, postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const savePost = async (postData: Partial<BlogPost>): Promise<BlogPost> => {
    const isNew = !postId || postId === 'new';
    const url = isNew ? '/api/crm/content/blog' : `/api/crm/content/blog/${postId}`;
    const method = isNew ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...postData, brandId }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to save blog post');

    const data = await response.json();
    setPost(data.post);
    return data.post;
  };

  const updatePost = async (updates: Partial<BlogPost>): Promise<void> => {
    if (!postId || postId === 'new') return;

    const response = await fetch(`/api/crm/content/blog/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, brandId }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to update blog post');

    setPost((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return {
    post,
    loading,
    error,
    savePost,
    updatePost,
    refresh: fetchPost,
  };
}
