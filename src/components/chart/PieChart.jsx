import { Pie, PieChart, Cell, Tooltip } from "recharts";
import { useEffect, useState, useRef } from "react";
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

// Global flag for refresh detection
let isAppLoaded = false;

export default function StraightAnglePieChart() {
  const cachedData = sessionStorage.getItem("cache_pie_chart");

  const [data, setData] = useState(() => {
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
          setChartWidth(entry.contentRect.width);
          
          clearTimeout(timer);
          timer = setTimeout(() => {
            setHasMounted(true);
            isAppLoaded = true;
            sessionStorage.setItem("dashboard_stabilized", "true");
          }, isAppLoaded ? 150 : 800); // Same behavior as login for hard refresh
        }
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);

    getStatusPengajuan(null, (apiData) => {
      const updateData = () => {
        if (JSON.stringify(apiData) !== JSON.stringify(data)) {
          setData(apiData);
          sessionStorage.setItem("cache_pie_chart", JSON.stringify(apiData));
        }
      };

      if (cachedData) {
        setTimeout(updateData, 2000);
      } else {
        updateData();
      }
    });
    
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [cachedData, data]);

  // Semantic Color Mapping
  const getColor = (status) => {
    const lowerStatus = status?.toLowerCase() || "";
    if (lowerStatus.includes("tolak")) return "#EE5D50"; // Red
    if (lowerStatus.includes("proses") || lowerStatus.includes("pending"))
      return "#FFB547"; // Orange
    if (lowerStatus.includes("sukses") || lowerStatus.includes("setuju"))
      return "#05CD99"; // Green
    return "#4318FF";
  };

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
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center min-h-[250px]">
      <div className="relative w-full h-[200px] flex justify-center">
        {hasMounted && data.length > 0 && (
          <PieChart width={chartWidth || 300} height={200}>
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
              isAnimationActive={true}
              animationDuration={2000}
              animationBegin={isAppLoaded ? 50 : 800}
            >
              {data.map((entry, index) => (
                <Cell key={`slice-${index}`} fill={getColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip content={<SimpleTooltip />} />
          </PieChart>
        )}
        
        {/* Center Text for Donut */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-10px] text-center pointer-events-none">
          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Total</p>
          <h4 className="text-lg font-bold text-[#2B3674]">
            {data.reduce((acc, curr) => acc + curr.value, 0)}
          </h4>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getColor(entry.name) }}
            />
            <span className="text-xs text-gray-500 font-medium">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
