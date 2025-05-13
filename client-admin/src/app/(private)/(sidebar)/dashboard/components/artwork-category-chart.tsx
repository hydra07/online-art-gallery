"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { getAllArtwork } from "@/service/analytics-service";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EF2",
  "#FF6B6B",
];

export function ArtworkCategoryChart() {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      const response = await getAllArtwork({
        skip: 0,
        take: 0
      });
      if (!response || !response.data?.artworks) return;

      const artworks = response.data.artworks;

      // Đếm số lượng artworks theo status
      const statusCount: Record<string, number> = {};
      artworks.forEach((artwork: any) => {
        const status = artwork.status || "unknown";
        statusCount[status] = (statusCount[status] || 0) + 1;
      });

      // Chuyển thành mảng để đưa vào biểu đồ
      const formattedData = Object.entries(statusCount).map(
        ([status, count]) => ({
          name: status,
          value: count,
        })
      );

      setChartData(formattedData);
    }

    fetchData();
  }, []);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
