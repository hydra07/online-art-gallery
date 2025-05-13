import { columns } from "./columns";
import { DataTable } from "@/components/ui.custom/data-table";
import { getGalleryTemplates } from "@/service/gallery-service";
import { Suspense } from "react";
import { TableSkeleton } from "../../../../components/ui.custom/table-skeleton";

async function GalleryTableContent({
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
  const response = await getGalleryTemplates({
    page,
    limit,
    sort,
    search
  });

  if (!response.data) {
    throw new Error('Failed to fetch gallery data');
  }

  const { galleries, pagination } = response.data;
  
  return (
    <DataTable 
      columns={columns} 
      data={galleries} 
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

export async function GalleryTable({
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
  // Parse and validate search params
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  
  // Parse sort parameters
  const sortField = searchParams?.sortField || 'createdAt';
  const sortOrder = searchParams?.sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder } as Record<string, 1 | -1>;
  
  // Get search term
  const search = searchParams?.search || undefined;

  return (
    <div className="container mx-auto py-10">
      <Suspense 
        key={`${page}-${limit}-${sortField}-${sortOrder}-${search}`} 
        fallback={<TableSkeleton />}
      >
        <GalleryTableContent 
          page={page}
          limit={limit}
          sort={sort}
          search={search}
        />
      </Suspense>
    </div>
  );
}