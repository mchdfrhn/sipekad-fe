import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useEffect, useState, useRef } from "react";
import { getTopTypePengajuan } from "../../utils/api/dashboardValue";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
        <p className="font-bold text-[#2B3674] mb-1">{label}</p>
        <p className="text-[#4318FF] font-medium text-sm">
          Total: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};
// Global flag for refresh detection
let isAppLoaded = false;

const SimpleBarChart = ({ days = 30 }) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const cacheKey = `cache_bar_chart_${currentUser.id || "guest"}_${days}`;

  const [data, setData] = useState(() => {
    const cachedData = sessionStorage.getItem(cacheKey);
    return cachedData ? JSON.parse(cachedData) : [];
  });
  
  const [hasMounted, setHasMounted] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    let timer;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 50) {
          // Always update width for responsiveness
          setChartWidth(entry.contentRect.width);
          
          clearTimeout(timer);
          timer = setTimeout(() => {
            setHasMounted(true);
            isAppLoaded = true;
            sessionStorage.setItem("dashboard_stabilized", "true");
          }, isAppLoaded ? 150 : 800);
        }
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);

    getTopTypePengajuan(null, (apiData) => {
      const updateData = () => {
        setData((currentData) =>
          JSON.stringify(apiData) === JSON.stringify(currentData)
            ? currentData
            : apiData,
        );
        sessionStorage.setItem(cacheKey, JSON.stringify(apiData));
      };

      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        setTimeout(updateData, 2000);
      } else {
        updateData();
      }
    }, days);
    
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [cacheKey, days]);

  if (!hasMounted || data.length === 0) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-[250px] flex items-center justify-center bg-gray-50/10 rounded-2xl animate-pulse">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          Memuat Data...
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full min-h-[250px]">
      {hasMounted && data.length > 0 && (
        <BarChart
          width={chartWidth || 400}
          height={250}
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 5,
          }}
          barSize={20}
        >
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
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar
            dataKey="uv"
            fill="#4318FF"
            radius={[20, 20, 0, 0]}
            background={{ fill: "#E9EDF7", radius: [20, 20, 0, 0] }}
            isAnimationActive={true}
            animationDuration={2000}
            animationBegin={isAppLoaded ? 50 : 800}
            animationEasing="ease-in-out"
          />
        </BarChart>
      )}
    </div>
  );
};

export default SimpleBarChart;
