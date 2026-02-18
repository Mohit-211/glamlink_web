import { 
  mockHeroData, 
  mockFeaturedProjects, 
  mockServices, 
  mockStats, 
  mockTestimonials 
} from "../mockData";
import { 
  HeroData, 
  ProjectItem, 
  ServiceItem, 
  StatItem, 
  TestimonialItem 
} from "../config";

// Type for the complete home data
export interface HomeData {
  heroData: HeroData;
  featuredProjects: ProjectItem[];
  services: ServiceItem[];
  stats: StatItem[];
  testimonials: TestimonialItem[];
}

/**
 * Fetches all home page data
 * In production, this would connect to MongoDB
 * For now, returns mock data
 */
export async function fetchAllHomeData(): Promise<HomeData> {
  try {
    // In a real implementation, this would query MongoDB collections
    // For now, we'll return mock data
    return {
      heroData: mockHeroData,
      featuredProjects: mockFeaturedProjects,
      services: mockServices,
      stats: mockStats,
      testimonials: mockTestimonials,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Seeds home data to the database
 * In production, this would insert data into MongoDB
 * For now, this is a no-op
 */
export async function seedHomeData(): Promise<void> {
  try {
    // In development, this would seed the database with initial data
    // For now, this is a no-op
  } catch (error) {
    throw error;
  }
}