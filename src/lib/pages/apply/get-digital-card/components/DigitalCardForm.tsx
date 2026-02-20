'use client';

import { useState, useCallback } from 'react';
import { DigitalCardFormData } from '../types';
import { fields_layout } from '../config/fields';
import { TextField, EmailField, TiptapField, PhoneField, SelectField } from '@/lib/pages/apply/shared/components/fields';

interface DigitalCardFormProps {
  onSubmit: (data: DigitalCardFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function DigitalCardForm({ onSubmit, isLoading = false }: DigitalCardFormProps) {
  const [formData, setFormData] = useState<DigitalCardFormData>({
    name: '',
    title: '',
    specialty: '',
    bio: '',
    profileImage: null,
    phone: '',
    email: '',
    applicationType: 'digital-card',
    locations: [],
    businessHours: [],
    specialties: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const profile = fields_layout.profile;

    // Validate required fields
    Object.entries(profile).forEach(([key, config]) => {
      if (config.required && !formData[key as keyof DigitalCardFormData]) {
        newErrors[key] = `${config.label} is required`;
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isLoading) return;

    if (!validateForm()) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Professional Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Professional Information
          </h3>
          <p className="text-gray-600">
            Tell us about yourself and your business
          </p>
        </div>

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

          <TextField
            fieldKey="businessName"
            config={fields_layout.profile.businessName}
            value={formData.businessName || ''}
            onChange={handleFieldChange}
            error={errors.businessName}
            disabled={isLoading || isSubmitting}
          />

          <SelectField
            fieldKey="specialty"
            config={fields_layout.profile.specialty}
            value={formData.specialty}
            onChange={handleFieldChange}
            error={errors.specialty}
            disabled={isLoading || isSubmitting}
            options={fields_layout.profile.specialty.options}
          />
        </div>

        <div className="mt-6">
          <TiptapField
            fieldKey="bio"
            config={fields_layout.profile.bio}
            value={formData.bio}
            onChange={handleFieldChange}
            error={errors.bio}
            disabled={isLoading || isSubmitting}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="mt-6">
          <TextField
            fieldKey="bookingUrl"
            config={fields_layout.profile.bookingUrl}
            value={formData.bookingUrl || ''}
            onChange={handleFieldChange}
            error={errors.bookingUrl}
            disabled={isLoading || isSubmitting}
          />
        </div>

      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className={`
            px-8 py-3 font-semibold rounded-full transition-all duration-200
            ${isLoading || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark shadow-lg hover:shadow-xl transform hover:scale-105'
            }
          `}
        >
          {isSubmitting ? 'Submitting...' : isLoading ? 'Loading...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}
