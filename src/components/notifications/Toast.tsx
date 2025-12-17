/**
 * GRUNDY TOAST COMPONENT
 *
 * Ephemeral notification toast for new notifications.
 * Per Bible §11.6.2 Notification Center.
 *
 * Features:
 * - Auto-dismisses after TOAST_DURATION_MS (5 seconds)
 * - Tap to navigate to deepLink
 * - Dismiss button
 * - Accessible (aria-live, keyboard support)
 * - Slide-down animation
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.2
 */

import React, { useEffect, useState, useCallback } from 'react';
import type { Notification } from '../../types/notifications';
import { TOAST_DURATION_MS } from '../../constants/notificationConstants';

// ============================================================================
// Props Interface
// ============================================================================

interface ToastProps {
  /** Notification to display (null hides toast) */
  notification: Notification | null;
  /** Called when toast is dismissed (timeout or user action) */
  onDismiss: () => void;
  /** Called when user taps the toast */
  onTap: (notification: Notification) => void;
}

// ============================================================================
// Component
// ============================================================================

export function Toast({ notification, onDismiss, onTap }: ToastProps) {
  const [visible, setVisible] = useState(false);

  // Show toast and start auto-dismiss timer
  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, TOAST_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  // Handle tap on toast body
  const handleTap = useCallback(() => {
    if (notification) {
      onTap(notification);
      setVisible(false);
    }
  }, [notification, onTap]);

  // Handle dismiss button click
  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setVisible(false);
      onDismiss();
    },
    [onDismiss]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisible(false);
        onDismiss();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (notification) {
          onTap(notification);
          setVisible(false);
        }
      }
    },
    [notification, onDismiss, onTap]
  );

  // Don't render if no notification or not visible
  if (!notification || !visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      tabIndex={0}
      data-testid="toast"
      onClick={handleTap}
      onKeyDown={handleKeyDown}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50
                 bg-slate-800 rounded-lg shadow-lg border border-slate-600 p-4
                 max-w-sm w-[calc(100%-2rem)] cursor-pointer
                 animate-[slideDown_0.3s_ease-out]
                 focus:outline-none focus:ring-2 focus:ring-amber-400"
      style={{
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" data-testid="toast-icon" aria-hidden="true">
          {notification.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold truncate text-white"
            data-testid="toast-title"
          >
            {notification.title}
          </p>
          <p
            className="text-sm text-slate-300 truncate"
            data-testid="toast-message"
          >
            {notification.message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-200 flex-shrink-0
                     focus:outline-none focus:text-white"
          data-testid="toast-dismiss"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;
