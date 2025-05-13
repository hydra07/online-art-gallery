'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bell, Calendar, Palette, Info, AlertTriangle, ExternalLink, Eye } from 'lucide-react';
import useNotificationToaster from '@/hooks/useNotificationToaster';
import { NotificationToast, useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './button';
import { Badge } from './badge';

export function NotificationToaster() {
  const { notifications, removeNotification } = useNotificationToaster();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 min-w-[320px] max-w-[450px]">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification._id}
            notification={notification}
            removeNotification={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Extract notification item to separate component to properly use useEffect
function NotificationItem({ 
  notification, 
  removeNotification 
}: { 
  notification: NotificationToast, 
  removeNotification: (id: string) => void 
}) {
  const [expanded, setExpanded] = useState(false);
    // Set auto-dismiss timer
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(notification._id);
      // Also update the Zustand store to ensure synchronization
      useNotificationStore.getState().removeToast(notification._id);
    }, notification.showDuration);
    
    return () => clearTimeout(timer);
  }, [notification._id, notification.showDuration, removeNotification]);

  // Get the appropriate icon based on notification type
  let Icon = Info;
  let iconColor = "text-blue-500";
  let bgColor = "bg-blue-50 dark:bg-blue-950/30";
  let borderColor = "border-blue-200 dark:border-blue-800";

  switch (notification.refType) {
    case 'artwork':
      Icon = Palette;
      iconColor = "text-green-500";
      bgColor = "bg-green-50 dark:bg-green-950/30";
      borderColor = "border-green-200 dark:border-green-800";
      break;
    case 'event':
      Icon = Calendar;
      iconColor = "text-violet-500";
      bgColor = "bg-violet-50 dark:bg-violet-950/30";
      borderColor = "border-violet-200 dark:border-violet-800";
      break;
    case 'maintenance':
      Icon = AlertTriangle;
      iconColor = "text-amber-500";
      bgColor = "bg-amber-50 dark:bg-amber-950/30";
      borderColor = "border-amber-200 dark:border-amber-800";
      break;
    default:
      Icon = Bell;
      iconColor = "text-blue-500";
      bgColor = "bg-blue-50 dark:bg-blue-950/30";
      borderColor = "border-blue-200 dark:border-blue-800";
  }

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { 
    addSuffix: true 
  });

  return (
    <motion.div
      key={notification._id}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "bg-background border rounded-lg shadow-lg relative overflow-hidden",
        notification.variant === 'success' ? "border-green-200 dark:border-green-800" :
        notification.variant === 'warning' ? "border-amber-200 dark:border-amber-800" :
        notification.variant === 'info' ? "border-blue-200 dark:border-blue-800" : 
        "border-red-200 dark:border-red-800", // Default to red for other notifications
        expanded ? "p-5" : "p-4",
        "transition-all duration-200 ease-in-out"
      )}
    >
      {/* New notification indicator */}
      {notification.isNew && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full" 
        />
      )}

      {/* Progress bar for auto-dismiss */}
      <motion.div 
        className={cn(
          "absolute bottom-0 left-0 h-1",
          notification.variant === 'success' ? "bg-green-500" :
          notification.variant === 'warning' ? "bg-amber-500" :
          notification.variant === 'info' ? "bg-blue-500" : "bg-red-500" // Changed default to red
        )}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: notification.showDuration / 1000, ease: "linear" }}
      />
      
      {/* Close button */}
      <button
        onClick={() => removeNotification(notification._id)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground rounded-full p-1 hover:bg-muted"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
      
      {/* Header */}
      <div className="flex items-start gap-3 mb-2">
        <div className={cn(
          "p-2 rounded-full flex items-center justify-center transition-colors",
          bgColor,
          iconColor
        )}>
          <Icon size={18} />
        </div>
        <div className="flex-1 pr-6">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
            
            {notification.isSystem && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">System</Badge>
            )}
            
            <Badge 
              variant="secondary" 
              className={cn(
                "text-[10px] px-1 py-0 h-4 capitalize",
                notification.variant === 'success' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                notification.variant === 'warning' ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                notification.variant === 'info' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : ""
              )}
            >
              {notification.refType}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Content */}
      {notification.content && (
        <div 
          className={cn(
            "text-sm text-muted-foreground leading-relaxed pl-10",
            "transition-all duration-200 ease-in-out",
            expanded ? "line-clamp-none mb-4" : "line-clamp-2 mb-3"
          )}
          onClick={() => setExpanded(!expanded)}
        >
          {notification.content}
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-between items-center pl-10">
        {notification.content && notification.content.length > 80 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Show more"}
            <Eye size={12} className="ml-1" />
          </Button>
        )}
        
        <div className="flex ml-auto">
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "h-8",
              notification.variant === 'success' ? "text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20" :
              notification.variant === 'warning' ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20" : 
              notification.variant === 'info' ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20" : ""
            )}            onClick={() => {
              if (notification.action) {
                notification.action();
              }
              removeNotification(notification._id);
              // Also update the Zustand store
              useNotificationStore.getState().markAsRead(notification._id);
            }}
          >
            View details
            <ExternalLink size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
