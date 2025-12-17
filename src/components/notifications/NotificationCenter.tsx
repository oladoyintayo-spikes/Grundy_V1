/**
 * GRUNDY NOTIFICATION CENTER
 *
 * Persistent notification history panel.
 * Per Bible §11.6.2 Notification Center.
 *
 * Features:
 * - Lists all notifications (max 50)
 * - Sorted by timestamp desc (newest first)
 * - Unread indicator dot
 * - Mark as read on tap
 * - Mark all as read button
 * - Clear all button (with confirmation)
 * - Navigate to deepLink on tap
 * - Accessible (keyboard navigation, ARIA)
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.2
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNotificationStore } from '../../stores/notificationStore';
import {
  navigateToTarget,
  NavigationContext,
} from '../../utils/navigationUtils';
import { formatRelativeTime } from '../../utils/formatTime';
import type { NavigationTarget } from '../../types/navigation';

// ============================================================================
// Props Interface
// ============================================================================

interface NotificationCenterProps {
  /** Whether the notification center is open */
  isOpen: boolean;
  /** Called when closing the notification center */
  onClose: () => void;
  /** Current timestamp for relative time display (deterministic) */
  nowMs: number;
  /** Navigation context for handling tap navigation */
  navigationContext: NavigationContext;
}

// ============================================================================
// Component
// ============================================================================

export function NotificationCenter({
  isOpen,
  onClose,
  nowMs,
  navigationContext,
}: NotificationCenterProps) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const clearAll = useNotificationStore((s) => s.clearAll);
  const openCenter = useNotificationStore((s) => s.openCenter);
  const [confirmClear, setConfirmClear] = useState(false);

  // Mark lastChecked when opening
  useEffect(() => {
    if (isOpen) {
      openCenter(nowMs);
    }
  }, [isOpen, nowMs, openCenter]);

  // Reset confirm state when closing
  useEffect(() => {
    if (!isOpen) {
      setConfirmClear(false);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Don't render if not open
  if (!isOpen) return null;

  // Handle tap on notification
  const handleTap = (id: string, deepLink: NavigationTarget) => {
    markAsRead(id);
    navigateToTarget(deepLink, navigationContext);
    onClose();
  };

  // Handle clear all (with confirmation)
  const handleClearAll = () => {
    if (confirmClear) {
      clearAll();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = () => {
    markAllAsRead(nowMs);
  };

  // Handle backdrop click
  const handleBackdropClick = () => {
    setConfirmClear(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      data-testid="notification-center-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Notification Center"
    >
      <div
        className="absolute right-0 top-0 h-full w-80 max-w-full bg-slate-900 shadow-lg flex flex-col border-l border-slate-700"
        onClick={(e) => e.stopPropagation()}
        data-testid="notification-center"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <h2
            className="font-bold text-lg text-white"
            id="notification-center-title"
          >
            🔔 Notifications
          </h2>
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-amber-400 hover:text-amber-300
                             focus:outline-none focus:underline"
                  data-testid="notification-mark-all-read"
                >
                  Mark Read
                </button>
                <button
                  onClick={handleClearAll}
                  className={`text-sm focus:outline-none focus:underline ${
                    confirmClear
                      ? 'text-red-400 font-bold'
                      : 'text-red-500 hover:text-red-400'
                  }`}
                  data-testid="notification-clear-all"
                >
                  {confirmClear ? 'Confirm?' : 'Clear'}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 ml-2
                         focus:outline-none focus:text-white"
              data-testid="notification-close"
              aria-label="Close notification center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div
          className="overflow-y-auto flex-1"
          role="list"
          aria-labelledby="notification-center-title"
        >
          {notifications.length === 0 ? (
            <div
              className="p-8 text-center text-slate-400"
              data-testid="notification-empty"
            >
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleTap(n.id, n.deepLink)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTap(n.id, n.deepLink);
                  }
                }}
                tabIndex={0}
                role="listitem"
                className={`p-4 border-b border-slate-700 cursor-pointer
                           hover:bg-slate-800 transition-colors
                           focus:outline-none focus:bg-slate-800 ${
                             !n.read ? 'bg-slate-800/50' : ''
                           }`}
                data-testid={`notification-item-${n.id}`}
              >
                <div className="flex items-start gap-3">
                  {!n.read && (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0"
                      data-testid="notification-unread-dot"
                      aria-label="Unread"
                    />
                  )}
                  {n.read && <span className="w-2" aria-hidden="true" />}
                  <span
                    className="text-xl flex-shrink-0"
                    aria-hidden="true"
                  >
                    {n.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-white">
                      {n.title}
                    </p>
                    <p className="text-sm text-slate-300 truncate">
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatRelativeTime(n.timestamp, nowMs)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCenter;
