"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vietnamCurrency } from "@/utils/converters";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import TabChart from "./tab-chart";
import {
  getExhibitions,
  getTransactions,
} from "@/service/dashboard";
import { ArtworksResponse } from "@/types/artwork";
import { getCurrentUser } from "@/lib/session";
import { getArtistArtworks } from "@/service/artwork";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement
);

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("week");
  const [salesFilter, setSalesFilter] = useState("week");
  const [isMobile, setIsMobile] = useState(false);
  const [token, setToken] = useState("");
  const [artworkData, setArtworkData] = useState<ArtworksResponse | null>(null);
  const [salesData, setSalesData] = useState<ArtworksResponse | null>(null);
  const [salesNumber, setSalesNumber] = useState<number>(0);
  const [ticketSalesNumber, setTicketSalesNumber] = useState<number>(0);
  const [salesAmount, setSalesAmount] = useState<number>(0);
  const [salesDataByStatus, setSalesDataByStatus] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [totalExhibition, setTotalExhibition] = useState<any>();
  useEffect(() => {
    const fetchExhibitions = async () => {
      if (!token) return;
      try {
        const res = await getExhibitions(token, 1000);
        if (res?.data) {
          setTotalExhibition(res.data.exhibitions.length);
        }
      } catch (error) {
        console.error("Failed to fetch exhibitions:", error);
      }
    };

    fetchExhibitions();
  }, [token]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      if (user) setToken(user.accessToken);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!token) return;
      try {
        const res = await getArtistArtworks(token, {
          skip: 0,
          take: 0
        });
        if (res?.data) setArtworkData(res.data);
      } catch (error) {
        console.error("Failed to fetch artwork data:", error);
      }
    };
    fetchArtworks();
  }, [token]);

  const totalArtworks = artworkData?.artworks.length ?? 0;
  const statusCounts =
    artworkData?.artworks.reduce((acc, art) => {
      acc[art.status] = (acc[art.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          "#10B981",
          "#3B82F6",
          "#F59E0B",
          "#F43F5E",
          "#6366F1",
        ],
        hoverBackgroundColor: [
          "#059669",
          "#2563EB",
          "#D97706",
          "#E11D48",
          "#4F46E5",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!token) return;
      try {
        const res = await getTransactions(token);
        if (res?.data?.transactions) {
          const relevantTransactions = res.data.transactions.filter(
            (tx) =>
              tx.status === "PAID" &&
              (tx.type === "SALE" || tx.type === "TICKET_SALE")
          );

          setSalesNumber(
            relevantTransactions.filter((tx) => tx.type === "SALE").length
          );
          setTicketSalesNumber(
            relevantTransactions.filter((tx) => tx.type === "TICKET_SALE")
              .length
          );
          setSalesAmount(
            relevantTransactions.reduce((sum, tx) => sum + tx.amount, 0)
          );

          const labelsMap: { [key: string]: string[] } = {
            week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            month: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
            year: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
          };

          const initData = new Array(labelsMap[salesFilter].length).fill(0);
          const salesAmounts = [...initData];
          const ticketAmounts = [...initData];

          relevantTransactions.forEach((tx) => {
            const date = new Date(tx.createdAt);
            let index = 0;
            if (salesFilter === "week") index = date.getDay();
            else if (salesFilter === "month") index = date.getDate() - 1;
            else if (salesFilter === "year") index = date.getMonth();

            if (tx.type === "SALE") salesAmounts[index] += tx.amount;
            if (tx.type === "TICKET_SALE") ticketAmounts[index] += tx.amount;
          });

          setSalesDataByStatus({
            labels: labelsMap[salesFilter],
            datasets: [
              {
                label: "Artwork Sales",
                data: salesAmounts,
                fill: true,
                backgroundColor: "rgba(20, 184, 166, 0.15)",
                borderColor: "#14B8A6",
                tension: 0.4,
                pointBackgroundColor: "#14B8A6",
                pointBorderColor: "#ffffff",
                pointHoverRadius: isMobile ? 6 : 8,
                pointRadius: isMobile ? 3 : 4,
                borderWidth: 2,
              },
              {
                label: "Ticket Sales",
                data: ticketAmounts,
                fill: true,
                backgroundColor: "rgba(234, 179, 8, 0.15)",
                borderColor: "#EAB308",
                tension: 0.4,
                pointBackgroundColor: "#EAB308",
                pointBorderColor: "#ffffff",
                pointHoverRadius: isMobile ? 6 : 8,
                pointRadius: isMobile ? 3 : 4,
                borderWidth: 2,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, [token, salesFilter]);

  const revenueData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 1900, 800, 1500, 2000, 1700, 1300],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "#10B981",
        borderWidth: 1,
        hoverBackgroundColor: "#10B981",
        barThickness: isMobile ? 20 : 40,
      },
    ],
  };

  const TimeFilter = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (e: any) => void;
  }) => (
    <select
      value={value}
      onChange={onChange}
      className="text-sm md:text-base text-emerald-700 dark:text-emerald-200 bg-transparent border border-emerald-300 dark:border-emerald-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600"
    >
      <option value="week">Week</option>
      <option value="month">Month</option>
      <option value="year">Year</option>
    </select>
  );

  const StatCard = ({
    title,
    value,
    color,
  }: {
    title: string;
    value: string | number;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-1 md:pb-2">
          <CardTitle className="text-xs md:text-sm font-medium text-teal-600 dark:text-teal-400 line-clamp-1">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-xl md:text-3xl font-bold ${color} truncate`}>
            {value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-6xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className={
          isMobile ? "space-y-3" : "flex justify-between items-center gap-4"
        }
      >
        <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </motion.div>

      <div
        className={
          isMobile
            ? "space-y-3"
            : "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        }
      >
        <StatCard
          title="Total Artworks"
          value={totalArtworks}
          color="text-emerald-600"
        />
        <StatCard
          title="Total Exhibition"
          value={totalExhibition}
          color="text-emerald-600"
        />
        <StatCard
          title="Total Ticket Sale"
          value={ticketSalesNumber}
          color="text-teal-600"
        />
        <StatCard
          title="Total Artwork Sales"
          value={salesNumber}
          color="text-amber-600"
        />
        <StatCard
          title="Total Revenue"
          value={vietnamCurrency(salesAmount + salesAmount * (3 / 100))}
          color="text-cyan-600"
        />
        <StatCard
          title="Total profit"
          value={vietnamCurrency(salesAmount)}
          color="text-cyan-600"
        />
      </div>

      <div
        className={
          isMobile
            ? "space-y-4"
            : "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        }
      >
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800">
            <CardTitle className="text-sm md:text-lg font-semibold text-emerald-700 dark:text-emerald-200 line-clamp-1">
              Status of artwork
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 h-[200px] md:h-[300px]">
            <Doughnut data={statusData} />
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200">
                Sales trends
              </h2>
              <TimeFilter
                value={salesFilter}
                onChange={(e) => setSalesFilter(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="p-3 md:p-6 h-[200px] md:h-[300px]">
            <Line data={salesDataByStatus} />
          </CardContent>
        </Card>

        {isMobile && (
          <div className="shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <TabChart />
          </div>
        )}
      </div>

      {!isMobile && (
        <div className="shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <TabChart />
        </div>
      )}
    </motion.div>
  );
}
