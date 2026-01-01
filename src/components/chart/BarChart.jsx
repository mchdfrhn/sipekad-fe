import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { getTopTypePengajuan } from "../../utils/api/dashboardValue";
import { motion } from "motion/react";

const SimpleBarChart = () => {
  const [label, setLabel] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
    getTopTypePengajuan(setLabel, setData);
  }, []);
  return (
    <motion.div initial={{ opcaity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 1.1, ease: ["easeInOut"] }}  className="bg-white  shadow-md rounded-md px-4 pt-2">
      <h2 className="mb-4 font-semibold">{ label }</h2>
      <BarChart
        style={{ width: "100%", height: "22vh", aspectRatio: 1.618 }}
        responsive
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" style={{ fontSize: "10px" }} />
        <YAxis width="auto" style={{ fontSize: "10px" }} />
        <Tooltip />
        <Bar
          dataKey="uv"
          fill="#82ca9d"
          activeBar={<Rectangle stroke="purple" />}
        />
      </BarChart>
    </motion.div>
  );
};

export default SimpleBarChart;
