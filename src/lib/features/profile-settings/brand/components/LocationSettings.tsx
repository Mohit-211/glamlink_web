"use client";

import { MapPin, Car, Compass } from "lucide-react";
import { SERVICE_AREA_TYPES, US_STATES } from "../config";
import type { ServiceArea, Address } from "../types";

interface LocationSettingsProps {
  location: ServiceArea;
  updateLocation: (location: Partial<ServiceArea>) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
  isSaving: boolean;
}

export default function LocationSettings({
  location,
  updateLocation,
  updateAddress,
  isSaving,
}: LocationSettingsProps) {
  // TODO: Complete implementation following BrandUrlSlug patterns
  // Component should include:
  // - Service type selector (location/mobile/both) with icons
  // - Address form fields (street, unit, city, state, zip)
  // - Show full address toggle
  // - Service radius slider (for mobile services)
  // - Travel fee configuration (enable, amount, unit, free within)
  // - Save button with isSaving state

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-5 h-5" />;
      case 'Car':
        return <Car className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Service Type
        </label>
        <div className="grid grid-cols-1 gap-3">
          {SERVICE_AREA_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => updateLocation({ type: type.value })}
              disabled={isSaving}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                location.type === type.value
                  ? 'border-glamlink-teal bg-glamlink-teal/5'
                  : 'border-gray-200 hover:border-gray-300'
              } disabled:opacity-50`}
            >
              <div className="flex items-start gap-3">
                <div className={`${location.type === type.value ? 'text-glamlink-teal' : 'text-gray-400'}`}>
                  {getIcon(type.icon)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{type.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Address Section - TODO: Implement full address form */}
      {(location.type === 'location' || location.type === 'both') && location.address && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Business Address
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              {location.address.street}
              {location.address.unit && `, ${location.address.unit}`}
            </p>
            <p className="text-sm text-gray-700">
              {location.address.city}, {location.address.state} {location.address.zipCode}
            </p>
          </div>

          {/* Show Full Address Toggle */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={location.showFullAddress}
              onChange={(e) => updateLocation({ showFullAddress: e.target.checked })}
              className="w-4 h-4 text-glamlink-teal focus:ring-glamlink-teal rounded"
            />
            <label className="text-sm text-gray-700">
              Show full address publicly (otherwise only city will be shown)
            </label>
          </div>
        </div>
      )}

      {/* Mobile Service Settings - TODO: Implement radius and travel fee editors */}
      {(location.type === 'mobile' || location.type === 'both') && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Service Radius
            </label>
            <p className="text-sm text-gray-600">
              {location.serviceRadius ? `${location.serviceRadius} miles` : 'Not configured'}
            </p>
          </div>

          {location.travelFee?.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Travel Fee
              </label>
              <p className="text-sm text-gray-600">
                ${location.travelFee.amount} ({location.travelFee.unit})
                {location.travelFee.freeWithin && ` - Free within ${location.travelFee.freeWithin} miles`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Placeholder message */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
        <p className="font-medium">Location Settings Editor - Full Implementation Needed</p>
        <p className="mt-1 text-xs">
          This component needs complete implementation with address form,
          service radius slider, and travel fee configuration.
        </p>
      </div>
    </div>
  );
}
