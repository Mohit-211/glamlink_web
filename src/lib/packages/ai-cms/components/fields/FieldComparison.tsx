'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';

// Import from package
import { formatHtmlForDisplay } from '../../utils';

// Import types
import type { FieldComparisonProps, FieldComparison } from '../../types';

export function FieldComparison({
  comparisons,
  onToggleField,
  onToggleAll,
  showHeader = true,
  maxHeight = '24rem',
  groupByType = false
}: FieldComparisonProps) {
  const [expandedFields, setExpandedFields] = React.useState<Set<string>>(new Set());
  
  const toggleFieldExpansion = (fieldName: string) => {
    setExpandedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldName)) {
        newSet.delete(fieldName);
      } else {
        newSet.add(fieldName);
      }
      return newSet;
    });
  };

  const formatValueForDisplay = (value: any, fieldType: FieldComparison['fieldType']): string => {
    if (!value) return '';
    
    if (fieldType === 'html') {
      return formatHtmlForDisplay(value);
    }
    
    return String(value);
  };

  const getPreviewValue = (value: any, fieldType: FieldComparison['fieldType'], maxLength: number = 100): string => {
    const formatted = formatValueForDisplay(value, fieldType);
    if (formatted.length <= maxLength) return formatted;
    return formatted.substring(0, maxLength) + '...';
  };

  const hasChanges = comparisons.some(comp => comp.shouldUpdate);
  const selectedCount = comparisons.filter(comp => comp.shouldUpdate).length;

  const groupedComparisons = React.useMemo(() => {
    if (!groupByType) return [{ type: 'all', comparisons }];
    
    const groups = comparisons.reduce((acc, comp) => {
      const type = comp.fieldType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(comp);
      return acc;
    }, {} as Record<string, FieldComparison[]>);

    return Object.entries(groups).map(([type, comps]) => ({
      type,
      comparisons: comps
    }));
  }, [comparisons, groupByType]);

  if (comparisons.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No field comparisons available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Proposed Changes</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {selectedCount} of {comparisons.length} selected
            </span>
            {comparisons.length > 1 && (
              <button
                onClick={() => onToggleAll(!hasChanges)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {hasChanges ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Field Comparisons */}
      <div className="space-y-4" style={{ maxHeight, overflowY: 'auto' }}>
        {groupedComparisons.map(({ type, comparisons: groupComps }) => (
          <div key={type}>
            {groupByType && type !== 'all' && (
              <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                {type} Fields
              </h4>
            )}
            
            <div className="space-y-3">
              {groupComps.map((comp) => {
                const isExpanded = expandedFields.has(comp.fieldName);
                const hasContent = comp.oldValue || comp.newValue;
                
                return (
                  <div
                    key={comp.fieldName}
                    className={`p-4 border rounded-lg transition-colors ${
                      comp.shouldUpdate 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {/* Field Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={comp.shouldUpdate}
                          onChange={() => onToggleField(comp.fieldName)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="font-medium text-gray-900">
                          {comp.displayName}
                        </label>
                        {comp.shouldUpdate && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Will update
                          </span>
                        )}
                      </div>
                      
                      {hasContent && (
                        <button
                          onClick={() => toggleFieldExpansion(comp.fieldName)}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Collapse
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Expand
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Field Content */}
                    {hasContent && (
                      <div className="grid grid-cols-2 gap-4">
                        {/* Current Value */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Current:</h4>
                          <div className="min-h-[60px] p-3 border border-gray-200 rounded bg-white overflow-y-auto">
                            {comp.fieldType === 'html' ? (
                              <div
                                className="text-sm text-gray-600"
                                dangerouslySetInnerHTML={{ 
                                  __html: isExpanded 
                                    ? comp.oldValue || '<em>No content</em>'
                                    : getPreviewValue(comp.oldValue, comp.fieldType) || '<em>No content</em>'
                                }}
                              />
                            ) : (
                              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                                {isExpanded 
                                  ? formatValueForDisplay(comp.oldValue, comp.fieldType) || <em className="text-gray-400">No content</em>
                                  : getPreviewValue(comp.oldValue, comp.fieldType) || <em className="text-gray-400">No content</em>
                                }
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Proposed Value */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">AI Proposed:</h4>
                          <div className="min-h-[60px] p-3 border border-gray-200 rounded bg-blue-50 overflow-y-auto">
                            {comp.fieldType === 'html' ? (
                              <div
                                className="text-sm text-gray-800"
                                dangerouslySetInnerHTML={{ 
                                  __html: isExpanded 
                                    ? comp.newValue || '<em>No content</em>'
                                    : getPreviewValue(comp.newValue, comp.fieldType) || '<em>No content</em>'
                                }}
                              />
                            ) : (
                              <div className="text-sm text-gray-800 whitespace-pre-wrap">
                                {isExpanded 
                                  ? formatValueForDisplay(comp.newValue, comp.fieldType) || <em className="text-gray-400">No content</em>
                                  : getPreviewValue(comp.newValue, comp.fieldType) || <em className="text-gray-400">No content</em>
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}