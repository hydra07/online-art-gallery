"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { vietnamCurrency } from "@/utils";

const data = [
  { month: "Jan", revenue: 4000000 },
  { month: "Feb", revenue: 3000000 },
  { month: "Mar", revenue: 2000000 },
  { month: "Apr", revenue: 2780000 },
  { month: "May", revenue: 1890000 },
  { month: "Jun", revenue: 2390000 },
];

export function EngagementMetrics() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <XAxis
            dataKey="month"
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "currentColor" }}
            tickFormatter={(value) => vietnamCurrency(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number) => vietnamCurrency(value)}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
