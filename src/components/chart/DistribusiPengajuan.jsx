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
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
