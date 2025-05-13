import UserTable from "../components/user-table"
import { Metadata } from "next"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/ui.custom/table-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage Users',
};

export default function ManagementUserPage() {
  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor user accounts</p>
        </div>
      </div>
      <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
        <Suspense fallback={<TableSkeleton />}>
          <UserTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
} 

