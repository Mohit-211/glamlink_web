import { MagazineIssue, MagazineIssueSection, UserMagazineTemplate, UserTemplateSection } from "../types/magazine";
import { customTemplates } from "../config/sections/templates/custom-templates";

export interface MagazineTemplate {
  id: string;
  name: string;
  description: string;
  sections: TemplateSectionStructure[];
  coverConfig?: any;
  isDefault?: boolean;
}

export interface TemplateSectionStructure {
  type: string;
  title: string;
  subtitle?: string;
  order: number;
}

class MagazineTemplateService {
  // Get the standard template structure
  getStandardTemplate(): MagazineTemplate {
    return {
      id: "standard",
      name: "Standard Glamlink Edit",
      description: "The proven magazine layout with 10 essential sections",
      isDefault: true,
      sections: [
        { type: "cover-pro-feature", title: "Cover Pro Feature", subtitle: "Featured Professional Interview", order: 1 },
        { type: "whats-new-glamlink", title: "What's New in Glamlink", subtitle: "Platform Updates & Features", order: 2 },
        { type: "top-treatment", title: "Top Treatment", subtitle: "Trending Beauty Treatment", order: 3 },
        { type: "top-product-spotlight", title: "Top Product Spotlight", subtitle: "Featured Product", order: 4 },
        { type: "maries-column", title: "Marie's Column", subtitle: "From the Founder", order: 5 },
        { type: "coin-drop", title: "Coin Drop", subtitle: "Rewards & Challenges", order: 6 },
        { type: "glamlink-stories", title: "Glamlink Stories", subtitle: "Community Highlights", order: 7 },
        { type: "spotlight-city", title: "Spotlight City", subtitle: "Beauty Scene Feature", order: 8 },
        { type: "pro-tips", title: "Pro Tips", subtitle: "Expert Advice", order: 9 },
        { type: "quote-wall", title: "Quote Wall", subtitle: "Inspiration & Motivation", order: 10 },
      ],
      coverConfig: {
        featuredPersonIssueHeight: {
          default: "320px",
          sm: "340px",
          md: "410px",
          lg: "340px",
          "2xl": "300px",
        },
        textPlacement: {
          verticalAlign: "bottom",
          horizontalAlign: "center",
          featuredPersonPosition: {
            default: { top: "60%", left: "5%", width: "150px" },
            sm: { top: "55%", left: "3%", width: "170px" },
            md: { top: "52%", left: "2%", width: "180px" },
            lg: { top: "50%", left: "0%", width: "200px" },
            "2xl": { top: "50%", left: "0%", width: "200px" },
          },
          featuredTitlePosition: {
            default: { top: "72%", left: "48%" },
            sm: { top: "70%", left: "47%" },
            md: { top: "68%", left: "46%" },
            lg: { top: "75%", left: "57%" },
            "2xl": { top: "73%", left: "48%" },
          },
          titlePosition: {
            default: { top: "80%", left: "50%" },
            sm: { top: "78%", left: "50%" },
            md: { top: "76%", left: "50%" },
            lg: { top: "82%", left: "50%" },
            "2xl": { top: "80%", left: "50%" },
          },
        },
      },
    };
  }

  // Get the Starting Magazine template with 7 predefined sections from custom templates
  getStartingMagazineTemplate(): MagazineTemplate {
    // Map the actual custom templates to sections
    const customSections = [
      "The Glam Drop",
      "Cover Pro Feature", 
      "Marie's Corner",
      "Rising Star Feature",
      "Top Treatment Showcase",
      "Product Spotlight Complete",
      "Quote Wall"
    ];
    
    const sections = customSections.map((name, index) => {
      const template = customTemplates.find(t => t.name === name);
      if (template) {
        return {
          type: "custom-section",
          title: template.data.title || name,
          subtitle: template.data.subtitle || "",
          order: index + 1,
          customData: template.data // Include the full custom template data
        };
      }
      // Fallback if template not found
      return {
        type: "custom-section",
        title: name,
        subtitle: "",
        order: index + 1
      };
    });

    return {
      id: "starting-magazine",
      name: "Starting Magazine Issue",
      description: "Quick start template with 7 pre-configured custom sections",
      isDefault: false,
      sections,
    };
  }

