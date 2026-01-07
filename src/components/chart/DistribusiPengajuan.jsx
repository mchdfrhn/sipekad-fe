import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useState, useEffect } from "react";
import { getDistribusiPengajuan } from "../../utils/api/dashboardValue";
import { motion } from "motion/react";


const DistribusiPengajuan = () => {
  const [label, setLabel] = useState("");
  const [dataPengajuan, setDataPengajuan] = useState([]);
  useEffect(() => {
    getDistribusiPengajuan(setLabel, setDataPengajuan);
  }, []);
  return (
    <motion.div initial={{ opcaity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 1, ease: ["easeInOut"] }} className="bg-white xl:col-span-2 xl:row-span-2 shadow-md rounded-md px-4 pt-2">
      <h2 className="mb-4 font-semibold md:text-xl">{ label }</h2>
      <AreaChart
        style={{ width: "100%", maxHeight: "50vh", aspectRatio: 1.618 }}
        responsive
        data={dataPengajuan}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" style={{ fontSize: "10px" }} />
        <YAxis width="auto" style={{ fontSize: "10px" }} />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </motion.div>
  );
};

export default DistribusiPengajuan;
