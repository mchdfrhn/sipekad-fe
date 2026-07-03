import { useEffect, useState, useRef } from "react";
import { getStatusPengajuan } from "../../utils/api/dashboardValue";

const getColor = (status) => {
  const s = status?.toLowerCase() || "";
  if (s.includes("masuk")) return { bar: "#2563EB", bg: "#EFF6FF", text: "#1D4ED8" };
  if (s.includes("tolak")) return { bar: "#EE5D50", bg: "#FFF1F0", text: "#B91C1C" };
  if (s.includes("proses") || s.includes("pending"))
    return { bar: "#FFB547", bg: "#FFFBEB", text: "#B45309" };
  if (s.includes("selesai") || s.includes("sukses") || s.includes("setuju"))
    return { bar: "#05CD99", bg: "#ECFDF5", text: "#047857" };
  return { bar: "#4318FF", bg: "#F4F7FE", text: "#4318FF" };
};

export default function StatusBarChart({ days = 30 }) {
  // ponytail: isAppLoaded moved from module scope → ref per instance to avoid cross-component interference
  const isAppLoadedRef = useRef(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const cacheKey = `cache_pie_chart_${currentUser.id || "guest"}_${days}`;

  const [data, setData] = useState(() => {
    const cached = sessionStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : [];
  });
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let timer;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 50) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            setHasMounted(true);
            isAppLoadedRef.current = true;
            sessionStorage.setItem("dashboard_stabilized", "true");
          }, isAppLoadedRef.current ? 150 : 600);
        }
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);

    getStatusPengajuan(null, (apiData) => {
      const update = () => {
        setData((cur) =>
          JSON.stringify(apiData) === JSON.stringify(cur) ? cur : apiData
        );
        sessionStorage.setItem(cacheKey, JSON.stringify(apiData));
      };
      sessionStorage.getItem(cacheKey) ? setTimeout(update, 1500) : update();
    }, days);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [cacheKey, days]);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (!hasMounted || data.length === 0) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-[250px] flex items-center justify-center animate-pulse">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Memuat Data...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-3 py-2">
      {/* Total badge */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status Pengajuan</span>
        <span className="text-xs font-bold text-[#2B3674] bg-[#F4F7FE] px-3 py-1 rounded-full">
          Total: {total}
        </span>
      </div>

      {data.map((entry, i) => {
        const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
        const { bar, bg, text } = getColor(entry.name);
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: bar }} />
                <span className="text-sm font-semibold text-[#2B3674]">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: text }}>{entry.value}</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: bg, color: text }}
                >
                  {pct}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, backgroundColor: bar }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
