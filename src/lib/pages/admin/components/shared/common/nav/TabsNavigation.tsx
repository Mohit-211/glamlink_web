"use client";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

type TabVariant = 'default' | 'indigo';

interface TabsNavigationProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  ariaLabel?: string;
  className?: string;
  variant?: TabVariant;
}

export default function TabsNavigation<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel = "Tabs",
  className = "",
  variant = "default"
}: TabsNavigationProps<T>) {
  const getTabClassName = (tabId: T) => {
    const isActive = activeTab === tabId;

    if (variant === 'indigo') {
      const baseClasses = 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150';
      if (isActive) {
        return `${baseClasses} border-indigo-500 text-indigo-600`;
      }
      return `${baseClasses} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`;
    }

    // Default variant
    const baseClasses = 'px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200';
    if (isActive) {
      return `${baseClasses} border-glamlink-teal text-glamlink-teal`;
    }
    return `${baseClasses} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`;
  };

  const getBadgeClassName = (tabId: T) => {
    const isActive = activeTab === tabId;

    if (variant === 'indigo') {
      if (isActive) {
        return 'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-600';
      }
      return 'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600';
    }

    // Default variant
    if (isActive) {
      return 'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700';
    }
    return 'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600';
  };

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className={`flex space-x-8 ${variant === 'indigo' ? '-mb-px' : ''}`} aria-label={ariaLabel}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={getTabClassName(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={getBadgeClassName(tab.id)}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
