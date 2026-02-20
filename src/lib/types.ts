export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  problemSolved: string;
  role: string;
  keyFeatures: string[];
  impact: string;
  learnings: string[];
  category: string;
  technologies: string[];
  github: string;
  demo: string;
  liveUrl: string;
  status: string;
  lastModified: string;
  isFeatured: boolean;
  featuredImage: string;
  order?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  source?: string;
}