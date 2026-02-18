import { PageConfig } from '@/lib/config/pageVisibility';

interface PageGroup {
  title: string;
  pages: string[];
}

interface SettingsGroupsProps {
  pageGroups: PageGroup[];
  localSettings: PageConfig[];
  expandedGroups: Record<string, boolean>;
  onToggleGroup: (groupTitle: string) => void;
  onTogglePage: (path: string) => void;
}

export default function SettingsGroups({
  pageGroups,
  localSettings,
  expandedGroups,
  onToggleGroup,
  onTogglePage
}: SettingsGroupsProps) {
  return (
    <div className="space-y-4">
      {pageGroups.map((group) => {
        const groupPages = localSettings.filter(page => group.pages.includes(page.path));
        if (groupPages.length === 0) return null;

        return (
          <div key={group.title} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => onToggleGroup(group.title)}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center">
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform mr-3 ${
                    expandedGroups[group.title] ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">{group.title}</h3>
                <span className="ml-2 text-xs text-gray-500">({groupPages.length} pages)</span>
              </div>
              <div className="text-xs text-gray-500">
                {groupPages.filter(p => p.isVisible).length} visible
              </div>
            </button>

            {/* Group Content */}
            {expandedGroups[group.title] && (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Page Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Path
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visibility
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupPages.map((page) => (
                      <tr key={page.path} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{page.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 font-mono">{page.path}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{page.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => onTogglePage(page.path)}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2
                              ${page.isVisible ? 'bg-glamlink-teal' : 'bg-gray-200'}
                            `}
                            aria-pressed={page.isVisible}
                            aria-label={`Toggle visibility for ${page.name}`}
                          >
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${page.isVisible ? 'translate-x-6' : 'translate-x-1'}
                              `}
                            />
                          </button>
                          <span className={`ml-2 text-sm ${page.isVisible ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            {page.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
