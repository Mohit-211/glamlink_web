"use client";

/**
 * Step1BusinessInfo - Business information form step
 */

import type { BusinessInfoFormData, BusinessType } from "../../types";
import { BUSINESS_TYPE_OPTIONS } from "../../config";

interface Step1BusinessInfoProps {
  data: BusinessInfoFormData;
  onChange: (data: Partial<BusinessInfoFormData>) => void;
  errors: string[];
}

export default function Step1BusinessInfo({
  data,
  onChange,
  errors,
}: Step1BusinessInfoProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    onChange({
      [name]:
        type === "number" ? (value === "" ? 0 : parseInt(value, 10)) : value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Business Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about your business. This information helps verify your
          legitimacy.
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Business Name */}
        <div className="sm:col-span-2">
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-gray-700"
          >
            Legal Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={data.businessName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            placeholder="Enter your legal business name"
          />
        </div>

        {/* Business Type */}
        <div>
          <label
            htmlFor="businessType"
            className="block text-sm font-medium text-gray-700"
          >
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            id="businessType"
            name="businessType"
            value={data.businessType}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
          >
            {BUSINESS_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Years in Business */}
        <div>
          <label
            htmlFor="yearsInBusiness"
            className="block text-sm font-medium text-gray-700"
          >
            Years in Business
          </label>
          <input
            type="number"
            id="yearsInBusiness"
            name="yearsInBusiness"
            value={data.yearsInBusiness || ""}
            onChange={handleInputChange}
            min="0"
            max="100"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            placeholder="0"
          />
        </div>

        {/* Business Address */}
        <div className="sm:col-span-2">
          <label
            htmlFor="businessAddress"
            className="block text-sm font-medium text-gray-700"
          >
            Business Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="businessAddress"
            name="businessAddress"
            value={data.businessAddress}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            placeholder="Street address"
          />
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={data.city}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            placeholder="City"
          />
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={data.state}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            placeholder="State"
          />
        </div>

        {/* ZIP Code */}
        <div>
          <label
            htmlFor="zipCode"
            className="block text-sm font-medium text-gray-700"
          >
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={data.zipCode}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            placeholder="ZIP Code"
          />
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={data.country}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            placeholder="Country"
          />
        </div>

        {/* Website */}
        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700"
          >
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={data.website || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            placeholder="https://www.example.com"
          />
          <p className="mt-1 text-xs text-gray-500">Optional</p>
        </div>

        {/* Social Media */}
        <div>
          <label
            htmlFor="socialMedia"
            className="block text-sm font-medium text-gray-700"
          >
            Social Media
          </label>
          <input
            type="text"
            id="socialMedia"
            name="socialMedia"
            value={data.socialMedia || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-glamlink-teal focus:outline-none focus:ring-1 focus:ring-glamlink-teal"
            placeholder="@yourbusiness"
          />
          <p className="mt-1 text-xs text-gray-500">
            Instagram, TikTok, or other primary platform
          </p>
        </div>
      </div>
    </div>
  );
}
