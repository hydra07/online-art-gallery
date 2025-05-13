"use client";
import { EngagementMetrics } from "@/app/(private)/(sidebar)/dashboard/components/revenue-chart";
import { UserActivityChart } from "@/app/(private)/(sidebar)/dashboard/components/user-activity-chart";
import { ArtworkCategoryChart } from "@/app/(private)/(sidebar)/dashboard/components/artwork-category-chart";
import { RevenueChart } from "@/app/(private)/(sidebar)/dashboard/components/engagement-tricts";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor your key metrics and performance indicators
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Revenue Overview">
          <RevenueChart />
        </DashboardCard>

        <DashboardCard title="User Activity">
          <UserActivityChart />
        </DashboardCard>

        <DashboardCard title="Artwork Categories">
          <ArtworkCategoryChart />
        </DashboardCard>

        <DashboardCard title="Engagement Metrics">
          <EngagementMetrics />
        </DashboardCard>
      </div>
    </div>
  );
}

function DashboardCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
