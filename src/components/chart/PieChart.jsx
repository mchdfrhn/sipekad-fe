import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getStatusPengajuan } from "../../utils/api/dashboardValue";

const SimpleTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-100 shadow-lg rounded-lg">
        <p
          className="text-sm font-bold"
          style={{ color: payload[0].payload.fill }}
        >
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function StraightAnglePieChart() {
  const [label, setLabel] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    getStatusPengajuan(setLabel, setData);
  }, []);

  // Semantic Color Mapping
  const getColor = (status) => {
    const lowerStatus = status?.toLowerCase() || "";
    if (lowerStatus.includes("tolak")) return "#EE5D50"; // Red
    if (lowerStatus.includes("proses") || lowerStatus.includes("pending"))
      return "#FFB547"; // Orange
    if (lowerStatus.includes("sukses") || lowerStatus.includes("setuju"))
      return "#05CD99"; // Green

    // Fallback colors for other categories
    return "#4318FF";
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[250px]">
      <div className="relative w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`slice-${index}`} fill={getColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip content={<SimpleTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text for Donut */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-xs text-gray-400">Total</p>
          <h4 className="text-xl font-bold text-[#2B3674]">
            {data.reduce((acc, curr) => acc + curr.value, 0)}
          </h4>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColor(entry.name) }}
            />
            <span className="text-sm text-gray-500">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
