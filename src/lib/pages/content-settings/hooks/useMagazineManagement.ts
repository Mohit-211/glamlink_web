import { useState, useEffect } from "react";
import magazineManagementService from "@/lib/services/magazineManagementService";
import { MagazineIssueCard } from "@/lib/pages/magazine/types/magazine";

export function useMagazineManagement(isAuthenticated: boolean, activeTab: string) {
  const [magazineIssues, setMagazineIssues] = useState<MagazineIssueCard[]>([]);
  const [isLoadingMagazine, setIsLoadingMagazine] = useState(false);
  const [isSavingMagazine, setIsSavingMagazine] = useState(false);
  const [editingIssue, setEditingIssue] = useState<MagazineIssueCard | null>(null);
  const [showAddIssue, setShowAddIssue] = useState(false);

  const loadMagazineConfig = async () => {
    setIsLoadingMagazine(true);
    try {
      const config = await magazineManagementService.getMagazineConfig();
      setMagazineIssues(config.issues || []);
    } catch (error) {
      console.error("Error loading magazine config:", error);
      setMagazineIssues([]);
    } finally {
      setIsLoadingMagazine(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === "magazine") {
      loadMagazineConfig();
    }
  }, [isAuthenticated, activeTab]);

  const handleToggleFeatured = async (id: string) => {
    setIsSavingMagazine(true);
    try {
      const success = await magazineManagementService.toggleFeatured(id);
      if (success) {
        await loadMagazineConfig();
      } else {
        alert("Failed to update featured status");
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("An error occurred");
    } finally {
      setIsSavingMagazine(false);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (!confirm("Are you sure you want to delete this magazine issue?")) {
      return;
    }

    setIsSavingMagazine(true);
    try {
      const success = await magazineManagementService.deleteMagazineIssue(id);
      if (success) {
        await loadMagazineConfig();
      } else {
        alert("Failed to delete issue");
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
      alert("An error occurred");
    } finally {
      setIsSavingMagazine(false);
    }
  };

  const handleSaveMagazineIssue = async (issue: MagazineIssueCard) => {
    setIsSavingMagazine(true);
    try {
      let success = false;
      if (editingIssue) {
        success = await magazineManagementService.updateMagazineIssue(issue.id, issue);
      } else {
        success = await magazineManagementService.addMagazineIssue(issue);
      }

      if (success) {
        await loadMagazineConfig();
        setEditingIssue(null);
        setShowAddIssue(false);
      } else {
        alert("Failed to save magazine issue");
      }
    } catch (error) {
      console.error("Error saving issue:", error);
      alert("An error occurred");
    } finally {
      setIsSavingMagazine(false);
    }
  };

  return {
    magazineIssues,
    isLoadingMagazine,
    isSavingMagazine,
    editingIssue,
    showAddIssue,
    setEditingIssue,
    setShowAddIssue,
    handleToggleFeatured,
    handleDeleteIssue,
    handleSaveMagazineIssue,
  };
}