  // Apply template to create new issue structure
  applyTemplateToIssue(template: MagazineTemplate, existingData?: Partial<MagazineIssue>): Partial<MagazineIssue> {
    const sections: MagazineIssueSection[] = template.sections.map((templateSection: any, index) => {
      // Use simple temporary IDs that won't conflict with Firestore
      // These will be replaced with real IDs when saved to database
      const tempId = `temp-${templateSection.type}-${index}`;

      // If this is a custom section with customData, use that
      if (templateSection.customData) {
        return {
          id: tempId,
          type: "custom-section" as any,
          title: templateSection.customData.title,
          subtitle: templateSection.customData.subtitle,
          content: templateSection.customData.content || templateSection.customData,
        };
      }

      // Otherwise create empty content based on section type
      const emptyContent = this.getEmptyContentForType(templateSection.type);

      return {
        id: tempId,
        type: templateSection.type as any,
        title: templateSection.title,
        subtitle: templateSection.subtitle,
        content: emptyContent,
      };
    });

    // Merge with existing data if provided, but always use template sections
    return {
      ...existingData,
      sections,
      // Apply cover config if it's the standard template
      ...(template.id === "standard" && template.coverConfig ? template.coverConfig : {}),
    };
  }

  // Get empty content structure for each section type
  private getEmptyContentForType(type: string): any {
    switch (type) {
      case "cover-pro-feature":
        return {
          type: "cover-pro-feature",
          coverImage: "/images/placeholder-cover.jpg",
          coverImageAlt: "",
          professionalName: "",
          professionalTitle: "",
          professionalImage: "",
          pullQuote: "",
          journey: "",
          niche: "",
          glamlinkUsage: "",
          achievements: [],
          socialLinks: {
            instagram: "",
            website: "",
            glamlinkProfile: "",
          },
        };

      case "whats-new-glamlink":
        return {
          type: "whats-new-glamlink",
          features: [],
          sneakPeeks: [],
          tips: [],
          usageBoosts: [],
        };

      case "top-treatment":
        return {
          type: "top-treatment",
          treatmentName: "",
          heroImage: "/images/placeholder.jpg",
          whyTrending: "",
          whyItMatters: "",
          benefits: [],
          duration: "",
          frequency: "",
          priceRange: "",
          results: "",
          beforeAfter: {
            before: "",
            after: "",
          },
          proInsights: [],
          bookingLink: "",
        };

      case "top-product-spotlight":
        return {
          type: "top-product-spotlight",
          productName: "",
          productImage: "/images/placeholder.jpg",
          brandName: "",
          price: 0,
          description: "",
          keyFeatures: [],
          ingredients: [],
          isBestseller: false,
          rating: 0,
          reviewCount: 0,
          shopLink: "",
        };

      case "maries-column":
        return {
          type: "maries-column",
          title: "",
          subtitle: "",
          authorImage: "",
          openingQuote: "",
          mainContent: "",
          keyTakeaways: [],
          actionItems: [],
          closingThought: "",
        };

      case "coin-drop":
        return {
          type: "coin-drop",
          monthlyChallenge: {
            title: "",
            description: "",
            coinReward: 0,
            steps: [],
            deadline: "",
            participants: 0,
          },
          waysToEarn: [],
          featuredRewards: [],
        };

      case "glamlink-stories":
        return {
          type: "glamlink-stories",
          stories: [],
          featuredStories: [],
        };

      case "spotlight-city":
        return {
          type: "spotlight-city",
          cityName: "",
          cityImage: "",
          description: "",
          topPros: [],
          localEvents: [],
          trends: [],
        };

      case "pro-tips":
        return {
          type: "pro-tips",
          authorName: "",
          authorTitle: "",
          authorImage: "",
          topic: "",
          tips: [],
          callToAction: {
            text: "",
            link: "",
          },
        };

      case "quote-wall":
        return {
          type: "quote-wall",
          quotes: [],
          theme: "",
        };

      case "maries-corner":
        return {
          type: "maries-corner",
          tagline: "",
          mainStory: {
            title: "",
            content: "",
            authorName: "Marie Marks",
            authorTitle: "Founder & CEO, Glamlink",
            authorImage: "",
          },
          mariesPicks: {
            title: "Marie's Picks",
            products: [],
          },
          sideStories: [],
          socialLink: {
            platform: "Instagram",
            handle: "@glamlink",
            qrCode: "",
          },
        };

      case "rising-star":
        return {
          type: "rising-star",
          starName: "",
          starImage: "",
          starTitle: "",
          introText: "",
          bodyContent: "",
          achievements: [],
          photoGallery: [],
          socialLinks: {},
        };

      default:
        return { type };
    }
  }

