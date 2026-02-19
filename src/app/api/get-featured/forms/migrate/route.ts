import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import {
  formLayouts,
  closingLayout,
  type FormLayout,
  type FormSection
} from '@/lib/pages/apply/featured/config/formLayouts';
import { fields_layout, type FieldConfig as GetFeaturedFieldConfig } from '@/lib/pages/apply/featured/config/fields';
import type { GetFeaturedFormConfig, FormSectionConfig, FormFieldConfig, FieldValidation, FieldOption } from '@/lib/pages/admin/components/form-submissions/get-featured/types';

const COLLECTION_NAME = 'get-featured-forms';

// Map form layout keys to database IDs
const FORM_ID_MAP: Record<string, string> = {
  'cover': 'cover',
  'localSpotlight': 'local-spotlight',
  'risingStar': 'rising-star',
  'topTreatment': 'top-treatment'
};

// Map form keys to field layout keys
const FIELD_LAYOUT_MAP: Record<string, keyof typeof fields_layout> = {
  'cover': 'cover',
  'localSpotlight': 'localSpotlight',
  'risingStar': 'risingStar',
  'topTreatment': 'topTreatment'
};

/**
 * Convert GetFeatured field config to admin FormFieldConfig
 */
function convertField(
  fieldKey: string,
  fieldConfig: GetFeaturedFieldConfig,
  order: number
): FormFieldConfig {
  const field: FormFieldConfig = {
    id: `field_${fieldKey}`,
    name: fieldKey,
    type: fieldConfig.type,
    label: fieldConfig.label,
    required: fieldConfig.required,
    placeholder: fieldConfig.placeholder,
    helperText: fieldConfig.helperText || fieldConfig.description,
    order
  };

  // Add optional properties
  if (fieldConfig.maxLength) {
    field.maxLength = fieldConfig.maxLength;
  }
  if (fieldConfig.rows) {
    field.rows = fieldConfig.rows;
  }
  if (fieldConfig.maxPoints) {
    field.maxPoints = fieldConfig.maxPoints;
  }
  if (fieldConfig.minSelections !== undefined) {
    field.minSelections = fieldConfig.minSelections;
  }
  if (fieldConfig.maxSelections !== undefined) {
    field.maxSelections = fieldConfig.maxSelections;
  }
  if (fieldConfig.columns !== undefined) {
    field.columns = fieldConfig.columns;
  }

  // Convert options
  if (fieldConfig.options && fieldConfig.options.length > 0) {
    field.options = fieldConfig.options.map(opt => ({
      id: opt.id,
      label: opt.label,
      description: opt.description
    }));
  }

  // Convert validation
  if (fieldConfig.validation) {
    const validation: FieldValidation = {};
    if (fieldConfig.validation.required !== undefined) {
      validation.required = fieldConfig.validation.required;
    }
    if (fieldConfig.validation.minLength !== undefined) {
      validation.minLength = fieldConfig.validation.minLength;
    }
    if (fieldConfig.validation.maxLength !== undefined) {
      validation.maxLength = fieldConfig.validation.maxLength;
    }
    if (fieldConfig.validation.minChars !== undefined) {
      validation.minChars = fieldConfig.validation.minChars;
    }
    if (fieldConfig.validation.pattern) {
      // Store regex as string
      validation.pattern = fieldConfig.validation.pattern.toString().slice(1, -1);
    }
    if (fieldConfig.validation.minFiles !== undefined) {
      validation.minFiles = fieldConfig.validation.minFiles;
    }
    if (fieldConfig.validation.maxFiles !== undefined) {
      validation.maxFiles = fieldConfig.validation.maxFiles;
    }
    if (fieldConfig.validation.maxSize !== undefined) {
      // Convert MB to bytes for storage
      validation.maxSize = fieldConfig.validation.maxSize * 1024 * 1024;
    }
    if (fieldConfig.validation.accept) {
      validation.accept = fieldConfig.validation.accept;
    }
    if (fieldConfig.validation.message) {
      validation.message = fieldConfig.validation.message;
    }

    if (Object.keys(validation).length > 0) {
      field.validation = validation;
    }
  }

  return field;
}

/**
 * Convert a form layout section to FormSectionConfig
 */
