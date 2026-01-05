import { Link } from "react-router";
import Underline from "./Underline";
import { motion } from "motion/react"

const ListLink = ({ data, title }) => {
  return (
    <>
      <h1 className="font-semibold text-slate-800 xl:text-2xl">{title}</h1>
      <Underline />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-4 gap-4 md:gap-8">
        {data.map((data, index) => (
          <motion.div initial={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: `0.${ index + 4 }`, ease: ["easeInOut"] }} >
            <Link
              key={index}
              to={data.path}
              className={`${data.color} shadow-xl block`}
            >
              {data.content}
            </Link>

          </motion.div>
        ))}
      </div>
    </>
  );
};

export default ListLink;
