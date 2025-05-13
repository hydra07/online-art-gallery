"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { getAllTransaction } from "@/service/analytics-service"; // Import API call function

type FilterType = "week" | "month" | "year";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }); // Chỉ hiển thị ngày và tháng
}

export function RevenueChart() {
  const [filter, setFilter] = useState<FilterType>("week");
  const [step, setStep] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [rangeLabel, setRangeLabel] = useState<string>("");
  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  // Lấy dữ liệu giao dịch từ API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAllTransaction();
        if (res?.data) {
          setAllTransactions(res.data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const paidTxs = allTransactions.filter((tx) => tx.status === "PAID");
    const { grouped, startDate, endDate } = groupTransactions(
      paidTxs,
      filter,
      step
    );
    setChartData(grouped);
    setRangeLabel(getRangeLabel(filter, startDate, endDate));
  }, [allTransactions, filter, step]);

  function groupTransactions(
    transactions: any[],
    type: FilterType,
    step: number
  ) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    const map: Record<
      string,
      { saleArtwork: number; saleTicket: number; premium: number }
    > = {};

    if (type === "week") {
      const today = new Date(now);
      const currentDay = today.getDay() || 7;
      endDate = new Date(today);
      endDate.setDate(today.getDate() - currentDay + 1 + step * 7);
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
    } else if (type === "month") {
      const ref = new Date(now.getFullYear(), now.getMonth() + step, 1);
      startDate = new Date(ref.getFullYear(), ref.getMonth(), 1);
      endDate = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
    } else {
      const year = now.getFullYear() + step;
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    }

    transactions.forEach((tx) => {
      const date = new Date(tx.createdAt);
      if (date < startDate || date > endDate) return;

      let key = "";

      if (type === "week") {
        key = date.toLocaleDateString("en-GB");
      } else if (type === "month") {
        const weekNum = Math.ceil(date.getDate() / 7);
        key = `Week ${weekNum}`;
      } else {
        key = date.toLocaleString("default", { month: "short" });
      }

      if (!map[key]) {
        map[key] = { saleArtwork: 0, saleTicket: 0, premium: 0 };
      }

      if (tx.type === "PAYMENT") map[key].saleArtwork += tx.amount;
      if (tx.type === "TICKET_SALE") map[key].saleTicket += tx.amount;
      if (tx.type === "PREMIUM_SUBSCRIPTION") map[key].premium += tx.amount;
    });

    const sortedKeys = Object.keys(map).sort((a, b) => {
      if (type === "week") {
        return new Date(b).getTime() - new Date(a).getTime(); // Đảo ngược thứ tự
      }
      if (type === "month")
        return Number(a.replace("Week ", "")) - Number(b.replace("Week ", ""));
      return (
        new Date(`${a} 1, 2000`).getMonth() -
        new Date(`${b} 1, 2000`).getMonth()
      );
    });

    const grouped = sortedKeys.map((name) => ({ name, ...map[name] }));

    return { grouped, startDate, endDate };
  }

  function getRangeLabel(type: FilterType, start: Date, end: Date): string {
    if (type === "week") {
      return `From ${formatDate(start)} to ${formatDate(end)}`;
    } else if (type === "month") {
      return `Month ${start.getMonth() + 1}/${start.getFullYear()}`;
    } else {
      return `Year ${start.getFullYear()}`;
    }
  }

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as FilterType);
    setStep(0);
  };

  const resetToCurrent = () => {
    setStep(0);
    setFilter("week");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select value={filter} onChange={handleFilterChange}>
            <MenuItem value="week">By Week</MenuItem>
            <MenuItem value="month">By Month</MenuItem>
            <MenuItem value="year">By Year</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setStep((prev) => prev - 1)}
        >
          Previous {filter}
        </Button>
        <Button variant="contained" size="small" onClick={resetToCurrent}>
          Reset
        </Button>
      </div>

      <Typography variant="subtitle2" color="text.secondary">
        {rangeLabel}
      </Typography>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="saleArtwork" stroke="#8884d8" />
            <Line type="monotone" dataKey="saleTicket" stroke="#82ca9d" />
            <Line type="monotone" dataKey="premium" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// "use client";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useEffect, useState } from "react";
// import {
//   Button,
//   FormControl,
//   MenuItem,
//   Select,
//   SelectChangeEvent,
//   Typography,
// } from "@mui/material";

// type FilterType = "week" | "month" | "year";

// function formatDate(date: Date) {
//   return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }); // Chỉ hiển thị ngày và tháng
// }

// function generateMockTransactions(): any[] {
//   const types = ["PAYMENT", "TICKET_SALE", "PREMIUM_SUBSCRIPTION"];
//   const transactions: any[] = [];

//   const now = new Date();
//   const start = new Date("2024-01-01");
//   const end = new Date(
//     Math.min(now.getTime(), new Date("2025-12-31").getTime())
//   );

//   for (let d = new Date(end); d >= start; d.setDate(d.getDate() - 1)) {
//     const dailyTxCount = Math.floor(Math.random() * 4) + 1;
//     for (let i = 0; i < dailyTxCount; i++) {
//       transactions.push({
//         createdAt: new Date(d).toISOString(),
//         type: types[Math.floor(Math.random() * types.length)],
//         status: "PAID",
//         amount: Math.floor(Math.random() * 90) + 10,
//       });
//     }
//   }

