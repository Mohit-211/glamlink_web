'use client';

/**
 * LoadFromSectionButton Component
 *
 * Main button for loading custom block data from existing web sections.
 * Handles:
 * - Finding matching sections
 * - Single vs multiple matches
 * - Overwrite protection
 * - Modal coordination
 */

import React, { useState, useCallback } from 'react';
import { useLoadFromSection } from './useLoadFromSection';
import SectionSelectionModal from '../modals/SectionSelectionModal';
import ConfirmOverwriteModal from '../modals/ConfirmOverwriteModal';
import type { SectionMatch } from '../../../types';

interface LoadFromSectionButtonProps {
  issueId: string;
  blockType: string;
  blockCategory: string;
  currentProps: Record<string, any>;
  onLoad: (data: Record<string, any>) => void;
}

export default function LoadFromSectionButton({
  issueId,
  blockType,
  blockCategory,
  currentProps,
  onLoad
}: LoadFromSectionButtonProps) {
  const { findMatches, isLoading: sectionsLoading } = useLoadFromSection({
    issueId,
    blockType,
    blockCategory
  });

  const [matches, setMatches] = useState<SectionMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<SectionMatch | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /**
   * Check if user has existing data that would be overwritten
   */
  const hasExistingData = Object.keys(currentProps).length > 0 &&
    Object.values(currentProps).some(v => v !== undefined && v !== '' && v !== null);

  /**
   * Handle button click - find matches and determine next action
   */
  const handleClick = useCallback(() => {
    // Find matching sections
    const foundMatches = findMatches();
    setMatches(foundMatches);

    if (foundMatches.length === 0) {
      // No matches - button should be disabled, but handle gracefully
      return;
    }

    if (foundMatches.length === 1) {
      // Single match - proceed directly
      setSelectedMatch(foundMatches[0]);

      // Check if we need overwrite confirmation
      if (hasExistingData) {
        setShowConfirmModal(true);
      } else {
        // No existing data - load immediately
        onLoad(foundMatches[0].componentData);
      }
    } else {
      // Multiple matches - show selection modal
      setShowSelectionModal(true);
    }
  }, [findMatches, hasExistingData, onLoad]);

  /**
   * Handle section selection from modal
   */
  const handleSelectSection = useCallback((sectionId: string) => {
    const match = matches.find(m => m.sectionId === sectionId);
    if (!match) return;

    setSelectedMatch(match);
    setShowSelectionModal(false);

    // Check if we need overwrite confirmation
    if (hasExistingData) {
      setShowConfirmModal(true);
    } else {
      onLoad(match.componentData);
    }
  }, [matches, hasExistingData, onLoad]);

  /**
   * Handle confirmed overwrite
   */
  const handleConfirmOverwrite = useCallback(() => {
    if (selectedMatch) {
      onLoad(selectedMatch.componentData);
    }
    setShowConfirmModal(false);
    setSelectedMatch(null);
  }, [selectedMatch, onLoad]);

  /**
   * Handle cancelled overwrite
   */
  const handleCancelOverwrite = useCallback(() => {
    setShowConfirmModal(false);
    setSelectedMatch(null);
  }, []);

  // Calculate button state
  const isDisabled = sectionsLoading || findMatches().length === 0;
  const matchCount = findMatches().length;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
        }`}
        title={isDisabled ? 'No matching sections found' : `Load from ${matchCount} section${matchCount > 1 ? 's' : ''}`}
      >
        {sectionsLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading sections...
          </span>
        ) : isDisabled ? (
          '📋 Load from Section (No matches)'
        ) : (
          `📋 Load from Section (${matchCount} match${matchCount > 1 ? 'es' : ''})`
        )}
      </button>

      {/* Section selection modal */}
      {showSelectionModal && (
        <SectionSelectionModal
          sections={matches}
          componentName={blockType}
          onSelect={handleSelectSection}
          onCancel={() => setShowSelectionModal(false)}
        />
      )}

      {/* Overwrite confirmation modal */}
      {showConfirmModal && selectedMatch && (
        <ConfirmOverwriteModal
          currentData={currentProps}
          newData={selectedMatch.componentData}
          componentName={blockType}
          sectionTitle={selectedMatch.sectionTitle}
          onConfirm={handleConfirmOverwrite}
          onCancel={handleCancelOverwrite}
        />
      )}
    </>
  );
}
