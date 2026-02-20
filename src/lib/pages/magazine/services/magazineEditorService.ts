import { MagazineIssue, MagazineIssueCard } from "../types/magazine";

export interface IssueVisibilitySettings {
  [issueId: string]: {
    visible: boolean;
    isEmpty: boolean;
    visibleForPreview?: boolean;
  };
}

export interface EditorIssue extends MagazineIssue {
  visible: boolean;
  isEmpty: boolean;
  sectionCount?: number; // Number of sections in the issue
  publuuLink?: string; // Publuu digital magazine embed URL
  // Lock-related properties for collaboration
  lockedBy?: string | null;
  lockedByEmail?: string | null;
  lockedByName?: string | null;
  lockedAt?: string | null;
  lockExpiresAt?: string | null;
  lockedTabId?: string | null;
  lockedTab?: string | null;
}

class MagazineEditorService {
  private visibilityKey = "magazine-issue-visibility";

  // Get all issues with visibility settings
  async getAllIssuesForEditor(): Promise<EditorIssue[]> {
    try {
      // Check if we're on the server or client
      const isServer = typeof window === "undefined";
      const baseUrl = isServer ? "http://localhost:3000" : "";

      // Fetch all issues from the API, including hidden ones for editor
      const response = await fetch(`${baseUrl}/api/magazine/issues?includeHidden=true`);
      if (!response.ok) {
        console.error(`Failed to fetch issues: ${response.status} ${response.statusText}`);
        return [];
      }

      const issues: MagazineIssue[] = await response.json();

      // Handle empty or invalid response
      if (!Array.isArray(issues)) {
        console.warn("Invalid response format, expected array of issues");
        return [];
      }

      const visibility = this.getVisibilitySettings();

      // Merge visibility settings with issues
      return issues.map((issue) => ({
        ...issue,
        visible: issue.visible ?? true, // Default to true if undefined
        isEmpty: issue.isEmpty ?? false, // Default to false if undefined
        visibleForPreview: issue.visibleForPreview ?? false, // Default to false if undefined
      }));
    } catch (error) {
      console.error("Error fetching issues for editor:", error);
      return [];
    }
  }

  // Get a single issue by ID
  async getIssueById(id: string): Promise<EditorIssue | null> {
    try {
      const isServer = typeof window === "undefined";
      const baseUrl = isServer ? "http://localhost:3000" : "";

      const response = await fetch(`${baseUrl}/api/magazine/issues/${id}`);
      if (!response.ok) {
        return null;
      }

      const issue: MagazineIssue = await response.json();
      const visibility = this.getVisibilitySettings();

      return {
        ...issue,
        visible: visibility[id]?.visible ?? true,
        isEmpty: visibility[id]?.isEmpty ?? false,
      };
    } catch (error) {
      console.error("Error fetching issue:", error);
      return null;
    }
  }

  // Create a new issue
  async createIssue(issue: Partial<MagazineIssue>): Promise<EditorIssue | null> {
    try {
      const isServer = typeof window === "undefined";
      const baseUrl = isServer ? "http://localhost:3000" : "";

      const response = await fetch(`${baseUrl}/api/magazine/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issue),
      });

      if (!response.ok) {
        throw new Error("Failed to create issue");
      }

      const newIssue: MagazineIssue = await response.json();

      // Set default visibility for new issue
      this.updateVisibility(newIssue.id, true, false);

      return {
        ...newIssue,
        visible: true,
        isEmpty: false,
      };
    } catch (error) {
      console.error("Error creating issue:", error);
      return null;
    }
  }

  // Update an existing issue
  async updateIssue(id: string, updates: Partial<EditorIssue>): Promise<EditorIssue | null> {
    try {
      const isServer = typeof window === "undefined";
      const baseUrl = isServer ? "http://localhost:3000" : "";

      const response = await fetch(`${baseUrl}/api/magazine/issues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update issue");
      }

      const updatedIssue: MagazineIssue = await response.json();

      // Use the visibility from the updates if provided, otherwise get from localStorage
      const visibility = this.getVisibilitySettings();
      const visible = updates.visible !== undefined ? updates.visible : visibility[id]?.visible ?? true;
      const isEmpty = updates.isEmpty !== undefined ? updates.isEmpty : visibility[id]?.isEmpty ?? false;

      // Update localStorage with the new visibility settings
      if (updates.visible !== undefined || updates.isEmpty !== undefined) {
        this.updateVisibility(id, visible, isEmpty);
      }

      return {
        ...updatedIssue,
        visible: updatedIssue.visible ?? true,
        isEmpty: updatedIssue.isEmpty ?? false,
        visibleForPreview: updatedIssue.visibleForPreview ?? false,
      };
    } catch (error) {
      console.error("Error updating issue:", error);
      return null;
    }
  }

