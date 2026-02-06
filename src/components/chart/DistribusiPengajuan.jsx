import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { getDistribusiPengajuan } from "../../utils/api/dashboardValue";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const DistribusiPengajuan = () => {
  const [label, setLabel] = useState("");
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "area",
        fontFamily: "inherit",
        toolbar: { show: false },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#8884d8"],
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
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
        colors: ["#8884d8"],
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
        series: [{ name: "Total Pengajuan", data: seriesData }],
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: categories,
          },
        },
      }));
    };

    getDistribusiPengajuan(setLabel, (data) =>
      handleData("Distribusi Pengajuan", data),
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 1, ease: ["easeInOut"] }}
      className="bg-white xl:col-span-2 xl:row-span-2 shadow-md rounded-md px-4 pt-4 pb-4"
    >
      <h2 className="mb-2 font-semibold md:text-xl">{label}</h2>
      <div className="w-full h-full">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          width="100%"
          height={300}
        />
      </div>
    </motion.div>
  );
};

export default DistribusiPengajuan;
