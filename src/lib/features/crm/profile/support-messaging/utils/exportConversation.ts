/**
 * Conversation export utilities for generating downloadable transcripts.
 *
 * Supports:
 * - Plain text (.txt)
 * - JSON (.json)
 * - HTML (for PDF-like viewing)
 */

import type { ConversationWithMessages } from '../types';

export type ExportFormat = 'txt' | 'json' | 'html';

export interface ExportOptions {
  /** Output format */
  format: ExportFormat;
  /** Include file attachment references */
  includeAttachments: boolean;
  /** Include metadata (status, priority, tags, etc.) */
  includeMetadata: boolean;
}

/**
 * Export a conversation to the specified format.
 *
 * @param conversation - The conversation with messages to export
 * @param options - Export options
 * @returns Blob containing the exported content
 *
 * @example
 * ```tsx
 * const blob = await exportConversation(conversation, {
 *   format: 'txt',
 *   includeAttachments: true,
 *   includeMetadata: true,
 * });
 * downloadBlob(blob, 'conversation.txt');
 * ```
 */
export async function exportConversation(
  conversation: ConversationWithMessages,
  options: ExportOptions
): Promise<Blob> {
  switch (options.format) {
    case 'txt':
      return generateTextTranscript(conversation, options);
    case 'json':
      return generateJsonExport(conversation, options);
    case 'html':
      return generateHtmlTranscript(conversation, options);
    default:
      throw new Error(`Unsupported format: ${options.format}`);
  }
}

/**
 * Generate a plain text transcript of the conversation.
 */
function generateTextTranscript(
  conversation: ConversationWithMessages,
  options: ExportOptions
): Blob {
  const lines: string[] = [];

  // Header
  lines.push('SUPPORT CONVERSATION TRANSCRIPT');
  lines.push('='.repeat(50));
  lines.push('');

  // Metadata
  if (options.includeMetadata) {
    lines.push(`Subject: ${conversation.subject}`);
    lines.push(`Status: ${conversation.status}`);
    lines.push(`Priority: ${conversation.priority || 'normal'}`);
    lines.push(`User: ${conversation.userName} (${conversation.userEmail})`);
    lines.push(`Created: ${formatDate(conversation.createdAt)}`);
    lines.push(`Last Updated: ${formatDate(conversation.updatedAt)}`);
    if (conversation.tags?.length) {
      lines.push(`Tags: ${conversation.tags.join(', ')}`);
    }
    lines.push('');
    lines.push('='.repeat(50));
    lines.push('');
  }

  // Messages
  lines.push(`MESSAGES (${conversation.messages.length})`);
  lines.push('-'.repeat(50));
  lines.push('');

  for (const message of conversation.messages) {
    const timestamp = formatDate(message.timestamp);
    lines.push(`[${timestamp}] ${message.senderName}:`);
    lines.push(message.content);

    if (options.includeAttachments && message.attachments?.length) {
      lines.push(`  Attachments: ${message.attachments.map(a => a.name).join(', ')}`);
    }

    if (message.editedAt) {
      lines.push(`  (edited ${formatDate(message.editedAt)})`);
    }

    if (message.reactions?.length) {
      const reactionSummary = message.reactions
        .map(r => `${r.emoji} ${r.userName}`)
        .join(', ');
      lines.push(`  Reactions: ${reactionSummary}`);
    }

    lines.push('');
  }

  // Footer
  lines.push('='.repeat(50));
  lines.push(`Exported: ${formatDate(new Date())}`);

  return new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
}

/**
 * Generate a JSON export of the conversation.
 */
function generateJsonExport(
  conversation: ConversationWithMessages,
  options: ExportOptions
): Blob {
  const exportData = {
    exportedAt: new Date().toISOString(),
    format: 'glamlink-support-export-v1',
    conversation: {
      id: conversation.id,
      subject: conversation.subject,
      status: conversation.status,
      priority: conversation.priority || 'normal',
      tags: conversation.tags || [],
      user: {
        id: conversation.userId,
        name: conversation.userName,
        email: conversation.userEmail,
      },
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      messageCount: conversation.messages.length,
    },
    messages: conversation.messages.map(m => ({
      id: m.id,
      sender: {
        id: m.senderId,
        name: m.senderName,
        email: m.senderEmail,
      },
      content: m.content,
      timestamp: m.timestamp.toISOString(),
      editedAt: m.editedAt?.toISOString() || null,
      editCount: m.editHistory?.length || 0,
      isPinned: m.isPinned || false,
      attachments: options.includeAttachments
        ? m.attachments?.map(a => ({
            name: a.name,
            type: a.type,
            size: a.size,
            url: a.url,
          }))
        : undefined,
      reactions: m.reactions?.map(r => ({
        emoji: r.emoji,
        userId: r.userId,
        userName: r.userName,
      })),
    })),
  };

  return new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
}

/**
 * Generate an HTML transcript (can be opened in browser or printed to PDF).
 */
