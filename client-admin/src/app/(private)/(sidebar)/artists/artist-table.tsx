// app/(private)/(sidebar)/artists/artist-table.tsx
import { columns } from "./column";
import { DataTable } from "@/components/ui.custom/data-table";
import { getArtists } from "@/service/artist-service";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function ArtistTableContent({
  page,
  limit,
  sort,
  search
}: {
  page: number;
  limit: number;
  sort: Record<string, 1 | -1>;
  search?: string;
}) {
  const response = await getArtists({
    page,
    limit,
    sort,
    search
  });

  console.log("response", response);

  if (!response.data) {
    throw new Error('Failed to fetch artists data');
  }

  const { artists, pagination } = response.data;
  
  return (
    <DataTable
      columns={columns}
      data={artists}
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

export function ArtistsTable({
  searchParams = {}
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    sortField?: string;
    sortOrder?: string;
    search?: string;
  }
}) {
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  
  const sortField = searchParams?.sortField || 'createdAt';
  const sortOrder = searchParams?.sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder } as Record<string, 1 | -1>;
  
  const search = searchParams?.search || undefined;

  return (
    <div className="space-y-4">
      <Suspense
        key={`${page}-${limit}-${sortField}-${sortOrder}-${search}`}
        fallback={<TableSkeleton />}
      >
        <ArtistTableContent
          page={page}
          limit={limit}
          sort={sort}
          search={search}
        />
      </Suspense>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="h-24 border-b border-neutral-100 bg-neutral-50/50"></div>
      <div className="divide-y divide-neutral-100">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}