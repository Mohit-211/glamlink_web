// Home Page Configuration and Type Definitions

// Redux State Interface
export interface HomeStateInterface {
  heroData: HeroData;
  featuredProjects: ProjectItem[];
  services: ServiceItem[];
  stats: StatItem[];
  testimonials: TestimonialItem[];
  isLoading: boolean;
  error: string | null;
}

// Component State Interfaces
export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  features: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string;
  rating: number;
}

// Component Props Types
export type HeroBannerProps = {
  state: HeroBannerStateInterface;
  handlers?: HeroBannerHandlersType;
};

export interface HeroBannerStateInterface {
  heroData: HeroData;
}

export interface HeroBannerHandlersType {
  onCtaClick: () => void;
}

export type FeaturedProjectsProps = {
  state: FeaturedProjectsStateInterface;
  handlers?: FeaturedProjectsHandlersType;
};

export interface FeaturedProjectsStateInterface {
  projects: ProjectItem[];
  isLoading: boolean;
}

export interface FeaturedProjectsHandlersType {
  onProjectClick: (projectId: string) => void;
  onViewAllClick: () => void;
}

export type ServicesSectionProps = {
  state: ServicesSectionStateInterface;
  handlers?: ServicesSectionHandlersType;
};

export interface ServicesSectionStateInterface {
  services: ServiceItem[];
}

export interface ServicesSectionHandlersType {
  onServiceClick: (serviceId: string) => void;
}

export type StatsSectionProps = {
  state: StatsSectionStateInterface;
};

export interface StatsSectionStateInterface {
  stats: StatItem[];
}

export type TestimonialsSectionProps = {
  state: TestimonialsSectionStateInterface;
  handlers?: TestimonialsSectionHandlersType;
};

export interface TestimonialsSectionStateInterface {
  testimonials: TestimonialItem[];
}

export interface TestimonialsSectionHandlersType {
  onScheduleClick: () => void;
}

// API Response Types
export interface HomeApiResponse {
  success: boolean;
  data?: {
    heroData: HeroData;
    featuredProjects: ProjectItem[];
    services: ServiceItem[];
    stats: StatItem[];
    testimonials: TestimonialItem[];
  };
  error?: string;
}

// Constants
export const HOME_API_ENDPOINT = "/api/home";

export const DEFAULT_HERO_DATA: HeroData = {
  title: "The Future of Beauty Analysis",
  subtitle: "AI-Powered Beauty Insights",
  description: "Discover your unique beauty potential with advanced AI technology. Get personalized recommendations, explore premium brands, and connect with beauty professionals.",
  ctaText: "Explore Your Beauty",
  ctaLink: "/image-analysis",
  features: ["AI Beauty Analysis", "Professional Products", "Expert Insights"],
};

export const ANIMATION_DURATION = 0.5;
export const ANIMATION_DELAY = 0.1;