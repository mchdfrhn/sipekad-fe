import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { getTopTypePengajuan } from "../../utils/api/dashboardValue";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const SimpleBarChart = () => {
  const [label, setLabel] = useState("");
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        fontFamily: "inherit",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "12px",
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#f3f4f6",
        strokeDashArray: 4,
      },
      fill: {
        opacity: 1,
        colors: ["#82ca9d"],
      },
      tooltip: {
        theme: "light",
      },
    },
  });

  useEffect(() => {
    // Wrapper to adapt the existing API response to ApexCharts format
    const handleData = (lbl, rawData) => {
      setLabel(lbl);
      const seriesData = rawData.map((item) => item.uv);
      const categories = rawData.map((item) => item.name);

      setChartData((prev) => ({
        ...prev,
        series: [{ name: "Jumlah", data: seriesData, color: "#82ca9d" }],
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: categories,
          },
        },
      }));
    };

    getTopTypePengajuan(setLabel, (data) =>
      handleData("Jenis Pengajuan", data),
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 1.1, ease: ["easeInOut"] }}
      className="bg-white shadow-md rounded-md px-4 pt-4 pb-4"
    >
      <h2 className="mb-2 font-semibold">{label}</h2>
      <div className="w-full h-full">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          width="100%"
          height={250}
        />
      </div>
    </motion.div>
  );
};

export default SimpleBarChart;
