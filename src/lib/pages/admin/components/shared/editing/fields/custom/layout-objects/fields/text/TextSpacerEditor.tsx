'use client';

/**
 * TextSpacerEditor - Sub-spacer editor for Text objects
 *
 * Wrapper around SubSpacerEditor with Text-specific defaults.
 */

import { SubSpacerEditor } from '../../shared';
import type { TextSubSpacer } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

interface TextSpacerEditorProps {
  spacers: TextSubSpacer[];
  onChange: (spacers: TextSubSpacer[]) => void;
  maxSpacers?: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function TextSpacerEditor(props: TextSpacerEditorProps) {
  return <SubSpacerEditor {...props} label="Sub-Spacers" />;
}
