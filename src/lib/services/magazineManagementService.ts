import { MagazineIssueCard } from "@/lib/pages/magazine/types/magazine";

const STORAGE_KEY = "glamlink_magazine_config";

interface MagazineConfig {
  issues: MagazineIssueCard[];
}

class MagazineManagementService {
  // Get magazine configuration
  async getMagazineConfig(): Promise<MagazineConfig> {
    try {
      const response = await fetch("/api/settings/magazine-config");
      const data = await response.json();

      if (data.success && data.config) {
        // Store in localStorage as backup
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.config));
        }
        return data.config;
      }
    } catch (error) {
      console.error("Error fetching magazine config:", error);
    }

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Error parsing stored config:", e);
        }
      }
    }

    // Return default config from file
    try {
      const magazineConfig = await import("@/lib/pages/magazine/config/magazines.json");
      return magazineConfig.default as MagazineConfig;
    } catch (error) {
      console.error("Error loading default config:", error);
      return { issues: [] };
    }
  }

  // Save magazine configuration
  async saveMagazineConfig(config: MagazineConfig): Promise<boolean> {
    try {
      const response = await fetch("/api/settings/magazine-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config }),
      });

      const data = await response.json();

      if (data.success) {
        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error saving magazine config:", error);

      // Fallback to localStorage only
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
          return true;
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
      }

      return false;
    }
  }

  // Add a new magazine issue
  async addMagazineIssue(issue: MagazineIssueCard): Promise<boolean> {
    const config = await this.getMagazineConfig();

    // Add the new issue
    config.issues.push(issue);

    // Sort by date (newest first)
    config.issues.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    return this.saveMagazineConfig(config);
  }

  // Update an existing magazine issue
  async updateMagazineIssue(id: string, updates: Partial<MagazineIssueCard>): Promise<boolean> {
    const config = await this.getMagazineConfig();

    const index = config.issues.findIndex((issue) => issue.id === id);
    if (index === -1) return false;

    config.issues[index] = { ...config.issues[index], ...updates };

    return this.saveMagazineConfig(config);
  }

  // Delete a magazine issue
  async deleteMagazineIssue(id: string): Promise<boolean> {
    const config = await this.getMagazineConfig();

    config.issues = config.issues.filter((issue) => issue.id !== id);

    return this.saveMagazineConfig(config);
  }

  // Toggle featured status (only one issue can be featured)
  async toggleFeatured(id: string): Promise<boolean> {
    const config = await this.getMagazineConfig();

    // Find the issue
    const issue = config.issues.find((i) => i.id === id);
    if (!issue) return false;

    // If making it featured, unfeatured all others
    if (!issue.featured) {
      config.issues.forEach((i) => {
        i.featured = i.id === id;
      });
    } else {
      // If unfeaturing, just unfeatured this one
      issue.featured = false;
    }

    return this.saveMagazineConfig(config);
  }

  // Reorder issues
  async reorderIssues(issueIds: string[]): Promise<boolean> {
    const config = await this.getMagazineConfig();

    // Create a map of current issues
    const issueMap = new Map(config.issues.map((issue) => [issue.id, issue]));

    // Reorder based on provided IDs
    const reordered: MagazineIssueCard[] = [];
    for (const id of issueIds) {
      const issue = issueMap.get(id);
      if (issue) {
        reordered.push(issue);
      }
    }

    // Add any issues not in the provided list at the end
    for (const issue of config.issues) {
      if (!issueIds.includes(issue.id)) {
        reordered.push(issue);
      }
    }

    config.issues = reordered;

    return this.saveMagazineConfig(config);
  }
}

// Export singleton instance
const magazineManagementService = new MagazineManagementService();
export default magazineManagementService;
