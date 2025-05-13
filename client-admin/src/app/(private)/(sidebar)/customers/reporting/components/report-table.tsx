// 'use client'
// import { ReasonReport, ReportStatus } from "@/utils/enums"
// import { Report } from "../types"
// import { motion, AnimatePresence } from "framer-motion"
// import { useState } from "react"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"
// import {
//   MoreVertical,
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
//   Ban,
//   CheckCircle,
//   User,
//   Flag,
//   ImageIcon,
// } from "lucide-react"
// import {
//   useReactTable,
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   VisibilityState,
//   OnChangeFn,
// } from "@tanstack/react-table"

// interface ReportTableProps {
//   reports: Report[];
//   searchQuery: string;
//   columnVisibility: VisibilityState;
//   pagination: { pageIndex: number; pageSize: number };
//   processingIds: string[];
//   onBanClick: (report: Report) => void;
//   onResolve: (reportId: string) => void;
//   getReasonLabel: (reason: ReasonReport) => string;
//   onColumnVisibilityChange: OnChangeFn<VisibilityState>;
//   onPaginationChange: OnChangeFn<{ pageIndex: number; pageSize: number }>;
//   onGlobalFilterChange: (value: string) => void;
// }

// export function ReportTable({
//   reports,
//   searchQuery,
//   columnVisibility,
//   pagination,
//   processingIds,
//   onBanClick,
//   onResolve,
//   getReasonLabel,
//   onColumnVisibilityChange,
//   onPaginationChange,
//   onGlobalFilterChange,
// }: ReportTableProps) {
//   // Table columns definition
//   const columns: ColumnDef<Report>[] = [
//     {
//       accessorKey: "reporterId",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="hover:bg-gray-100 p-0 h-auto font-medium"
//         >
//           <User className="mr-1 h-4 w-4 text-blue-500" />
//           <span className="font-medium">Reporter</span>
//           <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="font-medium truncate max-w-[120px]" title={row.original.reporterId}>
//           {row.original.reporterId}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "reportedId",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="hover:bg-gray-100 p-0 h-auto font-medium"
//         >
//           <User className="mr-1 h-4 w-4 text-red-500" />
//           <span className="font-medium">Reported</span>
//           <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="font-medium truncate max-w-[120px]" title={row.original.reportedId}>
//           {row.original.reportedId}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "refType",
//       header: "Type",
//       cell: ({ row }) => (
//         <Badge variant="outline" className="font-normal bg-gray-50 truncate">
//           {row.original.refType}
//         </Badge>
//       ),
//     },
//     {
//       accessorKey: "reason",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="hover:bg-gray-100 p-0 h-auto font-medium"
//         >
//           <Flag className="mr-1 h-4 w-4 text-blue-500" />
//           <span className="font-medium">Reason</span>
//           <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <Badge className="bg-blue-100 text-blue-800">
//           {getReasonLabel(row.original.reason)}
//         </Badge>
//       ),
//     },
//     {
//       accessorKey: "description",
//       header: "Description",
//       cell: ({ row }) => (
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <div className="truncate max-w-[200px]" title={row.original.description}>
//                 {row.original.description}
//               </div>
//             </TooltipTrigger>
//             <TooltipContent className="max-w-sm p-3 text-sm bg-gray-800 text-white">
//               {row.original.description}
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       ),
//     },
//     {
//       accessorKey: "status",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="hover:bg-gray-100 p-0 h-auto font-medium"
//         >
//           <span className="font-medium">Status</span>
//           <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <Badge
//           className={`${
//             row.original.status === ReportStatus.PENDING
//               ? "bg-yellow-100 text-yellow-800"
//               : row.original.status === ReportStatus.RESOLVED
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//           }`}
//         >
//           {row.original.status}
//         </Badge>
//       ),
//     },
//     {
//       accessorKey: "url",
//       header: "URL",
//       cell: ({ row }) => (
//         row.original.url ? (
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <div className="truncate max-w-[120px] text-blue-600 underline cursor-pointer" 
//                      onClick={() => window.open(row.original.url, '_blank')}>
//                   {row.original.url}
//                 </div>
//               </TooltipTrigger>
//               <TooltipContent className="max-w-sm p-3 text-sm bg-gray-800 text-white">
//                 {row.original.url}
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         ) : (
//           <span className="text-gray-400">None</span>
//         )
//       ),
//     },
//     {
//       accessorKey: "image",
//       header: () => (
//         <span className="flex items-center">
//           <ImageIcon className="mr-1 h-4 w-4 text-blue-500" />
//           Images
//         </span>
//       ),
//       cell: ({ row }) => (
//         row.original.image && row.original.image.length > 0 ? (
//           <div className="flex space-x-1">
//             {row.original.image.map((img, index) => (
//               <img 
//                 key={index}
//                 src={img} 
//                 alt={`Report image ${index + 1}`}
//                 className="w-10 h-10 object-cover rounded cursor-pointer"
//                 onClick={() => window.open(img, '_blank')}
//               />
//             ))}
//           </div>
//         ) : (
//           <span className="text-gray-400">No images</span>
//         )
//       ),
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100">
//               <MoreVertical className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-40">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem
//               onClick={() => onBanClick(row.original)}
//               disabled={row.original.status === ReportStatus.RESOLVED || processingIds.includes(row.original.id)}
//               className={row.original.status === ReportStatus.RESOLVED ? "text-gray-400" : "text-red-600 hover:text-red-800 hover:bg-red-50"}
//             >
//               <Ban className="mr-2 h-4 w-4" /> Ban User
//             </DropdownMenuItem>
//             <DropdownMenuItem 
//               onClick={() => onResolve(row.original.id)}
//               disabled={row.original.status === ReportStatus.RESOLVED}
//               className={row.original.status === ReportStatus.RESOLVED ? "text-gray-400" : "text-green-600 hover:text-green-800 hover:bg-green-50"}
//             >
//               <CheckCircle className="mr-2 h-4 w-4" /> Resolve Report
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ),
//     },
//   ];

//   // Initialize the table
//   const table = useReactTable({
//     data: reports,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: { 
//       globalFilter: searchQuery, 
//       columnVisibility, 
//       pagination 
//     },
//     onGlobalFilterChange,
//     onColumnVisibilityChange,
//     onPaginationChange,
//   });

//   return (
//     <>
//       <div className="w-full overflow-x-auto">
//         <Table className="w-full border-collapse">
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id} className="bg-gray-100">
//                 {headerGroup.headers.map((header) => (
//                   <TableHead
//                     key={header.id}
//                     className="text-xs font-semibold text-gray-700 bg-gray-100 whitespace-nowrap py-2 px-2"
//                   >
//                     {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             <AnimatePresence>
//               {table.getRowModel().rows.map((row, index) => (
//                 <motion.tr
//                   key={row.id}
//                   initial={{ opacity: 0, y: 5 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -5 }}
//                   transition={{ duration: 0.15, delay: index * 0.02 }}
//                   className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 group border-b text-sm`}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id} className="py-1 px-2">
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </motion.tr>
//               ))}
//             </AnimatePresence>
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 mt-4">
//         <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//           <div className="flex items-center gap-1">
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//               className="h-8 w-8"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//               className="h-8 w-8"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//           <span className="text-sm text-gray-600">
//             Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//           </span>
//         </div>
//         <div className="text-sm text-gray-500">
//           Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} reports
//         </div>
//       </div>
//     </>
//   )
// }