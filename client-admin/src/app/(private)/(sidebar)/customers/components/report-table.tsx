'use client'
import { ReasonReport, ReportStatus } from "@/utils/enums"
import reportService from "@/service/report-service"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronDown,
  MoreVertical,
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Ban,
  CheckCircle,
  User,
  Flag,
  FileText,
  ImageIcon,
  Clock,
  Shield,
  UserX,
  Calendar
} from "lucide-react"
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table"

export type Report = {  
    _id: string,
    reporterId: string,
    reportedId: string,
    refType: string,
    reason: ReasonReport,
    description: string,
    status: ReportStatus,
    url?: string,
    image?: string[]
}

interface ReportPageProps {
  params: {
    id: string;
  };
}

// Ban Confirmation Dialog Component
function BanConfirmationDialog({
    open,
    onOpenChange,
    onConfirm,
    onTemporaryBan,
    report,
    banType,
    isProcessing = false,
    getReasonLabel,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    onTemporaryBan: () => void
    report: Report | null
    banType: 'permanent' | 'temporary'
    isProcessing?: boolean
    getReasonLabel: (reason: ReasonReport) => string
  }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader className="space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <div className={`w-12 h-12 rounded-full ${banType === 'permanent' ? 'bg-red-100' : 'bg-orange-100'} flex items-center justify-center`}>
                {banType === 'permanent' ? (
                  <Ban className="h-6 w-6 text-red-600" />
                ) : (
                  <Clock className="h-6 w-6 text-orange-600" />
                )}
              </div>
            </motion.div>
            <DialogTitle className="text-xl font-bold text-center text-gray-800">
              Confirm {banType === 'permanent' ? 'Permanent' : 'Temporary'} Ban
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 max-w-xs mx-auto">
              {banType === 'permanent' 
                ? 'Are you sure you want to permanently ban this user? This action cannot be undone.'
                : 'Are you sure you want to temporarily ban this user for 30 days?'}
            </DialogDescription>
          </DialogHeader>
  
          {report && (
            <div className="bg-gray-50 p-4 rounded-md my-4 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                <div className="text-gray-500">User ID:</div>
                <div className="break-words">{report.reportedId}</div>
                <div className="text-gray-500">Reported For:</div>
                <div>{report.reason ? getReasonLabel(report.reason) : ''}</div>
                <div className="text-gray-500 self-start">Description:</div>
                <div className="break-words">{report.description}</div>
              </div>
            </div>
          )}
  
          <DialogFooter className="flex flex-col sm:flex-row justify-center gap-3 mt-4 px-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={banType === 'permanent' ? "destructive" : "default"}
              onClick={banType === 'permanent' ? onConfirm : onTemporaryBan}
              className={`w-full ${banType === 'temporary' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  <span>Processing...</span>
                </div>
              ) : banType === 'permanent' ? (
                "Permanently Ban User"
              ) : (
                "Ban for 30 Days"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

export default function ManageReport() {
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL_STATUSES");
  const [selectedReason, setSelectedReason] = useState<string>("ALL_REASONS");
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [banType, setBanType] = useState<'permanent' | 'temporary'>('permanent');
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    description: false,
    url: false,
    image: true,
  });
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { toast } = useToast();
  const router = useRouter();

  // Query to fetch reports
  const { data: reports, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const res = await reportService.getAll();
        console.log("API response:", res);
        
        // Make sure it returns an array
        const reportData = Array.isArray(res) ? res : (res?.data || []);
        
        // Log the first report to check its structure
        if (reportData.length > 0) {
          console.log("Sample report structure:", reportData[0]);
          console.log("First report ID:", reportData[0].id);
        }
        
        return reportData;
      } catch(error) {
        console.error("Error fetching reports:", error);
        return [];
      }
    }
  });

  // Apply filters and search whenever reports, search query, or filters change
  useEffect(() => {
    if (!reports) return;
    
    const reportList = Array.isArray(reports) ? reports : [];
    
    let filtered = reportList;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(report => 
        report.reporterId.toLowerCase().includes(query) || 
        report.reportedId.toLowerCase().includes(query) || 
        report.description.toLowerCase().includes(query) ||
        (report.url && report.url.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter - only filter if not the "ALL_STATUSES" value
    if (selectedStatus && selectedStatus !== "ALL_STATUSES") {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }
    
    // Apply reason filter - only filter if not the "ALL_REASONS" value
    if (selectedReason && selectedReason !== "ALL_REASONS") {
      filtered = filtered.filter(report => report.reason === selectedReason);
    }
    
    setFilteredReports(filtered);
  }, [reports, searchQuery, selectedStatus, selectedReason]);
  
  // Responsive column visibility
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setColumnVisibility({
        description: !isMobile,
        url: !isMobile && !isTablet,
        image: !isMobile,
        reporterId: true,
        reportedId: true,
        refType: !isMobile,
        reason: true,
        status: true,
        actions: true,
      });
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBanClick = (report: Report, type: 'permanent' | 'temporary' = 'permanent') => {
    if (!report._id) {
      console.error("Missing report ID for report:", report);
      toast({
        title: "Error",
        description: "Cannot ban user: Missing report ID",
        className: "bg-red-500 text-white border-red-600", 
        duration: 2000,
      });
      return;
    }
    
    setSelectedReport(report);
    setBanType(type);
    setShowBanConfirm(true);
  };

  const handleBan = async () => {
    if (!selectedReport || !selectedReport._id) {
      toast({
        title: "Error",
        description: "Cannot ban user: Invalid report ID",
        className: "bg-red-500 text-white border-red-600",
        duration: 2000,
      });
      return;
    }
    
    try {
      // Add this report ID to processing state
      setProcessingIds(prev => [...prev, selectedReport._id]);
      
      console.log("Banning user with report ID:", selectedReport._id);
      
      // Call the API to ban based on report ID
      const response = await reportService.permanentBan(selectedReport._id);
      
      // Show success message
      toast({
        title: "Success",
        description: "User has been permanently banned",
        className: "bg-green-500 text-white border-green-600",
        duration: 2000,
      });
      
      // Close the dialog
      setShowBanConfirm(false);
      
      // Refresh data to update UI
      refetch();
    } catch (error) {
      console.error("Error banning user:", error);
      
      toast({
        title: "Error",
        description: `Failed to ban user: ${(error as Error)?.message || 'Unknown error'}`,
        className: "bg-red-500 text-white border-red-600",
        duration: 2000,
      });
    } finally {
      // Remove from processing state
      setProcessingIds(prev => prev.filter(id => id !== selectedReport._id));
      setSelectedReport(null);
    }
  };

  const handleTemporaryBan = async () => {
    if (!selectedReport || !selectedReport._id) {
      toast({
        title: "Error",
        description: "Cannot ban user: Invalid report ID",
        className: "bg-red-500 text-white border-red-600",
        duration: 2000,
      });
      return;
    }
    
    try {
      // Add this report ID to processing state
      setProcessingIds(prev => [...prev, selectedReport._id]);
      
      console.log("Temporarily banning user with report ID:", selectedReport._id);
      
      // Call the API to temporarily ban based on report ID
      const response = await reportService.temporaryBan(selectedReport._id);
      
      // Show success message
      toast({
        title: "Success",
        description: "User has been temporarily banned for 30 days",
        className: "bg-green-500 text-white border-green-600",
        duration: 2000,
      });
      
      // Close the dialog
      setShowBanConfirm(false);
      
      // Refresh data to update UI
      refetch();
    } catch (error) {
      console.error("Error temporarily banning user:", error);
      
      toast({
        title: "Error",
        description: `Failed to temporarily ban user: ${(error as Error)?.message || 'Unknown error'}`,
        className: "bg-red-500 text-white border-red-600",
        duration: 2000,
      });
    } finally {
      // Remove from processing state
      setProcessingIds(prev => prev.filter(id => id !== selectedReport._id));
      setSelectedReport(null);
    }
  };

  const clearFilters = () => {
    setSelectedStatus("ALL_STATUSES");
    setSelectedReason("ALL_REASONS");
    setSearchQuery("");
  };

  const handleResolve = async (reportId: string) => {
    if (!reportId) {
      toast({
        title: "Error",
        description: "Cannot resolve report: Invalid report ID",
        className: "bg-red-500 text-white border-red-600",
        duration: 2000,
      });
      return;
    }
    
    try {
      // Add this report ID to processing state
      setProcessingIds(prev => [...prev, reportId]);
      
      console.log("Resolving report with ID:", reportId);
      
      // Call the API to update the report status to RESOLVED
      const response = await reportService.updateStatus(reportId, ReportStatus.RESOLVED);
      
      // Show success message
      toast({
        title: "Success",
        description: "Report has been marked as resolved",
        className: "bg-green-500 text-white border-green-600",
        duration: 2000,
      });
      
      // Refresh data to update UI
      refetch();
    } catch (error) {
      console.error("Error resolving report:", error);
      
      toast({
        title: "Error",
        description: `Failed to resolve report: ${(error as Error)?.message || 'Unknown error'}`,
        className: "bg-red-500 text-white border-red-600",
        duration: 2000,
      });
    } finally {
      // Remove from processing state
      setProcessingIds(prev => prev.filter(id => id !== reportId));
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getReasonLabel = (reason: ReasonReport) => {
    const reasonMap: Record<ReasonReport, string> = {
      [ReasonReport.SPAM]: "Spam",
      [ReasonReport.HARASSMENT]: "Harassment",
      [ReasonReport.COPYRIGHT]: "Copyright",
      [ReasonReport.INAPPROPRIATE]: "Inappropriate",
      [ReasonReport.Other]: "Other"
    };
    return reasonMap[reason] || reason;
  };

  const reasonOptions = Object.values(ReasonReport);
  const statusOptions = Object.values(ReportStatus);

  // Table columns definition
  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "reporterId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100 p-0 h-auto font-medium"
        >
          <User className="mr-1 h-4 w-4 text-blue-500" />
          <span className="font-medium">Reporter</span>
          <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium truncate max-w-[120px]" title={row.original.reporterId}>
          {row.original.reporterId}
        </div>
      ),
    },
    {
      accessorKey: "reportedId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100 p-0 h-auto font-medium"
        >
          <User className="mr-1 h-4 w-4 text-red-500" />
          <span className="font-medium">Reported</span>
          <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium truncate max-w-[120px]" title={row.original.reportedId}>
          {row.original.reportedId}
        </div>
      ),
    },
    {
      accessorKey: "refType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal bg-gray-50 truncate">
          {row.original.refType}
        </Badge>
      ),
    },
    {
      accessorKey: "reason",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100 p-0 h-auto font-medium"
        >
          <Flag className="mr-1 h-4 w-4 text-blue-500" />
          <span className="font-medium">Reason</span>
          <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge className="bg-blue-100 text-blue-800">
          {getReasonLabel(row.original.reason)}
        </Badge>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate max-w-[200px]" title={row.original.description}>
                {row.original.description}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-3 text-sm bg-gray-800 text-white">
              {row.original.description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100 p-0 h-auto font-medium"
        >
          <Shield className="mr-1 h-4 w-4 text-blue-500" />
          <span className="font-medium">Status</span>
          <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
        </Button>
      ),
      cell: ({ row }) => {
        let badgeClass = "";
        let icon = null;
        
        switch (row.original.status) {
          case ReportStatus.PENDING:
            badgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
            icon = <AlertTriangle className="mr-1 h-3.5 w-3.5" />;
            break;
          case ReportStatus.RESOLVED:
            badgeClass = "bg-green-100 text-green-800 border-green-200";
            icon = <CheckCircle className="mr-1 h-3.5 w-3.5" />;
            break;
          // case ReportStatus.BANNED:
          //   badgeClass = "bg-red-100 text-red-800 border-red-200";
          //   icon = <UserX className="mr-1 h-3.5 w-3.5" />;
          //   break;
          // case ReportStatus.TEMP_BANNED:
          //   badgeClass = "bg-orange-100 text-orange-800 border-orange-200";
          //   icon = <Clock className="mr-1 h-3.5 w-3.5" />;
          //   break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
        }
        
        return (
          <Badge className={`flex items-center ${badgeClass}`}>
            {icon}
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => (
        row.original.url ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="truncate max-w-[120px] text-blue-600 underline cursor-pointer" 
                     onClick={() => window.open(row.original.url, '_blank')}>
                  {row.original.url}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-3 text-sm bg-gray-800 text-white">
                {row.original.url}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-gray-400">None</span>
        )
      ),
    },
    {
      accessorKey: "image",
      header: () => (
        <span className="flex items-center">
          <ImageIcon className="mr-1 h-4 w-4 text-blue-500" />
          Evidence
        </span>
      ),
      cell: ({ row }) => (
        row.original.image && row.original.image.length > 0 ? (
          <div className="flex space-x-1">
            {row.original.image.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`Report image ${index + 1}`}
                className="w-10 h-10 object-cover rounded cursor-pointer"
                onClick={() => window.open(img, '_blank')}
              />
            ))}
          </div>
        ) : (
          <span className="text-gray-400">No images</span>
        )
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleBanClick(row.original, 'permanent')}
              disabled={row.original.status === ReportStatus.RESOLVED || processingIds.includes(row.original._id)}
              className={row.original.status === ReportStatus.RESOLVED ? "text-gray-400" : "text-red-600 hover:text-red-800 hover:bg-red-50"}
            >
              <Ban className="mr-2 h-4 w-4" /> Permanent Ban
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleBanClick(row.original, 'temporary')}
              disabled={row.original.status === ReportStatus.RESOLVED || processingIds.includes(row.original._id)}
              className={row.original.status === ReportStatus.RESOLVED ? "text-gray-400" : "text-orange-600 hover:text-orange-800 hover:bg-orange-50"}
            >
              <Clock className="mr-2 h-4 w-4" /> Ban for 30 Days
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleResolve(row.original._id)}
              disabled={row.original.status === ReportStatus.RESOLVED}
              className={row.original.status === ReportStatus.RESOLVED ? "text-gray-400" : "text-green-600 hover:text-green-800 hover:bg-green-50"}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Resolve Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Initialize the table
  const table = useReactTable({
    data: filteredReports,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { 
      globalFilter: searchQuery, 
      columnVisibility, 
      pagination 
    },
    onGlobalFilterChange: setSearchQuery,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-2">
          <CardTitle>
            <Skeleton className="h-8 w-[200px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Reports</h3>
          <p className="text-red-600 mb-4">{(error as Error)?.message || 'Unknown error'}</p>
          <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (filteredReports.length === 0 && !searchQuery && selectedStatus === "ALL_STATUSES" && selectedReason === "ALL_REASONS") {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold flex items-center">
            <Flag className="mr-2 h-6 w-6 text-blue-500" />
            Manage Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-64 gap-4">
          <FileText className="h-16 w-16 text-gray-300" />
          <p className="text-gray-500 text-lg">No reports found.</p>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white rounded-xl w-full">
      <CardHeader className="pb-0 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <Flag className="mr-2 h-6 w-6 text-blue-500" />
            Manage Reports
            <Badge className="ml-3 bg-blue-100 text-blue-700 hover:bg-blue-200">
              {table.getFilteredRowModel().rows.length} Reports
            </Badge>
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-[250px] focus-visible:ring-blue-500"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex-shrink-0"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {(selectedStatus !== "ALL_STATUSES" || selectedReason !== "ALL_REASONS") && (
                      <span className="ml-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {(selectedStatus !== "ALL_STATUSES" ? 1 : 0) + (selectedReason !== "ALL_REASONS" ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter Reports</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <div className="p-2">
                    <p className="text-xs font-medium mb-1">Status</p>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL_STATUSES">Any status</SelectItem>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-2">
                    <p className="text-xs font-medium mb-1">Reason</p>
                    <Select value={selectedReason} onValueChange={setSelectedReason}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL_REASONS">Any reason</SelectItem>
                        {reasonOptions.map((reason) => (
                          <SelectItem key={reason} value={reason}>{getReasonLabel(reason)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  {(selectedStatus !== "ALL_STATUSES" || selectedReason !== "ALL_REASONS") && (
                    <DropdownMenuItem onClick={clearFilters}>
                      Clear all filters
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {table.getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id === "reporterId" ? "Reporter" : 
                         column.id === "reportedId" ? "Reported User" : 
                         column.id === "refType" ? "Type" : 
                         column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                    
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Rows per page</DropdownMenuLabel>
                  {[5, 10, 20, 30, 50].map((size) => (
                    <DropdownMenuCheckboxItem
                      key={size}
                      checked={pagination.pageSize === size}
                      onCheckedChange={() =>
                        size !== pagination.pageSize && setPagination({ pageIndex: 0, pageSize: size })
                      }
                    >
                      {size}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">No reports match your search criteria.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="w-full border-collapse">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-xs font-semibold text-gray-700 bg-gray-100 whitespace-nowrap py-2 px-2"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {table.getRowModel().rows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 group border-b text-sm`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-1 px-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} reports
          </div>
        </div>
      </CardContent>

      {/* Ban confirmation dialog */}
      <BanConfirmationDialog
        open={showBanConfirm}
        onOpenChange={setShowBanConfirm}
        onConfirm={handleBan}
        onTemporaryBan={handleTemporaryBan}
        report={selectedReport}
        banType={banType}
        isProcessing={processingIds.includes(selectedReport?._id || '')}
        getReasonLabel={getReasonLabel}
      />

      {isFetching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-700 flex items-center space-x-2 border border-gray-200 z-50"
        >
          <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
          <span>Updating data...</span>
        </motion.div>
      )}
    </Card>
  );
}