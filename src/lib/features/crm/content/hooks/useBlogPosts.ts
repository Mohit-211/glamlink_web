/**
 * useBlogPosts Hook
 *
 * Manages blog posts listing and CRUD operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '../types';

interface UseBlogPostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  createPost: (post: Partial<BlogPost>) => Promise<BlogPost>;
  deletePost: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useBlogPosts(brandId: string): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPosts = useCallback(async () => {
    if (!brandId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/content/blog?brandId=${brandId}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch blog posts');

      const data = await response.json();
      setPosts(data.posts || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPosts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (postData: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await fetch('/api/crm/content/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...postData, brandId }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to create blog post');

    const data = await response.json();
    await fetchPosts();
    return data.post;
  };

  const deletePost = async (id: string): Promise<void> => {
    const response = await fetch(`/api/crm/content/blog/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandId }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to delete blog post');
    await fetchPosts();
  };

  return {
    posts,
    loading,
    error,
    totalCount,
    createPost,
    deletePost,
    refresh: fetchPosts,
  };
}
