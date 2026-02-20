// Link action types for magazine sections
export type LinkActionType = 
  | 'link'           // Regular link navigation
  | 'pro-popup'      // Pro app download popup
  | 'user-popup'     // User app download popup
  | 'modal'          // Open in modal (default)
  | 'modal-content'  // Open content in modal
  | 'modal-iframe'   // Open in modal with iframe
  | 'modal-image';   // Open image in modal/lightbox

// Modal configuration for link actions
export interface ModalConfig {
  type?: 'content' | 'iframe' | 'image';
  width?: string;
  height?: string;
  showCloseButton?: boolean;
}

// Link field value that supports both URL and action type
export interface LinkFieldValue {
  url: string;
  action?: LinkActionType; // Default to 'link' if not specified
  modalConfig?: ModalConfig; // Configuration for modal actions
  qrCode?: string; // Optional QR code URL or data
}

// Helper type that accepts both string (backward compatibility) and LinkFieldValue
export type LinkFieldType = string | LinkFieldValue;

// Type guard to check if a value is a LinkFieldValue
export function isLinkFieldValue(value: any): value is LinkFieldValue {
  return value && typeof value === 'object' && 'url' in value;
}

// Helper to get URL from LinkFieldType
export function getLinkUrl(value: LinkFieldType | undefined | null): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.url || '';
}

// Helper to get action type from LinkFieldType
export function getLinkAction(value: LinkFieldType | undefined | null): LinkActionType {
  if (!value) return 'link';
  if (typeof value === 'string') return 'link';
  return value.action || 'link';
}

// Helper to normalize link field value
export function normalizeLinkField(value: LinkFieldType | undefined | null): LinkFieldValue | null {
  if (!value) return null;
  if (typeof value === 'string') {
    return { url: value, action: 'link' };
  }
  return {
    url: value.url || '',
    action: value.action || 'link'
  };
}