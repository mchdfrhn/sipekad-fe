import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { getStatusPengajuan } from "../../utils/api/dashboardValue";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export default function StraightAnglePieChart() {
  const [label, setLabel] = useState("");
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
        fontFamily: "inherit",
      },
      labels: [],
      colors: ["#3b82f6", "#eab308", "#ef4444", "#22c55e"],
      legend: {
        position: "bottom",
        fontFamily: "inherit",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total",
                fontSize: "16px",
                fontFamily: "inherit",
                fontWeight: 600,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
  });

  useEffect(() => {
    // Wrapper to adapt the existing API response to ApexCharts format
    const handleData = (lbl, rawData) => {
      setLabel(lbl);
      const series = rawData.map((item) => item.value);
      const labels = rawData.map((item) => item.name);

      // Update state with new data options
      setChartData((prev) => ({
        ...prev,
        series,
        options: {
          ...prev.options,
          labels,
          // Map colors dynamically if they exist in raw data, else fallback
          colors: rawData.map((item) => item.color || "#ccc"),
        },
      }));
    };

    getStatusPengajuan(setLabel, (data) =>
      handleData("Status Pengajuan", data),
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 1.2, ease: ["easeInOut"] }}
      className="bg-white shadow-md rounded-md px-4 pt-4 pb-4 flex flex-col items-center justify-center"
    >
      <h2 className="mb-2 font-semibold w-full text-left">{label}</h2>
      <div className="w-full h-full flex items-center justify-center">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="donut"
          width="100%"
          height={300}
        />
      </div>
    </motion.div>
  );
}
