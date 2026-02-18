import { motion as Motion } from "motion/react";

const CardDashboardUser = ({ title, value, className, index }) => {
  return (
    <Motion.div
      initial={{ translateY: 20, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ duration: `0.${index}`, ease: ["easeInOut"] }}
      className={`flex flex-col p-2 hover:-translate-y-2 transition-transform duration-200 cursor-pointer ease-in-out rounded-md ${className}`}
    >
      <span className="text-white font-bold">{title}</span>
      <span className="text-4xl mt-2 text-white font-bold">{value}</span>
    </Motion.div>
  );
};

export default CardDashboardUser;