//   return transactions;
// }

// export function RevenueChart() {
//   const [filter, setFilter] = useState<FilterType>("week");
//   const [step, setStep] = useState(0);
//   const [chartData, setChartData] = useState<any[]>([]);
//   const [rangeLabel, setRangeLabel] = useState<string>("");
//   const allTransactions = generateMockTransactions();

//   useEffect(() => {
//     const paidTxs = allTransactions.filter((tx) => tx.status === "PAID");
//     const { grouped, startDate, endDate } = groupTransactions(
//       paidTxs,
//       filter,
//       step
//     );
//     setChartData(grouped);
//     setRangeLabel(getRangeLabel(filter, startDate, endDate));
//   }, [filter, step]);

//   function groupTransactions(
//     transactions: any[],
//     type: FilterType,
//     step: number
//   ) {
//     const now = new Date();
//     let startDate: Date;
//     let endDate: Date;
//     const map: Record<
//       string,
//       { saleArtwork: number; saleTicket: number; premium: number }
//     > = {};

//     if (type === "week") {
//       const today = new Date(now);
//       const currentDay = today.getDay() || 7;
//       endDate = new Date(today);
//       endDate.setDate(today.getDate() - currentDay + 1 + step * 7);
//       startDate = new Date(endDate);
//       startDate.setDate(endDate.getDate() - 6);
//     } else if (type === "month") {
//       const ref = new Date(now.getFullYear(), now.getMonth() + step, 1);
//       startDate = new Date(ref.getFullYear(), ref.getMonth(), 1);
//       endDate = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
//     } else {
//       const year = now.getFullYear() + step;
//       startDate = new Date(year, 0, 1);
//       endDate = new Date(year, 11, 31);
//     }

//     transactions.forEach((tx) => {
//       const date = new Date(tx.createdAt);
//       if (date < startDate || date > endDate) return;

//       let key = "";

//       if (type === "week") {
//         key = date.toLocaleDateString("en-GB");
//       } else if (type === "month") {
//         const weekNum = Math.ceil(date.getDate() / 7);
//         key = `Week ${weekNum}`;
//       } else {
//         key = date.toLocaleString("default", { month: "short" });
//       }

//       if (!map[key]) {
//         map[key] = { saleArtwork: 0, saleTicket: 0, premium: 0 };
//       }

//       if (tx.type === "PAYMENT") map[key].saleArtwork += tx.amount;
//       if (tx.type === "TICKET_SALE") map[key].saleTicket += tx.amount;
//       if (tx.type === "PREMIUM_SUBSCRIPTION") map[key].premium += tx.amount;
//     });

//     const sortedKeys = Object.keys(map).sort((a, b) => {
//       if (type === "week") {
//         // Sắp xếp ngày theo thứ tự từ ngày đầu tuần (thứ Hai) đến ngày cuối tuần (Chủ Nhật)
//         return new Date(b).getTime() - new Date(a).getTime(); // Đảo ngược thứ tự
//       }
//       if (type === "month")
//         return Number(a.replace("Week ", "")) - Number(b.replace("Week ", ""));
//       return (
//         new Date(`${a} 1, 2000`).getMonth() -
//         new Date(`${b} 1, 2000`).getMonth()
//       );
//     });

//     const grouped = sortedKeys.map((name) => ({ name, ...map[name] }));

//     return { grouped, startDate, endDate };
//   }

//   function getRangeLabel(type: FilterType, start: Date, end: Date): string {
//     if (type === "week") {
//       return `From ${formatDate(start)} to ${formatDate(end)}`;
//     } else if (type === "month") {
//       return `Month ${start.getMonth() + 1}/${start.getFullYear()}`;
//     } else {
//       return `Year ${start.getFullYear()}`;
//     }
//   }

//   const handleFilterChange = (event: SelectChangeEvent) => {
//     setFilter(event.target.value as FilterType);
//     setStep(0);
//   };

//   const resetToCurrent = () => {
//     setStep(0);
//     setFilter("week");
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <FormControl size="small" sx={{ minWidth: 180 }}>
//           <Select value={filter} onChange={handleFilterChange}>
//             <MenuItem value="week">By Week</MenuItem>
//             <MenuItem value="month">By Month</MenuItem>
//             <MenuItem value="year">By Year</MenuItem>
//           </Select>
//         </FormControl>
//         <Button
//           variant="outlined"
//           size="small"
//           onClick={() => setStep((prev) => prev - 1)}
//         >
//           Previous {filter}
//         </Button>
//         <Button variant="contained" size="small" onClick={resetToCurrent}>
//           Reset
//         </Button>
//       </div>

//       <Typography variant="subtitle2" color="text.secondary">
//         {rangeLabel}
//       </Typography>

//       <div className="h-[300px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="saleArtwork" stroke="#8884d8" />
//             <Line type="monotone" dataKey="saleTicket" stroke="#82ca9d" />
//             <Line type="monotone" dataKey="premium" stroke="#ffc658" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
