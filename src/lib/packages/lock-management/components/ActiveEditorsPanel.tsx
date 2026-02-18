'use client';

/**
 * ActiveEditorsPanel Component - Multi-Editor Status Display
 * 
 * Shows who is currently editing which resources with management actions.
 */

import React, { useState, useEffect } from 'react';
import { LockStatus } from '../types/lock.types';
import { LockCountdown } from './LockCountdown';
import { formatTimeRemaining } from '../utils/timeFormatters';

export interface ActiveEditor {
  userId: string;
  userEmail: string;
  userName?: string;
  resourceId: string;
  collection: string;
  section?: string;
  lockGroup?: string;
  lockExpiresAt: string;
  tabId?: string;
}

export interface ActiveEditorsPanelProps {
  editors: ActiveEditor[];
  currentUserId?: string;
  showActions?: boolean;
  onTransferLock?: (fromUserId: string, resourceId: string, collection: string) => void;
  onForceRelease?: (resourceId: string, collection: string) => void;
  className?: string;
  maxHeight?: string;
}

export function ActiveEditorsPanel({
  editors,
  currentUserId,
  showActions = false,
  onTransferLock,
  onForceRelease,
  className = '',
  maxHeight = 'max-h-96'
}: ActiveEditorsPanelProps) {
  const [timeRemainingMap, setTimeRemainingMap] = useState<Record<string, string>>({});

  // Update time remaining for all editors
  useEffect(() => {
    const updateTimes = () => {
      const newMap: Record<string, string> = {};
      const now = new Date();
      editors.forEach(editor => {
        const key = `${editor.resourceId}-${editor.userId}`;
        const expiresAt = new Date(editor.lockExpiresAt);
        const remainingMs = expiresAt.getTime() - now.getTime();
        const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
        newMap[key] = formatTimeRemaining(remainingSeconds);
      });
      setTimeRemainingMap(newMap);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    
    return () => clearInterval(interval);
  }, [editors]);

  const groupedEditors = editors.reduce((groups, editor) => {
    const key = `${editor.collection}/${editor.resourceId}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(editor);
    return groups;
  }, {} as Record<string, ActiveEditor[]>);

  const isCurrentUser = (editor: ActiveEditor) => editor.userId === currentUserId;

  const getEditorDisplayName = (editor: ActiveEditor) => {
    if (isCurrentUser(editor)) {
      return `${editor.userName || editor.userEmail} (You)`;
    }
    return editor.userName || editor.userEmail;
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expiration = new Date(expiresAt);
    const now = new Date();
    const minutesRemaining = (expiration.getTime() - now.getTime()) / (1000 * 60);
    return minutesRemaining <= 2;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) <= new Date();
  };

  if (editors.length === 0) {
    return (
      <div className={`p-4 text-center text-gray-500 bg-gray-50 rounded-lg border ${className}`}>
        <div className="text-2xl mb-2">👥</div>
        <p>No active editors</p>
        <p className="text-sm">All resources are available for editing</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-lg shadow-sm mb-4 ${className}`}>
      <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <span className="text-lg">👥</span>
          Active Editors ({editors.length})
        </h3>
      </div>

      <div className={`overflow-y-auto ${maxHeight}`}>
        {Object.entries(groupedEditors).map(([resourceKey, resourceEditors]) => {
          const [collection, resourceId] = resourceKey.split('/');
          
          return (
            <div key={resourceKey} className="border-b last:border-b-0">
              <div className="px-4 py-3 bg-gray-25">
                <div className="font-medium text-sm text-gray-700 mb-2">
                  {collection} / {resourceId}
                </div>
                
                <div className="space-y-2">
                  {resourceEditors.map(editor => {
                    const timeKey = `${editor.resourceId}-${editor.userId}`;
                    const timeRemaining = timeRemainingMap[timeKey] || '';
                    const expiringSoon = isExpiringSoon(editor.lockExpiresAt);
                    const expired = isExpired(editor.lockExpiresAt);
                    
                    return (
                      <div key={`${editor.userId}-${editor.tabId}`} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${isCurrentUser(editor) ? 'bg-green-500' : 'bg-blue-500'}`} />
                          
                          <div>
                            <div className="font-medium text-sm">
                              {getEditorDisplayName(editor)}
                            </div>
                            
                            <div className="text-xs text-gray-500 space-y-1">
                              {editor.section && (
                                <div>Section: {editor.section}</div>
                              )}
                              {editor.lockGroup && (
                                <div>Group: {editor.lockGroup}</div>
                              )}
                              {editor.tabId && (
                                <div>Tab: {editor.tabId.slice(-8)}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <LockCountdown
                            timeRemaining={timeRemaining}
                            isWarning={expiringSoon}
                            isError={expired}
                            size="sm"
                          />

                          {showActions && !isCurrentUser(editor) && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => onTransferLock?.(editor.userId, resourceId, collection)}
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                title="Transfer lock to yourself"
                              >
                                Transfer
                              </button>
                              
                              <button
                                onClick={() => onForceRelease?.(resourceId, collection)}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                title="Force release lock"
                              >
                                Release
                              </button>
                            </div>
                          )}

                          {showActions && isCurrentUser(editor) && (
                            <button
                              onClick={() => onForceRelease?.(resourceId, collection)}
                              className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                              title="Release your lock"
                            >
                              Release
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            Auto-updates every second
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>You</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Others</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}