import { useState, useEffect } from 'react';
import contentSettings from '@/lib/services/contentSettings';
import { PageConfig, defaultPageVisibility } from '@/lib/config/pageVisibility';

export function useContentSettings() {
  const [settings, setSettings] = useState<PageConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadSettings = async () => {
    try {
      const currentSettings = await contentSettings.getPageVisibility();
      setSettings(currentSettings);
    } catch (error) {
      console.error("Error loading settings:", error);
      setSettings(defaultPageVisibility);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggle = (path: string) => {
    const updatedSettings = settings.map((page) => 
      page.path === path ? { ...page, isVisible: !page.isVisible } : page
    );
    setSettings(updatedSettings);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccess(false);

    try {
      const success = await contentSettings.savePageVisibility(settings);

      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Failed to save settings. Please check your password and try again.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("An error occurred while saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default (all pages hidden)?")) {
      contentSettings.resetToDefaults();
      loadSettings();
    }
  };

  const handleExport = async () => {
    try {
      const json = await contentSettings.exportSettings();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "glamlink-page-settings.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting settings:", error);
      alert("Failed to export settings");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      try {
        const success = await contentSettings.importSettings(content);

        if (success) {
          await loadSettings();
          alert("Settings imported successfully!");
        } else {
          alert("Failed to import settings. Please check the file format.");
        }
      } catch (error) {
        console.error("Error importing settings:", error);
        alert("An error occurred while importing settings.");
      }
    };
    reader.readAsText(file);
  };

  return {
    settings,
    isLoading,
    isSaving,
    showSuccess,
    handleToggle,
    handleSave,
    handleReset,
    handleExport,
    handleImport,
  };
}