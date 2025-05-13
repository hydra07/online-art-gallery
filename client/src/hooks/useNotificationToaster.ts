'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuthClient from '@/hooks/useAuth-client';
import { Notification } from '@/service/notification';
import { NotificationToast, useNotificationStore } from '@/store/notificationStore';

export default function useNotificationToaster() {
  const { user } = useAuthClient();
  const router = useRouter();
  
  // Get state and actions from the centralized store
  const {
    toasts: notifications,
    removeToast: removeNotification,
    addToast,
    markAsRead,
    initializeSocket
  } = useNotificationStore();
  
  // Initialize socket when component mounts and user is available
  useEffect(() => {
    if (user?.id) {
      initializeSocket(user.id);
    }
  }, [user?.id, initializeSocket]);

  // Handle notification click based on type
  const handleNotificationClick = useCallback((notification: Notification) => {
    // Mark as read in our store
    markAsRead(notification._id);

    // Navigate based on notification type
    switch (notification.refType) {
      case 'artwork':
        if (notification.refId) {
          router.push(`/artwork/${notification.refId}`);
        }
        break;
      case 'event':
        router.push('/events');
        break;
      case 'maintenance':
        // Just display the notification, no navigation
        break;
      default:
        router.push('/notifications');
        break;
    }
  }, [router, markAsRead]);

  // Set up the action function for toasts
  useEffect(() => {
    // Update all toasts to include the action function
    if (notifications.length > 0) {
      notifications.forEach(toast => {
        if (!toast.action) {
          const updatedToast: NotificationToast = {
            ...toast,
            action: () => handleNotificationClick(toast)
          };
          // Replace the toast with one that has the action
          removeNotification(toast._id);
          addToast(updatedToast);
        }
      });
    }
  }, [notifications, handleNotificationClick, removeNotification, addToast]);

  return {
    notifications,
    removeNotification,
    handleNotificationClick,
  };
}
