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
import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // label is the formatted_date string "YYYY-MM-DD" from payload
    let dateObj;
    try {
      // Try parsing assuming ISO YYYY-MM-DD
      const parts = typeof label === "string" ? label.split("-") : [];
      if (parts.length === 3) {
        dateObj = new Date(parts[0], parts[1] - 1, parts[2]); // Month is 0-indexed in JS Date
      } else {
        dateObj = parseISO(label);
      }

      if (!isValid(dateObj)) dateObj = new Date(label);
    } catch (e) {
      dateObj = new Date();
    }

    const formattedLabel = isValid(dateObj)
      ? format(dateObj, "d MMMM yyyy", { locale: id })
      : label;

    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
        <p className="font-bold text-[#2B3674] mb-1">{formattedLabel}</p>
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

  const formatXAxis = (tickItem) => {
    // tickItem matches the connection data "formatted_date" -> "YYYY-MM-DD"
    if (!tickItem) return "";

    if (typeof tickItem === "string") {
      const parts = tickItem.split("-");
      // If string is "2026-02-14", parts is ["2026", "02", "14"]
      if (parts.length === 3) {
        // Return only the day part, parsing to int removes leading zeros (e.g. "01" -> "1")
        return parseInt(parts[2], 10).toString();
      }
    }

    // Fallback attempts
    try {
      const date = parseISO(tickItem);
      if (isValid(date)) {
        return format(date, "d", { locale: id });
      }
      return tickItem;
    } catch (e) {
      return tickItem;
    }
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
            minTickGap={30}
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
