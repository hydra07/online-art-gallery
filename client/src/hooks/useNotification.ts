'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInfiniteQuery, useQuery, useMutation } from '@tanstack/react-query';
import notificationService, { Notification } from '@/service/notification';
import useAuthClient from '@/hooks/useAuth-client';
import { useNotificationStore, NOTIFICATION_EVENTS, notificationEmitter } from '@/store/notificationStore';

export default function useNotification() {
  const { user } = useAuthClient();
  const userRef = useRef(user);
  const queryClient = useQueryClient();
  
  // Get state and actions from Zustand store
  const { 
    socketStatus: status, 
    initializeSocket,
    notifications: storeNotifications,
    unreadCount: storeUnreadCount,
    isNotificationPanelOpen,
    setNotificationPanelOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setNotifications,
    setUnreadCount,
    updateQueryData
  } = useNotificationStore();

  useEffect(() => {
    userRef.current = user;
    
    // Initialize socket when user is available
    if (user?.id) {
      initializeSocket(user.id);
    }
  }, [user, initializeSocket]);

  const notificationsQueryKey = useMemo(() => ['notifications'], []);
  const unreadCountQueryKey = useMemo(() => ['notifications', 'unread'], []);

  const isEnabled = Boolean(userRef.current?.id);
  const fetchedOnMount = useRef(false);

  // Force a one-time fetch of unread count on component mount
  useEffect(() => {
    if (isEnabled && !fetchedOnMount.current) {
      fetchedOnMount.current = true;
      // Directly fetch unread count and update cache
      notificationService.fetchUnreadCount().then(count => {
        queryClient.setQueryData(unreadCountQueryKey, count);
        setUnreadCount(count); // Update Zustand store
      }).catch(error => {
        console.error('Failed to fetch unread count:', error);
      });
    }
  }, [isEnabled, queryClient, unreadCountQueryKey, setUnreadCount]);

  // Listen for real-time notifications from socket (via event emitter)
  useEffect(() => {
    if (!isEnabled) return;

    // Handler for new notifications coming from socket
    const handleNewNotification = (newNotification: Notification) => {
      
      // Temporarily pause any ongoing refetches to reduce UI flicker
      queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      queryClient.cancelQueries({ queryKey: unreadCountQueryKey });
      
      // Update the unread count in React Query
      queryClient.setQueryData(unreadCountQueryKey, (old: number = 0) => old + 1);
      
      // Update the notifications list in React Query
      queryClient.setQueryData(notificationsQueryKey, (old: any) => {
        if (!old || !old.pages || !old.pages.length) {
          return {
            pages: [{ 
              notifications: [newNotification], 
              total: 1, 
              nextPage: undefined 
            }],
            pageParams: [0]
          };
        }
        
        // Check if this notification already exists in cache
        const notificationExists = old.pages.some((page: any) => 
          page.notifications.some((n: Notification) => n._id === newNotification._id)
        );
        
        // Don't add duplicates
        if (notificationExists) return old;
        
        // Create a new first page with the notification at the top
        const updatedPages = [...old.pages];
        updatedPages[0] = {
          ...updatedPages[0],
          notifications: [newNotification, ...updatedPages[0].notifications],
          total: updatedPages[0].total + 1
        };
        
        return {
          ...old,
          pages: updatedPages
        };
      });
    };
    
    // Subscribe to new notification events
    const unsubscribe = notificationEmitter.on(
      NOTIFICATION_EVENTS.NEW_NOTIFICATION, 
      handleNewNotification
    );
    
    return () => {
      // Clean up event listener
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [isEnabled, queryClient, notificationsQueryKey, unreadCountQueryKey]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: queryStatus,
    refetch,
  } = useInfiniteQuery({
    queryKey: notificationsQueryKey,
    queryFn: notificationService.fetchNotifications,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // Modified query to use cached data from our manual fetch
  const { data: unreadCount = 0 } = useQuery({
    queryKey: unreadCountQueryKey,
    queryFn: notificationService.fetchUnreadCount,
    enabled: false, // Disable automatic fetching completely
    staleTime: Infinity,
    initialData: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Memoize notifications to prevent unnecessary re-renders
  const notifications = useMemo(() => 
    data?.pages.flatMap(page => page?.notifications || []) || [], 
    [data]
  );

  // Update the Zustand store whenever the notifications data changes
  useEffect(() => {
    if (data) {
      // Type cast data to match NotificationQueryData type exactly
      const safeData = {
        pages: data.pages.map(page => page || { notifications: [], total: 0 }),
        pageParams: data.pageParams as number[]
      };
      updateQueryData(safeData);
    }
  }, [data, updateQueryData]);

  // Mark as read mutation adapted to use Zustand store
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (id?: string) => {
      // Cancel any outgoing refetches
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationsQueryKey }),
        queryClient.cancelQueries({ queryKey: unreadCountQueryKey }),
      ]);

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(notificationsQueryKey);
      
      if (id) {
        // Mark a single notification as read
        queryClient.setQueryData(notificationsQueryKey, (old: any) => {
          if (!old?.pages) return old;
          
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              notifications: page.notifications.map((notification: Notification) =>
                notification._id === id ? { ...notification, isRead: true } : notification
              ),
            })),
          };
        });
        
        // Update Zustand store
        markAsRead(id);
        
        // Decrement unread count by 1
        queryClient.setQueryData(unreadCountQueryKey, (old: number = 0) => Math.max(0, old - 1));
      } else {
        // Mark all notifications as read
        queryClient.setQueryData(notificationsQueryKey, (old: any) => {
          if (!old?.pages) return old;
          
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              notifications: page.notifications.map((notification: Notification) => 
                ({ ...notification, isRead: true })
              ),
            })),
          };
        });
        
        // Update Zustand store
        markAllAsRead();
        
        // Reset unread count to 0
        queryClient.setQueryData(unreadCountQueryKey, 0);
      }
      
      return { previousData };
    },
    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(notificationsQueryKey, context.previousData);
        // Refetch to ensure consistency
        queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is correct
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  // Delete notification mutation adapted to use Zustand store
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      const previousData = queryClient.getQueryData(notificationsQueryKey);
      const notificationToDelete = notifications.find(n => n._id === id);
      const wasUnread = notificationToDelete && !notificationToDelete.isRead;

      queryClient.setQueryData(notificationsQueryKey, (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          notifications: page.notifications.filter((notification: Notification) => notification._id !== id),
        })),
      }));

      // Update Zustand store
      deleteNotification(id);

      if (wasUnread) {
        queryClient.setQueryData(unreadCountQueryKey, (old: number = 0) => Math.max(0, old - 1));
      }
      return { previousData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  const handleMarkAllAsRead = useCallback(() => markAsReadMutation.mutate(undefined), [markAsReadMutation]);
  const handleMarkAsRead = useCallback((id: string) => markAsReadMutation.mutate(id), [markAsReadMutation]);
  const handleDeleteNotification = useCallback((id: string) => deleteNotificationMutation.mutate(id), [deleteNotificationMutation]);

  return {
    status,
    notifications,
    unreadCount,
    isLoading: queryStatus === 'pending',
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    handleMarkAllAsRead,
    handleMarkAsRead,
    handleDeleteNotification,
    setNotificationPanelOpen,
  };
}