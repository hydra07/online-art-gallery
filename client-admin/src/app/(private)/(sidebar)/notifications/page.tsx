"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationForm } from "./notification-form";
import { useToast } from "@/hooks/use-toast";
import { 
  PlusCircle, Bell, Calendar, CheckCircle, RefreshCw, 
  Users, Eye, ChevronLeft, ChevronRight, AlertTriangle, 
  Clock, Trash2, Globe, Info, User, ArrowUpDown, Search,
  FilterX, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationService from "@/service/notification-service";
import { Notification } from "@/types/notification";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import debounce from "lodash/debounce";

type SortOption = "newest" | "oldest" | "mostRead" | "leastRead";
type FilterOption = "all" | "system" | "event" | "maintenance" | "promotion";

export default function Notifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  
  // Search, sort and filter states
  const [searchInput, setSearchInput] = useState(""); // Immediate input value
  const [searchQuery, setSearchQuery] = useState(""); // Debounced search query
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Create debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // Update search query when input changes
  useEffect(() => {
    debouncedSearch(searchInput);
    
    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInput, debouncedSearch]);

  // Reset page when search/filter changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery, filterOption, sortOption]);

  // Fetch notifications with React Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-notifications', page],
    queryFn: () => notificationService.getAdminNotifications(page * pageSize, pageSize),
  });

  // Process notifications with search, sort and filter
  const processedNotifications = data?.data.notifications
    .filter(notification => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          notification.title.toLowerCase().includes(query) ||
          notification.content.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(notification => {
      // Apply type filter
      if (filterOption === "all") return true;
      return notification.refType === filterOption;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "mostRead":
          return b.stats.readPercentage - a.stats.readPercentage;
        case "leastRead":
          return a.stats.readPercentage - b.stats.readPercentage;
        default:
          return 0;
      }
    });

  // Create notification mutation
  const createMutation = useMutation({
    mutationFn: (notificationData: any) => {
      return notificationService.createNotification({
        title: notificationData.title,
        content: notificationData.message,
        roles: getRecipientRoles(notificationData.recipients),
        isSystem: notificationData.type === "system",
        refType: notificationData.type || "general",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification created successfully",
        className: "bg-green-500 text-white border-green-600",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error("Error creating notification:", error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        className: "bg-red-500 text-white border-red-600",
      });
    }
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification deleted successfully",
        className: "bg-green-500 text-white border-green-600",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      setDeleteConfirmOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        className: "bg-red-500 text-white border-red-600",
      });
    }
  });

  // Helper to convert UI recipient format to API roles format
  const getRecipientRoles = (recipients: string): string[] => {
    switch (recipients) {
      case "all_users":
        return ["user", "artist", "admin"];
      case "subscribers":
        return ["user"];
      case "artists":
        return ["artist"];
      default:
        return ["user", "artist"];
    }
  };

  // Helper to get a readable recipient string
  const getRecipientLabel = (notification: Notification): { icon: JSX.Element, label: string } => {
    const totalRecipients = notification.stats.totalRecipients;
    
    if (notification.sampleRecipients.length === 0) {
      return { icon: <Globe className="w-4 h-4" />, label: "All users" };
    }

    // Check sample recipients to determine the type
    const hasAdmin = notification.sampleRecipients.some(r => r.userId.includes("admin"));
    const hasArtist = notification.sampleRecipients.some(r => r.userId.includes("artist"));
    const hasUser = notification.sampleRecipients.some(r => r.userId.includes("user"));

    if (hasAdmin && hasArtist && hasUser) {
      return { icon: <Globe className="w-4 h-4" />, label: "All users" };
    } else if (hasArtist && !hasAdmin && !hasUser) {
      return { icon: <CheckCircle className="w-4 h-4" />, label: "Artists only" };
    } else if (hasUser && !hasAdmin && !hasArtist) {
      return { icon: <User className="w-4 h-4" />, label: "Users only" };
    } else {
      return { icon: <Users className="w-4 h-4" />, label: `${totalRecipients} recipients` };
    }
  };

  const handleCreateOrUpdateNotification = (formData: any) => {
    createMutation.mutate(formData);
  };

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (notificationToDelete) {
      deleteMutation.mutate(notificationToDelete);
    }
  };

  const getStatusColor = (refType: string) => {
    switch (refType) {
      case "event":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800";
      case "system":
      case "maintenance":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";
      case "promotion":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getTypeIcon = (refType: string) => {
    switch (refType) {
      case "event":
        return <Calendar className="w-4 h-4" />;
      case "system":
        return <Info className="w-4 h-4" />;
      case "maintenance":
        return <AlertTriangle className="w-4 h-4" />;
      case "promotion":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setFilterOption("all");
    setSortOption("newest");
  };

  const totalPages = data?.data.total ? Math.ceil(data.data.total / pageSize) : 0;

  // Pagination component
  const PaginationControls = () => (
    totalPages > 1 ? (
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 my-4"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
            const pageNumber = page < 2 ? i : page - 2 + i;
            if (pageNumber >= totalPages) return null;
            
            return (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setPage(pageNumber)}
                disabled={pageNumber === page}
              >
                {pageNumber + 1}
              </Button>
            );
          })}
          {totalPages > 5 && page < totalPages - 3 && (
            <>
              <span className="mx-1">...</span>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setPage(totalPages - 1)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages - 1}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>
    ) : null
  );

  // Show skeletons during loading
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-48 rounded" />
            <Skeleton className="h-4 w-64 mt-2 rounded" />
          </div>
          <Skeleton className="h-10 w-40 rounded" />
        </div>
        
        <div className="flex items-center mb-6 space-x-4">
          <Skeleton className="h-10 w-full max-w-sm rounded" />
          <Skeleton className="h-10 w-32 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
        </div>
        
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0, 0.5, 1], 
                y: 0,
                transition: { 
                  duration: 0.5, 
                  delay: i * 0.1,
                  opacity: { duration: 1 }
                }
              }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm overflow-hidden"
            >
              <div className="flex justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-6 w-48 rounded" />
                      <div className="flex gap-2 mt-1">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-32 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-28 rounded" />
                      <Skeleton className="h-4 w-32 rounded" />
                    </div>
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Notifications</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Failed to load notification data. Please try again.</p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and send notifications to your users</p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New Notification
        </Button>
      </div>

      <NotificationForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingNotification(null);
        }}
        onSubmit={handleCreateOrUpdateNotification}
        initialData={editingNotification}
        isPending={createMutation.isPending}
      />

      {/* Search, filter, and sort controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search notifications..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 w-full"
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full aspect-square text-gray-400"
              onClick={() => {
                setSearchInput("");
                setSearchQuery(""); // Clear the debounced value immediately too
              }}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="gap-1 w-[140px]">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-500 mr-1" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="mostRead">Most read</SelectItem>
              <SelectItem value="leastRead">Least read</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant={filterOption !== "all" ? "default" : "outline"} 
                size="icon" 
                className={filterOption !== "all" ? "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <h3 className="font-medium mb-2 dark:text-gray-200">Filter by type</h3>
              <div className="space-y-1">
                <Button
                  variant={filterOption === "all" ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start mb-1"
                  onClick={() => {
                    setFilterOption("all");
                    setIsFilterOpen(false);
                  }}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  All types
                </Button>
                <Button
                  variant={filterOption === "system" ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterOption("system");
                    setIsFilterOpen(false);
                  }}
                >
                  <Info className="mr-2 h-4 w-4 text-amber-500 dark:text-amber-400" />
                  System
                </Button>
                <Button
                  variant={filterOption === "event" ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterOption("event");
                    setIsFilterOpen(false);
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                  Event
                </Button>
                <Button
                  variant={filterOption === "maintenance" ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterOption("maintenance");
                    setIsFilterOpen(false);
                  }}
                >
                  <AlertTriangle className="mr-2 h-4 w-4 text-orange-500 dark:text-orange-400" />
                  Maintenance
                </Button>
                <Button
                  variant={filterOption === "promotion" ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterOption("promotion");
                    setIsFilterOpen(false);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 dark:text-green-400" />
                  Promotion
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {(searchQuery || filterOption !== "all" || sortOption !== "newest") && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={resetFilters}
              className="border border-gray-200 dark:border-gray-700"
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {!data?.data.notifications.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10 border rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700"
        >
          <Bell className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No notifications found</h3>
          <p className="max-w-xs mx-auto mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create your first notification to send to your users.
          </p>
          <Button 
            onClick={() => setIsFormOpen(true)}
            variant="outline" 
            className="mt-4 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary/90 hover:border-primary"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Notification
          </Button>
        </motion.div>
      ) : (
        <>
          {processedNotifications?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700"
            >
              <Search className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {searchQuery ? "No results found for: " : "No matching notifications"}
                {searchQuery && <span className="font-semibold italic">"{searchQuery}"</span>}
              </h3>
              <p className="max-w-sm mx-auto mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              <Button 
                onClick={resetFilters}
                variant="outline" 
                className="mt-3"
              >
                <FilterX className="mr-2 h-4 w-4" />
                Reset filters
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Pagination controls for mobile - above the list */}
              <div className="block md:hidden">
                <PaginationControls />
              </div>

              <div className="space-y-4">
                {searchQuery && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-500 dark:text-gray-400 mb-2"
                  >
                    Showing results for: <span className="font-medium">"{searchQuery}"</span>
                  </motion.p>
                )}
                <AnimatePresence>
                  {processedNotifications?.map((notification, idx) => {
                    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
                    const { icon: recipientIcon, label: recipientLabel } = getRecipientLabel(notification);
                    
                    return (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4">
                          {/* Header with title, badge and time */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                {getTypeIcon(notification.refType)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg leading-none dark:text-white">
                                  {notification.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    className={cn(
                                      "rounded-full px-2 py-0.5 text-xs font-medium border",
                                      getStatusColor(notification.refType)
                                    )}
                                  >
                                    {notification.refType}
                                  </Badge>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {timeAgo}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(notification._id)}
                              className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Content */}
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed px-1">
                            {notification.content}
                          </p>
                          
                          {/* Footer with stats */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                {recipientIcon}
                                <span>{recipientLabel}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>Read: {notification.stats.readCount} ({Math.round(notification.stats.readPercentage)}%)</span>
                              </div>
                            </div>
                            
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              ID: {notification._id.substring(notification._id.length - 6)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Pagination controls for desktop - below the list */}
              <div className="hidden md:block">
                <PaginationControls />
              </div>
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="mx-auto bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-3"
            >
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </motion.div>
            <DialogTitle className="text-center text-xl dark:text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-center dark:text-gray-400">
              Are you sure you want to delete this notification? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-center gap-3 sm:gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="w-full sm:w-auto"
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Notification"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

