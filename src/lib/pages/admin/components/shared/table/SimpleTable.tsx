import React from 'react';
import { LoadingSpinner, LoadingOverlay } from '@/lib/components/ui';
import { EmptyState } from '@/lib/components/ui';
import TextRenderer from './renderers/TextRenderer';
import MultiLineRenderer from './renderers/MultiLineRenderer';
import BadgeRenderer from './renderers/BadgeRenderer';
import YearsRenderer from './renderers/YearsRenderer';
import RatingRenderer from './renderers/RatingRenderer';
import DateRangeRenderer from './renderers/DateRangeRenderer';
import ToggleRenderer from './renderers/ToggleRenderer';
import ToggleWithIconRenderer from './renderers/ToggleWithIconRenderer';
import ActionsRenderer from './renderers/ActionsRenderer';
import EditSectionsRenderer from './renderers/EditSectionsRenderer';
import ContentBlocksRenderer from './renderers/ContentBlocksRenderer';
import ViewButtonRenderer from './renderers/ViewButtonRenderer';
import LockStatusRenderer from './renderers/LockStatusRenderer';
import OrderControlRenderer from './renderers/OrderControlRenderer';

interface DisplayTableConfig {
  [key: string]: {
    label: string;
    type: 'text' | 'multiLine' | 'badge' | 'years' | 'rating' | 'dateRange' | 'toggle' | 'toggleWithIcon' | 'actions' | 'editSections' | 'contentBlocks' | 'viewButton' | 'lockStatus' | 'orderControl';
    width?: string;
    align?: 'left' | 'right' | 'center';
    fields?: string[];
    colors?: { [key: string]: string | { bg: string; text: string } };
    trueLabel?: string;
    falseLabel?: string;
    trueColor?: string;
    falseColor?: string;
    actions?: string[];
    buttonText?: string;
  };
}

interface SimpleTableProps<T> {
  data: T[];
  config: DisplayTableConfig;
  isLoading?: boolean;
  emptyMessage?: string;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (item: T) => void;
  onToggleFeatured?: (item: T) => void;
  onToggleVisibility?: (item: T) => void;
  onToggleEnabled?: (item: T) => void;
  onToggleReviewed?: (item: T) => void;
  onEditSections?: (item: T) => void;
  onEditThumbnails?: (item: T) => void;
  onMagazineView?: (item: T) => void;
  onDigitalView?: (item: T) => void;
  onMoveUp?: (item: T) => void;
  onMoveDown?: (item: T) => void;
  onOrderChange?: (item: T, newPosition: number) => void;
  onAddProfessional?: (item: T) => void;
  currentUserId?: string;
  loadingRowId?: string;
}

export function SimpleTable<T extends Record<string, any>>({
  data,
  config,
  isLoading = false,
  emptyMessage = 'No items found',
  onEdit,
  onView,
  onDelete,
  onToggleFeatured,
  onToggleVisibility,
  onToggleEnabled,
  onToggleReviewed,
  onEditSections,
  onEditThumbnails,
  onMagazineView,
  onDigitalView,
  onMoveUp,
  onMoveDown,
  onOrderChange,
  onAddProfessional,
  currentUserId,
  loadingRowId
}: SimpleTableProps<T>) {
  const renderComponents: Record<string, React.ComponentType<any>> = {
    text: TextRenderer,
    multiLine: MultiLineRenderer,
    badge: BadgeRenderer,
    years: YearsRenderer,
    rating: RatingRenderer,
    dateRange: DateRangeRenderer,
    toggle: ToggleRenderer,
    toggleWithIcon: ToggleWithIconRenderer,
    actions: ActionsRenderer,
    editSections: EditSectionsRenderer,
    contentBlocks: ContentBlocksRenderer,
    viewButton: ViewButtonRenderer,
    lockStatus: LockStatusRenderer,
    orderControl: OrderControlRenderer
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingOverlay message="Loading..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const columns = Object.entries(config);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(([key, columnConfig]) => (
              <th
                key={key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  columnConfig.width ? `w-[${columnConfig.width}]` : ''
                }`}
              >
                {columnConfig.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map(([key, columnConfig]) => {
                const value = columnConfig.fields
                  ? columnConfig.fields.map(field => row[field]).filter(Boolean).join(' - ')
                  : row[key];

                const RendererComponent = renderComponents[columnConfig.type];
                const props = {
                  row,
                  column: { key, ...columnConfig },
                  value,
                  onEdit,
                  onView,
                  onDelete,
                  onToggleFeatured,
                  onToggleVisibility,
                  onToggleEnabled,
                  onToggleReviewed,
                  onEditSections,
                  onEditThumbnails,
                  onMagazineView,
                  onDigitalView,
                  onMoveUp,
                  onMoveDown,
                  onOrderChange,
                  onAddProfessional,
                  currentUserId,
                  loadingRowId,
                  // For OrderControlRenderer
                  rowIndex,
                  totalRows: data.length
                };

                return (
                  <td
                    key={key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      columnConfig.width ? `w-[${columnConfig.width}]` : ''
                    }`}
                  >
                    {columnConfig.type ? (
                      <RendererComponent {...props} />
                    ) : (
                      <span className="text-sm text-gray-900">{value}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type { DisplayTableConfig };
export default SimpleTable;