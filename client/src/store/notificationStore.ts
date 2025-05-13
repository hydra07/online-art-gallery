'use client';

import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { Notification } from '@/service/notification';

// Custom event for notifications
export const NOTIFICATION_EVENTS = {
  NEW_NOTIFICATION: 'new-notification'
};

// Create a custom event emitter for notifications
export const notificationEmitter = {
  listeners: new Map(),

  emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach((listener: Function) => listener(data));
  },

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event) || [];
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    };
  }
};

// Extend Notification type for toast display
export type NotificationToast = Notification & {
  showDuration: number;
  action?: () => void;
  isNew?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'info';
};

// Type for query data structure
export interface NotificationQueryData {
  pages: Array<{
    notifications: Notification[];
    total: number;
    nextPage?: number;
  }>;
  pageParams: number[];
}

// Socket configuration
const createSocket = (url: string, options: {
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  timeout?: number;
  transports?: string[];
  autoConnect: boolean;
}) => io(url, options);

interface NotificationState {
  // Socket state
  socket: Socket | null;
  socketStatus: 'connect' | 'disconnect';
  socketInitializing: boolean;
  registeredUsers: Set<string>;

  // Notification data
  notifications: Notification[];
  toasts: NotificationToast[];
  unreadCount: number;
  lastNotificationId: string | null;

  // UI state
  isNotificationPanelOpen: boolean;

  // Socket management
  initializeSocket: (userId: string) => void;
  disconnectSocket: () => void;

  // Notification actions
  addNotification: (notification: Notification) => void;
  addToast: (toast: NotificationToast) => void;
  removeToast: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  setNotificationPanelOpen: (isOpen: boolean) => void;
  updateQueryData: (queryData: NotificationQueryData) => void;
}

// Helper function to determine notification variant
const getVariantFromType = (refType: string): NotificationToast['variant'] => {
  switch (refType) {
    case 'artwork':
      return 'success';
    case 'event':
      return 'info';
    case 'maintenance':
      return 'warning';
    default:
      return 'default';
  }
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Socket state
  socket: null,
  socketStatus: 'disconnect',
  socketInitializing: false,
  registeredUsers: new Set<string>(),

  // Notification data
  notifications: [],
  toasts: [],
  unreadCount: 0,
  lastNotificationId: null,

  // UI state
  isNotificationPanelOpen: false,

  // Socket management
  initializeSocket: (userId: string) => {
    const { socket, socketInitializing, registeredUsers } = get();

    // If socket exists and user already registered, do nothing
    if (socket?.connected && registeredUsers.has(userId)) {
      set({ socketStatus: 'connect' });
      return;
    }

    // If already initializing, wait
    if (socketInitializing) return;

    set({ socketInitializing: true });

    try {
      const newSocket = createSocket(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['websocket', 'polling'],
        autoConnect: true
      });

      // Register user
      newSocket.emit('register', userId);
      const newRegisteredUsers = new Set(registeredUsers);
      newRegisteredUsers.add(userId);

      // Set up event listeners
      newSocket.on('connect', () => {
        set({ socketStatus: 'connect' });
        // Re-register on reconnect
        newSocket.emit('register', userId);
      });

      newSocket.on('disconnect', () => set({ socketStatus: 'disconnect' }));

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        set({ socketStatus: 'disconnect' });
      });

      newSocket.on('notifications', (newNotification: Notification) => {
        const { lastNotificationId } = get();

        // Skip if already processed
        if (lastNotificationId === newNotification._id) {
          return;
        }


        // Format notification
        const formattedNotification = {
          ...newNotification,
          createdAt: new Date(newNotification.createdAt),
          updatedAt: new Date(newNotification.updatedAt),
          isRead: false,
        };

        // Create toast
        const variant = getVariantFromType(newNotification.refType);
        const toast: NotificationToast = {
          ...formattedNotification,
          showDuration: 10000,
          isNew: true,
          variant,
        };

        // Update state
        set(state => ({
          notifications: [formattedNotification, ...state.notifications],
          toasts: [...state.toasts, toast],
          unreadCount: state.unreadCount + 1,
          lastNotificationId: newNotification._id
        }));

        // Emit event for React Query to update
        notificationEmitter.emit(
          NOTIFICATION_EVENTS.NEW_NOTIFICATION,
          formattedNotification
        );
      });

      // Update state
      set({
        socket: newSocket,
        socketStatus: 'connect',
        socketInitializing: false,
        registeredUsers: newRegisteredUsers
      });

    } catch (error) {
      console.error('Socket initialization error:', error);
      set({
        socketStatus: 'disconnect',
        socketInitializing: false
      });
    }
  },

  disconnectSocket: () => {
    const { socket, registeredUsers } = get();
    if (!socket) return;

    // Clean up event listeners
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.off('notifications');

    // Disconnect if no users registered
    if (registeredUsers.size === 0) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  // Notification actions
  addNotification: (notification: Notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1)
    }));
  },

  addToast: (toast: NotificationToast) => {
    set(state => ({
      toasts: [...state.toasts, toast]
    }));
  },

  removeToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast._id !== id)
    }));
  },

  markAsRead: (id: string) => {
    set(state => {
      // Check if notification is unread
      const isUnread = state.notifications.some(n => n._id === id && !n.isRead);

      return {
        notifications: state.notifications.map(notification =>
          notification._id === id ? { ...notification, isRead: true } : notification
        ),
        unreadCount: isUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    });
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(notification => ({ ...notification, isRead: true })),
      unreadCount: 0
    }));
  },

  deleteNotification: (id: string) => {
    set(state => {
      const notification = state.notifications.find(n => n._id === id);
      const wasUnread = notification && !notification.isRead;

      return {
        notifications: state.notifications.filter(n => n._id !== id),
        toasts: state.toasts.filter(t => t._id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    });
  },

  setNotifications: (notifications: Notification[]) => {
    set({ notifications });
  },

  setUnreadCount: (count: number) => {
    set({ unreadCount: count });
  },

  setNotificationPanelOpen: (isOpen: boolean) => {
    set({ isNotificationPanelOpen: isOpen });
  },

  updateQueryData: (queryData: NotificationQueryData) => {
    // Extract all notifications from pages
    const allNotifications = queryData.pages.flatMap(page => page.notifications || []);

    // Count unread notifications
    const unreadCount = allNotifications.filter(n => !n.isRead).length;

    set({
      notifications: allNotifications,
      unreadCount
    });
  }
}));