  // Get all available templates
  getAllTemplates(): MagazineTemplate[] {
    return [
      this.getStandardTemplate(),
      {
        id: "blank",
        name: "Blank Template",
        description: "Start with an empty magazine",
        sections: [],
        isDefault: false,
      },
      {
        id: "minimal",
        name: "Minimal Template",
        description: "Just the essentials - 5 core sections",
        sections: [
          { type: "cover-pro-feature", title: "Cover Feature", order: 1 },
          { type: "whats-new-glamlink", title: "Platform Updates", order: 2 },
          { type: "top-product-spotlight", title: "Product Spotlight", order: 3 },
          { type: "glamlink-stories", title: "Community Stories", order: 4 },
          { type: "quote-wall", title: "Closing Quotes", order: 5 },
        ],
        isDefault: false,
      },
    ];
  }

  // Load the actual standard template from the JSON file
  async loadStandardTemplateContent(): Promise<MagazineIssue> {
    // In a real app, this would fetch from the server
    // For now, we return a structured template
    const standardIssue: MagazineIssue = {
      id: "2025-08-04",
      title: "The Glamlink Edit",
      subtitle: "Issue #1: The Launch Edition",
      featuredPerson: "MELANIE MARKS",
      featuredTitle: "Founder & CEO",
      issueNumber: 1,
      issueDate: "2025-08-04",
      coverImage: "/images/cover_1_edited.png",
      coverImageAlt: "Glamlink Magazine Issue 1 - Summer Glow Edition",
      description: "Welcome to the inaugural issue of The Glamlink Edit - your monthly guide to building a successful beauty business on Glamlink.",
      editorNote: "Welcome to The Glamlink Edit! This is more than just a magazine - it's your monthly playbook for beauty business success.",
      featured: true,
      sections: [], // Sections would be populated from template
    };

    return standardIssue;
  }

  // Create a new issue from template with updated metadata
  createIssueFromTemplate(
    templateId: string,
    metadata: {
      id: string;
      title: string;
      subtitle: string;
      issueNumber: number;
      issueDate: string;
      description: string;
    }
  ): Partial<MagazineIssue> {
    const templates = this.getAllTemplates();
    const template = templates.find((t) => t.id === templateId);

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const baseIssue = this.applyTemplateToIssue(template);

    return {
      ...baseIssue,
      ...metadata,
      coverImage: "/images/cover_1_transparent.png",
      coverImageAlt: `${metadata.title} Cover`,
      featured: false,
      editorNote: "",
    };
  }

