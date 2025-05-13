import ManageReport from '../components/report-table';
export default function Report() {
    return (
            <div>
                <ManageReport />
            </div>
    );
}
// 'use client'
// import { ReasonReport, ReportStatus } from "@/utils/enums"
// import reportService from "@/service/report-service"
// import { useMutation, useQuery } from "@tanstack/react-query"
// import { useState, useEffect } from "react"
// import { useToast } from "@/hooks/use-toast"
// import { useRouter } from 'next/navigation'
// import { motion } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Flag, RefreshCw } from "lucide-react"
// import { VisibilityState } from "@tanstack/react-table"

// import { Report, ReportPageProps } from "./types"
// import {
//   BanConfirmationDialog,
//   ReportLoadingState,
//   ReportErrorState,
//   ReportEmptyState,
//   ReportFilters,
//   ReportTable,
//   ReportNoResults
// } from "./components"

// export default function ManageReport({ params }: ReportPageProps) {
//   const [processingIds, setProcessingIds] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState<string>("ALL_STATUSES");
//   const [selectedReason, setSelectedReason] = useState<string>("ALL_REASONS");
//   const [showBanConfirm, setShowBanConfirm] = useState(false);
//   const [selectedReport, setSelectedReport] = useState<Report | null>(null);
//   const [filteredReports, setFilteredReports] = useState<Report[]>([]);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
//     description: false,
//     url: false,
//     image: true,
//   });
//   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
//   const { toast } = useToast();
//   const router = useRouter();

//   // Query to fetch reports
//   const { data: reports, isLoading, isError, error, refetch, isFetching } = useQuery({
//     queryKey: ['reports'],
//     queryFn: async () => {
//       try {
//         const res = await reportService.getAll();
//         console.log("API response:", res);
        
//         // Make sure it returns an array
//         const reportData = Array.isArray(res) ? res : (res?.data || []);
        
//         // Log the first report to check its structure
//         if (reportData.length > 0) {
//           console.log("Sample report structure:", reportData[0]);
//           console.log("First report ID:", reportData[0].id);
//         }
        
//         return reportData;
//       } catch(error) {
//         console.error("Error fetching reports:", error);
//         return [];
//       }
//     }
//   });

//   // Apply filters and search whenever reports, search query, or filters change
//   useEffect(() => {
//     if (!reports) return;
    
//     const reportList = Array.isArray(reports) ? reports : [];
    
//     let filtered = reportList;
    
//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(report => 
//         report.reporterId.toLowerCase().includes(query) || 
//         report.reportedId.toLowerCase().includes(query) || 
//         report.description.toLowerCase().includes(query) ||
//         (report.url && report.url.toLowerCase().includes(query))
//       );
//     }
    
//     // Apply status filter - only filter if not the "ALL_STATUSES" value
//     if (selectedStatus && selectedStatus !== "ALL_STATUSES") {
//       filtered = filtered.filter(report => report.status === selectedStatus);
//     }
    
//     // Apply reason filter - only filter if not the "ALL_REASONS" value
//     if (selectedReason && selectedReason !== "ALL_REASONS") {
//       filtered = filtered.filter(report => report.reason === selectedReason);
//     }
    
//     setFilteredReports(filtered);
//   }, [reports, searchQuery, selectedStatus, selectedReason]);
  
