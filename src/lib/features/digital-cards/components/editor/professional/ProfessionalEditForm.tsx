'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { FormRenderer } from '@/lib/pages/admin/components/shared/editing/form/FormRenderer';
import EditPreviewPanel from './EditPreviewPanel';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

// Define tabs for professional edit form
const EDIT_TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'contact', label: 'Contact & Booking' },
  { id: 'location', label: 'Location' },
  { id: 'hours', label: 'Hours & Info' },
  { id: 'media', label: 'Profile Image' },
];

// Field configurations for each tab
const basicInfoFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Your full name',
  },
  {
    name: 'title',
    label: 'Occupation',
    type: 'text',
    required: true,
    placeholder: 'e.g., Master Esthetician, Hair Stylist',
  },
  {
    name: 'specialty',
    label: 'Primary Specialty',
    type: 'text',
    required: true,
    placeholder: 'e.g., Skincare, Hair Color, Makeup',
  },
  {
    name: 'business_name',
    label: 'Business Name',
    type: 'text',
    placeholder: 'e.g., Glamlink Salon, Beauty Studio',
    helperText: 'Name of your business or salon',
  },
  {
    name: 'bio',
    label: 'Professional Bio',
    type: 'html',
    placeholder: 'Tell clients about your background, expertise, and approach...',
    helperText: 'Supports rich text formatting',
  },
];

const contactBookingFields: FieldConfig[] = [
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(555) 123-4567',
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'your@email.com',
  },
  {
    name: 'website',
    label: 'Website',
    type: 'url',
    placeholder: 'https://your-website.com',
  },
  {
    name: 'instagram',
    label: 'Instagram',
    type: 'text',
    placeholder: '@username or https://instagram.com/username',
  },
  {
    name: 'tiktok',
    label: 'TikTok',
    type: 'text',
    placeholder: '@username or https://tiktok.com/@username',
  },
  {
    name: 'bookingUrl',
    label: 'Booking Link',
    type: 'url',
    placeholder: 'https://calendly.com/your-link',
    helperText: 'URL for clients to book appointments',
  },
  {
    name: 'preferredBookingMethod',
    label: 'Preferred Booking Method',
    type: 'select',
    options: [
      { value: '', label: 'Not set' },
      { value: 'send-text', label: 'Send Text' },
      { value: 'instagram', label: 'Instagram Profile' },
      { value: 'booking-link', label: 'Go to Booking Link' },
    ],
    helperText: 'How clients should book appointments',
  },
];

const locationFields: FieldConfig[] = [
  {
    name: 'locations',
    label: 'Business Locations',
    type: 'multiLocation',
    required: false,
    helperText: 'Add your business locations. Mark one as primary.',
  },
];

const hoursInfoFields: FieldConfig[] = [
  {
    name: 'businessHours',
    label: 'Business Hours',
    type: 'array',
    helperText: 'Add your operating hours (e.g., "Monday: 9:00 AM - 6:00 PM")',
  },
  {
    name: 'importantInfo',
    label: 'Important Info for Clients',
    type: 'array',
    maxItems: 10,
    helperText: 'Key information (e.g., "By appointment only", "Cash preferred")',
  },
];

const mediaFields: FieldConfig[] = [
  {
    name: 'profileImage',
    label: 'Profile Image',
    type: 'image',
    helperText: 'Your professional headshot',
  },
];

// Map tab IDs to their field configurations
const TAB_FIELDS: Record<string, FieldConfig[]> = {
  basic: basicInfoFields,
  contact: contactBookingFields,
  location: locationFields,
  hours: hoursInfoFields,
  media: mediaFields,
};

// All fields combined for FormProvider
const allFields: FieldConfig[] = [
  ...basicInfoFields,
  ...contactBookingFields,
  ...locationFields,
  ...hoursInfoFields,
  ...mediaFields,
];

interface ProfessionalEditFormProps {
  professional: Professional;
  token: string;
}

export default function ProfessionalEditForm({ professional, token }: ProfessionalEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (formData: Record<string, any>) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/professionals/${professional.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token,
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save changes');
      }

      setSaveSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving professional:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const viewDigitalCard = () => {
    const cardUrl = professional.cardUrl || professional.id;
    router.push(`/${cardUrl}`);
  };

  return (
    <FormProvider
      initialData={professional as Record<string, any>}
      fields={allFields}
    >
      <EditFormContent
        professional={professional}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSaving={isSaving}
        saveError={saveError}
        saveSuccess={saveSuccess}
        onSave={handleSave}
        onViewCard={viewDigitalCard}
      />
    </FormProvider>
  );
}

interface EditFormContentProps {
  professional: Professional;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
  onSave: (data: Record<string, any>) => Promise<void>;
  onViewCard: () => void;
}

function EditFormContent({
  professional,
  activeTab,
  setActiveTab,
  isSaving,
  saveError,
  saveSuccess,
  onSave,
  onViewCard,
}: EditFormContentProps) {
  const { formData, validateAllFields, errors } = useFormContext();

  const handleSubmit = async () => {
    // Validate all fields first
    const isValid = validateAllFields();
    if (!isValid) {
      return;
    }
    await onSave(formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form panel (45%) */}
      <div className="w-[45%] min-w-[400px] border-r border-gray-200 overflow-y-auto bg-white">
        <div className="py-8 px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit Your Digital Card
            </h1>
            <p className="text-gray-600">
              Update your professional information displayed on your digital business card.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {EDIT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <FormRenderer
              fields={TAB_FIELDS[activeTab] || []}
              columns={1}
            />
          </div>

          {/* Error/Success Messages */}
          {saveError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{saveError}</p>
            </div>
          )}
          {saveSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Changes saved successfully!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={onViewCard}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              View Digital Card
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right: Preview panel (55%) */}
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <EditPreviewPanel />
      </div>
    </div>
  );
}
