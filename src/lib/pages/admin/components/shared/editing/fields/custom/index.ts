// Custom field components - organized by type
// Uses createCustomFieldWrapper factory for form integration

import { createCustomFieldWrapper } from './createCustomFieldWrapper';

// Import implementation components
import GalleryFieldImpl from './gallery/GalleryField';
import LocationFieldImpl from './location/LocationField';
import MultiLocationFieldImpl from './location/MultiLocationField';
import SpecialtiesFieldImpl from './specialties/SpecialtiesField';
import PromotionFieldImpl from './promotion/PromotionField';
import ImageUploadFieldImpl from './media/imageUpload';

// Create wrapped versions using factory
export const GalleryField = createCustomFieldWrapper(GalleryFieldImpl, {
  defaultValue: [],
  displayName: 'GalleryField'
});

export const LocationField = createCustomFieldWrapper(LocationFieldImpl, {
  defaultValue: null,
  displayName: 'LocationField'
});

export const MultiLocationField = createCustomFieldWrapper(MultiLocationFieldImpl, {
  defaultValue: [],
  displayName: 'MultiLocationField'
});

export const SpecialtiesField = createCustomFieldWrapper(SpecialtiesFieldImpl, {
  defaultValue: [],
  displayName: 'SpecialtiesField'
});

export const PromotionsField = createCustomFieldWrapper(PromotionFieldImpl, {
  defaultValue: [],
  displayName: 'PromotionsField'
});

export const ImageField = createCustomFieldWrapper(ImageUploadFieldImpl, {
  defaultValue: '',
  displayName: 'ImageField'
});

// Re-export ImageCropModal from media
export { default as ImageCropModal } from './media/ImageCropModal';

// Export LinkActionField
export { LinkActionField } from './link-action';
export type { LinkActionType, LinkFieldValue } from './link-action';

// Export VideoField (already form-integrated, no wrapper needed)
export { VideoField } from './media/video';
export type { VideoSourceType } from './media/video';

// Export ThumbnailEditorField (already form-integrated)
export { ThumbnailEditorField } from './ThumbnailEditorField';

// Export implementations for direct use if needed
export { GalleryFieldImpl, LocationFieldImpl, MultiLocationFieldImpl, SpecialtiesFieldImpl, PromotionFieldImpl, ImageUploadFieldImpl };
