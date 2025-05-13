"use client";

import { useEffect, useState } from "react";
import { ArtworkCategoryChart } from "@/app/(private)/(sidebar)/dashboard/components/artwork-category-chart";
import { RevenueChart } from "@/app/(private)/(sidebar)/dashboard/components/engagement-tricts";
import TabChart from "@/app/(private)/(sidebar)/dashboard/components/tab-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllUser,
  getAllArtwork,
  getAllGallery,
  getAllTransaction,
} from "@/service/analytics-service";
import { vietnamCurrency } from "@/utils/converters";
import { getExhibitions } from "@/service/exhibition-service";

export default function Dashboard() {
  const [artistCount, setArtistCount] = useState(0);
  const [artworkCount, setArtworkCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [exhibitionCount, setExhibitionCount] = useState(0);
  const [commissionTotal, setCommissionTotal] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [premiumRevenue, setPremiumRevenue] = useState(0);
  const [ticketRevenue, setTicketRevenue] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          userRes,
          artworkRes,
          galleryRes,
          transactionRes,
          exhibitionRes,
        ] = await Promise.all([
          getAllUser(),
          getAllArtwork({
            skip: 0,
            take: 0
          }),
          getAllGallery(),
          getAllTransaction(),
          getExhibitions({}),
        ]);

        if (userRes?.data) {
          const artists = userRes.data.filter(
            (user: any) => user.role.includes("artist") && !user.isBanned
          );
          setArtistCount(artists.length);
        }

        if (artworkRes?.data?.artworks) {
          setArtworkCount(artworkRes.data.artworks.length);
        }

        if (galleryRes?.data?.pagination?.total !== undefined) {
          setGalleryCount(galleryRes.data.pagination.total);
        }

        if (exhibitionRes?.data?.pagination?.total !== undefined) {
          setExhibitionCount(exhibitionRes.data.pagination.total);
        }

        if (transactionRes?.data) {
          const paidTransactions = transactionRes.data.filter(
            (tx: any) => tx.status === "PAID"
          );

          const revenueTypes = [
            "PAYMENT",
            "PREMIUM_SUBSCRIPTION",
            "TICKET_SALE",
          ];

          const totalRevenue = paidTransactions
            .filter((tx: any) => revenueTypes.includes(tx.type))
            .reduce((sum: number, tx: any) => sum + tx.amount, 0);

          const premiumRevenue = paidTransactions
            .filter((tx: any) => tx.type === "PREMIUM_SUBSCRIPTION")
            .reduce((sum: number, tx: any) => sum + tx.amount, 0);

          const ticketRevenue = paidTransactions
            .filter((tx: any) => tx.type === "TICKET_SALE")
            .reduce((sum: number, tx: any) => sum + tx.amount, 0);

          const commissionTransactions = paidTransactions.filter(
            (tx: any) => tx.type === "COMMISSION"
          );

          const commissionTotal = commissionTransactions.reduce(
            (sum: number, tx: any) => sum + tx.amount,
            0
          );

          setCommissionTotal(parseFloat(commissionTotal.toFixed(2)));
          setTransactionCount(commissionTransactions.length);
          setTotalRevenue(parseFloat(totalRevenue.toFixed(2)));
          setPremiumRevenue(parseFloat(premiumRevenue.toFixed(2)));
          setTicketRevenue(parseFloat(ticketRevenue.toFixed(2)));
        }
      } catch (err) {
        console.error("Error loading analytics:", err);
      }
    }

    fetchData();
  }, []);

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Artists"
          value={`${artistCount}`}
          description="Active artists"
          trend="up"
        />
        <MetricCard
          title="Total Artworks"
          value={`${artworkCount}`}
          description="Active artworks"
          trend="up"
        />
        <MetricCard
          title="Total Exhibitions"
          value={`${exhibitionCount}`}
          description="Active exhibitions"
          trend="up"
        />
        <MetricCard
          title="Total Galleries"
          value={`${galleryCount}`}
          description="Active galleries"
          trend="up"
        />
        <MetricCard
          title="Total Revenue"
          value={`${vietnamCurrency(totalRevenue)}`}
          description="All paid revenue types"
          trend="up"
        />
        <MetricCard
          title="Revenue from Premium"
          value={`${vietnamCurrency(premiumRevenue)}`}
          description="From premium subscriptions"
          trend="up"
        />
        <MetricCard
          title="Revenue from Ticket Sales"
          value={`${vietnamCurrency(ticketRevenue)}`}
          description="From ticket sales"
          trend="up"
        />
        <MetricCard
          title="Total Profit"
          value={`${vietnamCurrency(commissionTotal)}`}
          description={`${transactionCount} commission transactions`}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardCard title="Revenue Overview">
          <RevenueChart />
        </DashboardCard>

        <DashboardCard title="Artwork Categories">
          <ArtworkCategoryChart />
        </DashboardCard>

        {/* <DashboardCard title="User Activity">
          <UserActivityChart />
        </DashboardCard>

        <DashboardCard title="Revenue Overview">
          <EngagementMetrics />
        </DashboardCard> */}
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Detailed Analytics
        </h2>
        <TabChart />
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

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down";
}

function MetricCard({ title, value, description, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