//   // Responsive column visibility
//   useEffect(() => {
//     const handleResize = () => {
//       const isMobile = window.innerWidth < 768;
//       const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
//       setColumnVisibility({
//         description: !isMobile,
//         url: !isMobile && !isTablet,
//         image: !isMobile,
//         reporterId: true,
//         reportedId: true,
//         refType: !isMobile,
//         reason: true,
//         status: true,
//         actions: true,
//       });
//     };
    
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleBanClick = (report: Report) => {
//     if (!report.id) {
//       console.error("Missing report ID for report:", report);
//       toast({
//         title: "Error",
//         description: "Cannot ban user: Missing report ID",
//         className: "bg-red-500 text-white border-red-600", 
//         duration: 2000,
//       });
//       return;
//     }
    
//     setSelectedReport(report);
//     setShowBanConfirm(true);
//   };

//   const handleBan = async () => {
//     if (!selectedReport || !selectedReport.id) {
//       toast({
//         title: "Error",
//         description: "Cannot ban user: Invalid report ID",
//         className: "bg-red-500 text-white border-red-600",
//         duration: 2000,
//       });
//       return;
//     }
    
//     try {
//       // Add this report ID to processing state
//       setProcessingIds(prev => [...prev, selectedReport.id]);
      
//       console.log("Banning user with report ID:", selectedReport.id);
      
//       // Call the API to ban based on report ID
//       const response = await reportService.permanentBan(selectedReport.id);
      
//       // Show success message
//       toast({
//         title: "Success",
//         description: "User has been banned successfully",
//         className: "bg-green-500 text-white border-green-600",
//         duration: 2000,
//       });
      
//       // Close the dialog
//       setShowBanConfirm(false);
      
//       // Refresh data to update UI
//       refetch();
//     } catch (error) {
//       console.error("Error banning user:", error);
      
//       toast({
//         title: "Error",
//         description: `Failed to ban user: ${(error as Error)?.message || 'Unknown error'}`,
//         className: "bg-red-500 text-white border-red-600",
//         duration: 2000,
//       });
//     } finally {
//       // Remove from processing state
//       setProcessingIds(prev => prev.filter(id => id !== selectedReport.id));
//       setSelectedReport(null);
//     }
//   };

//   const clearFilters = () => {
//     setSelectedStatus("ALL_STATUSES");
//     setSelectedReason("ALL_REASONS");
//     setSearchQuery("");
//   };

//   const handleResolve = async (reportId: string) => {
//     toast({
//       title: "Info",
//       description: "Resolve functionality not implemented yet",
//       className: "bg-blue-500 text-white border-blue-600",
//       duration: 2000,
//     });
//   };

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await refetch();
//     setTimeout(() => setIsRefreshing(false), 800);
//   };

//   const getReasonLabel = (reason: ReasonReport) => {
//     const reasonMap: Record<ReasonReport, string> = {
//       [ReasonReport.SPAM]: "Spam",
//       [ReasonReport.HARASSMENT]: "Harassment",
//       [ReasonReport.COPYRIGHT]: "Hate Speech",
//       [ReasonReport.INAPPROPRIATE]: "Violence",
//       [ReasonReport.Other]: "Other"
//     };
//     return reasonMap[reason] || reason;
//   };

//   const reasonOptions = Object.values(ReasonReport);
//   const statusOptions = Object.values(ReportStatus);

//   if (isLoading) {
//     return <ReportLoadingState />;
//   }
  
//   if (isError) {
//     return <ReportErrorState error={error} refetch={refetch} />;
//   }

//   if (filteredReports.length === 0 && !searchQuery && selectedStatus === "ALL_STATUSES" && selectedReason === "ALL_REASONS") {
//     return <ReportEmptyState onRefresh={handleRefresh} />;
//   }

//   return (
//     <Card className="border-0 shadow-xl bg-white rounded-xl w-full">
//       <CardHeader className="pb-0 space-y-4">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//           <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
//             <Flag className="mr-2 h-6 w-6 text-blue-500" />
//             Manage Reports
//             <Badge className="ml-3 bg-blue-100 text-blue-700 hover:bg-blue-200">
//               {filteredReports.length} Reports
//             </Badge>
//           </CardTitle>
//           <ReportFilters 
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             selectedStatus={selectedStatus}
//             setSelectedStatus={setSelectedStatus}
//             selectedReason={selectedReason}
//             setSelectedReason={setSelectedReason}
//             statusOptions={statusOptions}
//             reasonOptions={reasonOptions}
//             getReasonLabel={getReasonLabel}
//             clearFilters={clearFilters}
//             handleRefresh={handleRefresh}
//             isRefreshing={isRefreshing}
//             columnVisibility={columnVisibility}
//             setColumnVisibility={setColumnVisibility}
//             pagination={pagination}
//             setPagination={setPagination}
//             totalFilteredRows={filteredReports.length}
//             columns={[]} // Need to pass actual columns here if needed
//           />
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-2 md:p-4">
//         {filteredReports.length === 0 ? (
//           <ReportNoResults clearFilters={clearFilters} />
//         ) : (
//           <ReportTable
//             reports={filteredReports}
//             searchQuery={searchQuery}
//             columnVisibility={columnVisibility}
//             pagination={pagination}
//             processingIds={processingIds}
//             onBanClick={handleBanClick}
//             onResolve={handleResolve}
//             getReasonLabel={getReasonLabel}
//             onColumnVisibilityChange={setColumnVisibility}
//             onPaginationChange={setPagination}
//             onGlobalFilterChange={setSearchQuery}
//           />
//         )}
//       </CardContent>

//       {/* Ban confirmation dialog */}
//       <BanConfirmationDialog
//         open={showBanConfirm}
//         onOpenChange={setShowBanConfirm}
//         onConfirm={handleBan}
//         report={selectedReport}
//         isProcessing={processingIds.includes(selectedReport?.id || '')}
//         getReasonLabel={getReasonLabel}
//       />

//       {isFetching && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-700 flex items-center space-x-2 border border-gray-200 z-50"
//         >
//           <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
//           <span>Updating data...</span>
//         </motion.div>
//       )}
//     </Card>
//   );
// }