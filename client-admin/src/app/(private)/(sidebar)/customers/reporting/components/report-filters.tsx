// 'use client'
// import { ReasonReport, ReportStatus } from "@/utils/enums"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuCheckboxItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Search,
//   SlidersHorizontal,
//   X,
//   RefreshCw
// } from "lucide-react"
// import { VisibilityState } from "@tanstack/react-table"

// interface ReportFiltersProps {
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   selectedStatus: string;
//   setSelectedStatus: (status: string) => void;
//   selectedReason: string;
//   setSelectedReason: (reason: string) => void;
//   statusOptions: ReportStatus[];
//   reasonOptions: ReasonReport[];
//   getReasonLabel: (reason: ReasonReport) => string;
//   clearFilters: () => void;
//   handleRefresh: () => void;
//   isRefreshing: boolean;
//   columnVisibility: VisibilityState;
//   setColumnVisibility: (state: VisibilityState) => void;
//   pagination: { pageIndex: number, pageSize: number };
//   setPagination: (pagination: { pageIndex: number, pageSize: number }) => void;
//   totalFilteredRows: number;
//   columns: any[];
// }

// export function ReportFilters({
//   searchQuery,
//   setSearchQuery,
//   selectedStatus,
//   setSelectedStatus,
//   selectedReason,
//   setSelectedReason,
//   statusOptions,
//   reasonOptions,
//   getReasonLabel,
//   clearFilters,
//   handleRefresh,
//   isRefreshing,
//   columnVisibility,
//   setColumnVisibility,
//   pagination,
//   setPagination,
//   totalFilteredRows,
//   columns
// }: ReportFiltersProps) {
//   return (
//     <div className="flex flex-col sm:flex-row gap-2">
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//         <Input
//           placeholder="Search reports..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="pl-9 w-full sm:w-[250px] focus-visible:ring-blue-500"
//         />
//         {searchQuery && (
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setSearchQuery("")}
//             className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <div className="flex gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={handleRefresh}
//           disabled={isRefreshing}
//           className="flex-shrink-0"
//         >
//           <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
//           Refresh
//         </Button>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button 
//               variant="outline" 
//               size="sm"
//               className="flex items-center gap-2"
//             >
//               <SlidersHorizontal className="h-4 w-4" />
//               Filters
//               {(selectedStatus !== "ALL_STATUSES" || selectedReason !== "ALL_REASONS") && (
//                 <span className="ml-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
//                   {(selectedStatus !== "ALL_STATUSES" ? 1 : 0) + (selectedReason !== "ALL_REASONS" ? 1 : 0)}
//                 </span>
//               )}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Filter Reports</DropdownMenuLabel>
//             <DropdownMenuSeparator />
            
//             <div className="p-2">
//               <p className="text-xs font-medium mb-1">Status</p>
//               <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Any status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ALL_STATUSES">Any status</SelectItem>
//                   {statusOptions.map((status) => (
//                     <SelectItem key={status} value={status}>{status}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div className="p-2">
//               <p className="text-xs font-medium mb-1">Reason</p>
//               <Select value={selectedReason} onValueChange={setSelectedReason}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Any reason" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ALL_REASONS">Any reason</SelectItem>
//                   {reasonOptions.map((reason) => (
//                     <SelectItem key={reason} value={reason}>{getReasonLabel(reason)}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <DropdownMenuSeparator />
            
//             {(selectedStatus !== "ALL_STATUSES" || selectedReason !== "ALL_REASONS") && (
//               <DropdownMenuItem onClick={clearFilters}>
//                 Clear all filters
//               </DropdownMenuItem>
//             )}
            
//             <DropdownMenuSeparator />
//             <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
//             <DropdownMenuSeparator />
            
//             {columns
//               .filter((column) => column.getCanHide?.())
//               .map((column) => (
//                 <DropdownMenuCheckboxItem
//                   key={column.id}
//                   className="capitalize"
//                   checked={column.getIsVisible?.()}
//                   onCheckedChange={(value) => {
//                     setColumnVisibility({
//                       ...columnVisibility,
//                       [column.id]: !!value
//                     });
//                   }}
//                 >
//                   {column.id === "reporterId" ? "Reporter" : 
//                    column.id === "reportedId" ? "Reported User" : 
//                    column.id === "refType" ? "Type" : 
//                    column.id}
//                 </DropdownMenuCheckboxItem>
//               ))}
              
//             <DropdownMenuSeparator />
//             <DropdownMenuLabel>Rows per page</DropdownMenuLabel>
//             {[5, 10, 20, 30, 50].map((size) => (
//               <DropdownMenuCheckboxItem
//                 key={size}
//                 checked={pagination.pageSize === size}
//                 onCheckedChange={() =>
//                   size !== pagination.pageSize && setPagination({ pageIndex: 0, pageSize: size })
//                 }
//               >
//                 {size}
//               </DropdownMenuCheckboxItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   )
// }