'use client';

import React, { useState } from 'react';
import {
  Customer,
  CreateCustomerInput,
  TaxCollectionSetting
} from '../types/customer';
import { AddAddressModal } from './AddAddressModal';
import { TagInput } from './TagInput';
import { PhoneInput } from './PhoneInput';

interface AddCustomerModalProps {
  onClose: () => void;
  onCustomerCreated: (customer: Customer) => void;
}

export function AddCustomerModal({
  onClose,
  onCustomerCreated,
}: AddCustomerModalProps) {
  const [formData, setFormData] = useState<CreateCustomerInput>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCountryCode: 'US',
    language: 'en',
    emailMarketingConsent: false,
    smsMarketingConsent: false,
    taxCollectionSetting: 'collect_tax',
    tags: [],
    notes: '',
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/crm/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create customer');
      }

      onCustomerCreated(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-semibold text-gray-900">New customer</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Customer Overview Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Customer overview</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English [Default]</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    This customer will receive notifications in this language.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                <PhoneInput
                  phone={formData.phone || ''}
                  countryCode={formData.phoneCountryCode || 'US'}
                  onPhoneChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                  onCountryCodeChange={(code) => setFormData(prev => ({ ...prev, phoneCountryCode: code }))}
                />

                {/* Marketing Consent */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="emailMarketingConsent"
                      checked={formData.emailMarketingConsent}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      Customer agreed to receive marketing emails.
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="smsMarketingConsent"
                      checked={formData.smsMarketingConsent}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      Customer agreed to receive SMS marketing text messages.
                    </span>
                  </label>

                  <p className="text-xs text-gray-500">
                    You should ask your customers for permission before you subscribe them to your marketing emails or SMS.
                  </p>
                </div>
              </div>

              {/* Default Address Section */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Default address</h3>
                  <p className="text-xs text-gray-500">The primary address of this customer</p>
                </div>

                {formData.address ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">
                      {formData.address.firstName} {formData.address.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{formData.address.address1}</p>
                    {formData.address.address2 && (
                      <p className="text-sm text-gray-600">{formData.address.address2}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {formData.address.city}, {formData.address.state} {formData.address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{formData.address.country}</p>

                    <button
                      type="button"
                      onClick={() => setShowAddressModal(true)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit address
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-2 px-4 py-3 w-full text-left text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add address
                  </button>
                )}
              </div>

              {/* Tax Details Section */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Tax details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax settings
                  </label>
                  <select
                    name="taxCollectionSetting"
                    value={formData.taxCollectionSetting}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="collect_tax">Collect tax</option>
                    <option value="collect_tax_unless_exempt">Collect tax unless exemptions apply</option>
                    <option value="do_not_collect_tax">Don&apos;t collect tax</option>
                  </select>
                </div>
              </div>

              {/* Tags Section */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                <TagInput
                  tags={formData.tags || []}
                  onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                />
              </div>

              {/* Notes Section */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notes</h3>
                  <p className="text-xs text-gray-500">Notes are private and won&apos;t be shared with the customer.</p>
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Add a note about this customer..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>

          {/* Address Modal */}
          {showAddressModal && (
            <AddAddressModal
              initialData={formData.address}
              onClose={() => setShowAddressModal(false)}
              onSave={(address) => {
                setFormData(prev => ({ ...prev, address }));
                setShowAddressModal(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
