import React from "react";
import { Filter, RefreshCw, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Full page loading skeleton
export function ArtworkLoadingSkeleton() {
  return (
    <div className="container py-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
      </div>

      <div className="border rounded-lg shadow-sm bg-card">
        {/* Header */}
        <div className="p-6 pb-3">
          <div className="flex justify-between">
            <div>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <Skeleton className="h-10 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            <TableSkeleton rowCount={10} columnCount={7} />

            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-4 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Table skeleton component for full table loading
export function TableSkeleton({ 
  rowCount = 10, 
  columnCount = 7,
  alternateBg = true 
}: { 
  rowCount?: number; 
  columnCount?: number;
  alternateBg?: boolean;
}) {
  return (
    <div className="rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b bg-muted/50">
          <tr>
            {Array.from({ length: columnCount }).map((_, i) => (
              <th
                key={`skeleton-header-${i}`}
                className="h-10 px-2 text-left align-middle font-medium"
              >
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                  {i % 3 === 0 && <Skeleton className="h-3 w-3 ml-1" />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRowSkeleton 
              key={`skeleton-row-${i}`} 
              columnCount={columnCount} 
              index={i} 
              alternateBg={alternateBg} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Row skeleton for individual row loading
export function TableRowSkeleton({ 
  columnCount = 7, 
  index = 0, 
  alternateBg = true 
}: { 
  columnCount?: number; 
  index?: number; 
  alternateBg?: boolean;
}) {
  // Decide background based on index if alternating rows is enabled
  const bgClass = alternateBg && index % 2 !== 0 ? "bg-muted/30" : "";
  
  return (
    <tr className={`border-b ${bgClass}`}>
      {/* Index column */}
      <td className="p-2 align-middle">
        <Skeleton className="h-4 w-6" />
      </td>
      
      {/* Preview column */}
      <td className="p-2 align-middle">
        <Skeleton className="h-10 w-10 rounded-md" />
      </td>
      
      {/* Title column */}
      <td className="p-2 align-middle">
        <Skeleton className="h-4 w-32" />
      </td>
      
      {/* Artist column */}
      <td className="p-2 align-middle">
        <Skeleton className="h-4 w-24" />
      </td>
      
      {/* Status column */}
      {columnCount > 4 && (
        <td className="p-2 align-middle">
          <Skeleton className="h-6 w-16 rounded-full" />
        </td>
      )}
      
      {/* Moderation status column */}
      {columnCount > 5 && (
        <td className="p-2 align-middle">
          <Skeleton className="h-6 w-20 rounded-full" />
        </td>
      )}
      
      {/* Other columns */}
      {Array.from({ length: Math.max(0, columnCount - 7) }).map((_, i) => (
        <td key={`skeleton-cell-${i}`} className="p-2 align-middle">
          <Skeleton className="h-4 w-16" />
        </td>
      ))}
      
      {/* Actions column */}
      <td className="p-2 align-middle">
        <div className="flex justify-end">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </td>
    </tr>
  );
}