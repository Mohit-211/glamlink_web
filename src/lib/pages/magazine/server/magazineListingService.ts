import { getAuthenticatedAppForUser, getPublicFirebaseApp } from "@/lib/firebase/serverApp";
import { FEATURE_FLAGS } from "@/lib/config/features";
import magazineServerService from "@/lib/services/firebase/magazineServerService";
import { MagazineIssueCard } from "../types/magazine";

class MagazineListingService {
  /**
   * Get all public magazine issues for display
   * This runs on the server, so no localStorage or client-side checks
   */
  async getPublicIssues(): Promise<MagazineIssueCard[]> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_MAGAZINE_AUTH;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available, returning empty array");
        return [];
      }

      // Get only visible issues from Firebase
      const visibleIssues = await magazineServerService.getVisibleIssues(db);

      // Map to card format for display
      return visibleIssues.map((issue) => ({
        id: issue.id,
        urlId: issue.urlId,
        title: issue.title,
        subtitle: issue.subtitle,
        featuredPerson: issue.featuredPerson,
        featuredTitle: issue.featuredTitle,
        issueNumber: issue.issueNumber,
        issueDate: issue.issueDate,
        coverImage: issue.coverImage,
        coverImageAlt: issue.coverImageAlt,
        coverBackgroundImage: issue.coverBackgroundImage,
        useCoverBackground: issue.useCoverBackground,
        description: issue.description,
        featured: issue.featured,
        visible: issue.visible,
        publuuLink: issue.publuuLink, // Add the Publuu link field
        // Add any additional fields needed for the card
        featuredPersonIssueHeight: (issue as any).featuredPersonIssueHeight,
        textPlacement: (issue as any).textPlacement,
      }));
    } catch (error) {
      console.error("Error fetching public magazine issues:", error);
      return [];
    }
  }

  /**
   * Get a single magazine issue by ID
   */
  async getIssueById(id: string): Promise<MagazineIssueCard | null> {
    try {
      // Check if authentication is required based on feature flag
      const requireAuth = FEATURE_FLAGS.REQUIRE_MAGAZINE_AUTH;

      // Get Firebase instance based on auth requirement
      const { db } = requireAuth ? await getAuthenticatedAppForUser() : await getPublicFirebaseApp();

      if (!db) {
        console.log("No Firebase db available");
        return null;
      }

      const issue = await magazineServerService.getIssueById(db, id);

      if (!issue) {
        return null;
      }

      return {
        id: issue.id,
        urlId: issue.urlId,
        title: issue.title,
        subtitle: issue.subtitle,
        featuredPerson: issue.featuredPerson,
        featuredTitle: issue.featuredTitle,
        issueNumber: issue.issueNumber,
        issueDate: issue.issueDate,
        coverImage: issue.coverImage,
        coverImageAlt: issue.coverImageAlt,
        coverBackgroundImage: issue.coverBackgroundImage,
        useCoverBackground: issue.useCoverBackground,
        description: issue.description,
        featured: issue.featured,
        publuuLink: issue.publuuLink, // Add the Publuu link field
        featuredPersonIssueHeight: (issue as any).featuredPersonIssueHeight,
        textPlacement: (issue as any).textPlacement,
      };
    } catch (error) {
      console.error("Error fetching magazine issue:", error);
      return null;
    }
  }
}

// Export singleton instance
const magazineListingService = new MagazineListingService();
export default magazineListingService;