function convertSection(
  section: FormSection,
  sectionOrder: number,
  formFieldsLayout: Record<string, GetFeaturedFieldConfig>
): FormSectionConfig {
  const fields: FormFieldConfig[] = section.fields.map((fieldKey, index) => {
    const fieldConfig = formFieldsLayout[fieldKey];
    if (!fieldConfig) {
      // Return a placeholder for missing fields
      return {
        id: `field_${fieldKey}`,
        name: fieldKey,
        type: 'text' as const,
        label: fieldKey,
        required: false,
        order: index + 1
      };
    }
    return convertField(fieldKey, fieldConfig, index + 1);
  });

  return {
    id: `section_${sectionOrder}`,
    title: section.title,
    description: section.description,
    fields,
    layout: section.layout || 'single',
    order: sectionOrder
  };
}

/**
 * Convert a FormLayout to GetFeaturedFormConfig
 */
function convertFormLayout(
  formKey: string,
  layout: FormLayout,
  order: number
): GetFeaturedFormConfig {
  const formId = FORM_ID_MAP[formKey] || formKey;
  const fieldLayoutKey = FIELD_LAYOUT_MAP[formKey];
  const formFieldsLayout = fieldLayoutKey ? fields_layout[fieldLayoutKey] : {};

  // Convert main sections
  const sections: FormSectionConfig[] = layout.sections.map((section, index) =>
    convertSection(section, index + 1, formFieldsLayout as Record<string, GetFeaturedFieldConfig>)
  );

  // Add closing layout sections (common to all forms)
  const closingSections = closingLayout.sections.map((section, index) =>
    convertSection(
      section,
      layout.sections.length + index + 1,
      fields_layout.glamlinkIntegration as Record<string, GetFeaturedFieldConfig>
    )
  );

  const now = new Date().toISOString();

  return {
    id: formId,
    title: layout.title,
    description: layout.description,
    icon: layout.icon,
    bannerColor: layout.bannerColor,
    enabled: true,
    order,
    sections: [...sections, ...closingSections],
    createdAt: now,
    updatedAt: now
  };
}

/**
 * POST /api/get-featured/forms/migrate
 * Migrate static form configurations to database
 */
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check for existing forms
    const existingForms = await getDocs(collection(db, COLLECTION_NAME));
    if (!existingForms.empty) {
      return NextResponse.json({
        success: false,
        error: 'Form configurations already exist in database',
        existingCount: existingForms.size,
        message: 'Delete existing forms before running migration'
      }, { status: 400 });
    }

    const results: { id: string; title: string; sectionCount: number; fieldCount: number }[] = [];
    let order = 1;

    // Migrate each form layout
    for (const [formKey, layout] of Object.entries(formLayouts)) {
      const formConfig = convertFormLayout(formKey, layout, order);

      // Calculate total fields
      const fieldCount = formConfig.sections.reduce(
        (sum, section) => sum + section.fields.length,
        0
      );

      // Save to Firestore
      const formRef = doc(db, COLLECTION_NAME, formConfig.id);
      await setDoc(formRef, formConfig);

      results.push({
        id: formConfig.id,
        title: formConfig.title,
        sectionCount: formConfig.sections.length,
        fieldCount
      });

      order++;
    }

    // Also create a profile-only form config for profile-only submissions
    const profileOnlyConfig: GetFeaturedFormConfig = {
      id: 'profile-only',
      title: 'Profile Only',
      description: 'Basic profile submission without a specific feature type.',
      icon: 'heart',
      bannerColor: 'bg-gradient-to-r from-gray-600 to-gray-500',
      enabled: true,
      order,
      sections: [
        {
          id: 'section_profile',
          title: 'Profile Information',
          description: 'Basic profile details',
          fields: [],
          layout: 'single',
          order: 1
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const profileRef = doc(db, COLLECTION_NAME, 'profile-only');
    await setDoc(profileRef, profileOnlyConfig);
    results.push({
      id: 'profile-only',
      title: 'Profile Only',
      sectionCount: 1,
      fieldCount: 0
    });

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      migratedForms: results,
      totalForms: results.length
    });

  } catch (error) {
    console.error('Error during migration:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
