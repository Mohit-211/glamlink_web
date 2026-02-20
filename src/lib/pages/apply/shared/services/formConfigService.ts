/**
 * Form Config Service - Server-side service for fetching form configurations
 *
 * Fetches form configs from Firestore and transforms them into the format
 * expected by the GetFeaturedForm components.
 */

import { getPublicFirebaseApp } from '@/lib/firebase/serverApp';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { GetFeaturedFormConfig, FormFieldConfig, FormSectionConfig } from '@/lib/pages/admin/components/form-submissions/get-featured/types';
import type { FormLayout, FormSection } from '../../featured/config/formLayouts';
import type { FieldConfig, TabConfig, FieldsLayout } from '../../featured/config/fields';

// =============================================================================
// TYPES
// =============================================================================

export interface FormConfigsData {
  formTypes: string[];
  fieldsLayout: FieldsLayout;
  formLayouts: Record<string, FormLayout>;
  closingLayout: FormLayout;
  rawConfigs: GetFeaturedFormConfig[];
}

// =============================================================================
// COLLECTION NAME
// =============================================================================

const COLLECTION_NAME = 'get-featured-forms';

// =============================================================================
// MAIN FETCH FUNCTION
// =============================================================================

/**
 * Fetch and transform form configurations from Firestore
 * For use in server components (SSR)
 */
export async function getFormConfigs(): Promise<FormConfigsData | null> {
  try {
    const { db } = await getPublicFirebaseApp();

    if (!db) {
      console.error('[formConfigService] Failed to get Firestore instance');
      return null;
    }

    // Fetch all enabled form configs, ordered by order field
    const formsQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('order', 'asc')
    );

    const querySnapshot = await getDocs(formsQuery);
    const configs = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GetFeaturedFormConfig))
      .filter(config => config.enabled); // Only include enabled forms

    if (configs.length === 0) {
      console.log('[formConfigService] No form configs found in database');
      return null;
    }

    // Transform configs into the formats expected by form components
    const formTypes = configs.map(c => c.id);
    const fieldsLayout = transformToFieldsLayout(configs);
    const formLayouts = transformToFormLayouts(configs);
    const closingLayout = extractClosingLayout(configs);

    return {
      formTypes,
      fieldsLayout,
      formLayouts,
      closingLayout,
      rawConfigs: configs
    };

  } catch (error) {
    console.error('[formConfigService] Error fetching form configs:', error);
    return null;
  }
}

// =============================================================================
// TRANSFORM FUNCTIONS
// =============================================================================

/**
 * Transform DB configs into fields_layout format
 * { profile: { email: {...}, fullName: {...} }, cover: { bio: {...} }, ... }
 */
function transformToFieldsLayout(configs: GetFeaturedFormConfig[]): FieldsLayout {
  const layout: FieldsLayout = {
    profile: {},
    glamlinkIntegration: {},
    cover: {},
    localSpotlight: {},
    risingStar: {},
    topTreatment: {}
  };

  for (const config of configs) {
    // Map config ID to layout key
    const layoutKey = mapIdToLayoutKey(config.id);
    if (!layoutKey) continue;

    // Process each section
    for (const section of config.sections || []) {
      // Check if this is a special section
      if (section.id === 'profile' || section.title.toLowerCase().includes('profile')) {
        // Add fields to profile section
        for (const field of section.fields || []) {
          layout.profile[field.name] = transformFieldConfig(field);
        }
      } else if (section.id === 'glamlink' || section.title.toLowerCase().includes('glamlink')) {
        // Add fields to glamlinkIntegration section
        for (const field of section.fields || []) {
          layout.glamlinkIntegration[field.name] = transformFieldConfig(field);
        }
      } else {
        // Add fields to form-specific section
        const targetLayout = layout[layoutKey as keyof FieldsLayout];
        if (targetLayout) {
          for (const field of section.fields || []) {
            (targetLayout as TabConfig)[field.name] = transformFieldConfig(field);
          }
        }
      }
    }
  }

  return layout;
}

/**
 * Transform a single FormFieldConfig to FieldConfig format
 */
