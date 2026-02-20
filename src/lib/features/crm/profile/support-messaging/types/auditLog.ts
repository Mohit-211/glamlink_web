// Audit Log Types for Support Messaging System

export type AuditAction =
  | 'status_changed'
  | 'priority_changed'
  | 'tags_updated'
  | 'conversation_created'
  | 'conversation_resolved'
  | 'message_deleted'
  | 'message_pinned'
  | 'message_unpinned'
  | 'message_edited';

export interface AuditLogEntry {
  id: string;
  conversationId: string;
  action: AuditAction;
  oldValue: unknown;
  newValue: unknown;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SerializableAuditLogEntry {
  id: string;
  conversationId: string;
  action: AuditAction;
  oldValue: unknown;
  newValue: unknown;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string; // ISO string
  metadata?: Record<string, unknown>;
}

export interface CreateAuditLogInput {
  conversationId: string;
  action: AuditAction;
  oldValue: unknown;
  newValue: unknown;
  userId: string;
  userName: string;
  userEmail: string;
  metadata?: Record<string, unknown>;
}

// Conversion helpers
export const toSerializableAuditLog = (entry: AuditLogEntry): SerializableAuditLogEntry => ({
  ...entry,
  timestamp: entry.timestamp instanceof Date ? entry.timestamp.toISOString() : entry.timestamp,
});

export const fromSerializableAuditLog = (entry: SerializableAuditLogEntry): AuditLogEntry => ({
  ...entry,
  timestamp: new Date(entry.timestamp),
});
