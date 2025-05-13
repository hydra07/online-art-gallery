import { Suspense } from "react";
import { BlogsTable } from "./blog-table";
import { TableSkeleton } from '@/components/ui.custom/table-skeleton';
import { CreateBlogButton } from "./create-blog-button";
import { ErrorBoundary } from "@/components/error-boundary";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Manage Blogs',
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    sortField?: string;
    sortOrder?: string;
    status?: string;
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your blogs</p>
        </div>
        <CreateBlogButton />
      </div>
      <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
        <Suspense fallback={<TableSkeleton />}>
          <BlogsTable searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}