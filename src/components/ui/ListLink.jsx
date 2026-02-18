import { Link } from "react-router";
import { motion as Motion } from "motion/react";
import { cn } from "@/lib/utils";

const ListLink = ({ data, title }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {data.map((item, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
          >
            <Link
              to={item.path}
              className={cn(
                "group flex flex-col p-6 rounded-[20px] bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden",
                "before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:bg-[#4318FF]/20 group-hover:before:bg-[#4318FF] before:transition-colors",
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "p-3 rounded-xl bg-[#F4F7FE] text-[#2B3674] group-hover:bg-[#4318FF]/10 group-hover:text-[#4318FF] transition-all duration-300 shadow-sm",
                  )}
                >
                  {item.icon && <item.icon className="h-6 w-6" />}
                </div>
              </div>
              <span className="text-lg font-bold text-[#2B3674] group-hover:text-[#4318FF] transition-colors">
                {item.content}
              </span>
              <p className="text-xs text-gray-400 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Klik untuk detail pengajuan →
              </p>
            </Link>
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default ListLink;
