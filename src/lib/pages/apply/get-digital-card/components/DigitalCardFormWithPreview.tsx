'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { DigitalCardFormData } from '../types';
import { fields_layout as staticFieldsLayout } from '../config/fields';
import { useDigitalCardFormConfig } from '../hooks/useDigitalCardFormConfig';
import {
  TextField,
  EmailField,
  TextareaField,
  TiptapField,
  MultiCheckboxField,
  CheckboxField,
  PhoneField
} from '@/lib/pages/apply/shared/components/fields';
import MultiLocationFieldWrapper from './MultiLocationFieldWrapper';
import SimpleArrayField from './SimpleArrayField';
import { GalleryField } from '@/lib/pages/admin/components/shared/editing/fields/custom/gallery';
import { ImageCropModal } from '@/lib/pages/admin/components/shared/editing/fields/custom/media';
import { transformFormDataToProfessional, cleanupObjectURLs } from '../utils/transformFormData';
import StyledDigitalCardPreview from '@/lib/features/digital-cards/preview/StyledDigitalCardPreview';
import { LoadingSpinner } from '@/lib/components/ui';

interface DigitalCardFormWithPreviewProps {
  onSubmit: (data: DigitalCardFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function DigitalCardFormWithPreview({
  onSubmit,
  isLoading = false
}: DigitalCardFormWithPreviewProps) {
  // Fetch dynamic form configuration
  const {
    fieldsLayout: dynamicFieldsLayout,
    isLoading: isConfigLoading,
    source: configSource
  } = useDigitalCardFormConfig();

  // Use dynamic config if available, fallback to static
  const fields_layout = useMemo(() => {
    // Merge dynamic with static to ensure all fields are available
    return {
      profile: {
        ...staticFieldsLayout.profile,
        ...dynamicFieldsLayout.profile
      },
      glamlinkIntegration: {
        ...staticFieldsLayout.glamlinkIntegration,
        ...dynamicFieldsLayout.glamlinkIntegration
      }
    };
  }, [dynamicFieldsLayout]);
  const [formData, setFormData] = useState<DigitalCardFormData>({
    name: '',
    title: '',
    specialty: '',
    bio: '',
    profileImage: null,
    tiktok: '',
    locations: [],
    phone: '',
    email: '',
    businessHours: [
      'Monday: 9:00 AM - 5:00 PM',
      'Tuesday: 9:00 AM - 5:00 PM',
      'Wednesday: 9:00 AM - 5:00 PM',
      'Thursday: 9:00 AM - 5:00 PM',
      'Friday: 9:00 AM - 5:00 PM',
      'Saturday: Closed',
      'Sunday: Closed'
    ],
    specialties: [],
    gallery: [],
    // Booking preferences
    preferredBookingMethod: undefined,
    importantInfo: ['Deposit required to secure booking'],
    // Glamlink Integration
    excitementFeatures: [],
    painPoints: [],
    promotionOffer: false,
    promotionDetails: '',
    instagramConsent: false,
    applicationType: 'digital-card'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile image crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');

  // Transform form data to Professional format for preview
  const previewData = useMemo(() => {
    return transformFormDataToProfessional(formData);
  }, [formData]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      cleanupObjectURLs(previewData);
    };
  }, [previewData]);

  const handleFieldChange = useCallback((fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));

    // Clear error when field is updated
    if (errors[fieldKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.title?.trim()) {
      newErrors.title = 'Professional title is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.locations || formData.locations.length === 0) {
      newErrors.locations = 'At least one business location is required';
    }
    if (!formData.specialty?.trim()) {
      newErrors.specialty = 'Primary specialty is required';
    }
    if (!formData.bio?.trim()) {
      newErrors.bio = 'Professional bio is required';
    }

    // Glamlink Integration validation
    if (!formData.excitementFeatures || formData.excitementFeatures.length === 0) {
      newErrors.excitementFeatures = 'Please select at least one feature that excites you';
    }
    if (!formData.painPoints || formData.painPoints.length === 0) {
      newErrors.painPoints = 'Please select at least one pain point';
    }
    if (!formData.instagramConsent) {
      newErrors.instagramConsent = 'Please consent to profile creation using Instagram content';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isLoading) return;

    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching config
  if (isConfigLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading form configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50">
      {/* Config source indicator (for debugging - can be removed in production) */}
      {process.env.NODE_ENV === 'development' && configSource && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          Config: {configSource}
        </div>
      )}

      {/* Split View Container */}
      <div className="grid grid-cols-1 xl:grid-cols-[40%_60%] gap-6 p-6">

        {/* LEFT PANEL - Form (40%) */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-50px)] order-2 xl:order-1">

          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Basic Information
              </h3>
              <p className="text-gray-600 text-sm">
                Your professional details and contact information
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  fieldKey="name"
                  config={fields_layout.profile.name}
                  value={formData.name}
                  onChange={handleFieldChange}
                  error={errors.name}
                  disabled={isLoading || isSubmitting}
                />

                <TextField
                  fieldKey="title"
                  config={fields_layout.profile.title}
                  value={formData.title}
                  onChange={handleFieldChange}
                  error={errors.title}
                  disabled={isLoading || isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EmailField
                  fieldKey="email"
                  config={fields_layout.profile.email}
                  value={formData.email}
                  onChange={handleFieldChange}
                  error={errors.email}
                  disabled={isLoading || isSubmitting}
                />

                <PhoneField
                  fieldKey="phone"
                  config={fields_layout.profile.phone}
                  value={formData.phone}
                  onChange={handleFieldChange}
                  error={errors.phone}
                  disabled={isLoading || isSubmitting}
                />
              </div>

              <TiptapField
                fieldKey="bio"
                config={fields_layout.profile.bio}
                value={formData.bio}
                onChange={handleFieldChange}
                error={errors.bio}
                disabled={isLoading || isSubmitting}
              />

              <TextField
                fieldKey="businessName"
                config={fields_layout.profile.businessName}
                value={formData.businessName || ''}
                onChange={handleFieldChange}
                error={errors.businessName}
                disabled={isLoading || isSubmitting}
              />

              <MultiLocationFieldWrapper
                field={{
                  name: 'locations',
                  label: fields_layout.profile.locations.label,
                  type: 'multiLocation',
                  required: fields_layout.profile.locations.required,
                  helperText: fields_layout.profile.locations.helperText
                }}
                value={formData.locations}
                onChange={handleFieldChange}
                error={errors.locations}
                defaultBusinessName={formData.businessName}
                defaultPhone={formData.phone}
                defaultBusinessHours={formData.businessHours}
              />

              <SimpleArrayField
                fieldName="businessHours"
                label={fields_layout.profile.businessHours.label}
                value={formData.businessHours}
                onChange={handleFieldChange}
                error={errors.businessHours}
                disabled={isLoading || isSubmitting}
                placeholder="e.g., Monday: 9:00 AM - 7:00 PM"
                helperText={fields_layout.profile.businessHours.helperText}
                maxItems={10}
              />
            </div>
          </div>

          {/* Section 2: Media & Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Media & Profile
              </h3>
              <p className="text-gray-600 text-sm">
                Your professional image and portfolio
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  {formData.profileImage && (
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={formData.profileImage instanceof File
                            ? URL.createObjectURL(formData.profileImage)
                            : formData.profileImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Crop Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const imageUrl = formData.profileImage instanceof File
                            ? URL.createObjectURL(formData.profileImage)
                            : formData.profileImage;
                          if (imageUrl) {
                            setImageToCrop(imageUrl);
                            setShowCropModal(true);
                          }
                        }}
                        className="absolute -bottom-1 -right-1 bg-glamlink-teal text-white p-1.5 rounded-full shadow-md hover:bg-glamlink-teal-dark transition-colors"
                        title="Crop image"
                        disabled={isLoading || isSubmitting}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Store original file, then optionally open crop modal
                          handleFieldChange('profileImage', file);
                          // Auto-open crop modal after upload
                          const imageUrl = URL.createObjectURL(file);
                          setImageToCrop(imageUrl);
                          setShowCropModal(true);
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-glamlink-teal file:text-white
                        hover:file:bg-glamlink-teal-dark
                        cursor-pointer"
                      disabled={isLoading || isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a professional headshot (JPG, PNG, max 5MB). A crop tool will open automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery & Portfolio */}
              <GalleryField
                field={{
                  name: 'gallery',
                  label: fields_layout.profile.gallery.label,
                  type: 'gallery',
                  required: false,
                  helperText: fields_layout.profile.gallery.helperText
                }}
                value={formData.gallery || []}
                onChange={handleFieldChange}
                error={errors.gallery}
              />
            </div>
          </div>

          {/* Section 3: Services & Booking */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Services & Booking
              </h3>
              <p className="text-gray-600 text-sm">
                Your specialties and how clients can reach you
              </p>
            </div>

            <div className="space-y-6">
              <TextField
                fieldKey="specialty"
                config={fields_layout.profile.specialty}
                value={formData.specialty}
                onChange={handleFieldChange}
                error={errors.specialty}
                disabled={isLoading || isSubmitting}
              />

              <SimpleArrayField
                fieldName="specialties"
                label={fields_layout.profile.specialties.label}
                value={formData.specialties}
                onChange={handleFieldChange}
                error={errors.specialties}
                disabled={isLoading || isSubmitting}
                placeholder="e.g., Balayage, Keratin Treatments"
                helperText={fields_layout.profile.specialties.helperText}
                maxItems={5}
              />

              <TextField
                fieldKey="customHandle"
                config={fields_layout.profile.customHandle}
                value={formData.customHandle || ''}
                onChange={handleFieldChange}
                error={errors.customHandle}
                disabled={isLoading || isSubmitting}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  fieldKey="website"
                  config={fields_layout.profile.website}
                  value={formData.website || ''}
                  onChange={handleFieldChange}
                  error={errors.website}
                  disabled={isLoading || isSubmitting}
                />

                <TextField
                  fieldKey="instagram"
                  config={fields_layout.profile.instagram}
                  value={formData.instagram || ''}
                  onChange={handleFieldChange}
                  error={errors.instagram}
                  disabled={isLoading || isSubmitting}
                />
              </div>

              <TextField
                fieldKey="tiktok"
                config={fields_layout.profile.tiktok}
                value={formData.tiktok || ''}
                onChange={handleFieldChange}
                error={errors.tiktok}
                disabled={isLoading || isSubmitting}
              />

              {/* Preferred Booking Method Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Booking Method
                </label>
                <select
                  value={formData.preferredBookingMethod || ''}
                  onChange={(e) => handleFieldChange('preferredBookingMethod', e.target.value || undefined)}
                  disabled={isLoading || isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-glamlink-teal focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">Select booking method...</option>
                  <option value="send-text">Send Text</option>
                  <option value="instagram">Instagram Profile</option>
                  <option value="booking-link">Go to Booking Link</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.preferredBookingMethod === 'send-text' && 'Opens SMS to your phone number'}
                  {formData.preferredBookingMethod === 'instagram' && 'Opens your Instagram profile'}
                  {formData.preferredBookingMethod === 'booking-link' && 'Opens your booking link'}
                  {!formData.preferredBookingMethod && 'How clients should book appointments with you'}
                </p>
              </div>

              {/* Booking Link field - only shown when "Booking Link" is selected */}
              {formData.preferredBookingMethod === 'booking-link' && (
                <TextField
                  fieldKey="bookingUrl"
                  config={fields_layout.profile.bookingUrl}
                  value={formData.bookingUrl || ''}
                  onChange={handleFieldChange}
                  error={errors.bookingUrl}
                  disabled={isLoading || isSubmitting}
                />
              )}

              <SimpleArrayField
                fieldName="importantInfo"
                label={fields_layout.profile.importantInfo.label}
                value={formData.importantInfo || []}
                onChange={handleFieldChange}
                error={errors.importantInfo}
                disabled={isLoading || isSubmitting}
                placeholder="e.g., By appointment only"
                helperText={fields_layout.profile.importantInfo.helperText}
                maxItems={5}
              />
            </div>
          </div>

          {/* Section 4: Glamlink Integration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Glamlink Integration
              </h3>
              <p className="text-gray-600 text-sm">
                Help us understand your needs and how we can best support your business
              </p>
            </div>

            <div className="space-y-6">
              <MultiCheckboxField
                fieldKey="excitementFeatures"
                config={fields_layout.glamlinkIntegration.excitementFeatures}
                value={formData.excitementFeatures || []}
                onChange={handleFieldChange}
                error={errors.excitementFeatures}
                disabled={isLoading || isSubmitting}
                options={fields_layout.glamlinkIntegration.excitementFeatures.options || []}
                minSelections={fields_layout.glamlinkIntegration.excitementFeatures.minSelections}
                columns={(fields_layout.glamlinkIntegration.excitementFeatures.columns || 1) as 1 | 2}
              />

              <MultiCheckboxField
                fieldKey="painPoints"
                config={fields_layout.glamlinkIntegration.painPoints}
                value={formData.painPoints || []}
                onChange={handleFieldChange}
                error={errors.painPoints}
                disabled={isLoading || isSubmitting}
                options={fields_layout.glamlinkIntegration.painPoints.options || []}
                minSelections={fields_layout.glamlinkIntegration.painPoints.minSelections}
                columns={(fields_layout.glamlinkIntegration.painPoints.columns || 2) as 1 | 2}
              />

              <CheckboxField
                fieldKey="promotionOffer"
                config={fields_layout.glamlinkIntegration.promotionOffer}
                value={formData.promotionOffer}
                onChange={handleFieldChange}
                error={errors.promotionOffer}
                disabled={isLoading || isSubmitting}
              />

              {formData.promotionOffer && (
                <TextareaField
                  fieldKey="promotionDetails"
                  config={fields_layout.glamlinkIntegration.promotionDetails}
                  value={formData.promotionDetails || ''}
                  onChange={handleFieldChange}
                  error={errors.promotionDetails}
                  disabled={isLoading || isSubmitting}
                />
              )}

              <CheckboxField
                fieldKey="instagramConsent"
                config={fields_layout.glamlinkIntegration.instagramConsent}
                value={formData.instagramConsent}
                onChange={handleFieldChange}
                error={errors.instagramConsent}
                disabled={isLoading || isSubmitting}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className={`
                w-full px-8 py-4 font-semibold rounded-full transition-all duration-200 text-lg
                ${isLoading || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark shadow-lg hover:shadow-xl transform hover:scale-105'
                }
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Application...
                </span>
              ) : isLoading ? (
                'Loading...'
              ) : (
                'Submit Application'
              )}
            </button>
            {Object.keys(errors).length > 0 && (
              <p className="text-red-600 text-sm text-center mt-3">
                Please fix the errors above before submitting
              </p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Preview (60%) */}
        <div className="bg-gray-100 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-50px)] min-h-[calc(100vh-50px)] order-1 xl:order-2 xl:sticky xl:top-6">
          <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Live Preview
                </h3>
                <p className="text-sm text-gray-600">
                  See how your digital card will look
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Auto-updating</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <StyledDigitalCardPreview
              professional={previewData}
              showPromoSection={formData.promotionOffer}
              promotionDetails={formData.promotionDetails}
              bookingMethod={formData.preferredBookingMethod}
              importantInfo={formData.importantInfo}
            />
          </div>
        </div>
      </div>

      {/* Profile Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        imageUrl={imageToCrop}
        onClose={() => {
          setShowCropModal(false);
          setImageToCrop('');
        }}
        onCropComplete={(croppedUrl) => {
          // Store the cropped image URL
          handleFieldChange('profileImage', croppedUrl);
          setShowCropModal(false);
          setImageToCrop('');
        }}
        issueId="apply-profile"
        imageType="profile"
        customAspectRatio={{ ratio: 1, label: '1:1' }}
        hideFreeOption={true}
      />
    </form>
  );
}
