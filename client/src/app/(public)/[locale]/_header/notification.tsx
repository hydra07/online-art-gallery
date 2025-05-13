'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import useNotification from '@/hooks/useNotification';
import { Notification as NotificationType } from '@/service/notification';
import { useNotificationStore } from '@/store/notificationStore';
import { formatCreatedAt } from '@/utils/date';
import { 
  Bell, BellIcon, BellOff, Check, Trash2, CheckCheck, Loader2,
  Calendar as CalendarDays, AlertTriangle, Paintbrush as PaintBrush 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import HeaderButton from '@/app/(public)/[locale]/_header/components/header-button';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { createPortal } from 'react-dom';

// Define animation variants with bounce
const counterVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { 
    scale: [0.5, 1.2, 1], 
    opacity: 1,
    transition: { type: "spring", bounce: 0.5, duration: 0.3 }
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -5,
    transition: { duration: 0.1 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.1 }
  }
};

export default function Notification() {
  const t = useTranslations('common');
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const [dropdownStyles, setDropdownStyles] = useState({
    top: 0,
    right: 0,
    left: 0
  });
  
  // Get data from the hook (API-related functionality)
  const {
    notifications,
    unreadCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    handleMarkAllAsRead,
    handleMarkAsRead,
    handleDeleteNotification,
  } = useNotification();
  
  // Get UI state directly from Zustand store
  const { 
    setNotificationPanelOpen 
  } = useNotificationStore();

  const displayUnreadCount = typeof unreadCount === 'number' ? unreadCount : 0;
  const hasUnreadNotifications = displayUnreadCount > 0;
  
  const showDropdown = isPinned || isHovering;
  
  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (isPinned && dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsPinned(false);
      }
    };
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPinned) {
        setIsPinned(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isPinned]);
  
  useEffect(() => {
    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const buttonCenter = rect.left + rect.width / 2;
      const dropdownWidth = 350;
      const leftPosition = buttonCenter - dropdownWidth / 2;
      const rightEdge = leftPosition + dropdownWidth;
      const adjustedLeft = rightEdge > window.innerWidth ? window.innerWidth - dropdownWidth - 10 : Math.max(10, leftPosition);
      setDropdownStyles({
        top: rect.bottom + 5,
        left: adjustedLeft,
        right: 0
      });
    };
    if (showDropdown) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [showDropdown]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotificationPanelOpen(showDropdown);
    }, 200);
    return () => clearTimeout(timer);
  }, [showDropdown, setNotificationPanelOpen]);
  
  const memoizedNotifications = useMemo(() => {
    return notifications.map(item => ({
      ...item,
      createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt)
    }));
  }, [notifications]);
  
  const { ref: loadingRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: '400px',
    delay: 100,
  });
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const buttonCenter = rect.left + rect.width / 2;
      const dropdownWidth = 350;
      const leftPosition = buttonCenter - dropdownWidth / 2;
      const rightEdge = leftPosition + dropdownWidth;
      const adjustedLeft = rightEdge > window.innerWidth ? window.innerWidth - dropdownWidth - 10 : Math.max(10, leftPosition);
      setDropdownStyles({
        top: rect.bottom + 5,
        left: adjustedLeft,
        right: 0
      });
    }
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);
  
  const handleClick = useCallback(() => {
    setIsPinned(prev => !prev);
  }, []);

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <HeaderButton
        className={cn(
          "relative backdrop-blur-md bg-opacity-40",
          isPinned && "bg-muted dark:bg-muted/50"
        )}
        aria-label={t('notifications')}
        onClick={handleClick}
        ref={triggerRef}
      >
        <BellIcon className="h-6 w-6 text-black dark:text-gray-200" />
        <AnimatePresence>
          {hasUnreadNotifications && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={counterVariants}
              className="absolute -top-1 -right-1"
              key="badge-animation"
            >
              <Badge 
                variant="destructive" 
                className="flex items-center justify-center px-2 py-1 min-w-5 h-5 text-xs rounded-full bg-[#ff4444] text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              >
                {displayUnreadCount > 99 ? '99+' : displayUnreadCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </HeaderButton>
      
      {mounted && showDropdown && createPortal(
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={dropdownVariants}
          className="fixed z-50 shadow-lg"
          style={{ 
            top: `${dropdownStyles.top}px`, 
            left: `${dropdownStyles.left}px`,
            width: '350px',
            maxWidth: 'calc(100vw - 24px)'
          }}
          ref={dropdownRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="bg-background rounded-md border border-border overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 sticky top-0 z-10 border-b border-border">
              <h2 className="text-base font-semibold">
                {t('notifications')}
              </h2>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => {
                  handleMarkAllAsRead();
                  // Also update the Zustand store
                  useNotificationStore.getState().markAllAsRead();
                }}
                disabled={notifications.length === 0 || notifications.every(n => n.isRead)}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                <span className="text-xs">{t('markAllAsRead')}</span>
              </Button>
            </div>
            
            <ScrollArea className="h-[400px] max-h-[calc(100vh-150px)] w-full">
              <MemorizedNotificationList 
                notifications={memoizedNotifications}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
                loadingRef={loadingRef}
                onLoadMore={fetchNextPage}
              />
            </ScrollArea>
          </div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}

// Optimized notification list with React.memo
const MemorizedNotificationList = React.memo(NotificationList);

// Rest of the component remains similar, with NotificationList, NotificationItem, and NotificationItemSkeleton
function NotificationList({
  notifications,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onMarkAsRead,
  onDelete,
  loadingRef,
  onLoadMore
}: {
  notifications: NotificationType[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  loadingRef: any;
  onLoadMore: () => void;
}) {
  const t = useTranslations('common');
  
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);
  
  const EmptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground p-4">
      <BellOff className="h-12 w-12 mb-3 opacity-20" />
      <p className="text-center">{t('noNotifications')}</p>
      <p className="text-xs text-center mt-1 max-w-[80%] text-muted-foreground/70">
        {t('notificationsWillAppearHere')}
      </p>
    </div>
  ), [t]);
  
  const SkeletonLoader = useMemo(() => (
    <div className="p-2 space-y-2">
      {[...Array(4)].map((_, index) => (
        <NotificationItemSkeleton key={index} />
      ))}
    </div>
  ), []);
  
  if (isLoading && notifications.length === 0) {
    return SkeletonLoader;
  }
  
  if (notifications.length === 0) {
    return EmptyState;
  }
  
  return (
    <div className="p-0">
      {notifications.map((item) => (
        <MemorizedNotificationItem
          key={item._id}
          notification={item}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
      
      <div 
        ref={loadingRef} 
        className="py-2 flex justify-center"
      >
        {isFetchingNextPage ? (
          <div className="py-2 w-full px-2">
            <NotificationItemSkeleton />
            <NotificationItemSkeleton />
          </div>
        ) : hasNextPage ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLoadMore} 
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t('loadMore')}
          </Button>
        ) : (
          <div className="text-center py-2 text-xs text-muted-foreground">
            {notifications.length > 0 ? t('noMoreNotifications') : ''}
          </div>
        )}
      </div>
    </div>
  );
}

// Memoized notification item with improved comparison function
const MemorizedNotificationItem = React.memo(NotificationItem, (prev, next) => {
  return prev.notification._id === next.notification._id && 
         prev.notification.isRead === next.notification.isRead &&
         prev.notification.title === next.notification.title &&
         prev.notification.content === next.notification.content;
});

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete
}: {
  notification: NotificationType;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { markAsRead } = useNotificationStore();
  
  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(notification._id);
      // Also update the Zustand store
      useNotificationStore.getState().deleteNotification(notification._id);
    }, 300);
  }, [notification._id, onDelete]);
  
  const handleMarkAsRead = useCallback(() => {
    onMarkAsRead(notification._id);
    markAsRead(notification._id);
  }, [notification._id, onMarkAsRead, markAsRead]);

  const handleExpandClick = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);
  
  // Get icon based on notification type with smaller size
  const getNotificationIcon = () => {
    switch (notification.refType) {
      case 'artwork':
        return (
          <div className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 h-7 w-7 rounded-full flex items-center justify-center">
            <PaintBrush className="h-3.5 w-3.5" />
          </div>
        );
      case 'event':
        return (
          <div className="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 h-7 w-7 rounded-full flex items-center justify-center">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>
        );
      case 'maintenance':
        return (
          <div className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 h-7 w-7 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        );
      default:
        return (
          <div className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center",
            notification.isSystem 
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          )}>
            <Bell className="h-3.5 w-3.5" />
          </div>
        );
    }
  };
  
  const hasLongTitle = notification.title && notification.title.length > 35;
  const hasContent = notification.content && notification.content?.trim().length > 0;
  const shouldShowExpandButton = (hasLongTitle && notification.title.length > 50) || 
                                (hasContent && notification.content && notification.content.length > 120);
  
  return (
    <div
      className={cn(
        "relative py-2 px-2.5 border-b border-border transition-all group",
        !notification.isRead && "bg-primary/5 dark:bg-primary/10",
        isHovered && "bg-muted/50",
        isDeleting && "opacity-0 h-0 p-0 overflow-hidden"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!notification.isRead && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      )}
      
      <div className="flex items-start gap-2">
        {/* Left: Icon */}
        <div className="flex-shrink-0">
          {getNotificationIcon()}
        </div>
        
        {/* Middle: Content */}
        <div className="flex-grow min-w-0">
          {/* Title */}
          <h3 
            className={cn(
              "text-xs font-medium leading-tight mb-1",
              isExpanded ? "" : (hasLongTitle ? "line-clamp-2" : "line-clamp-1"),
              !notification.isRead && "font-semibold"
            )}
            onClick={handleExpandClick}
          >
            {notification.title || 'No title'}
          </h3>
          
          {/* Content */}
          {hasContent && (
            <div
              className={cn(
                "text-[11px] text-muted-foreground cursor-pointer leading-relaxed mb-1",
                isExpanded ? "" : "line-clamp-3"
              )}
              onClick={handleExpandClick}
            >
              {notification.content}
            </div>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-wrap items-center text-[9px] text-muted-foreground gap-1">
              <span className="opacity-80">
                {formatCreatedAt(notification.createdAt, locale as 'vi' | 'en')}
              </span>
              
              {!notification.isRead && (
                <Badge variant="outline" className="px-1 py-0 h-3 text-[8px] font-normal border-primary/30 text-primary">
                  New
                </Badge>
              )}
              
              {notification.refType && (
                <Badge 
                  variant="outline" 
                  className="px-1 py-0 h-3 text-[8px] font-normal border-muted-foreground/30 text-muted-foreground"
                >
                  {notification.refType}
                </Badge>
              )}
            </div>
            
            {/* Show more/less button */}
            {shouldShowExpandButton && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleExpandClick}
                className="h-4 text-[8px] px-1 py-0 opacity-70 hover:opacity-100"
              >
                {isExpanded ? "Less" : "More"}
              </Button>
            )}
          </div>
        </div>
        
        {/* Right: Action Buttons Column */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 ml-1">
          {!notification.isRead && (
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5 hover:bg-primary/10 hover:text-primary"
              onClick={handleMarkAsRead}
              title="Mark as read"
            >
              <Check className="h-2.5 w-2.5" />
            </Button>
          )}
          
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            title="Delete notification"
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotificationItemSkeleton() {
  return (
    <div className="py-2 px-2.5 border-b border-border">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">
          <div className="h-7 w-7 rounded-full bg-muted/60 animate-pulse" />
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="h-3 w-3/4 bg-muted/60 animate-pulse rounded mb-1.5" />
          <div className="space-y-1 mb-1.5">
            <div className="h-2 w-5/6 bg-muted/60 animate-pulse rounded" />
            <div className="h-2 w-4/6 bg-muted/60 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-1/4 bg-muted/60 animate-pulse rounded" />
          </div>
        </div>
        
        <div className="w-5 flex-shrink-0">
          <div className="h-5 w-5 rounded bg-muted/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}