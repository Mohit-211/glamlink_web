/**
 * BlogPostEditor Component
 *
 * Full-featured blog post editor with rich text, SEO, and scheduling
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/features/auth/useAuth';
import { useBlogPost } from '@/lib/features/crm/content/hooks';
import { BlogPost, BlogPostStatus } from '@/lib/features/crm/content/types';
import { formatDate } from '@/lib/utils/format';

interface BlogPostEditorProps {
  postId?: string;
  isNew?: boolean;
}

type EditorTab = 'content' | 'seo' | 'settings';

export function BlogPostEditor({ postId, isNew = false }: BlogPostEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const brandId = (user as any)?.brandId || '';

  const { post, loading, error, savePost, updatePost } = useBlogPost(brandId, postId);

  const [activeTab, setActiveTab] = useState<EditorTab>('content');
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    featuredImage: undefined,
    author: { id: user?.uid || '', name: user?.displayName || '' },
    blogCategory: '',
    status: 'draft',
    visibility: 'visible',
    tags: [],
    seo: {
      title: '',
      description: '',
    },
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');

  // Load post data
  useEffect(() => {
    if (post && !isNew) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        author: post.author,
        status: post.status,
        visibility: post.visibility,
        tags: post.tags,
        seo: post.seo,
      });
    }
  }, [post, isNew]);

  // Track changes
  const updateFormData = useCallback((updates: Partial<BlogPost>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  }, []);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle title change
  const handleTitleChange = (title: string) => {
    updateFormData({
      title,
      slug: generateSlug(title),
    });
  };

  // Save draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const newPost = await savePost({
        ...formData,
        brandId,
        status: 'draft',
      });
      if (newPost && isNew) {
        router.push(`/profile/content/blog/${newPost.id}`);
      }
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  // Publish post
  const handlePublish = async () => {
    setSaving(true);
    try {
      const newPost = await savePost({
        ...formData,
        brandId,
        status: 'published',
        publishedAt: new Date().toISOString(),
      });
      if (newPost && isNew) {
        router.push(`/profile/content/blog/${newPost.id}`);
      }
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  // Schedule post
  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) return;

    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();

    setSaving(true);
    try {
      const newPost = await savePost({
        ...formData,
        brandId,
        status: 'scheduled',
        scheduledAt,
      });
      if (newPost && isNew) {
        router.push(`/profile/content/blog/${newPost.id}`);
      }
      setShowScheduleModal(false);
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  // Unpublish post
  const handleUnpublish = async () => {
    if (confirm('Are you sure you want to unpublish this post?')) {
      await updatePost({ status: 'draft' });
    }
  };

  if (loading && !isNew) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" />
      </div>
    );
  }

  if (error && !isNew) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Post not found</h2>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <Link href="/profile/content/blog" className="text-pink-600 hover:text-pink-700">
          Back to blog posts
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/profile/content/blog"
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {isNew ? 'New blog post' : formData.title || 'Untitled post'}
                </h1>
                {!isNew && post && (
                  <p className="text-sm text-gray-500">
                    {post.status === 'published'
                      ? `Published ${formatDate(post.publishedAt!)}`
                      : post.status === 'scheduled'
                      ? `Scheduled for ${formatDate(post.scheduledAt!)}`
                      : 'Draft'}
                    {hasChanges && ' • Unsaved changes'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Preview button */}
              {!isNew && post?.status === 'published' && (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  View live
                </a>
              )}

              {/* Save draft */}
              <button
                onClick={handleSaveDraft}
                disabled={saving || !hasChanges}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save draft'}
              </button>

              {/* Schedule button */}
              {(!post || post.status !== 'published') && (
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Schedule
                </button>
              )}

              {/* Publish/Unpublish */}
              {post?.status === 'published' ? (
                <button
                  onClick={handleUnpublish}
                  className="px-4 py-2 text-sm text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={saving || !formData.title}
                  className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main editor */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6">
              {[
                { id: 'content', label: 'Content' },
                { id: 'seo', label: 'SEO' },
                { id: 'settings', label: 'Settings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as EditorTab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {activeTab === 'content' && (
                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Post title"
                      className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-0 focus:outline-none focus:ring-0"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <textarea
                      value={formData.content}
                      onChange={(e) => updateFormData({ content: e.target.value })}
                      placeholder="Write your content here... (Rich text editor coming soon)"
                      rows={20}
                      className="w-full text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Rich text editor with formatting tools coming soon. For now, use plain text.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Search engine listing</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Customize how your post appears in search engine results
                    </p>
                  </div>

                  {/* SEO Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page title
                    </label>
                    <input
                      type="text"
                      value={formData.seo?.title || ''}
                      onChange={(e) =>
                        updateFormData({ seo: { ...formData.seo!, title: e.target.value } })
                      }
                      placeholder={formData.title || 'Enter page title'}
                      maxLength={70}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {(formData.seo?.title || formData.title || '').length}/70 characters
                    </p>
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta description
                    </label>
                    <textarea
                      value={formData.seo?.description || ''}
                      onChange={(e) =>
                        updateFormData({ seo: { ...formData.seo!, description: e.target.value } })
                      }
                      placeholder="Enter a description for search engines"
                      rows={3}
                      maxLength={160}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {(formData.seo?.description || '').length}/160 characters
                    </p>
                  </div>

                  {/* URL Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL slug
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-500">
                        /blog/
                      </span>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => updateFormData({ slug: e.target.value })}
                        placeholder="post-url-slug"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-xs text-gray-500 uppercase mb-3">Search result preview</h4>
                    <div className="space-y-1">
                      <p className="text-blue-700 text-lg hover:underline cursor-pointer">
                        {formData.seo?.title || formData.title || 'Page title'}
                      </p>
                      <p className="text-green-700 text-sm">
                        yourbrand.com/blog/{formData.slug || 'url-slug'}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {formData.seo?.description ||
                          formData.excerpt ||
                          'Add a description to help search engines understand your content...'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6 space-y-6">
                  {/* Visibility */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility
                    </label>
                    <select
                      value={formData.visibility}
                      onChange={(e) =>
                        updateFormData({ visibility: e.target.value as 'visible' | 'hidden' })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="visible">Visible</option>
                      <option value="hidden">Hidden</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Hidden posts won't appear in your blog listing
                    </p>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={typeof formData.author === 'object' ? formData.author?.name || '' : ''}
                      onChange={(e) => updateFormData({ author: { id: formData.author && typeof formData.author === 'object' ? formData.author.id : user?.uid || '', name: e.target.value } })}
                      placeholder="Enter author name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) =>
                        updateFormData({
                          tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Enter tags, separated by commas"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tags help organize and categorize your posts
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Featured image */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Featured image</h3>
              <div
                className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => {
                  // TODO: Open image picker
                }}
              >
                {formData.featuredImage?.url ? (
                  <img
                    src={formData.featuredImage.url}
                    alt={formData.featuredImage.altText || 'Featured'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Add featured image</span>
                  </div>
                )}
              </div>
              {formData.featuredImage?.url && (
                <button
                  onClick={() => updateFormData({ featuredImage: undefined })}
                  className="w-full mt-3 text-sm text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Excerpt</h3>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => updateFormData({ excerpt: e.target.value })}
                placeholder="Write a short summary of your post..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Appears in post previews and social shares
              </p>
            </div>

            {/* Post status */}
            {!isNew && post && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium capitalize">{post.status}</span>
                  </div>
                  {post.publishedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Published</span>
                      <span className="font-medium">{formatDate(post.publishedAt)}</span>
                    </div>
                  )}
                  {post.scheduledAt && post.status === 'scheduled' && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Scheduled</span>
                      <span className="font-medium">{formatDate(post.scheduledAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Schedule post</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!scheduleDate || !scheduleTime || saving}
                className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                {saving ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogPostEditor;
