"use client";
import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Search,
  RefreshCw,
  FileText,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Artwork } from "@/types/artwork";
import artworkService from "@/service/artwork-service";
import { ArtworkLoadingSkeleton, TableRowSkeleton } from "./loading-skeleton";
import { getArtworkColumns } from "./table-columns";
import { ArtworkDetailsDialog, ModerationDialog } from "./artwork-dialogs";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
export default function ArtworkPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  
  // State
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const [moderationReason, setModerationReason] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Table state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Debounced column filter handler
  const debouncedSetColumnFilter = useCallback(
    debounce((columnId: string, value: string) => {
      setColumnFilters((prev) => {
        const newFilters = prev.filter((filter) => filter.id !== columnId);
        if (value) {
          newFilters.push({ id: columnId, value });
        }
        return newFilters;
      });
    }, 300),
    []
  );

  // Responsive column visibility
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // Progressive disclosure of columns based on screen width
      if (width < 640) {
        // Mobile
        setColumnVisibility({
          index: true,
          title: true,
          moderationStatus: true,
          actions: true,
          // Hide everything else on small screens
          preview: false,
          "artistId.name": false,
          status: false,
          moderatedBy: false,
          price: false,
          createdAt: false,
        });
      } else if (width < 768) {
        // Small tablet
        setColumnVisibility({
          index: true,
          preview: true,
          title: true,
          "artistId.name": true,
          moderationStatus: true,
          createdAt: false,
          actions: true,
          // Hide less important columns
          status: false,
          moderatedBy: false,
          price: false,
        });
      } else if (width < 1024) {
        // Large tablet
        setColumnVisibility({
          index: true,
          preview: true,
          title: true,
          "artistId.name": true,
          moderationStatus: true,
          createdAt: true,
          actions: true,
          // Hide only the least important
          status: false,
          moderatedBy: false,
          price: false,
        });
      } else if (width < 1280) {
        // Small desktop
        setColumnVisibility({
          index: true,
          preview: true,
          title: true,
          "artistId.name": true,
          status: false,
          moderationStatus: true,
          moderatedBy: true,
          price: false,
          createdAt: true,
          actions: true,
        });
      } else {
        // Large desktop - show all
        setColumnVisibility({
          index: true,
          preview: true,
          title: true,
          "artistId.name": true,
          status: true,
          moderationStatus: true,
          moderatedBy: true,
          price: true,
          createdAt: true,
          actions: true,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch artworks with pagination and caching
  const {
    data,
    isLoading,
    isFetching,
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      "artworks",
      pagination.pageIndex,
      pagination.pageSize,
      filterStatus,
      sorting,
    ],
    queryFn: () =>
      artworkService.getArtworks({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        status: filterStatus,
        sortBy: sorting.length > 0 ? sorting[0].id : undefined,
        sortOrder: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
      }),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

  // Prefetch next page for smoother pagination
  useEffect(() => {
    if (!isPlaceholderData && data?.data?.total && pagination.pageIndex < Math.ceil(data.data.total / pagination.pageSize) - 1) {
      const nextPage = pagination.pageIndex + 1;
      queryClient.prefetchQuery({
        queryKey: [
          "artworks", 
          nextPage,
          pagination.pageSize,
          filterStatus,
          sorting,
        ],
        queryFn: () =>
          artworkService.getArtworks({
            skip: nextPage * pagination.pageSize,
            take: pagination.pageSize,
            status: filterStatus,
            sortBy: sorting.length > 0 ? sorting[0].id : undefined,
            sortOrder: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
          }),
        staleTime: 1 * 60 * 1000,
      });
    }
  }, [data, isPlaceholderData, pagination, queryClient, filterStatus, sorting]);

  // Handle refresh with animation
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      await refetch();
      toast({
        title: "Refreshed",
        description: "Artwork data has been updated",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not update artwork data. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Add a minimum delay for the animation
      setTimeout(() => setIsRefreshing(false), 800);
    }
  }, [refetch, toast]);

  // Mutation for reviewing artwork
  const { mutate, isPending: isMutationPending } = useMutation({
    mutationFn: artworkService.reviewArtwork,
  });

  // Extract data from query results
  const artworks = useMemo(() => data?.data?.artworks || [], [data]);
  const totalItems = useMemo(() => data?.data?.total || 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalItems / pagination.pageSize),
    [totalItems, pagination.pageSize]
  );

  // Handle artwork moderation
  const handleModerateArtwork = useCallback((status: "approved" | "rejected" | "suspended") => {
    if (!selectedArtwork) return;
    
    // Validate requirements for moderation actions
    if ((status === "rejected" || status === "suspended") && !moderationReason.trim()) {
      toast({
        title: "Reason Required",
        description: `Please provide a reason for ${status === "rejected" ? "rejecting" : "suspending"} this artwork.`,
        variant: "destructive",
      });
      return;
    }
    
    // Optimistic update to UI for immediate feedback
    queryClient.setQueryData(
      ["artworks", pagination.pageIndex, pagination.pageSize, filterStatus, sorting],
      (oldData: any) => {
        if (!oldData?.data?.artworks) return oldData;
        
        const updatedArtworks = oldData.data.artworks.map((artwork: Artwork) =>
          artwork._id === selectedArtwork._id
            ? {
                ...artwork,
                moderationStatus: status,
                moderationReason: status === "rejected" || status === "suspended" ? moderationReason : "",
                _optimistic: true,
              }
            : artwork
        );
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            artworks: updatedArtworks,
          },
        };
      }
    );
    
    mutate(
      {
        artworkId: selectedArtwork._id,
        moderationStatus: status,
        moderationReason: status === "rejected" || status === "suspended" ? moderationReason : undefined,
      },
      {
        onSuccess: () => {
          // Show success toast
          toast({
            title: "Success",
            description: `Artwork has been ${status} successfully`,
            variant: "success",
          });
          
          setShowModerationDialog(false);
          setSelectedArtwork(null);
          setModerationReason("");
          
          // Invalidate and refetch to ensure data consistency
          queryClient.invalidateQueries({ 
            queryKey: ["artworks"],
            refetchType: 'all',
          });
        },
        onError: (error) => {
          // Show error toast
          toast({
            title: "Moderation Failed",
            description: "Could not update artwork moderation status. Please try again.",
            variant: "destructive",
          });
          
          // Revert optimistic update
          queryClient.invalidateQueries({ 
            queryKey: ["artworks"],
            refetchType: 'all',
          });
        },
      }
    );
  }, [selectedArtwork, moderationReason, mutate, queryClient, pagination.pageIndex, pagination.pageSize, filterStatus, sorting, toast]);

  // View artwork details
  const handleViewDetails = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShowDetailsDialog(true);
  }, []);

  // Open moderation dialog
  const handleOpenModerationDialog = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setModerationReason(artwork.moderationReason || "");
    setShowModerationDialog(true);
  }, []);

  // Handle filter change with page reset
  const handleFilterChange = useCallback((value: string) => {
    startTransition(() => {
      setFilterStatus(value);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    });
  }, []);

  // Setup columns with handlers
  const columns = useMemo(() => 
    getArtworkColumns({
      handleViewDetails,
      handleOpenModerationDialog,
      paginationState: pagination,
    }), 
    [handleViewDetails, handleOpenModerationDialog, pagination]
  );

  // Set up the data table
  const table = useReactTable({
    data: artworks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount,
    enableSorting: !isLoading && !isFetching,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // Loading skeleton
  if (isLoading) {
    return <ArtworkLoadingSkeleton />;
  }

  return (
    <div className="container py-6 mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Artwork Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and moderate artwork submissions
          </p>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2 space-y-1.5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Artworks</CardTitle>
              <CardDescription>
                Review and moderate artist submissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 self-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table.getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === "artistId.name"
                          ? "Artist"
                          : column.id === "moderationStatus"
                          ? "Moderation"
                          : column.id === "createdAt"
                          ? "Uploaded"
                          : column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || isFetching}
                className="transition-all"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isRefreshing || isFetching ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title..."
                  className="pl-8"
                  value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    table.getColumn("title")?.setFilterValue(value);
                    debouncedSetColumnFilter("title", value);
                  }}
                />
                {(table.getColumn("title")?.getFilterValue() as string) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      table.getColumn("title")?.setFilterValue("");
                      debouncedSetColumnFilter("title", "");
                    }}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Filter by moderation status */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <Badge
                  variant={filterStatus === "" ? "default" : "outline"}
                  className={cn("cursor-pointer transition-all", isPending && "opacity-70")}
                  onClick={() => !isPending && handleFilterChange("")}
                >
                  All
                </Badge>
                <Badge
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    filterStatus === "pending"
                      ? ""
                      : "hover:bg-amber-50 hover:text-amber-700",
                    isPending && "opacity-70"
                  )}
                  onClick={() => !isPending && handleFilterChange("pending")}
                >
                  Pending
                </Badge>
                <Badge
                  variant={filterStatus === "approved" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    filterStatus === "approved"
                      ? ""
                      : "hover:bg-emerald-50 hover:text-emerald-700",
                    isPending && "opacity-70"
                  )}
                  onClick={() => !isPending && handleFilterChange("approved")}
                >
                  Approved
                </Badge>
                <Badge
                  variant={filterStatus === "rejected" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    filterStatus === "rejected"
                      ? ""
                      : "hover:bg-rose-50 hover:text-rose-700",
                    isPending && "opacity-70"
                  )}
                  onClick={() => !isPending && handleFilterChange("rejected")}
                >
                  Rejected
                </Badge>
                <Badge
                  variant={filterStatus === "suspended" ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    filterStatus === "suspended"
                      ? ""
                      : "hover:bg-slate-50 hover:text-slate-700",
                    isPending && "opacity-70"
                  )}
                  onClick={() => !isPending && handleFilterChange("suspended")}
                >
                  Suspended
                </Badge>
              </div>
            </div>
          </div>

          {isFetching && !isLoading ? (
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y">
                  {/* Use the TableRowSkeleton component for each row */}
                  {Array.from({ length: pagination.pageSize }).map((_, i) => (
                    <TableRowSkeleton 
                      key={`skeleton-row-${i}`} 
                      columnCount={table.getVisibleLeafColumns().length} 
                      index={i}
                      alternateBg={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, i) => (
                      <tr
                        key={row.id}
                        className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${
                          row.original._optimistic 
                            ? "relative after:absolute after:inset-0 after:bg-primary/5 after:animate-pulse"
                            : ""
                        } ${
                          row.original.moderationStatus === "pending"
                            ? "bg-amber-50/20"
                            : row.original.moderationStatus === "approved"
                            ? "bg-emerald-50/20"
                            : row.original.moderationStatus === "rejected"
                            ? "bg-rose-50/20"
                            : row.original.moderationStatus === "suspended"
                            ? "bg-slate-50/20"
                            : ""
                        } ${i % 2 === 0 ? "" : "bg-muted/30"}`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${
                              row.original._optimistic ? "opacity-80" : ""
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
                          <FileText className="h-8 w-8 mb-2 text-muted-foreground/50" />
                          <p>No artworks found</p>
                          {filterStatus && (
                            <Button
                              variant="link"
                              onClick={() => handleFilterChange("")}
                              className="mt-2"
                            >
                              Clear filters
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {table.getRowModel().rows.length > 0
                ? pagination.pageIndex * pagination.pageSize + 1
                : 0}{" "}
              to{" "}
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                totalItems
              )}{" "}
              of {totalItems} artworks
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage() || isFetching}
                className="h-8 transition-all"
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || isFetching}
                className="h-8 transition-all"
              >
                Previous
              </Button>
              <div className="mx-2 text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount() || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || isFetching}
                className="h-8 transition-all"
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  table.setPageIndex(table.getPageCount() - 1)
                }
                disabled={!table.getCanNextPage() || isFetching}
                className="h-8 transition-all"
              >
                Last
              </Button>

              <select
                className="h-8 w-[70px] rounded-md border bg-background text-sm transition-all"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                disabled={isFetching}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artwork Details Dialog */}
      <ArtworkDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        artwork={selectedArtwork}
        onModerate={(artwork) => {
          setShowDetailsDialog(false);
          handleOpenModerationDialog(artwork);
        }}
      />

      {/* Moderation Dialog */}
      <ModerationDialog
        open={showModerationDialog}
        onOpenChange={setShowModerationDialog}
        artwork={selectedArtwork}
        moderationReason={moderationReason}
        setModerationReason={setModerationReason}
        onApprove={() => handleModerateArtwork("approved")}
        onReject={() => handleModerateArtwork("rejected")}
        onSuspend={() => handleModerateArtwork("suspended")}
        isPending={isMutationPending}
      />

      {/* Loading indicator for background fetches */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 bg-background rounded-lg shadow-lg p-3 text-sm text-foreground flex items-center space-x-2 border z-50 animate-in fade-in slide-in-from-bottom-5">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <span>Updating data...</span>
        </div>
      )}
    </div>
  );
}
