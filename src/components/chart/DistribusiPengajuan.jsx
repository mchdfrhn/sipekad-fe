import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { getDistribusiPengajuan } from "../../utils/api/dashboardValue";
import { format, parseISO, isSameMonth, isValid } from "date-fns";
import { id } from "date-fns/locale";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
        <p className="font-bold text-[#2B3674] mb-1">{label}</p>
        <p className="text-[#4318FF] font-medium text-sm">
          Pengajuan: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const DistribusiPengajuan = () => {
  const [label, setLabel] = useState("");
  const [dataPengajuan, setDataPengajuan] = useState([]);

  useEffect(() => {
    getDistribusiPengajuan(setLabel, setDataPengajuan);
  }, []);

  const formatXAxis = (tickItem, index) => {
    if (!dataPengajuan || dataPengajuan.length === 0) return tickItem;

    // Safety check: ensure index is within bounds
    const currentItem = dataPengajuan[index];
    if (!currentItem) return tickItem;

    // Try to parse the date. Assuming 'name' is a date string like YYYY-MM-DD or ISO
    let date;
    try {
      date = parseISO(currentItem.name);
      if (!isValid(date)) {
        // If parseISO fails, try new Date
        date = new Date(currentItem.name);
        if (!isValid(date)) return currentItem.name; // Fallback to original string
      }
    } catch (e) {
      return currentItem.name;
    }

    // Always show full date for the first item
    if (index === 0) {
      return format(date, "d MMM yyyy", { locale: id });
    }

    // Check if month/year changed from previous item
    const prevItem = dataPengajuan[index - 1];
    let prevDate;
    try {
      prevDate = parseISO(prevItem.name);
      if (!isValid(prevDate)) prevDate = new Date(prevItem.name);
    } catch {
      return format(date, "d", { locale: id });
    }

    if (!isSameMonth(date, prevDate)) {
      return format(date, "d MMM yyyy", { locale: id });
    }

    // Default: just show day
    return format(date, "d", { locale: id });
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <AreaChart
          data={dataPengajuan}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4318FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E0E5F2"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#A3AED0", fontSize: 12 }}
            dy={10}
            tickFormatter={formatXAxis}
            interval={0}
            minTickGap={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#A3AED0", fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#4318FF"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistribusiPengajuan;
