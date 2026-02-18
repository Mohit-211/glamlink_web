"use client";

import { useState } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import OverviewContent from "./OverviewContent";

type ProfileTabId = "overview" | "digital-card" | "analytics";

interface TabItem {
  id: ProfileTabId;
  label: string;
}

export default function ProfileHomeTab() {
  const [activeTab, setActiveTab] = useState<ProfileTabId>("overview");
  const { user } = useAuth();

  const tabs: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "digital-card", label: "Digital Card" },
    { id: "analytics", label: "Analytics" },
  ];

  const handleTabChange = (tabId: ProfileTabId) => {
    if (tabId === "digital-card") {
      window.location.href = "/profile/digital-card";
    } else if (tabId === "analytics") {
      window.location.href = "/profile/analytics";
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === tab.id
                  ? "border-glamlink-teal text-glamlink-teal"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewContent userName={user?.displayName || "there"} />}
    </div>
  );
}
