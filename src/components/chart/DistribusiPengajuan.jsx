import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect, useRef, useMemo } from "react";
import { getDistribusiPengajuan } from "../../utils/api/dashboardValue";
import { format, parseISO, isValid, subDays } from "date-fns";
import { id } from "date-fns/locale";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    let dateObj;
    try {
      const parts = typeof label === "string" ? label.split("-") : [];
      if (parts.length === 3) {
        dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        dateObj = parseISO(label);
      }

      if (!isValid(dateObj)) dateObj = new Date(label);
    } catch {
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

// Global flag to track if the application has settled since the last hard refresh/load
let isAppLoaded = false;

const DistribusiPengajuan = ({ days = 7 }) => {
  const isPreviouslyStabilized = !!sessionStorage.getItem("dashboard_stabilized");

  // Memoize template to prevent reference changes
  const defaultData = useMemo(() => Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    return {
      name: format(date, "yyyy-MM-dd"),
      uv: 0,
    };
  }), [days]);

  const [dataPengajuan, setDataPengajuan] = useState(() => {
    const cachedData = sessionStorage.getItem("cache_distribusi_pengajuan");
    return cachedData ? JSON.parse(cachedData) : defaultData;
  });
  
  // ALWAYS start false to ensure layout stabilization cycle happens
  const [hasMounted, setHasMounted] = useState(false);
  const [dataReady, setDataReady] = useState(!!sessionStorage.getItem("cache_distribusi_pengajuan"));
  const [chartWidth, setChartWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Phase 1: Fetch real data
    getDistribusiPengajuan(null, (apiData) => {
      if (apiData && Array.isArray(apiData)) {
        const mergedData = defaultData.map((defaultItem) => {
          const apiMatch = apiData.find(
            (item) => item.name === defaultItem.name,
          );
          return apiMatch ? { ...defaultItem, uv: apiMatch.uv } : defaultItem;
        });

        const updateData = () => {
          if (JSON.stringify(mergedData) !== JSON.stringify(dataPengajuan)) {
            setDataPengajuan(mergedData);
            sessionStorage.setItem("cache_distribusi_pengajuan", JSON.stringify(mergedData));
          }
          setDataReady(true);
        };

        const cachedData = sessionStorage.getItem("cache_distribusi_pengajuan");
        // If we matched cached data, wait for animation to finish before updating
        if (cachedData) {
          setTimeout(updateData, 2000); // Wait for entrance animation (1.5s + buffer)
        } else {
          updateData();
        }
      } else {
        setDataReady(true);
      }
    });

    // Phase 2: Observer for layout stability
    let resizeTimer;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 50 && entry.contentRect.height > 50) {
          // Always update width immediately for responsiveness
          clearTimeout(resizeTimer);
          const targetDelay = isAppLoaded ? 200 : 800;
          
          resizeTimer = setTimeout(() => {
            setChartWidth(entry.contentRect.width);
            setHasMounted(true);
            isAppLoaded = true; // Mark as settled for subsequent internal navigations
            sessionStorage.setItem("dashboard_stabilized", "true");
          }, targetDelay); 
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(resizeTimer);
    };
  }, [days, defaultData]);

  // Only render chart when BOTH layout is ready and data has been fetched
  const isReady = hasMounted && dataReady;

  const formatXAxis = (tickItem) => {
    if (!tickItem) return "";
    if (typeof tickItem === "string") {
      const parts = tickItem.split("-");
      if (parts.length === 3) {
        return parseInt(parts[2], 10).toString();
      }
    }
    try {
      const date = parseISO(tickItem);
      return isValid(date) ? format(date, "d", { locale: id }) : tickItem;
    } catch {
      return tickItem;
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] relative">
      {!isReady ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/10 rounded-2xl animate-pulse">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Memuat Data...
          </p>
        </div>
      ) : (
        <div className="w-full h-full min-h-[300px]">
          <AreaChart
            key="distribusi-chart-v1"
            width={chartWidth || 500}
            height={300}
            data={dataPengajuan}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
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
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={isPreviouslyStabilized ? 50 : 800}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </div>
      )}
    </div>
  );
};

export default DistribusiPengajuan;