function transformFieldConfig(field: FormFieldConfig): FieldConfig {
  const config: FieldConfig = {
    type: field.type as FieldConfig['type'],
    label: field.label,
    required: field.required,
    placeholder: field.placeholder,
    helperText: field.helperText
  };

  // Add optional properties
  if (field.maxLength) config.maxLength = field.maxLength;
  if (field.rows) config.rows = field.rows;
  if (field.maxPoints) config.maxPoints = field.maxPoints;
  if (field.minSelections) config.minSelections = field.minSelections;
  if (field.maxSelections) config.maxSelections = field.maxSelections;
  if (field.columns) config.columns = field.columns;

  // Transform options
  if (field.options && field.options.length > 0) {
    config.options = field.options.map(opt => ({
      id: opt.id,
      label: opt.label,
      description: opt.description
    }));
  }

  // Transform validation
  if (field.validation) {
    config.validation = {
      required: field.validation.required,
      minLength: field.validation.minLength,
      maxLength: field.validation.maxLength,
      minChars: field.validation.minChars,
      minFiles: field.validation.minFiles,
      maxFiles: field.validation.maxFiles,
      maxSize: field.validation.maxSize,
      accept: field.validation.accept,
      message: field.validation.message
    };

    // Convert pattern string to RegExp
    if (field.validation.pattern) {
      try {
        config.validation.pattern = new RegExp(field.validation.pattern);
      } catch (e) {
        console.warn(`[formConfigService] Invalid pattern for field ${field.name}:`, e);
      }
    }
  }

  return config;
}

/**
 * Transform DB configs into formLayouts format
 * { cover: { title, description, icon, bannerColor, sections: [...] }, ... }
 */
function transformToFormLayouts(configs: GetFeaturedFormConfig[]): Record<string, FormLayout> {
  const layouts: Record<string, FormLayout> = {};

  for (const config of configs) {
    const layoutKey = mapIdToLayoutKey(config.id);
    if (!layoutKey) continue;

    // Filter out profile and glamlink sections for the form-specific layout
    const formSections = (config.sections || [])
      .filter(s => !s.id?.includes('profile') && !s.id?.includes('glamlink') &&
                   !s.title?.toLowerCase().includes('profile') && !s.title?.toLowerCase().includes('glamlink'))
      .map(transformSectionConfig);

    layouts[layoutKey] = {
      title: config.title,
      description: config.description,
      icon: config.icon,
      bannerColor: config.bannerColor,
      sections: formSections
    };
  }

  return layouts;
}

/**
 * Transform a FormSectionConfig to FormSection format
 */
function transformSectionConfig(section: FormSectionConfig): FormSection {
  return {
    title: section.title,
    description: section.description,
    fields: (section.fields || []).map(f => f.name),
    layout: section.layout
  };
}

/**
 * Extract closing layout (glamlink integration sections)
 */
function extractClosingLayout(configs: GetFeaturedFormConfig[]): FormLayout {
  // Try to find glamlink sections from any config
  let glamlinkSections: FormSection[] = [];

  for (const config of configs) {
    const sections = (config.sections || [])
      .filter(s => s.id?.includes('glamlink') || s.id?.includes('closing') ||
                   s.title?.toLowerCase().includes('glamlink') || s.title?.toLowerCase().includes('promotion'))
      .map(transformSectionConfig);

    if (sections.length > 0) {
      glamlinkSections = sections;
      break;
    }
  }

  // Default closing layout if none found
  return {
    title: "Glamlink Integration & Promotion",
    description: "Complete your feature submission with integration details and content planning.",
    icon: "sparkles",
    bannerColor: "bg-gradient-to-r from-teal-600 to-cyan-600",
    sections: glamlinkSections.length > 0 ? glamlinkSections : [
      {
        title: "Content Promotion",
        description: "Let's create buzz before your feature drop",
        fields: ["contentPlanningRadio", "contentPlanningDate", "contentPlanningMedia", "hearAboutLocalSpotlight"],
        layout: "single"
      },
      {
        title: "Glamlink Integration",
        description: "Your feature connects to Glamlink, our interactive platform.",
        fields: ["excitementFeatures", "painPoints", "promotionOffer", "promotionDetails", "instagramConsent"],
        layout: "single"
      }
    ]
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Map config ID to fields_layout key
 * e.g., 'local-spotlight' -> 'localSpotlight'
 */
function mapIdToLayoutKey(id: string): keyof FieldsLayout | null {
  const mapping: Record<string, keyof FieldsLayout> = {
    'cover': 'cover',
    'local-spotlight': 'localSpotlight',
    'rising-star': 'risingStar',
    'top-treatment': 'topTreatment',
    'profile': 'profile',
    'glamlink': 'glamlinkIntegration'
  };

  return mapping[id] || null;
}

/**
 * Get a single form layout by form type
 */
export async function getFormLayoutByType(formType: string): Promise<FormLayout | null> {
  const configs = await getFormConfigs();
  if (!configs) return null;

  const layoutKey = mapIdToLayoutKey(formType);
  if (!layoutKey) return null;

  return configs.formLayouts[layoutKey] || null;
}
