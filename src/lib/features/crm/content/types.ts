/**
 * Content Management Types
 *
 * Type definitions for files and blog posts management
 */

// ============================================
// FILE TYPES
// ============================================

export type FileType = 'image' | 'video' | 'document' | 'other';
export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'svg';

export interface ContentFile {
  id: string;
  brandId: string;
  name: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: FileType;
  mimeType: string;
  format: string;
  size: number; // in bytes
  width?: number;
  height?: number;
  altText: string;
  focalPoint?: { x: number; y: number };
  references: FileReference[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface FileReference {
  type: 'product' | 'blog_post' | 'page' | 'other';
  id: string;
  name: string;
}

export interface FileFilter {
  search?: string;
  fileType?: FileType | 'all';
  sizeRange?: { min?: number; max?: number };
  usedIn?: 'products' | 'blog_posts' | 'unused' | 'all';
  dateRange?: { start?: string; end?: string };
}

export interface FileSortOption {
  field: 'date' | 'name' | 'size';
  direction: 'asc' | 'desc';
}

export interface FileView {
  id: string;
  name: string;
  filters: FileFilter;
  sort: FileSortOption;
  isDefault?: boolean;
}

// ============================================
// BLOG POST TYPES
// ============================================

export type BlogPostStatus = 'draft' | 'published' | 'scheduled' | 'hidden';

export interface BlogPost {
  id: string;
  brandId: string;
  title: string;
  slug: string;
  content: string; // HTML content
  excerpt: string;
  featuredImage?: {
    url: string;
    altText: string;
    focalPoint?: { x: number; y: number };
  };
  author: {
    id: string;
    name: string;
  };
  blogCategory: string;
  tags: string[];
  status: BlogPostStatus;
  visibility: 'visible' | 'hidden';
  seo: {
    title?: string;
    description?: string;
  };
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

// ============================================
// IMAGE EDITOR TYPES
// ============================================

export type AspectRatio = 'original' | 'square' | '3:2' | '5:4' | '7:5' | '16:9' | 'freeform';
export type Orientation = 'landscape' | 'portrait';

export interface ImageCropData {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: AspectRatio;
  orientation: Orientation;
}

export interface ImageTransform {
  crop?: ImageCropData;
  resize?: { width: number; height: number };
  rotate?: number; // degrees
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

export interface DrawAnnotation {
  type: 'brush';
  color: string;
  brushSize: number;
  points: { x: number; y: number }[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface FilesResponse {
  files: ContentFile[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// ============================================
// INPUT TYPES
// ============================================

export interface CreateFileInput {
  brandId: string;
  name: string;
  url: string;
  type: FileType;
  mimeType: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
}

export interface CreateBlogPostInput {
  brandId: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    altText: string;
  };
  author: {
    id: string;
    name: string;
  };
  blogCategory: string;
  tags?: string[];
  status?: BlogPostStatus;
  visibility?: 'visible' | 'hidden';
  seo?: {
    title?: string;
    description?: string;
  };
}