  // Validate if an issue follows a template structure
  validateAgainstTemplate(
    issue: MagazineIssue,
    templateId: string
  ): {
    valid: boolean;
    differences: string[];
  } {
    const templates = this.getAllTemplates();
    const template = templates.find((t) => t.id === templateId);

    if (!template) {
      return { valid: false, differences: ["Template not found"] };
    }

    const differences: string[] = [];

    // Check section count
    if (issue.sections.length !== template.sections.length) {
      differences.push(`Section count mismatch: ${issue.sections.length} vs ${template.sections.length}`);
    }

    // Check section types and order
    template.sections.forEach((templateSection, index) => {
      if (issue.sections[index]) {
        if (issue.sections[index].type !== templateSection.type) {
          differences.push(`Section ${index + 1} type mismatch: ${issue.sections[index].type} vs ${templateSection.type}`);
        }
      } else {
        differences.push(`Missing section at position ${index + 1}: ${templateSection.type}`);
      }
    });

    return {
      valid: differences.length === 0,
      differences,
    };
  }

  // ================ User Magazine Template Management ================

  private userTemplatesKey = "magazine-user-templates";

  // Get all user templates from localStorage (client-side only)
  getUserTemplates(): UserMagazineTemplate[] {
    if (typeof window === "undefined") return [];
    
    const stored = localStorage.getItem(this.userTemplatesKey);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing user templates:", error);
      return [];
    }
  }

  // Save a new user template
  saveUserTemplate(template: Omit<UserMagazineTemplate, 'id' | 'createdAt' | 'updatedAt'>): UserMagazineTemplate {
    if (typeof window === "undefined") {
      throw new Error("Cannot save templates on server side");
    }

    const templates = this.getUserTemplates();
    const newTemplate: UserMagazineTemplate = {
      ...template,
      id: `user-template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    templates.push(newTemplate);
    localStorage.setItem(this.userTemplatesKey, JSON.stringify(templates));
    
    return newTemplate;
  }

  // Update an existing user template
  updateUserTemplate(id: string, updates: Partial<UserMagazineTemplate>): UserMagazineTemplate | null {
    if (typeof window === "undefined") return null;

    const templates = this.getUserTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) return null;

    templates[index] = {
      ...templates[index],
      ...updates,
      id: templates[index].id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(this.userTemplatesKey, JSON.stringify(templates));
    return templates[index];
  }

  // Delete a user template
  deleteUserTemplate(id: string): boolean {
    if (typeof window === "undefined") return false;

    const templates = this.getUserTemplates();
    const filtered = templates.filter(t => t.id !== id);
    
    if (filtered.length === templates.length) return false; // Template not found
    
    localStorage.setItem(this.userTemplatesKey, JSON.stringify(filtered));
    return true;
  }

  // Apply a user template to create sections
  applyUserTemplate(template: UserMagazineTemplate): MagazineIssueSection[] {
    return template.sections.map((section, index) => {
      // Each section in the template already has full data
      const sectionData = section.data;
      
      return {
        id: `${sectionData.id || section.type}-${Date.now()}-${index}`,
        type: sectionData.type || section.type,
        title: sectionData.title || section.name,
        subtitle: sectionData.subtitle || "",
        content: sectionData.content || sectionData,
      };
    });
  }

  // Create a user template from existing sections
  createTemplateFromSections(
    name: string,
    description: string,
    sections: any[],
    icon?: string
  ): Omit<UserMagazineTemplate, 'id' | 'createdAt' | 'updatedAt'> {
    const templateSections: UserTemplateSection[] = sections.map((section, index) => ({
      id: `section-${index}`,
      type: section.type || 'custom-section',
      name: section.title || `Section ${index + 1}`,
      description: section.subtitle || '',
      order: index,
      data: section, // Store the entire section data
    }));

    return {
      name,
      description,
      icon,
      sections: templateSections,
      createdBy: 'current-user', // This would be replaced with actual user ID in production
      isPublic: false,
      tags: [],
    };
  }

  // Get template by ID
  getTemplateById(templateId: string): MagazineTemplate | null {
    const templates = this.getAllTemplates();
    return templates.find(t => t.id === templateId) || null;
  }

  // Get default template for new issues
  getDefaultTemplate(): MagazineTemplate {
    return this.getStartingMagazineTemplate();
  }
}

// Export singleton instance
const magazineTemplateService = new MagazineTemplateService();
export default magazineTemplateService;
