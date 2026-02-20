"use client";

import { Clock, Plus, X } from "lucide-react";
import { DAYS_OF_WEEK, TIME_OPTIONS, formatTime } from "../config";
import type { BusinessHours as BusinessHoursType, DayOfWeek, DayHours, SpecialHours } from "../types";

interface BusinessHoursProps {
  hours: BusinessHoursType;
  updateDayHours: (day: DayOfWeek, hours: DayHours) => Promise<void>;
  updateAllHours: (hours: BusinessHoursType) => Promise<void>;
  addSpecialHours: (special: Omit<SpecialHours, 'id'>) => Promise<void>;
  removeSpecialHours: (id: string) => Promise<void>;
  isSaving: boolean;
}

export default function BusinessHours({
  hours,
  updateDayHours,
  updateAllHours,
  addSpecialHours,
  removeSpecialHours,
  isSaving,
}: BusinessHoursProps) {
  // TODO: Complete implementation following BrandUrlSlug patterns
  // Component should include:
  // - Week view with each day row
  // - Toggle checkbox for isOpen
  // - Time selectors for open/close using TIME_OPTIONS
  // - "Add Break" button for multiple slots per day
  // - "Copy to All Days" button for applying current day to all
  // - Special hours section with date picker
  // - Display timezone
  // - Save button with isSaving state

  return (
    <div className="space-y-6">
      {/* Timezone Display */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Timezone
        </label>
        <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
          {hours.timezone}
        </div>
      </div>

      {/* Week Schedule */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Weekly Schedule
        </label>
        <div className="space-y-3">
          {DAYS_OF_WEEK.map((day) => {
            const dayHours = hours[day.value];
            return (
              <div key={day.value} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={dayHours.isOpen}
                      onChange={(e) => {
                        updateDayHours(day.value, {
                          ...dayHours,
                          isOpen: e.target.checked,
                        });
                      }}
                      className="w-4 h-4 text-glamlink-teal focus:ring-glamlink-teal rounded"
                    />
                    <span className="font-medium text-gray-900">{day.label}</span>
                  </div>
                  {!dayHours.isOpen && (
                    <span className="text-sm text-gray-500">Closed</span>
                  )}
                </div>

                {/* Time Slots - TODO: Implement full time slot editor */}
                {dayHours.isOpen && dayHours.slots.length > 0 && (
                  <div className="space-y-2">
                    {dayHours.slots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-gray-700">
                          {formatTime(slot.open)} - {formatTime(slot.close)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Hours - TODO: Implement special hours editor */}
      {hours.specialHours.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Special Hours
          </label>
          <div className="space-y-2">
            {hours.specialHours.map((special) => (
              <div key={special.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{special.name}</p>
                  <p className="text-sm text-gray-500">{special.date}</p>
                </div>
                <button
                  onClick={() => removeSpecialHours(special.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder message */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
        <p className="font-medium">Business Hours Editor - Full Implementation Needed</p>
        <p className="mt-1 text-xs">
          This component needs complete implementation with time slot editors,
          special hours management, and bulk operations.
        </p>
      </div>
    </div>
  );
}