function generateHtmlTranscript(
  conversation: ConversationWithMessages,
  options: ExportOptions
): Blob {
  const escapedSubject = escapeHtml(conversation.subject);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conversation: ${escapedSubject}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #fff;
      color: #333;
      line-height: 1.6;
    }
    h1 {
      color: #1f2937;
      border-bottom: 3px solid #8b5cf6;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .metadata {
      background: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      border: 1px solid #e5e7eb;
    }
    .metadata p {
      margin: 6px 0;
      font-size: 14px;
    }
    .metadata strong { color: #374151; }
    .tag {
      display: inline-block;
      background: #ede9fe;
      color: #7c3aed;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-right: 4px;
    }
    .messages-header {
      font-size: 18px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    .message {
      margin: 16px 0;
      padding: 16px;
      border-left: 3px solid #8b5cf6;
      background: #fafafa;
      border-radius: 0 8px 8px 0;
    }
    .message.pinned {
      border-left-color: #f59e0b;
      background: #fffbeb;
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .sender {
      font-weight: 600;
      color: #1f2937;
    }
    .timestamp {
      color: #6b7280;
      font-size: 13px;
    }
    .message-content {
      white-space: pre-wrap;
      word-break: break-word;
    }
    .edited {
      color: #9ca3af;
      font-size: 12px;
      font-style: italic;
      margin-top: 8px;
    }
    .attachments {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e5e7eb;
      font-size: 13px;
      color: #6b7280;
    }
    .reactions {
      margin-top: 8px;
      font-size: 13px;
    }
    .pin-badge {
      background: #fef3c7;
      color: #92400e;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      margin-left: 8px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      color: #9ca3af;
      font-size: 12px;
      text-align: center;
    }
    @media print {
      body { margin: 0; padding: 20px; }
      .message { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${escapedSubject}</h1>
`;

  // Metadata section
  if (options.includeMetadata) {
    html += `
  <div class="metadata">
    <p><strong>Status:</strong> ${escapeHtml(conversation.status)}</p>
    <p><strong>Priority:</strong> ${escapeHtml(conversation.priority || 'normal')}</p>
    <p><strong>User:</strong> ${escapeHtml(conversation.userName)} (${escapeHtml(conversation.userEmail)})</p>
    <p><strong>Created:</strong> ${formatDate(conversation.createdAt)}</p>
    <p><strong>Last Updated:</strong> ${formatDate(conversation.updatedAt)}</p>`;

    if (conversation.tags?.length) {
      html += `
    <p><strong>Tags:</strong> ${conversation.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</p>`;
    }

    html += `
  </div>`;
  }

  // Messages
  html += `
  <div class="messages-header">Messages (${conversation.messages.length})</div>`;

  for (const message of conversation.messages) {
    const pinnedClass = message.isPinned ? ' pinned' : '';
    const pinnedBadge = message.isPinned ? '<span class="pin-badge">📌 Pinned</span>' : '';

    html += `
  <div class="message${pinnedClass}">
    <div class="message-header">
      <span class="sender">${escapeHtml(message.senderName)}${pinnedBadge}</span>
      <span class="timestamp">${formatDate(message.timestamp)}</span>
    </div>
    <div class="message-content">${escapeHtml(message.content)}</div>`;

    if (message.editedAt) {
      html += `
    <div class="edited">(edited ${formatDate(message.editedAt)})</div>`;
    }

    if (options.includeAttachments && message.attachments?.length) {
      const attachmentList = message.attachments.map(a => escapeHtml(a.name)).join(', ');
      html += `
    <div class="attachments">📎 Attachments: ${attachmentList}</div>`;
    }

    if (message.reactions?.length) {
      const reactionSummary = message.reactions
        .map(r => `${r.emoji} ${escapeHtml(r.userName)}`)
        .join(', ');
      html += `
    <div class="reactions">${reactionSummary}</div>`;
    }

    html += `
  </div>`;
  }

  // Footer
  html += `
  <div class="footer">
    Exported from Glamlink Support on ${formatDate(new Date())}
  </div>
</body>
</html>`;

  return new Blob([html], { type: 'text/html;charset=utf-8' });
}

/**
 * Escape HTML special characters to prevent XSS.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format a date for display.
 */
function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Download a blob as a file.
 *
 * @param blob - The blob to download
 * @param filename - The filename for the download
 *
 * @example
 * ```tsx
 * const blob = await exportConversation(conversation, { format: 'txt', ... });
 * downloadBlob(blob, 'conversation.txt');
 * ```
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get the file extension for an export format.
 */
export function getExportExtension(format: ExportFormat): string {
  switch (format) {
    case 'txt':
      return 'txt';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    default:
      return 'txt';
  }
}

/**
 * Generate a filename for the export.
 */
export function generateExportFilename(
  conversation: ConversationWithMessages,
  format: ExportFormat
): string {
  const sanitizedSubject = conversation.subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);

  const timestamp = new Date().toISOString().slice(0, 10);
  const extension = getExportExtension(format);

  return `conversation-${sanitizedSubject}-${timestamp}.${extension}`;
}
