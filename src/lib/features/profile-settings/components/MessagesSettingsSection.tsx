"use client";

/**
 * MessagesSettingsSection - Settings for Support Messaging
 *
 * Allows users to configure:
 * - Notification preferences for new messages
 * - Auto-reply settings
 * - Message history preferences
 * - Quick access to conversations
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Clock, Inbox, MessageSquare, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/features/auth/useAuth";

interface MessagesSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
  keepHistoryDays: number;
}

const DEFAULT_SETTINGS: MessagesSettings = {
  emailNotifications: true,
  pushNotifications: true,
  autoReplyEnabled: false,
  autoReplyMessage: "Thank you for your message! We'll get back to you as soon as possible.",
  keepHistoryDays: 90,
};

// Card component for settings sections
function SettingsCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function MessagesSettingsSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [settings, setSettings] = useState<MessagesSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key: keyof MessagesSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key: keyof MessagesSettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleViewConversations = () => {
    router.push('/profile/support');
  };

  return (
    <div className="space-y-6">
      {/* Quick Access */}
      <SettingsCard
        title="Your Conversations"
        description="View and manage your support conversations"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-glamlink-teal/10 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-glamlink-teal" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Support Messages</p>
              <p className="text-sm text-gray-500">
                View your active and past conversations with support
              </p>
            </div>
          </div>
          <button
            onClick={handleViewConversations}
            className="flex items-center gap-2 px-4 py-2 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-teal/90 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View Messages
          </button>
        </div>
      </SettingsCard>

      {/* Notification Settings */}
      <SettingsCard
        title="Notification Preferences"
        description="Choose how you want to be notified about new messages"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive email alerts for new support messages
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-glamlink-teal' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">
                  Get instant notifications in your browser
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('pushNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-glamlink-teal' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </SettingsCard>

      {/* Auto-Reply Settings */}
      <SettingsCard
        title="Auto-Reply"
        description="Set up automatic responses when you're unavailable"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-medium text-gray-900">Enable Auto-Reply</p>
                <p className="text-sm text-gray-500">
                  Automatically respond to new messages
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('autoReplyEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoReplyEnabled ? 'bg-glamlink-teal' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoReplyEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.autoReplyEnabled && (
            <div className="ml-8 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Auto-Reply Message
              </label>
              <textarea
                value={settings.autoReplyMessage}
                onChange={(e) => handleChange('autoReplyMessage', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-glamlink-teal focus:ring-1 focus:ring-glamlink-teal resize-none"
                placeholder="Enter your auto-reply message..."
              />
            </div>
          )}
        </div>
      </SettingsCard>

      {/* Message History */}
      <SettingsCard
        title="Message History"
        description="Manage how long your message history is kept"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Keep Message History</p>
              <p className="text-sm text-gray-500">
                Messages older than this will be automatically deleted
              </p>
            </div>
            <select
              value={settings.keepHistoryDays}
              onChange={(e) => handleChange('keepHistoryDays', parseInt(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-glamlink-teal focus:ring-1 focus:ring-glamlink-teal"
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>1 year</option>
              <option value={0}>Forever</option>
            </select>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Changing this setting will not affect messages that have already been deleted.
              Messages marked as important will not be automatically deleted.
            </p>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
