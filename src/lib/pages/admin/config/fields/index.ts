// ============================================
// FIELD CONFIGURATIONS - CENTRALIZED EXPORTS
// ============================================

// Export all professional field configurations
export {
  CERTIFICATION_LEVELS,
  PROFESSIONAL_CUSTOM_MODAL_REGISTRY,
  professionalEditFields,
  getProfessionalFieldsForModalType,
  getDefaultProfessionalValues,
  // New tab-specific exports
  basicInfoFields as professionalBasicInfoFields,
  mediaGalleryFields,
  servicesPromotionsFields,
  professionalModalTabs
} from './professionals';

// Export all promo field configurations
export {
  PROMO_CATEGORIES,
  DISCOUNT_TYPES,
  PROMO_CUSTOM_MODAL_REGISTRY,
  promoEditFields,
  getPromoFieldsForModalType,
  getDefaultPromoValues
} from './promos';

// Export all magazine field configurations
export {
  magazineEditFields,
  basicInfoFields,
  coverConfigurationFields,
  getDefaultMagazineValues,
  magazineModalTabs
} from './magazine';

// Export magazine preview components configuration
export {
  issuePreviewComponents,
  type IssuePreviewComponent,
  type PreviewComponentProps
} from '../previewComponents';

// Export digital page field configurations
export {
  imageWithCaptionPageFields,
  fullBleedImagePageFields,
  textOnlyPageFields,
  getDefaultImageWithCaptionPage,
  getDefaultFullBleedImagePage,
  getDefaultTextOnlyPage,
  digitalPageFieldConfigs,
  getFieldsForPageType,
  getDefaultDataForPageType,
  IMAGE_POSITION_OPTIONS,
  TEXT_ALIGNMENT_OPTIONS,
  IMAGE_SIZE_OPTIONS,
  VERTICAL_ALIGNMENT_OPTIONS
} from './digital';

// Export digital preview components configuration
export {
  digitalPreviewComponents,
  getDigitalPreviewComponent,
  getFieldsForDigitalPage,
  getDefaultDigitalPageData,
  type DigitalPreviewComponent
} from '../digitalPreviewComponents';

// Export web section field configurations
export {
  joinGlamlinkFields,
  getDefaultJoinGlamlink,
  webSectionFieldConfigs,
  getFieldsForWebSectionType,
  getDefaultDataForWebSectionType,
} from './web';

// Export web preview components configuration
export {
  webPreviewComponents,
  getWebPreviewComponent,
  getFieldsForWebSection,
  getDefaultWebSectionData,
  type WebPreviewComponent
} from '../webPreviewComponents';

// Export professional preview components configuration
export {
  professionalPreviewComponents,
  type ProfessionalPreviewComponent,
  type ProfessionalPreviewComponentProps
} from '../professionalPreviewComponents';

// Re-export MODAL_TYPE_OPTIONS from professionals (shared constant)
export { MODAL_TYPE_OPTIONS } from './professionals';

// Export all get-featured field configurations
export {
  SUBMISSION_STATUS_OPTIONS,
  FORM_TYPE_OPTIONS,
  FORM_FIELD_TYPE_OPTIONS,
  FORM_ICON_OPTIONS,
  SECTION_LAYOUT_OPTIONS,
  submissionViewFields,
  formConfigBasicFields,
  formSectionFields,
  formFieldConfigFields,
  fieldValidationFields,
  fieldOptionFields,
  getDefaultFormConfigValues,
  getDefaultSectionValues,
  getDefaultFieldConfigValues,
  getDefaultValidationValues,
  getDefaultOptionValues
} from './getFeatured';
