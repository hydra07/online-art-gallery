"use client"

import * as React from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
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
import { motion, AnimatePresence } from "framer-motion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MoreHorizontal,
  ArrowUpDown,
  Calendar,
  User,
  Image as ImageIcon,
  FileText,
  Search,
  SlidersHorizontal,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Edit,
  Trash,
  Link as LinkIcon,
  ExternalLink
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import eventService from "@/service/event-service"
import Link from "next/link"
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, FileSearch, X } from "@/app/(private)/(sidebar)/events/components/icon-custom"
import { EventStatus } from "@/utils/enums";
export type Event = {
  _id: string
  image: string
  title: string
  description: string
  type: string
  status: EventStatus
  organizer: string
  startDate: string
  endDate: string
  link: string
}

// Hàm định dạng ngày
const formatShortDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear().toString().slice(2)}`
}

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString)
  return date
    .toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(",", "")
}

// Delete Confirmation Dialog Component
function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting?: boolean
}) {
  // Sửa lỗi: Đảm bảo rằng khi đóng dialog, chúng ta sẽ clean up event handlers
  useEffect(() => {
    // Thêm cleanup cho các event listeners khi dialog đóng
    return () => {
      // Đảm bảo không có event listeners nào còn sót lại
      document.body.style.pointerEvents = ''
    }
  }, [open])

  const handleCancel = () => {
    if (!isDeleting) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center mb-2"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </motion.div>
          <DialogTitle className="text-xl font-bold text-center text-gray-800">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-center mt-2 text-gray-600">
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-3 sm:gap-4 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:w-auto"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                Deleting...
              </>
            ) : (
              "Delete Event"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function EventTable() {
  const { toast } = useToast()
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    description: false,
    image: true,
    type: true,
    organizer: true,
  })
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [eventIdToDelete, setEventIdToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Responsive: Điều chỉnh hiển thị cột dựa trên kích thước màn hình
  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
      setColumnVisibility({
        description: false,
        image: !isMobile,
        type: !isMobile && !isTablet,
        organizer: !isMobile && !isTablet,
        link: !isMobile && !isTablet, // Add link visibility control
        index: true,
        title: true,
        status: true,
        startDate: !isMobile,
        endDate: !isMobile && !isTablet,
        actions: true,
      })
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Thêm effect để đảm bảo body không bị khóa sau khi đóng dialog
  useEffect(() => {
    // Khi component unmount hoặc khi dialog đóng, đảm bảo reset lại trạng thái
    return () => {
      // Reset lại style cho body khi unmount
      document.body.style.pointerEvents = ''
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  // Sử dụng useMemo để tối ưu cột (re-render chỉ khi columnVisibility thay đổi)
  const columns: ColumnDef<Event>[] = React.useMemo(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-gray-100 p-0 h-auto font-medium"
          >
            <FileText className="mr-1 h-4 w-4 text-blue-500" />
            <span className="font-medium">Title</span>
            <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="max-w-[120px] md:max-w-[200px]">
            <div className="font-medium truncate" title={row.original.title}>
              {row.original.title}
            </div>
            {columnVisibility.description === false && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {row.original.description.slice(0, 30)}...
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-3 text-sm bg-gray-800 text-white">
                    {row.original.description}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block truncate max-w-[120px] text-gray-600">
                  {row.original.description.slice(0, 30)}...
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-3 text-sm bg-gray-800 text-white">
                {row.original.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        accessorKey: "image",
        header: () => (
          <span className="flex items-center">
            <ImageIcon className="mr-1 h-4 w-4 text-blue-500" />
            Image
          </span>
        ),
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
                  <img
                    src={row.original.image}
                    alt={row.original.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <div className="w-32 h-32 relative rounded-md overflow-hidden">
                  <img
                    src={row.original.image}
                    alt={row.original.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        size: 60,
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline" className="font-normal bg-gray-50 truncate max-w-[80px]" title={row.original.type}>
            {row.original.type}
          </Badge>
        ),
        size: 80,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={`${
              row.original.status === EventStatus.ONGOING
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : row.original.status === EventStatus.UPCOMING
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {row.original.status}
          </Badge>
        ),
        size: 80,
      },
      {
        accessorKey: "organizer",
        header: () => (
          <span className="flex items-center">
            <User className="mr-1 h-4 w-4 text-blue-500" />
            Organizer
          </span>
        ),
        cell: ({ row }) => (
          <span className="text-gray-600 truncate block max-w-[100px]" title={row.original.organizer}>
            {row.original.organizer}
          </span>
        ),
        size: 100,
      },
      // Add new link column here
      {
        accessorKey: "link",
        header: () => (
          <span className="flex items-center">
            <LinkIcon className="mr-1 h-4 w-4 text-blue-500" />
            Link
          </span>
        ),
        cell: ({ row }) => {
          const link = row.original.link;
          return link ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[120px]"
                  >
                    <span className="truncate">{link.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  {link}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="text-gray-400 italic">No link</span>
          );
        },
        size: 120,
      },
      {
        accessorKey: "startDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-gray-100 p-0 h-auto font-medium"
          >
            <Calendar className="mr-1 h-4 w-4 text-blue-500" />
            <span className="font-medium">Start</span>
            <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
          </Button>
        ),
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-gray-600 text-sm">{formatShortDate(row.original.startDate)}</div>
              </TooltipTrigger>
              <TooltipContent side="top">{formatFullDate(row.original.startDate)}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        size: 80,
      },
      {
        accessorKey: "endDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-gray-100 p-0 h-auto font-medium"
          >
            <Calendar className="mr-1 h-4 w-4 text-blue-500" />
            <span className="font-medium">End</span>
            <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
          </Button>
        ),
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-gray-600 text-sm">{formatShortDate(row.original.endDate)}</div>
              </TooltipTrigger>
              <TooltipContent side="top">{formatFullDate(row.original.endDate)}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        size: 80,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => console.log("View", row.original._id)}
                className="cursor-pointer flex items-center text-gray-700 hover:text-blue-600"
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer flex items-center text-gray-700 hover:text-blue-600">
                <Link href={`/events/update/${row.original._id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteEvent(row.original._id)}
                className="cursor-pointer flex items-center text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [columnVisibility]
  )

  // Query lấy danh sách events
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.get(),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  })

  // Mutation xóa event với useMutation và hiển thị thông báo qua useToast
  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventService.delete(id),
    onSuccess: () => {
      toast({ title: "Success", description: "Event deleted successfully.", className: "bg-green-500 text-white border-green-600", duration: 2000 })
      refetch()
    },
    onError: (error) => {
      console.error("Error deleting event:", error)
      toast({ title: "Error", description: "Error deleting event.", className: "bg-red-500 text-white border-red-600", duration: 2000 })
    },
  })

  // Chỉnh sửa: Cải thiện cách xử lý dialog
  const handleDeleteEvent = (id: string) => {
    setEventIdToDelete(id)
    setOpenDialog(true)
  }

  // Chỉnh sửa: Đảm bảo cleanup đúng cách khi confirm xong
  const handleConfirmDelete = async () => {
    if (eventIdToDelete) {
      setIsDeleting(true)
      try {
        await deleteMutation.mutateAsync(eventIdToDelete)
      } catch (error) {
        console.error("Error during deletion:", error)
      } finally {
        setIsDeleting(false)
        setOpenDialog(false)
        setEventIdToDelete(null)
        
        // Đảm bảo dialog đã đóng hoàn toàn và có thể tương tác với màn hình
        setTimeout(() => {
          document.body.style.pointerEvents = ''
          document.body.classList.remove('overflow-hidden')
        }, 100)
      }
    }
  }

  // Chỉnh sửa: Thêm xử lý khi đóng dialog
  const handleOpenChangeDialog = (open: boolean) => {
    setOpenDialog(open)
    if (!open) {
      // Khi dialog đóng, reset các state và đảm bảo màn hình có thể tương tác
      setTimeout(() => {
        setIsDeleting(false)
        document.body.style.pointerEvents = ''
        document.body.classList.remove('overflow-hidden')
      }, 100)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setTimeout(() => setIsRefreshing(false), 800)
  }

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter, columnVisibility, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
  })

  if (isLoading)
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
    )

  return (
    <>
      <Card className="border-0 shadow-xl bg-white rounded-xl w-full">
        <CardHeader className="pb-0 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
              <Calendar className="mr-2 h-6 w-6 text-blue-500" />
              Event Manager
              <Badge className="ml-3 bg-blue-100 text-blue-700 hover:bg-blue-200">
                {table.getFilteredRowModel().rows.length} Events
              </Badge>
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 w-full sm:w-[250px] focus-visible:ring-blue-500"
                />
                {globalFilter && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setGlobalFilter("")}
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
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      <SlidersHorizontal className="h-4 w-4 mr-1" />
                      View
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
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id === "startDate" ? "Start Date" : column.id === "endDate" ? "End Date" : column.id}
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
          <div className="w-full overflow-x-auto">
            <Table className="w-full border-collapse">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-xs font-semibold text-gray-700 bg-gray-100 whitespace-nowrap py-2 px-2"
                        style={{ width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : "auto" }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row, index) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FileSearch className="h-10 w-10 mb-2 text-gray-400" />
                          <p className="text-sm">No events found.</p>
                          {globalFilter && (
                            <Button variant="link" onClick={() => setGlobalFilter("")} className="mt-2 text-blue-600">
                              Clear search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

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
              Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} events
            </div>
          </div>

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
        </CardContent>
      </Card>

      {/* Enhanced Delete Confirmation Dialog với onOpenChange được cập nhật */}
      <DeleteConfirmationDialog
        open={openDialog}
        onOpenChange={handleOpenChangeDialog}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}

// Icon components
