// Core magazine types
export * from "./core";

// Field types  
export * from "./fields";

// Section content types
export * from "./sections";

// Entity types (from sections folder)
export type { 
  ClinicalTrial,
  UserGeneratedContent,
  BeautyBoxSubscription,
  YouthTrendItem,
  SustainableProduct,
  BeautyInvestment,
  LiveCommerceEvent
} from "./sections/entities";

// User-created magazine template types
export interface UserMagazineTemplate {
  id: string;
  name: string;
  description: string;
  icon?: string;
  sections: UserTemplateSection[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UserTemplateSection {
  id: string;
  type: string;
  name: string;
  description: string;
  order: number;
  data: any; // Full section data including content blocks
}

// User-saved custom section types
export interface UserSavedSection {
  id: string;
  name: string;
  description: string;
  icon?: string;
  type: string;
  baseType?: string; // Original section type it was based on
  data: any; // Full section data
  includeEmptyOption?: boolean; // Whether to show "empty data" option when using
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}