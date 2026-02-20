
import { FirebaseHelpers } from './firebaseHelpers';

// ============================================
// BASIC TYPE DEFINITIONS
// ============================================

interface TrainingProgram {
  id: string;
  title: string;
  [key: string]: any;
}

interface Brand {
  id: string;
  name: string;
  [key: string]: any;
}

// ============================================
// FIREBASE TRAINING SERVICE - TRAINING PROGRAM CRUD OPERATIONS
// ============================================

class FirebaseTrainingService {
  // Add a new training program to brand
  async addTrainingProgram(brandId: string, program: TrainingProgram): Promise<void> {
    return FirebaseHelpers.addToBrandArray(brandId, 'trainingPrograms', program);
  }

  // Update an existing training program
  async updateTrainingProgram(brandId: string, programId: string, updates: Partial<TrainingProgram>): Promise<void> {
    return FirebaseHelpers.updateInBrandArray(brandId, 'trainingPrograms', programId, updates);
  }

  // Remove a training program from brand
  async removeTrainingProgram(brandId: string, programId: string): Promise<void> {
    return FirebaseHelpers.removeFromBrandArray(brandId, 'trainingPrograms', programId);
  }

  // Batch add multiple training programs
  async addMultipleTrainingPrograms(brandId: string, programs: TrainingProgram[]): Promise<void> {
    for (const program of programs) {
      await this.addTrainingProgram(brandId, program);
    }
  }

  // Update program enrollment count
  async updateEnrollmentCount(brandId: string, programId: string, enrollmentCount: number): Promise<void> {
    return this.updateTrainingProgram(brandId, programId, { enrollmentCount });
  }

  // Increment enrollment count
  async incrementEnrollment(brandId: string, programId: string): Promise<void> {
    // Note: This requires fetching the current count first
    // In a real implementation, you might want to use Firestore increment
    const brand = await FirebaseHelpers.getBrand(brandId);
    if (brand) {
      const program = brand.trainingPrograms?.find(p => p.id === programId);
      if (program) {
        return this.updateEnrollmentCount(brandId, programId, program.enrollmentCount + 1);
      }
    }
  }

  // Update next session date
  async updateNextSessionDate(brandId: string, programId: string, nextSessionDate: string): Promise<void> {
    return this.updateTrainingProgram(brandId, programId, { nextSessionDate });
  }

  // Update program pricing
  async updateProgramPricing(brandId: string, programId: string, price: number): Promise<void> {
    return this.updateTrainingProgram(brandId, programId, { price });
  }

  // Update program level
  async updateProgramLevel(brandId: string, programId: string, level: TrainingProgram['level']): Promise<void> {
    return this.updateTrainingProgram(brandId, programId, { level });
  }

  // Update instructor information
  async updateInstructorInfo(brandId: string, programId: string, instructor: {
    instructorName?: string;
    instructorTitle?: string;
    instructorImage?: string;
  }): Promise<void> {
    return this.updateTrainingProgram(brandId, programId, instructor);
  }

  // Update program images
  async updateProgramImages(brandId: string, programId: string, images: {
    image?: string;
    thumbnailImage?: string;
    images?: string[];
    imageAlt?: string;
    imagesAlt?: string[];
  }): Promise<void> {
    return this.updateTrainingProgram(brandId, programId, images);
  }

  // Update program topics
  async updateProgramTopics(brandId: string, programId: string, topics: string[]): Promise<void> {
    return this.updateTrainingProgram(brandId, programId, { topics });
  }

  // Alias for backward compatibility
  async addToBrandArray(brandId: string, arrayName: keyof Brand, item: any): Promise<void> {
    return FirebaseHelpers.addToBrandArray(brandId, arrayName, item);
  }

  async updateInBrandArray(brandId: string, arrayName: keyof Brand, itemId: string, updates: any): Promise<void> {
    return FirebaseHelpers.updateInBrandArray(brandId, arrayName, itemId, updates);
  }

  async removeFromBrandArray(brandId: string, arrayName: keyof Brand, itemId: string): Promise<void> {
    return FirebaseHelpers.removeFromBrandArray(brandId, arrayName, itemId);
  }
}

// Export singleton instance
const firebaseTrainingService = new FirebaseTrainingService();
export default firebaseTrainingService;