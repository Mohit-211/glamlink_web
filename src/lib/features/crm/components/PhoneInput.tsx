'use client';

import React from 'react';
import { countries } from '../utils/locationData';

interface PhoneInputProps {
  phone: string;
  countryCode: string;
  onPhoneChange: (phone: string) => void;
  onCountryCodeChange: (code: string) => void;
  error?: string;
}

export function PhoneInput({
  phone,
  countryCode,
  onPhoneChange,
  onCountryCodeChange,
  error,
}: PhoneInputProps) {
  const selectedCountry = countries.find(c => c.code === countryCode);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Phone number
      </label>
      <div className="flex">
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          className="flex-shrink-0 px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.code} {country.phoneCode}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={selectedCountry?.phoneCode}
          className={`flex-1 px-3 py-2 border rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
