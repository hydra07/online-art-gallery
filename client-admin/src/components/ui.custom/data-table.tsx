"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Download
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState("");
  
  // Add debounce for search
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only update if the search term has actually changed
      if (globalFilter !== searchParams.get('search')) {
        const params = new URLSearchParams(searchParams);
        if (globalFilter) {
          params.set('page', '1'); // Reset to first page on new search
          params.set('search', globalFilter);
        } else {
          params.delete('search');
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(handler);
  }, [globalFilter, router, pathname, searchParams]);
  
  // Initialize search field from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    if (searchFromUrl !== globalFilter) {
      setGlobalFilter(searchFromUrl);
    }
  }, [searchParams]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
  });

  const updateSearchParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    
    return params.toString();
  };

  const handlePageChange = (newPage: number) => {
    router.push(
      `${pathname}?${updateSearchParams({ page: newPage })}`,
      { scroll: false }
    );
  };

  const exportToCSV = () => {
    // Implementation for CSV export
    console.log("Exporting to CSV...");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="text-secondary-400 dark:text-secondary-500 h-4 w-4" />
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm h-8 text-sm"
          />
        </div>
        <Button onClick={exportToCSV} variant="outline" size="sm" className="h-8 text-xs">
          <Download className="mr-1 h-3 w-3" />
          Export CSV
        </Button>
      </div>
      <div className="rounded-md border bg-white dark:bg-gray-800 shadow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center py-2 px-3 text-xs">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center py-2 px-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-16 text-center text-sm">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="flex items-center space-x-2">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Showing {pagination.pageIndex * pagination.pageSize + 1} to {
              Math.min((pagination.pageIndex + 1) * pagination.pageSize, pagination.totalCount)
            } of {pagination.totalCount} results
          </p>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) => {
              router.push(
                `${pathname}?${updateSearchParams({ 
                  page: 1, // Reset to page 1
                  limit: Number(value)
                })}`,
                { scroll: false }
              );
            }}
          >
            <SelectTrigger className="h-7 w-[60px] text-xs">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(1)}
            disabled={!pagination.hasPrevPage}
            className="h-7 w-7"
          >
            <ChevronsLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.pageIndex)}
            disabled={!pagination.hasPrevPage}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.pageIndex + 2)}
            disabled={!pagination.hasNextPage}
            className="h-7 w-7"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={!pagination.hasNextPage}
            className="h-7 w-7"
          >
            <ChevronsRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}