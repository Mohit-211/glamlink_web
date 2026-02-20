"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { GetFeaturedFormData } from '../types';

interface MagazinePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: GetFeaturedFormData;
}

export default function MagazinePreviewDialog({
  isOpen,
  onClose,
  formData
}: MagazinePreviewDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-semibold text-gray-900"
                    >
                      Magazine Content Preview
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-500">
                      Preview how your content could appear in the magazine
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content Preview Area */}
                <div className="space-y-6">
                  {/* Profile Section */}
                  {formData.fullName && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-2">Profile Information</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                        {formData.primarySpecialties && formData.primarySpecialties.length > 0 && (
                          <p><span className="font-medium">Specialties:</span> {formData.primarySpecialties.join(', ')}</p>
                        )}
                        {formData.businessAddress && (
                          <p><span className="font-medium">Location:</span> {formData.businessAddress}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Form Type Section */}
                  {formData.applicationType && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-2">Feature Type</h4>
                      <p className="capitalize">{formData.applicationType.replace('-', ' ')}</p>
                    </div>
                  )}

                  {/* Placeholder Message */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                      Full Preview Coming Soon
                    </h5>
                    <p className="text-gray-600 max-w-md mx-auto">
                      A detailed magazine layout preview will be available soon. For now, you can review your submitted information above.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-teal-dark focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2 transition-colors duration-200"
                  >
                    Close Preview
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
