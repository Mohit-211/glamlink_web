// Audit Log Utilities for Support Messaging System
// Handles Firestore operations for audit trail

import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import type { AuditLogEntry, CreateAuditLogInput } from '../types/auditLog';

// Collection path for audit logs (subcollection under conversations)
export const AUDIT_LOG_COLLECTION = (conversationId: string) =>
  `support_conversations/${conversationId}/audit_logs`;

/**
 * Create a new audit log entry
 */
export async function createAuditLog(input: CreateAuditLogInput): Promise<string | null> {
  if (!clientDb) {
    console.error('Firestore not initialized');
    return null;
  }

  try {
    const auditRef = collection(clientDb, AUDIT_LOG_COLLECTION(input.conversationId));
    const docRef = await addDoc(auditRef, {
      ...input,
      timestamp: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating audit log:', error);
    return null;
  }
}

/**
 * Fetch audit log entries for a conversation
 */
export async function fetchAuditLogs(
  conversationId: string,
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  entries: AuditLogEntry[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  if (!clientDb) {
    return { entries: [], lastDoc: null, hasMore: false };
  }

  try {
    const auditRef = collection(clientDb, AUDIT_LOG_COLLECTION(conversationId));
    let auditQuery = query(
      auditRef,
      orderBy('timestamp', 'desc'),
      limit(pageSize + 1) // Fetch one extra to check if there are more
    );

    if (lastDoc) {
      auditQuery = query(
        auditRef,
        orderBy('timestamp', 'desc'),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(auditQuery);
    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;
    const actualDocs = hasMore ? docs.slice(0, pageSize) : docs;

    const entries: AuditLogEntry[] = actualDocs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        conversationId: data.conversationId,
        action: data.action,
        oldValue: data.oldValue,
        newValue: data.newValue,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
        metadata: data.metadata,
      };
    });

    return {
      entries,
      lastDoc: actualDocs.length > 0 ? actualDocs[actualDocs.length - 1] : null,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return { entries: [], lastDoc: null, hasMore: false };
  }
}

/**
 * Get a human-readable description of an audit action
 */
export function getAuditActionDescription(entry: AuditLogEntry): string {
  switch (entry.action) {
    case 'status_changed':
      return `changed status from "${entry.oldValue}" to "${entry.newValue}"`;
    case 'priority_changed':
      return `changed priority from "${entry.oldValue}" to "${entry.newValue}"`;
    case 'tags_updated': {
      const oldTags = Array.isArray(entry.oldValue) ? entry.oldValue : [];
      const newTags = Array.isArray(entry.newValue) ? entry.newValue : [];
      if (oldTags.length === 0 && newTags.length > 0) {
        return `added tags: ${newTags.join(', ')}`;
      } else if (oldTags.length > 0 && newTags.length === 0) {
        return `removed all tags`;
      } else {
        return `updated tags to: ${newTags.join(', ')}`;
      }
    }
    case 'conversation_created':
      return 'created the conversation';
    case 'conversation_resolved':
      return 'resolved the conversation';
    case 'message_deleted':
      return 'deleted a message';
    default:
      return `performed action: ${entry.action}`;
  }
}

/**
 * Get an icon for an audit action (using unicode characters)
 */
export function getAuditActionIcon(action: AuditLogEntry['action']): string {
  switch (action) {
    case 'status_changed':
      return '🔄';
    case 'priority_changed':
      return '⚡';
    case 'tags_updated':
      return '🏷️';
    case 'conversation_created':
      return '✨';
    case 'conversation_resolved':
      return '✅';
    case 'message_deleted':
      return '🗑️';
    default:
      return '📝';
  }
}