  // Delete an issue
  async deleteIssue(id: string): Promise<boolean> {
    try {
      const isServer = typeof window === "undefined";
      const baseUrl = isServer ? "http://localhost:3000" : "";

      const response = await fetch(`${baseUrl}/api/magazine/issues/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete issue");
      }

      // Remove visibility settings for deleted issue
      const visibility = this.getVisibilitySettings();
      delete visibility[id];
      this.saveVisibilitySettings(visibility);

      return true;
    } catch (error) {
      console.error("Error deleting issue:", error);
      return false;
    }
  }

  // Update visibility and empty status
  updateVisibility(issueId: string, visible: boolean, isEmpty: boolean, visibleForPreview?: boolean): void {
    const visibility = this.getVisibilitySettings();
    visibility[issueId] = { visible, isEmpty, visibleForPreview: visibleForPreview ?? false };
    this.saveVisibilitySettings(visibility);
  }

  // Get visibility settings from localStorage
  private getVisibilitySettings(): IssueVisibilitySettings {
    if (typeof window === "undefined") return {};

    const stored = localStorage.getItem(this.visibilityKey);
    if (!stored) return {};

    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }

  // Save visibility settings to localStorage
  private saveVisibilitySettings(settings: IssueVisibilitySettings): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.visibilityKey, JSON.stringify(settings));
  }

  // Get issues for public display (filtered by visibility)
  async getPublicIssues(): Promise<MagazineIssueCard[]> {
    try {
      const issues = await this.getAllIssuesForEditor();

      // Filter to only visible and non-empty issues
      return issues
        .filter((issue) => issue.visible && !issue.isEmpty)
        .map((issue) => ({
          id: issue.id,
          title: issue.title,
          subtitle: issue.subtitle,
          featuredPerson: issue.featuredPerson,
          featuredTitle: issue.featuredTitle,
          issueNumber: issue.issueNumber,
          issueDate: issue.issueDate,
          coverImage: issue.coverImage,
          coverImageAlt: issue.coverImageAlt,
          description: issue.description,
          featured: issue.featured,
          featuredPersonIssueHeight: (issue as any).featuredPersonIssueHeight,
          textPlacement: (issue as any).textPlacement,
        }));
    } catch (error) {
      console.error("Error fetching public issues:", error);
      return [];
    }
  }

  // Toggle featured status
  async toggleFeatured(issueId: string): Promise<boolean> {
    try {
      const issues = await this.getAllIssuesForEditor();

      // Find the issue to toggle
      const targetIssue = issues.find((i) => i.id === issueId);
      if (!targetIssue) return false;

      // If making this issue featured, unfeatured all others
      if (!targetIssue.featured) {
        for (const issue of issues) {
          if (issue.featured && issue.id !== issueId) {
            await this.updateIssue(issue.id, { featured: false });
          }
        }
      }

      // Toggle the target issue's featured status
      await this.updateIssue(issueId, { featured: !targetIssue.featured });

      return true;
    } catch (error) {
      console.error("Error toggling featured status:", error);
      return false;
    }
  }

  // Export configuration
  exportConfiguration(): string {
    const visibility = this.getVisibilitySettings();
    return JSON.stringify(visibility, null, 2);
  }

  // Import configuration
  importConfiguration(jsonString: string): boolean {
    try {
      const visibility = JSON.parse(jsonString);
      this.saveVisibilitySettings(visibility);
      return true;
    } catch (error) {
      console.error("Error importing configuration:", error);
      return false;
    }
  }

  // Check if an issue exists
  async issueExists(id: string): Promise<boolean> {
    const issue = await this.getIssueById(id);
    return issue !== null;
  }

  // Validate issue data
  validateIssue(issue: Partial<MagazineIssue>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!issue.id) {
      errors.push("Issue ID is required");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(issue.id)) {
      errors.push("Issue ID must be in YYYY-MM-DD format");
    }

    if (!issue.title) {
      errors.push("Title is required");
    }

    if (!issue.subtitle) {
      errors.push("Subtitle is required");
    }

    if (!issue.issueNumber || issue.issueNumber < 1) {
      errors.push("Issue number must be a positive integer");
    }

    if (!issue.issueDate) {
      errors.push("Issue date is required");
    }

    if (!issue.coverImage) {
      errors.push("Cover image is required");
    }

    if (!issue.description) {
      errors.push("Description is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Replace entire issue with new data
  async replaceIssue(id: string, newData: Partial<MagazineIssue>): Promise<EditorIssue | null> {
    try {
      // Preserve the ID to ensure we're updating the right issue
      const updates = { ...newData, id };

      // Use the existing updateIssue method to replace all data
      return await this.updateIssue(id, updates);
    } catch (error) {
      console.error("Error replacing issue:", error);
      throw error;
    }
  }

  // Upload PDF for an issue
  async uploadPdf(issueId: string, file: File): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/magazine/issues/${issueId}/pdf`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || "Failed to upload PDF" };
      }

      const result = await response.json();
      return { success: true, pdfUrl: result.pdfUrl };
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return { success: false, error: "Failed to upload PDF" };
    }
  }

  // Remove PDF from an issue
  async removePdf(issueId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/magazine/issues/${issueId}/pdf`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || "Failed to remove PDF" };
      }

      return { success: true };
    } catch (error) {
      console.error("Error removing PDF:", error);
      return { success: false, error: "Failed to remove PDF" };
    }
  }

  // Get PDF info for an issue
  async getPdfInfo(issueId: string): Promise<{ hasPdf: boolean; pdfUrl?: string }> {
    try {
      const response = await fetch(`/api/magazine/issues/${issueId}/pdf`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        return { hasPdf: false };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error getting PDF info:", error);
      return { hasPdf: false };
    }
  }

  // Download issue as JSON file
  downloadIssueAsJSON(issue: EditorIssue): void {
    try {
      // Create a clean copy without editor-specific fields
      const cleanIssue: MagazineIssue = { ...issue };
      delete (cleanIssue as any).visible;
      delete (cleanIssue as any).isEmpty;

      // Convert to JSON string with pretty formatting
      const jsonString = JSON.stringify(cleanIssue, null, 2);

      // Create a blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${issue.id}.json`;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading issue as JSON:", error);
      throw error;
    }
  }

  // Download issue with all sections as JSON file
  async downloadIssueWithSections(issue: EditorIssue): Promise<void> {
    try {
      // Fetch all sections for the issue
      const response = await fetch(`/api/magazine/sections?issueId=${issue.id}&skipLockChecks=true`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }

      const data = await response.json();
      const sections = data.sections || [];

      // Create a clean copy without editor-specific fields
      const cleanIssue: any = { ...issue };
      delete cleanIssue.visible;
      delete cleanIssue.isEmpty;

      // Clean sections - remove lock-related fields
      const cleanSections = sections.map((section: any) => {
        const { lockedBy, lockedByEmail, lockedByName, lockedAt, lockExpiresAt, lockGroup, lockedTabId, isLockedByCurrentUser, canEdit, ...cleanSection } = section;
        return cleanSection;
      });

      // Add sections to the issue data
      cleanIssue.sections = cleanSections;

      // Convert to JSON string with pretty formatting
      const jsonString = JSON.stringify(cleanIssue, null, 2);

      // Create a blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${issue.id}-complete.json`;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading issue with sections:", error);
      throw error;
    }
  }

  // Create issue with sections from JSON data
  async createIssueWithSections(data: any): Promise<EditorIssue | null> {
    try {
      // Extract sections from data if they exist
      const { sections, ...issueData } = data;

      // Step 1: Create the issue first
      console.log("Creating issue:", issueData.id);
      const newIssue = await this.createIssue(issueData);

      if (!newIssue) {
        throw new Error("Failed to create issue");
      }

      // Step 2: Create all sections if they exist
      if (sections && Array.isArray(sections) && sections.length > 0) {
        console.log(`Creating ${sections.length} sections for issue ${newIssue.id}`);

        const response = await fetch("/api/magazine/sections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issueId: newIssue.id,
            sections: sections,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to create sections, but issue was created");
          // Don't throw - issue was created successfully
        } else {
          const result = await response.json();
          console.log(`Successfully created ${result.sections?.length || 0} sections`);
        }
      }

      return newIssue;
    } catch (error) {
      console.error("Error creating issue with sections:", error);
      throw error;
    }
  }

  // Replace issue with new data including sections
  async replaceIssueWithSections(id: string, data: any): Promise<EditorIssue | null> {
    try {
      // Extract sections from data if they exist
      const { sections, ...issueData } = data;

      // Step 1: Update issue metadata
      console.log("Updating issue metadata:", id);
      const updatedIssue = await this.updateIssue(id, issueData);

      if (!updatedIssue) {
        throw new Error("Failed to update issue");
      }

      // Step 2: Delete existing sections
      if (sections !== undefined) {
        console.log("Deleting existing sections for issue:", id);
        await this.deleteAllSections(id);

        // Step 3: Create new sections if provided
        if (Array.isArray(sections) && sections.length > 0) {
          console.log(`Creating ${sections.length} new sections for issue ${id}`);

          const response = await fetch("/api/magazine/sections", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              issueId: id,
              sections: sections,
            }),
            credentials: "include",
          });

          if (!response.ok) {
            console.error("Failed to create sections, but issue was updated");
          } else {
            const result = await response.json();
            console.log(`Successfully created ${result.sections?.length || 0} sections`);
          }
        }
      }

      return updatedIssue;
    } catch (error) {
      console.error("Error replacing issue with sections:", error);
      throw error;
    }
  }

  // Delete all sections for an issue
  async deleteAllSections(issueId: string): Promise<boolean> {
    try {
      // First, fetch all sections for the issue
      const response = await fetch(`/api/magazine/sections?issueId=${issueId}&skipLockChecks=true`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }

      const data = await response.json();
      const sections = data.sections || [];

      // Delete each section
      for (const section of sections) {
        console.log(`Deleting section ${section.id}`);
        const deleteResponse = await fetch(`/api/magazine/sections/${section.id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!deleteResponse.ok) {
          console.error(`Failed to delete section ${section.id}`);
        }
      }

      console.log(`Deleted ${sections.length} sections for issue ${issueId}`);
      return true;
    } catch (error) {
      console.error("Error deleting all sections:", error);
      return false;
    }
  }

  // Delete all digital pages for an issue
  async deleteAllDigitalPages(issueId: string): Promise<boolean> {
    try {
      // First, fetch all digital pages for the issue
      const response = await fetch(`/api/magazine/digital-pages?issueId=${issueId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch digital pages");
      }

      const data = await response.json();
      const pages = data.pages || [];

      // Delete each digital page
      for (const page of pages) {
        console.log(`Deleting digital page ${page.id}`);
        const deleteResponse = await fetch(`/api/magazine/digital-pages/${page.id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!deleteResponse.ok) {
          console.error(`Failed to delete digital page ${page.id}`);
        }
      }

      console.log(`Deleted ${pages.length} digital pages for issue ${issueId}`);
      return true;
    } catch (error) {
      console.error("Error deleting all digital pages:", error);
      return false;
    }
  }

  // Create issue with sections AND digital pages from JSON data
  async createIssueWithSectionsAndDigitalPages(data: any): Promise<EditorIssue | null> {
    try {
      // Extract sections and digitalPages from data if they exist
      const { sections, digitalPages, ...issueData } = data;

      // Step 1: Create the issue first
      console.log("Creating issue:", issueData.id);
      const newIssue = await this.createIssue(issueData);

      if (!newIssue) {
        throw new Error("Failed to create issue");
      }

      // Step 2: Create all sections if they exist
      if (sections && Array.isArray(sections) && sections.length > 0) {
        console.log(`Creating ${sections.length} sections for issue ${newIssue.id}`);

        const response = await fetch("/api/magazine/sections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issueId: newIssue.id,
            sections: sections,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to create sections, but issue was created");
        } else {
          const result = await response.json();
          console.log(`Successfully created ${result.sections?.length || 0} sections`);
        }
      }

      // Step 3: Create all digital pages if they exist
      if (digitalPages && Array.isArray(digitalPages) && digitalPages.length > 0) {
        console.log(`Creating ${digitalPages.length} digital pages for issue ${newIssue.id}`);

        const response = await fetch("/api/magazine/digital-pages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issueId: newIssue.id,
            pages: digitalPages,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to create digital pages, but issue was created");
        } else {
          const result = await response.json();
          console.log(`Successfully created ${result.pages?.length || 0} digital pages`);
        }
      }

      return newIssue;
    } catch (error) {
      console.error("Error creating issue with sections and digital pages:", error);
      throw error;
    }
  }

  // Replace issue with selective replacement of sections and/or digital pages
  async replaceIssueWithSectionsAndDigitalPages(
    id: string,
    data: any,
    replaceSections: boolean,
    replaceDigitalPages: boolean
  ): Promise<EditorIssue | null> {
    try {
      // Extract sections and digitalPages from data if they exist
      const { sections, digitalPages, ...issueData } = data;

      // Step 1: Update issue metadata
      console.log("Updating issue metadata:", id);
      const updatedIssue = await this.updateIssue(id, issueData);

      if (!updatedIssue) {
        throw new Error("Failed to update issue");
      }

      // Step 2: Handle sections replacement if requested
      if (replaceSections) {
        console.log("Deleting existing sections for issue:", id);
        await this.deleteAllSections(id);

        // Create new sections if provided
        if (sections && Array.isArray(sections) && sections.length > 0) {
          console.log(`Creating ${sections.length} new sections for issue ${id}`);

          const response = await fetch("/api/magazine/sections", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              issueId: id,
              sections: sections,
            }),
            credentials: "include",
          });

          if (!response.ok) {
            console.error("Failed to create sections, but issue was updated");
          } else {
            const result = await response.json();
            console.log(`Successfully created ${result.sections?.length || 0} sections`);
          }
        }
      }

      // Step 3: Handle digital pages replacement if requested
      if (replaceDigitalPages) {
        console.log("Deleting existing digital pages for issue:", id);
        await this.deleteAllDigitalPages(id);

        // Create new digital pages if provided
        if (digitalPages && Array.isArray(digitalPages) && digitalPages.length > 0) {
          console.log(`Creating ${digitalPages.length} new digital pages for issue ${id}`);

          const response = await fetch("/api/magazine/digital-pages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              issueId: id,
              pages: digitalPages,
            }),
            credentials: "include",
          });

          if (!response.ok) {
            console.error("Failed to create digital pages, but issue was updated");
          } else {
            const result = await response.json();
            console.log(`Successfully created ${result.pages?.length || 0} digital pages`);
          }
        }
      }

      return updatedIssue;
    } catch (error) {
      console.error("Error replacing issue with sections and digital pages:", error);
      throw error;
    }
  }

  // Download issue with complete data (sections and/or digital pages)
  async downloadIssueComplete(issue: EditorIssue, includeSections: boolean, includeDigitalPages: boolean): Promise<void> {
    try {
      // Create a clean copy without editor-specific fields
      const cleanIssue: any = { ...issue };
      delete cleanIssue.visible;
      delete cleanIssue.isEmpty;

      // Fetch sections if requested
      if (includeSections) {
        const response = await fetch(`/api/magazine/sections?issueId=${issue.id}&skipLockChecks=true`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const sections = data.sections || [];

          // Clean sections - remove lock-related fields
          const cleanSections = sections.map((section: any) => {
            const {
              lockedBy,
              lockedByEmail,
              lockedByName,
              lockedAt,
              lockExpiresAt,
              lockGroup,
              lockedTabId,
              isLockedByCurrentUser,
              canEdit,
              ...cleanSection
            } = section;
            return cleanSection;
          });

          cleanIssue.sections = cleanSections;
        }
      }

      // Fetch digital pages if requested
      if (includeDigitalPages) {
        const response = await fetch(`/api/magazine/digital-pages?issueId=${issue.id}`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          cleanIssue.digitalPages = data.pages || [];
        }
      }

      // Convert to JSON string with pretty formatting
      const jsonString = JSON.stringify(cleanIssue, null, 2);

      // Create a blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${issue.id}-complete.json`;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading complete issue:", error);
      throw error;
    }
  }
}

// Export singleton instance
const magazineEditorService = new MagazineEditorService();
export default magazineEditorService;
