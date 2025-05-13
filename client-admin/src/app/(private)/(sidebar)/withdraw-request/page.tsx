"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import bankrequestService from "@/service/bankrequest-service"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Eye, Loader2, X, RefreshCw, AlertCircle, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

interface WithdrawalRequest {
  _id: string
  walletId: {
    userId: string
  }
  idBankAccount: string
  bankName: string
  bankAccountName: string
  amount: number
  status: string
  createdAt: string
  [key: string]: any
}

export default function WithdrawRequest() {
    const queryClient = useQueryClient()
    const [selectedRequest, setSelectedRequest] = React.useState<WithdrawalRequest | null>(null)
    const [previewOpen, setPreviewOpen] = React.useState(false)
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [isRefreshing, setIsRefreshing] = React.useState(false)
    
    const { data, error, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['bankrequest'],
        queryFn: () => bankrequestService.get(),
        placeholderData: (previousData: unknown) => previousData,
        refetchOnWindowFocus: true
    })

    React.useEffect(() => {
      const handleResize = () => {
        const isMobile = window.innerWidth < 768
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
        
        setColumnVisibility({
          id: !isMobile,
          userId: true,
          accountNumber: !isMobile,
          bankName: !isMobile && !isTablet,
          recipientName: !isMobile && !isTablet,
          amount: true,
          status: true,
          createdAt: !isMobile,
          actions: true,
        })
      }
      
      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    const approveWithdrawalMutation = useMutation({
        mutationFn: bankrequestService.approveWithdrawalRequest,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Withdrawal request has been approved",
            })
            queryClient.invalidateQueries({ queryKey: ['bankrequest'] })
            setPreviewOpen(false)
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Unable to approve withdrawal request",
                variant: "destructive",
            })
            console.error("Error approving withdrawal request:", error)
        }
    })

    const rejectWithdrawalMutation = useMutation({
        mutationFn: bankrequestService.rejectWithdrawalRequest,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Withdrawal request has been rejected",
            })
            queryClient.invalidateQueries({ queryKey: ['bankrequest'] })
            setPreviewOpen(false)
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Unable to reject withdrawal request",
                variant: "destructive",
            })
            console.error("Error rejecting withdrawal request:", error)
        }
    })

    const handleApprove = (id: string) => {
        approveWithdrawalMutation.mutate(id)
    }

    const handleReject = (id: string) => {
        rejectWithdrawalMutation.mutate(id)
    }
    
    const openPreviewDialog = (request: WithdrawalRequest) => {
        setSelectedRequest(request)
        setPreviewOpen(true)
    }
    
    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refetch()
        setTimeout(() => setIsRefreshing(false), 800)
    }

    // Get pending requests count
    const pendingCount = data?.filter((request: WithdrawalRequest) => request.status === 'PENDING').length || 0

    // Status badge color mappings
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'PENDING':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">PENDING</Badge>
            case 'APPROVED':
                return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">APPROVED</Badge>
            case 'REJECTED':
                return <Badge variant="destructive" className="bg-red-200 text-red-800 hover:bg-red-100">REJECTED</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const columns: ColumnDef<WithdrawalRequest>[] = React.useMemo(() => [
        {
            id: "index",
            header: "#",
            cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
            enableSorting: false,
            size: 40,
        },
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-mono text-xs">{row.original._id.substring(0, 8)}</span>
            ),
            size: 80,
        },
        {
            accessorKey: "userId",
            header: "User",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.walletId?.userId || 'N/A'}</span>
            ),
        },
        {
            accessorKey: "accountNumber",
            header: "Account Number",
            cell: ({ row }) => row.original.idBankAccount,
        },
        {
            accessorKey: "bankName",
            header: "Bank Name",
            cell: ({ row }) => row.original.bankName,
        },
        {
            accessorKey: "recipientName",
            header: "Recipient Name",
            cell: ({ row }) => row.original.bankAccountName,
        },
        {
            accessorKey: "amount",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-gray-100 p-0 h-auto font-medium"
                >
                    <span className="font-medium">Amount</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3 text-gray-400">
                        <path d="m8 15 4 4 4-4"/>
                        <path d="m16 9-4-4-4 4"/>
                    </svg>
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-medium">{row.original.amount?.toLocaleString()} VND</span>
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
                    <span className="font-medium">Status</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3 text-gray-400">
                        <path d="m8 15 4 4 4-4"/>
                        <path d="m16 9-4-4-4 4"/>
                    </svg>
                </Button>
            ),
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-gray-100 p-0 h-auto font-medium"
                >
                    <span className="font-medium">Created At</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3 text-gray-400">
                        <path d="m8 15 4 4 4-4"/>
                        <path d="m16 9-4-4-4 4"/>
                    </svg>
                </Button>
            ),
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="text-sm text-muted-foreground">
                                {formatDate(row.original.createdAt)}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            {new Date(row.original.createdAt).toLocaleString('en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                size="sm" 
                                variant={row.original.status === 'PENDING' ? "default" : "outline"}
                                className={`flex items-center gap-1 ${row.original.status !== 'PENDING' ? 'text-muted-foreground' : ''}`}
                                onClick={() => openPreviewDialog(row.original)}
                            >
                                <Eye className="h-3.5 w-3.5" />
                                {row.original.status === 'PENDING' ? 'Preview' : 'Details'}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {row.original.status === 'PENDING' ? 'Process request' : 'View details'}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
    ], []);

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { 
            globalFilter, 
            columnVisibility, 
            pagination 
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        globalFilterFn: (row, columnId, filterValue) => {
            const request = row.original;
            const searchValue = filterValue.toLowerCase();
            
            // Search in all relevant fields, including nested ones
            return (
                // ID and basic fields
                (request._id?.toLowerCase().includes(searchValue)) ||
                (request.walletId?.userId?.toLowerCase().includes(searchValue)) ||
                (request.idBankAccount?.toLowerCase().includes(searchValue)) ||
                // Explicitly include bankName and bankAccountName (recipient name)
                (request.bankName?.toLowerCase().includes(searchValue)) ||
                (request.bankAccountName?.toLowerCase().includes(searchValue)) || 
                // Amount (convert to string first)
                (request.amount?.toString().includes(searchValue)) ||
                (request.status?.toLowerCase().includes(searchValue))
            );
        },
    })

    if (isLoading) return (
        <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <span className="text-lg text-muted-foreground">Loading data...</span>
            </div>
        </div>
    )

    if (error) return (
        <Card className="border-red-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-red-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Error
                </CardTitle>
                <CardDescription>An error occurred while loading withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => refetch()} variant="outline" className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
            </CardContent>
        </Card>
    )

    return (
        <>
            <Card className="shadow-sm border-0">
                <CardHeader className="pb-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center">
                                Withdrawal Requests
                                {pendingCount > 0 && (
                                    <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                        {pendingCount} pending
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>Manage all user withdrawal requests</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search requests..."
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
                                                    {column.id}
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
                <CardContent className="p-2 md:p-4 mt-2">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-card z-10">
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
                                                className={`${
                                                    row.original.status === 'PENDING' ? 'bg-yellow-50/30' : 
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                } hover:bg-blue-50 transition-colors group border-b text-sm`}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="py-2 px-2">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                                        <circle cx="12" cy="13" r="3"></circle>
                                                    </svg>
                                                    <p className="text-sm">No withdrawal requests found</p>
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
                            Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} requests
                        </div>
                    </div>

                    {isFetching && !isLoading && (
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

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Withdrawal Request Details</DialogTitle>
                        <DialogDescription>
                            {selectedRequest?.status === 'PENDING' ? 
                                'Please verify all information before approving or rejecting' : 
                                'Detailed information about the withdrawal request'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 py-2">
                                <div className="text-sm font-medium text-muted-foreground">ID:</div>
                                <div className="text-sm font-mono">{selectedRequest._id}</div>

                                <div className="text-sm font-medium text-muted-foreground">User:</div>
                                <div className="text-sm font-medium">{selectedRequest.walletId?.userId || 'N/A'}</div>

                                <div className="text-sm font-medium text-muted-foreground">Account Number:</div>
                                <div className="text-sm">{selectedRequest.idBankAccount}</div>

                                <div className="text-sm font-medium text-muted-foreground">Bank Name:</div>
                                <div className="text-sm">{selectedRequest.bankName}</div>

                                <div className="text-sm font-medium text-muted-foreground">Recipient Name:</div>
                                <div className="text-sm">{selectedRequest.bankAccountName}</div>

                                <div className="text-sm font-medium text-muted-foreground">Amount:</div>
                                <div className="text-sm font-semibold text-primary">{selectedRequest.amount?.toLocaleString()} VND</div>

                                <div className="text-sm font-medium text-muted-foreground">Status:</div>
                                <div className="text-sm">
                                    {getStatusBadge(selectedRequest.status)}
                                </div>

                                <div className="text-sm font-medium text-muted-foreground">Created At:</div>
                                <div className="text-sm">{new Date(selectedRequest.createdAt).toLocaleString('en-US', {
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</div>
                            </div>
                            
                            {selectedRequest.status === 'PENDING' && (
                                <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 mt-2">
                                    <div className="flex">
                                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                                        <div>
                                            <p>Please carefully verify the bank details and amount before approval.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex space-x-2 justify-end">
                        {selectedRequest?.status === 'PENDING' ? (
                            <>
                                <Button 
                                    variant="outline" 
                                    className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                                    onClick={() => selectedRequest && handleReject(selectedRequest._id)}
                                    disabled={rejectWithdrawalMutation.isPending}
                                >
                                    {rejectWithdrawalMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <X className="h-4 w-4 mr-2" />
                                    )}
                                    Reject Request
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                                    onClick={() => selectedRequest && handleApprove(selectedRequest._id)}
                                    disabled={approveWithdrawalMutation.isPending}
                                >
                                    {approveWithdrawalMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4 mr-2" />
                                    )}
                                    Approve
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setPreviewOpen(false)}>
                                Close
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}