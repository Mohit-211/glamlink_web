"use client";

import { Bell, AlertCircle } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { NOTIFICATION_CATEGORIES } from "../config";
import NotificationToggle from "./NotificationToggle";
import type { NotificationPreferences } from "../types";

export default function NotificationsSection() {
  const { preferences, isLoading, isSaving, error, updatePreference, updateAllInCategory } = useNotifications();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-glamlink-teal" />
          <span className="text-sm text-gray-500">Loading notification preferences...</span>
        </div>
      </div>
    );
  }

  const handleToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      await updatePreference(key, value);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleCategoryToggle = async (categoryId: string, value: boolean) => {
    const category = NOTIFICATION_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    const keys = category.notifications.map(n => n.id);
    try {
      await updateAllInCategory(keys, value);
    } catch (err) {
      // Error handled in hook
    }
  };

  const isCategoryEnabled = (categoryId: string) => {
    const category = NOTIFICATION_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return false;
    return category.notifications.every(n => preferences[n.id] === true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-400" />
          Notification Preferences
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage how we communicate with you</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Categories */}
        {NOTIFICATION_CATEGORIES.map((category, index) => {
          const allEnabled = isCategoryEnabled(category.id);
          const hasNonRequired = category.notifications.some(n => !n.required);

          return (
            <div key={category.id}>
              {index > 0 && <div className="border-t border-gray-200 -mx-6 mb-6" />}

              {/* Category header with enable/disable all button */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
                </div>
                {hasNonRequired && (
                  <button
                    onClick={() => handleCategoryToggle(category.id, !allEnabled)}
                    disabled={isSaving}
                    className="text-sm font-medium text-glamlink-teal hover:text-glamlink-teal/80 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ml-4"
                  >
                    {allEnabled ? 'Disable All' : 'Enable All'}
                  </button>
                )}
              </div>

              {/* Notifications list */}
              <div className="space-y-1 divide-y divide-gray-100">
                {category.notifications.map((notification) => (
                  <NotificationToggle
                    key={notification.id}
                    label={notification.label}
                    description={notification.description}
                    checked={preferences[notification.id]}
                    onChange={(checked) => handleToggle(notification.id, checked)}
                    disabled={isSaving}
                    required={notification.required}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
