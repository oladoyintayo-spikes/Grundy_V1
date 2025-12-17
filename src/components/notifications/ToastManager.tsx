/**
 * GRUNDY TOAST MANAGER
 *
 * Manages toast queue and display for notifications.
 * Listens to notification store for new notifications.
 *
 * Features:
 * - Tracks lastAddedId to detect new notifications
 * - Queues multiple toasts if they arrive rapidly
 * - Handles navigation on tap
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md (v1.11) §11.6.2
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Toast } from './Toast';
import { useNotificationStore } from '../../stores/notificationStore';
import {
  navigateToTarget,
  NavigationContext,
} from '../../utils/navigationUtils';
import type { Notification } from '../../types/notifications';

// ============================================================================
// Props Interface
// ============================================================================

interface ToastManagerProps {
  /** Navigation context for handling tap navigation */
  navigationContext: NavigationContext;
}

// ============================================================================
// Component
// ============================================================================

export function ToastManager({ navigationContext }: ToastManagerProps) {
  const [current, setCurrent] = useState<Notification | null>(null);
  const queueRef = useRef<Notification[]>([]);
  const lastSeenIdRef = useRef<string | null>(null);

  // Subscribe to notification store
  const notifications = useNotificationStore((s) => s.notifications);
  const lastAddedId = useNotificationStore((s) => s.lastAddedId);
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  // Detect new notifications by tracking lastAddedId
  useEffect(() => {
    if (lastAddedId && lastAddedId !== lastSeenIdRef.current) {
      lastSeenIdRef.current = lastAddedId;

      // Find the notification that was just added
      const newNotification = notifications.find((n) => n.id === lastAddedId);

      if (newNotification) {
        if (!current) {
          // No toast showing, display immediately
          setCurrent(newNotification);
        } else {
          // Toast already showing, queue this one
          queueRef.current = [...queueRef.current, newNotification];
        }
      }
    }
  }, [lastAddedId, notifications, current]);

  // Handle toast dismiss (show next in queue)
  const handleDismiss = useCallback(() => {
    if (queueRef.current.length > 0) {
      const [next, ...rest] = queueRef.current;
      queueRef.current = rest;
      setCurrent(next);
    } else {
      setCurrent(null);
    }
  }, []);

  // Handle tap on toast
  const handleTap = useCallback(
    (notification: Notification) => {
      markAsRead(notification.id);
      navigateToTarget(notification.deepLink, navigationContext);
      handleDismiss();
    },
    [markAsRead, navigationContext, handleDismiss]
  );

  return (
    <Toast
      notification={current}
      onDismiss={handleDismiss}
      onTap={handleTap}
    />
  );
}

export default ToastManager;
