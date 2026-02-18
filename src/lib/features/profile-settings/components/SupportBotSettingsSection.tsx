"use client";

/**
 * SupportBotSettingsSection - Settings for the AI Support Bot
 *
 * Allows users to configure:
 * - Enable/disable the AI support bot
 * - Customize greeting messages
 * - Manage FAQ responses
 * - Set response behavior preferences
 */

import { useState } from "react";
import { Bot, MessageCircle, Settings2, Sparkles } from "lucide-react";

interface SupportBotSettings {
  enabled: boolean;
  greetingMessage: string;
  autoEscalate: boolean;
  escalateAfterMessages: number;
}

const DEFAULT_SETTINGS: SupportBotSettings = {
  enabled: true,
  greetingMessage: "Hello! I'm the Glamlink support assistant. How can I help you today?",
  autoEscalate: true,
  escalateAfterMessages: 5,
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

export default function SupportBotSettingsSection() {
  const [settings, setSettings] = useState<SupportBotSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key: keyof SupportBotSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key: keyof SupportBotSettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Bot Status */}
      <SettingsCard
        title="Bot Status"
        description="Enable or disable the AI support assistant"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              settings.enabled ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Bot className={`w-5 h-5 ${settings.enabled ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">AI Support Bot</p>
              <p className="text-sm text-gray-500">
                {settings.enabled ? 'Active and responding to queries' : 'Currently disabled'}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('enabled')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.enabled ? 'bg-glamlink-teal' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </SettingsCard>

      {/* Greeting Message */}
      <SettingsCard
        title="Greeting Message"
        description="Customize the initial message users see when starting a support chat"
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-glamlink-teal mt-2" />
            <textarea
              value={settings.greetingMessage}
              onChange={(e) => handleChange('greetingMessage', e.target.value)}
              rows={3}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-glamlink-teal focus:ring-1 focus:ring-glamlink-teal resize-none"
              placeholder="Enter a greeting message..."
            />
          </div>
          <p className="text-xs text-gray-500 ml-8">
            This message will be shown when users first open the support chat.
          </p>
        </div>
      </SettingsCard>

      {/* Auto-Escalation Settings */}
      <SettingsCard
        title="Auto-Escalation"
        description="Automatically suggest human support when the bot can't resolve issues"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-medium text-gray-900">Enable Auto-Escalation</p>
                <p className="text-sm text-gray-500">
                  Offer to connect users with human support after multiple exchanges
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('autoEscalate')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoEscalate ? 'bg-glamlink-teal' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoEscalate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.autoEscalate && (
            <div className="ml-8 p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escalate after how many messages?
              </label>
              <select
                value={settings.escalateAfterMessages}
                onChange={(e) => handleChange('escalateAfterMessages', parseInt(e.target.value))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-glamlink-teal focus:ring-1 focus:ring-glamlink-teal"
              >
                <option value={3}>3 messages</option>
                <option value={5}>5 messages</option>
                <option value={7}>7 messages</option>
                <option value={10}>10 messages</option>
              </select>
            </div>
          )}
        </div>
      </SettingsCard>

      {/* Response Preferences */}
      <SettingsCard
        title="Response Preferences"
        description="Configure how the AI bot responds to users"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Settings2 className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">AI-Powered Responses</p>
              <p className="text-sm text-blue-700">
                The bot uses AI to understand and respond to user queries intelligently.
                It references your FAQs and Glamlink knowledge base.
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">The bot is configured to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Answer questions about Glamlink features and services</li>
              <li>Help users navigate the platform</li>
              <li>Provide information about digital cards, bookings, and the magazine</li>
              <li>Direct users to human support for complex issues</li>
            </ul>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
