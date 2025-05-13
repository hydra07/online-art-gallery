import { columns } from "./columns";
import { DataTable } from "@/components/ui.custom/data-table";
import { getArtistRequests } from "@/service/artist-request-service";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function ArtistRequestsTableContent({
  page,
  limit,
  sort,
  status,
  search
}: {
  page: number;
  limit: number;
  sort: Record<string, 1 | -1>;
  status?: string;
  search?: string;
}) {
  const response = await getArtistRequests({
    page,
    limit,
    sort,
    status,
    search
  });

  if (!response.data) {
    throw new Error('Failed to fetch artist requests data');
  }

  console.log('Artist Requests Response:', response.data); // Debugging line
  const { requests, pagination } = response.data;
  return (
    <DataTable
      columns={columns}
      data={requests}
      pagination={{
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
        totalCount: pagination.total,
        totalPages: pagination.pages,
        hasNextPage: pagination.hasNext,
        hasPrevPage: pagination.hasPrev
      }}
    />
  );
}

export function ArtistRequestsTable({
  searchParams = {}
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    sortField?: string;
    sortOrder?: string;
    status?: string;
    search?: string;
  }
}) {
  // Parse and validate search params
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  // Parse sort parameters
  const sortField = searchParams?.sortField || 'createdAt';
  const sortOrder = searchParams?.sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder } as Record<string, 1 | -1>;

  // Get status directly from URL params
  const status = searchParams?.status || undefined;

  // Get search term
  const search = searchParams?.search || undefined;

  return (
    <div className="container mx-auto py-10">
      <Suspense key={`${page}-${limit}-${sortField}-${sortOrder}-${status}-${search}`} fallback={<TableSkeleton />}>
        <ArtistRequestsTableContent
          page={page}
          limit={limit}
          sort={sort}
          status={status}
          search={search}
        />
      </Suspense>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-2">
      {/* Search and Export Bar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border bg-white dark:bg-gray-800 shadow">
        {/* Header */}
        <div className="border-b">
          <div className="flex">
            {[...Array(6)].map((_, i) => (
              <div key={`header-${i}`} className="flex-1 p-2">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        {[...Array(5)].map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {[...Array(6)].map((_, cellIndex) => (
              <div key={`cell-${rowIndex}-${cellIndex}`} className="flex-1 p-2">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Controls Skeleton */}
      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-7 w-[60px]" />
        </div>
        <div className="space-x-1 flex">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={`pagination-${i}`} className="h-7 w-7" />
          ))}
        </div>
      </div>
    </div>
  );
}